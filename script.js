const options = [
  "Je moet langer op werk blijven",
  "Skip werk, pak een terrasje",
  "Je trein rijdt niet",
  "Je baas is ziek, vrij vandaag!",
  "Koffieautomaat stuk, ga maar naar huis",
  "Je krijgt onverwacht een bonus!",
  "Thuiswerken met kat op schoot",
  "Teamuitje: bowlen & bier"
];

const messageEl = document.getElementById("message");

function shakeHandler() {
  const randomIndex = Math.floor(Math.random() * options.length);
  messageEl.textContent = options[randomIndex];
}

// Simpele shake detectie (niet perfect maar werkt op veel telefoons)
let lastX = null, lastY = null, lastZ = null, lastTime = Date.now();

window.addEventListener("devicemotion", function(event) {
  const acc = event.accelerationIncludingGravity;
  const currentTime = Date.now();

  if ((currentTime - lastTime) > 100) {
    const deltaX = acc.x - (lastX || 0);
    const deltaY = acc.y - (lastY || 0);
    const deltaZ = acc.z - (lastZ || 0);
    const speed = Math.abs(deltaX + deltaY + deltaZ);

    if (speed > 25) {
      shakeHandler();
    }

    lastX = acc.x;
    lastY = acc.y;
    lastZ = acc.z;
    lastTime = currentTime;
  }
});