
let map;
let markers = [];
let lastKnownPos = null;

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([52.1, 5.1], 8);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors & CartoDB',
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
});

function laadTerrassenInZicht() {
  const melding = document.getElementById("melding");
  melding.style.display = "block";
  melding.textContent = "Terrasdata laden...";

  const query = `
    [out:json];
    node["amenity"~"cafe|bar|pub|restaurant"](52.05,5.05,52.15,5.15);
    out;
  `;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  })
  .then(res => res.json())
  .then(data => {
    const terrassen = data.elements.map(e => ({
      lat: e.lat,
      lon: e.lon,
      name: e.tags?.name || "Onbekend terras"
    }));
    updateMarkers(terrassen.length ? terrassen : [{ lat: 52.0907, lon: 5.1214, name: "Fallback terras Utrecht" }]);
  })
  .catch(err => {
    console.error("Fout bij ophalen Overpass-data:", err);
    updateMarkers([{ lat: 52.0907, lon: 5.1214, name: "Fallback terras Utrecht" }]);
  });
}

function updateMarkers(terrassen) {
  const mapDiv = document.getElementById("map");
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  terrassen.forEach(t => {
    const marker = L.marker([t.lat, t.lon])
      .addTo(map)
      .bindPopup(`<b>${t.name}</b><br>Testterras`);
    markers.push(marker);
  });

  document.getElementById("melding").style.display = "none";
  document.getElementById("status").textContent = `${terrassen.length} terras(sen) zichtbaar`;
  document.getElementById("status").style.display = "block";
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
