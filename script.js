
const zonIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});
const wolkIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});



let map;
let markers = [];
let lastKnownPos = null;


const zonIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Circle-icons-sun.svg/48px-Circle-icons-sun.svg.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const wolkIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Circle-icons-cloud.svg/48px-Circle-icons-cloud.svg.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});


document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([52.0907, 5.1214], 8);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap & CartoDB',
    subdomains: 'abcd'
  }).addTo(map);

  setTimeout(() => { laadTerrassenInZicht(); }, 100);

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
  const gevoel = Math.max(5, Math.min(30, Math.round(15 + (altitude * 50))));
  const richting = zonRichting(azimuth);
  if (altitude > 0) {
    const sunset = times.sunset.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return `Zon schijnt nog even ${Math.round((times.sunset - now) / 60000)} min<br>Zon gaat onder in het ${richting} rond ${sunset}<br>Voelt als: ${gevoel}°C`;
  } else {
    const terug = times.sunrise.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return `Zon terug rond ${terug}<br>Voelt als: ${gevoel}°C`;
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
  const b = {getSouth: () => 50.7, getWest: () => 3.3, getNorth: () => 53.6, getEast: () => 7.3};
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
    document.getElementById("melding").style.display = "none";
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
      const marker = L.marker([t.lat, t.lon], { icon: zonnig ? zonIcon : wolkIcon })
        .addTo(map)
        .bindPopup(`<b>${t.name}</b><br>${zonnig ? "Zonnetje!" : "Schaduw"}<br><i>${info}</i>
    <div class='popup-actions'>
      <button class='fav' onclick='toggleFavoriet("${t.name}", this)'>☆ Favoriet</button>
      <button onclick='deelTerras("${t.name}")'>Deel</button>
    </div>`);
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


function toggleFavoriet(naam, btn) {
  let favs = JSON.parse(localStorage.getItem("favs") || "[]");
  if (favs.includes(naam)) {
    favs = favs.filter(f => f !== naam);
    btn.textContent = "☆ Favoriet";
    btn.classList.remove("saved");
  } else {
    favs.push(naam);
    btn.textContent = "★ Verwijder";
    btn.classList.add("saved");
  }
  localStorage.setItem("favs", JSON.stringify(favs));
}

function deelTerras(naam) {
  const url = `${location.origin}?terras=${encodeURIComponent(naam)}`;
  navigator.clipboard.writeText(url);
  alert(`Link gekopieerd: ${url}`);
}
