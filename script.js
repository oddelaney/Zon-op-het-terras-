
const map = L.map('map').setView([52.1, 5.1], 8);

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

function berekenOfZon(lat, lon, oriëntatie = 180) {
  const now = new Date();
  const sunPos = SunCalc.getPosition(now, lat, lon);
  const sunAzimuthDeg = (sunPos.azimuth * 180 / Math.PI + 180) % 360;
  const angleDiff = Math.abs(sunAzimuthDeg - oriëntatie);
  return angleDiff < 45 && sunPos.altitude > 0;
}

function updateMarkers(terrassen) {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  if (terrassen.length === 0) {
    document.getElementById('melding').textContent = "Geen terrassen gevonden in de buurt.";
    document.getElementById('melding').style.display = "block";
  } else {
    document.getElementById('melding').style.display = "none";
  }

  terrassen.forEach(t => {
    const zonnig = berekenOfZon(t.lat, t.lon);
    const marker = L.marker([t.lat, t.lon], { icon: zonnig ? zonnigIcon : schaduwIcon })
      .addTo(map)
      .bindPopup(`<b>${t.name || 'Onbekend terras'}</b><br>${zonnig ? 'Zonnetje!' : 'Schaduw...'}`);
    markers.push(marker);
  });
}

function laadTerrassenRond(lat, lon) {
  const radius = 2000;
  const query = `
    [out:json];
    (
      node["amenity"="cafe"](around:${radius},${lat},${lon});
      way["amenity"="cafe"](around:${radius},${lat},${lon});
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
  });
}

function initApp() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      map.setView([lat, lon], 15);
      laadTerrassenRond(lat, lon);
      setInterval(() => laadTerrassenRond(lat, lon), 60000);
    }, () => {
      document.getElementById('melding').textContent = "Locatie niet beschikbaar. Standaardlocatie gebruikt.";
      document.getElementById('melding').style.display = "block";
      laadTerrassenRond(52.1, 5.1);
    });
  } else {
    document.getElementById('melding').textContent = "Geolocatie wordt niet ondersteund.";
    document.getElementById('melding').style.display = "block";
    laadTerrassenRond(52.1, 5.1);
  }
}

initApp();
