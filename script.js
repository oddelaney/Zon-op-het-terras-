
let map = L.map('map').setView([52.1, 5.1], 8);
let markers = [];
let userMarker = null;
let lastKnownPos = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap & CartoDB'
}).addTo(map);

const zonnigIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
  iconSize: [30, 30]
});

const schaduwIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/414/414825.png',
  iconSize: [30, 30]
});

function zonTijdInfo(lat, lon) {
  const now = new Date();
  const times = SunCalc.getTimes(now, lat, lon);
  const sunPos = SunCalc.getPosition(now, lat, lon);
  const altitude = sunPos.altitude;
  const azimuth = (sunPos.azimuth * 180 / Math.PI + 180) % 360;
  const richting = azimuthToRichting(azimuth);
  const gevoel = Math.round(10 + (altitude * 60));

  if (altitude > 0) {
    const sunset = times.sunset;
    const zonTijd = sunset.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return `Zon nog ± ${Math.round((sunset - now) / 60000)} min.<br>Zon gaat onder in het ${richting} rond ${zonTijd}<br>Gevoelstemperatuur: ${gevoel}°C`;
  } else {
    const sunrise = times.sunrise;
    const zonTijd = sunrise.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return `Zon terug rond ${zonTijd}<br>Gevoelstemperatuur: ${gevoel}°C`;
  }
}

function azimuthToRichting(angle) {
  if (angle >= 337.5 || angle < 22.5) return "noorden";
  if (angle < 67.5) return "noordoosten";
  if (angle < 112.5) return "oosten";
  if (angle < 157.5) return "zuidoosten";
  if (angle < 202.5) return "zuiden";
  if (angle < 247.5) return "zuidwesten";
  if (angle < 292.5) return "westen";
  return "noordwesten";
}

function berekenOfZon(lat, lon) {
  const now = new Date();
  const pos = SunCalc.getPosition(now, lat, lon);
  const azimuth = (pos.azimuth * 180 / Math.PI + 180) % 360;
  return pos.altitude > 0 && Math.abs(azimuth - 180) < 45;
}

function updateMarkers(terrassen) {
  const filter = document.getElementById("zonFilter").value;
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  let zichtbaar = 0;

  terrassen.forEach(t => {
    const zonnig = berekenOfZon(t.lat, t.lon);
    if (filter === 'alle' || (filter === 'zon' && zonnig) || (filter === 'schaduw' && !zonnig)) {
      zichtbaar++;
      const marker = L.marker([t.lat, t.lon], { icon: zonnig ? zonnigIcon : schaduwIcon })
        .addTo(map)
        .bindPopup(`<b>${t.name || 'Onbekend terras'}</b><br>${zonnig ? 'Zonnetje!' : 'Schaduw'}<br><i>${zonTijdInfo(t.lat, t.lon)}</i>`);
      markers.push(marker);
    }
  });

  document.getElementById("melding").style.display = "none";
  document.getElementById("status").style.display = "block";
  document.getElementById("status").innerText = `${zichtbaar} terrassen zichtbaar (${filter})`;
}

function laadTerrassenInZicht() {
  document.getElementById("melding").textContent = "Terrasdata laden...";
  document.getElementById("melding").style.display = "block";

  const b = map.getBounds();
  const query = `
    [out:json];
    (
      node["amenity"~"cafe|bar|pub|restaurant"](${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()});
      way["amenity"~"cafe|bar|pub|restaurant"](${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()});
    );
    out center;
  `;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  })
  .then(res => res.json())
  .then(data => {
    const terrassen = data.elements.map(e => {
      const lat = e.lat || e.center?.lat;
      const lon = e.lon || e.center?.lon;
      return { lat, lon, name: e.tags?.name };
    }).filter(t => t.lat && t.lon);
    updateMarkers(terrassen);
  });
}

function zoekLocatie() {
  const zoekterm = document.getElementById('zoekveld').value;
  if (!zoekterm) return;
  document.getElementById("melding").textContent = "Locatie zoeken...";
  document.getElementById("melding").style.display = "block";

  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zoekterm)}&format=json`)
    .then(r => r.json())
    .then(d => {
      if (d.length > 0) {
        const lat = parseFloat(d[0].lat);
        const lon = parseFloat(d[0].lon);
        map.setView([lat, lon], 14);
      } else {
        alert("Geen locatie gevonden.");
      }
    });
}

function springNaarLocatie() {
  if (lastKnownPos) {
    map.setView(lastKnownPos, 14);
  }
}

navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  lastKnownPos = [lat, lon];
  map.setView(lastKnownPos, 13);
  userMarker = L.circleMarker(lastKnownPos, {
    radius: 6,
    fillColor: "#2196f3",
    color: "#ffffff",
    weight: 2,
    fillOpacity: 1
  }).addTo(map).bindPopup("Jij bent hier");
});

map.on('moveend', laadTerrassenInZicht);
window.onload = laadTerrassenInZicht;

function deelTerras(lat, lon, name) {
  const link = `https://www.google.com/maps?q=${lat},${lon}`;
  const msg = `Check dit terras: ${name}\n${link}`;
  if (navigator.share) {
    navigator.share({ title: name, text: msg, url: link });
  } else {
    navigator.clipboard.writeText(link);
    alert("Link gekopieerd!");
  }
}

function toggleFavoriet(lat, lon, name) {
  const key = `${lat},${lon}`;
  const stored = JSON.parse(localStorage.getItem("favorieten") || "{}");
  if (stored[key]) {
    delete stored[key];
    alert("Verwijderd uit favorieten.");
  } else {
    stored[key] = name;
    alert("Toegevoegd aan favorieten!");
  }
  localStorage.setItem("favorieten", JSON.stringify(stored));
}

// Overschrijf updateMarkers met deel- en favorietknoppen
updateMarkers = function(terrassen) {
  const filter = document.getElementById("zonFilter").value;
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  let zichtbaar = 0;

  terrassen.forEach(t => {
    const zonnig = berekenOfZon(t.lat, t.lon);
    if (filter === 'alle' || (filter === 'zon' && zonnig) || (filter === 'schaduw' && !zonnig)) {
      zichtbaar++;
      const tijdInfo = zonTijdInfo(t.lat, t.lon);
      const popupContent = \`
        <b>\${t.name || 'Onbekend terras'}</b><br>
        \${zonnig ? 'Zonnetje!' : 'Schaduw'}<br>
        <i>\${tijdInfo}</i><br>
        <button class='fav-button' onclick="toggleFavoriet(\${t.lat}, \${t.lon}, '\${t.name || ''}')">★ Favoriet</button>
        <button class='share-button' onclick="deelTerras(\${t.lat}, \${t.lon}, '\${t.name || ''}')">Deel</button>
      \`;
      const marker = L.marker([t.lat, t.lon], { icon: zonnig ? zonnigIcon : schaduwIcon })
        .addTo(map)
        .bindPopup(popupContent);
      markers.push(marker);
    }
  });

  document.getElementById("melding").style.display = "none";
  document.getElementById("status").style.display = "block";
  document.getElementById("status").innerText = `${zichtbaar} terrassen zichtbaar (${filter})`;
}

function updateZonStatus() {
  if (!lastKnownPos) return;
  const pos = SunCalc.getPosition(new Date(), lastKnownPos[0], lastKnownPos[1]);
  const status = pos.altitude > 0 ? "zon op jouw locatie" : "schaduw op jouw locatie";
  document.getElementById("zonStatus").innerText = `Op dit moment: ${status}`;
}
setInterval(updateZonStatus, 30000);
window.setTimeout(updateZonStatus, 2000);
