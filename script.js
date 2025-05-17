
let map;
let markers = [];
let lastKnownPos = null;

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([52.0907, 5.1214], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([52.0907, 5.1214]).addTo(map).bindPopup("Fallback terras – Utrecht");
});
