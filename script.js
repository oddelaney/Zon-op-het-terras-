
const options = [
  "Ticket #3412: 'De printer bij sales print alleen blanco pagina's'",
  "Ticket #8821: 'Gebruiker Jeroen wil een PDF omzetten naar Word'",
  "Ticket #2299: 'Outlook crasht bij het openen van e-mail'",
  "Ticket #1010: 'Gebruiker meldt: wachtwoord vergeten'",
  "Ticket #4903: 'VPN werkt niet, maar gebruiker zegt niets veranderd te hebben'",
  "Ticket #7804: 'Geen internetverbinding - via Teams gemeld'",
  "Ticket #6620: 'Gebruiker heeft niks gedaan maar laptop werkt niet meer'",
  "Ticket #7711: 'Vraag: hoe maak ik mijn toetsenbord draadloos?'",
  "Ticket #9901: 'Scherm blijft zwart, mogelijk uitgeschakeld monitor'",
  "Ticket #4130: 'Teams update veroorzaakt foutmeldingen bij alle gebruikers'",
  "Ticket #3322: 'IT'er vraagt om wachtwoordreset'",
  "Ticket #8100: 'Kan je inloggen op mijn pc met deze handschoen aan?'",
  "Ticket #1220: 'Gebruiker heeft zelf wijzigingen gedaan in het register'",
  "Ticket #2341: 'Outlook opent meerdere keren bij dubbelklikken'",
  "Ticket #6642: 'Nieuwe medewerker vraagt waar de aan-knop zit'",
  "Ticket #8122: 'Gebruiker zegt: ik hoor niks - geluid blijkt uit'",
  "Ticket #9099: 'Vraag van manager: hoe maak ik een screenshot?'",
  "Ticket #2212: 'Caps Lock stond aan tijdens het inloggen'",
  "Ticket #7853: 'Gebruiker vraagt: mag ik een grotere muismat?'",
  "Ticket #1205: 'Laptop traag sinds maandag - vervanging gewenst'"
];

const messageEl = document.getElementById("message");
const ball = document.getElementById("magicBall");
const sound = new Audio('shake.mp3');

let lastX = null, lastY = null, lastZ = null, lastTime = Date.now();
let cooldown = false;

function shakeHandler() {
  if (cooldown) return;
  cooldown = true;

  const randomIndex = Math.floor(Math.random() * options.length);
  messageEl.classList.remove("ticket-animate");
  void messageEl.offsetWidth;
  messageEl.textContent = options[randomIndex];
  messageEl.classList.add("ticket-animate");

  ball.classList.add("shake");
  setTimeout(() => ball.classList.remove("shake"), 600);

  sound.currentTime = 0;
  sound.play().catch(() => {
    console.warn("Geluid kon niet automatisch afgespeeld worden.");
  });

  setTimeout(() => {
    cooldown = false;
  }, 1500);
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
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener("devicemotion", handleMotion);
          document.getElementById("permissionBtn").style.display = "none";
          console.log("Bewegingstoegang verleend.");
        } else {
          alert("Toegang tot beweging geweigerd.");
        }
      })
      .catch(e => {
        console.error("Fout bij vragen om toestemming:", e);
      });
  } else {
    window.addEventListener("devicemotion", handleMotion);
    document.getElementById("permissionBtn").style.display = "none";
    console.log("Bewegingsdetectie ingeschakeld zonder toestemming.");
  }
}

document.getElementById("permissionBtn").addEventListener("click", initMotion);
