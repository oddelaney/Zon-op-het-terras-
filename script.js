
const map = L.map('map').setView([52.1, 5.1], 7);
let loading = false;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const zonnigIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
  iconSize: [30, 30]
});

const schaduwIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/414/414825.png',
  iconSize: [30, 30]
});

let markers = [];

function zonTijdInfo(lat, lon) {
  const now = new Date();
  const times = SunCalc.getTimes(now, lat, lon);
  const sunPos = SunCalc.getPosition(now, lat, lon);
  if (sunPos.altitude > 0) {
    const sunset = times.sunset;
    const minutes = Math.max(0, Math.round((sunset - now) / 60000));
    return `Zon nog ± ${minutes} min.`;
  } else {
    const nextRise = times.sunrise;
    return `Zon terug rond ${nextRise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }
}

function berekenOfZon(lat, lon, oriëntatie = 180) {
  const now = new Date();
  const sunPos = SunCalc.getPosition(now, lat, lon);
  const sunAzimuthDeg = (sunPos.azimuth * 180 / Math.PI + 180) % 360;
  const angleDiff = Math.abs(sunAzimuthDeg - oriëntatie);
  return angleDiff < 45 && sunPos.altitude > 0;
}

function updateMarkers(terrassen) {
  const filter = document.getElementById("zonFilter").value;
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  terrassen.forEach(t => {
    const zonnig = berekenOfZon(t.lat, t.lon);
    if (
      filter === "alle" ||
      (filter === "zon" && zonnig) ||
      (filter === "schaduw" && !zonnig)
    ) {
      const tijdInfo = zonTijdInfo(t.lat, t.lon);
      const marker = L.marker([t.lat, t.lon], { icon: zonnig ? zonnigIcon : schaduwIcon })
        .addTo(map)
        .bindPopup(`<b>${t.name || 'Onbekend terras'}</b><br>${zonnig ? 'Zonnetje!' : 'Schaduw'}<br><i>${tijdInfo}</i>`);
      markers.push(marker);
    }
  });

  document.getElementById('melding').style.display = "none";
  loading = false;
}

function laadTerrassenInZicht() {
  if (loading) return;
  loading = true;
  document.getElementById('melding').textContent = "Terrasdata laden...";
  document.getElementById('melding').style.display = "block";

  const bounds = map.getBounds();
  const query = `
    [out:json];
    (
      node["amenity"~"cafe|bar|pub|restaurant"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
      way["amenity"~"cafe|bar|pub|restaurant"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
    );
    out center;
  `;
  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  })
  .then(res => res.json())
  .then(data => {
    const terrassen = data.elements.map(el => {
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      return { lat, lon, name: el.tags?.name };
    }).filter(t => t.lat && t.lon);
    updateMarkers(terrassen);
  })
  .catch(err => {
    console.error("Overpass API error:", err);
    document.getElementById('melding').textContent = "Fout bij laden van terrassen.";
  });
}

function zoekLocatie() {
  const zoekterm = document.getElementById('zoekveld').value;
  if (!zoekterm) return;
  document.getElementById('melding').textContent = "Locatie zoeken...";
  document.getElementById('melding').style.display = "block";

  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zoekterm)}&format=json`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        map.setView([lat, lon], 15);
      } else {
        alert("Geen locatie gevonden.");
        document.getElementById('melding').style.display = "none";
      }
    });
}

map.on('moveend', laadTerrassenInZicht);

navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  map.setView([lat, lon], 13);
});
