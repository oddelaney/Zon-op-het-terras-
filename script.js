
let map;
let markers = [];
let lastKnownPos = null;

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([52.0907, 5.1214], 13);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap & CartoDB',
    subdomains: 'abcd'
  }).addTo(map);

  setTimeout(() => map.invalidateSize(), 400);
  laadTerrassenInZicht();

  navigator.geolocation.getCurrentPosition(pos => {
    lastKnownPos = [pos.coords.latitude, pos.coords.longitude];
    L.circleMarker(lastKnownPos, {
      radius: 6,
      fillColor: "#2196f3",
      color: "#ffffff",
      weight: 2,
      fillOpacity: 1
    }).addTo(map).bindPopup("Jij bent hier");
    map.setView(lastKnownPos, 14);
  });

  updateZonStatus();
});

function zonTijdInfo(lat, lon) {
  const now = new Date();
  const times = SunCalc.getTimes(now, lat, lon);
  const pos = SunCalc.getPosition(now, lat, lon);
  const azimuth = (pos.azimuth * 180 / Math.PI + 180) % 360;
  const altitude = pos.altitude;
  const gevoel = Math.round(10 + (altitude * 60));
  const richting = zonRichting(azimuth);
  if (altitude > 0) {
    const sunset = times.sunset.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return `Zon nog ± ${Math.round((times.sunset - now) / 60000)} min<br>Zon gaat onder in het ${richting} rond ${sunset}<br>Gevoelstemperatuur: ${gevoel}°C`;
  } else {
    const terug = times.sunrise.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return `Zon terug rond ${terug}<br>Gevoelstemperatuur: ${gevoel}°C`;
  }
}

function zonRichting(azimuth) {
  if (azimuth >= 337.5 || azimuth < 22.5) return "noorden";
  if (azimuth < 67.5) return "noordoosten";
  if (azimuth < 112.5) return "oosten";
  if (azimuth < 157.5) return "zuidoosten";
  if (azimuth < 202.5) return "zuiden";
  if (azimuth < 247.5) return "zuidwesten";
  if (azimuth < 292.5) return "westen";
  return "noordwesten";
}

function laadTerrassenInZicht() {
  document.getElementById("melding").style.display = "block";
  document.getElementById("melding").textContent = "Terrasdata laden...";
  const b = map.getBounds();
  const query = `
    [out:json];
    (
      node["amenity"~"cafe|bar|pub|restaurant"](${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()});
    );
    out center;
  `;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  })
  .then(r => r.json())
  .then(data => {
    const terrassen = data.elements.map(e => ({
      lat: e.lat,
      lon: e.lon,
      name: e.tags?.name || "Onbekend terras"
    }));
    updateMarkers(terrassen.length ? terrassen : [{ lat: 52.0907, lon: 5.1214, name: "Fallback terras Utrecht" }]);
  })
  .catch(err => {
    updateMarkers([{ lat: 52.0907, lon: 5.1214, name: "Fallback terras Utrecht" }]);
    document.getElementById("melding").textContent = "Fout bij laden terrassen.";
  });
}

function updateMarkers(terrassen) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const filter = document.getElementById("zonFilter").value;
  let zichtbaar = 0;

  terrassen.forEach(t => {
    const pos = SunCalc.getPosition(new Date(), t.lat, t.lon);
    const zonnig = pos.altitude > 0 && Math.abs(pos.azimuth * 180 / Math.PI) < 160;

    if (filter === 'alle' || (filter === 'zon' && zonnig) || (filter === 'schaduw' && !zonnig)) {
      zichtbaar++;
      const info = zonTijdInfo(t.lat, t.lon);
      const marker = L.marker([t.lat, t.lon])
        .addTo(map)
        .bindPopup(`<b>${t.name}</b><br>${zonnig ? "Zonnetje!" : "Schaduw"}<br><i>${info}</i>`);
      markers.push(marker);
    }
  });

  document.getElementById("melding").style.display = "none";
  document.getElementById("status").textContent = `${zichtbaar} terras(sen) zichtbaar`;
}

function zoekLocatie() {
  const zoekterm = document.getElementById("zoekveld").value;
  if (!zoekterm) return;
  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zoekterm)}&format=json`)
    .then(r => r.json())
    .then(d => {
      if (d.length > 0) {
        map.setView([parseFloat(d[0].lat), parseFloat(d[0].lon)], 14);
      }
    });
}

function springNaarLocatie() {
  if (lastKnownPos) {
    map.setView(lastKnownPos, 14);
  }
}

function updateZonStatus() {
  if (!lastKnownPos) return;
  const pos = SunCalc.getPosition(new Date(), lastKnownPos[0], lastKnownPos[1]);
  const status = pos.altitude > 0 ? "zon op jouw locatie" : "schaduw op jouw locatie";
  document.getElementById("zonStatus").innerText = `Op dit moment: ${status}`;
}
setInterval(updateZonStatus, 30000);
