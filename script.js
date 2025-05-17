
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

function zonTijdInfo(lat, lon) {
  const now = new Date();
  const times = SunCalc.getTimes(now, lat, lon);
  const sunPos = SunCalc.getPosition(now, lat, lon);
  if (sunPos.altitude > 0) {
    const sunset = times.sunset;
    const minutes = Math.round((sunset - now) / 60000);
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
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  if (terrassen.length === 0) {
    document.getElementById('melding').textContent = "Geen terrassen gevonden in dit gebied.";
    document.getElementById('melding').style.display = "block";
  } else {
    document.getElementById('melding').style.display = "none";
  }

  terrassen.forEach(t => {
    const zonnig = berekenOfZon(t.lat, t.lon);
    const tijdInfo = zonTijdInfo(t.lat, t.lon);
    const marker = L.marker([t.lat, t.lon], { icon: zonnig ? zonnigIcon : schaduwIcon })
      .addTo(map)
      .bindPopup(`<b>${t.name || 'Onbekend terras'}</b><br>${zonnig ? 'Zonnetje!' : 'Schaduw...'}<br><i>${tijdInfo}</i>`);
    markers.push(marker);
  });
}

function laadTerrassenRond(lat, lon) {
  const radius = 3000;
  const query = `
    [out:json];
    (
      node["amenity"~"cafe|bar|pub|restaurant"](around:${radius},${lat},${lon});
      way["amenity"~"cafe|bar|pub|restaurant"](around:${radius},${lat},${lon});
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
    document.getElementById('melding').textContent = "Fout bij laden van terrasdata.";
    document.getElementById('melding').style.display = "block";
    console.error(err);
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

function zoekLocatie() {
  const zoekterm = document.getElementById('zoekveld').value;
  if (!zoekterm) return;
  fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zoekterm)}&format=json`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        map.setView([lat, lon], 15);
        laadTerrassenRond(lat, lon);
      } else {
        alert("Geen locatie gevonden.");
      }
    });
}

initApp();
