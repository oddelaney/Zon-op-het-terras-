
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

let map = L.map("map").setView([52.1, 5.1], 7);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

navigator.geolocation.getCurrentPosition(pos => {
  const userLoc = [pos.coords.latitude, pos.coords.longitude];
  L.circleMarker(userLoc, {
    radius: 6,
    fillColor: "#2196f3",
    color: "#ffffff",
    weight: 2,
    fillOpacity: 1
  }).addTo(map).bindPopup("Jij bent hier");
});

updateZonStatus();

function updateZonStatus() {
  const now = new Date();
  const pos = SunCalc.getPosition(now, 52.1, 5.1);
  const status = pos.altitude > 0 ? "zon op jouw locatie" : "schaduw op jouw locatie";
  document.getElementById("zonStatus").textContent = `Op dit moment: ${status}`;
}
setInterval(updateZonStatus, 30000);

function laadTerrassen() {
  document.getElementById("melding").style.display = "block";
  const query = `
    [out:json];
    (
      node["amenity"~"cafe|bar|pub|restaurant"](50.7,3.3,53.6,7.3);
    );
    out center;
  `;
  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  })
  .then(r => r.json())
  .then(data => {
    document.getElementById("melding").style.display = "none";
    const terrassen = data.elements.map(e => ({
      lat: e.lat,
      lon: e.lon,
      name: e.tags?.name || "Onbekend terras"
    }));
    toonMarkers(terrassen);
  });
}

function toonMarkers(terrassen) {
  terrassen.forEach(t => {
    const pos = SunCalc.getPosition(new Date(), t.lat, t.lon);
    const zonnig = pos.altitude > 0;

    const marker = L.marker([t.lat, t.lon], { icon: zonnig ? zonIcon : wolkIcon }).addTo(map);

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${t.lat}&longitude=${t.lon}&current=apparent_temperature&timezone=auto`)
      .then(res => res.json())
      .then(data => {
        const gevoel = data.current?.apparent_temperature ?? "onbekend";
        const info = zonTijdInfo(t.lat, t.lon, zonnig, gevoel);
        marker.bindPopup(`<b>${t.name}</b><br>${zonnig ? "Zonnetje!" : "Schaduw"}<br><i>${info}</i>${popupKnoppen(t.name)}`);
      });
  });
}

function zonTijdInfo(lat, lon, zonnig, gevoel) {
  const now = new Date();
  const times = SunCalc.getTimes(now, lat, lon);
  const sunset = times.sunset.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  const terug = times.sunrise.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  const richting = zonRichting(SunCalc.getPosition(now, lat, lon).azimuth * 180 / Math.PI + 180);
  if (zonnig) {
    return `Zon gaat onder in het ${richting} rond ${sunset}<br>Voelt als: ${gevoel}°C`;
  } else {
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

function popupKnoppen(naam) {
  return `<div class='popup-actions'>
    <button class='fav' onclick='toggleFavoriet("${naam}", this)'>☆ Favoriet</button>
    <button onclick='deelTerras("${naam}")'>Deel</button>
  </div>`;
}

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

laadTerrassen();
