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
const ball = document.getElementById("magicBall");
const sound = new Audio('shake.mp3');

let lastX = null, lastY = null, lastZ = null, lastTime = Date.now();

function shakeHandler() {
  const randomIndex = Math.floor(Math.random() * options.length);
  messageEl.textContent = options[randomIndex];

  ball.classList.add("shake");
  setTimeout(() => ball.classList.remove("shake"), 600);

  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }

  sound.currentTime = 0;
  sound.play().catch(() => {
    console.warn("Geluid kon niet automatisch afgespeeld worden.");
  });
}

function handleMotion(event) {
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
}

function initMotion() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response === 'granted') {
        window.addEventListener("devicemotion", handleMotion);
        document.getElementById("permissionBtn").style.display = "none";
      } else {
        alert("Bewegingstoegang geweigerd.");
      }
    }).catch(console.error);
  } else {
    window.addEventListener("devicemotion", handleMotion);
    document.getElementById("permissionBtn").style.display = "none";
  }
}

document.getElementById("permissionBtn").addEventListener("click", initMotion);
