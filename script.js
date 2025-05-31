const options = [
  "De printer bij sales is weer offline",
  "Jeroen vraagt hoe je een PDF omzet naar een Word-document",
  "Outlook start niet op… alweer",
  "Je eerste ticket is: 'Ik ben mijn wachtwoord vergeten'",
  "VPN doet het niet, maar ze hebben niks veranderd",
  "We hebben geen internet — gestuurd via Teams",
  "Laptop kapot. Gebruiker zegt: 'Ik heb echt niks gedaan'",
  "Kan ik m’n toetsenbord ook draadloos maken?",
  "Je wordt gebeld: 'Ik zie ineens niks meer!' (monitor uit)",
  "Microsoft Teams update. Alles crasht.",
  "IT’er belt IT’er omdat hij z’n wachtwoord kwijt is",
  "Je mag weer inloggen met iemand z’n rsi-handschoen aan",
  "Ik heb gisteravond zelf iets geprobeerd…",
  "Je belt iemand. Ze nemen op met: 'Oh jij belt ook?'",
  "Helpdesk of hulppsycholoog? Vandaag allebei",
  "Ticket: 'Printer print alleen wit papier'",
  "Gebruiker klikt 11x op Outlook. Alles opent tegelijk",
  "Nieuwe collega vraagt: 'Waar is de Aan-knop?'",
  "Je staat op mute. Weer.",
  "Teamlead: 'Hoe ver ben je met die 300 tickets?'",
  "Gebruiker wil Excel gebruiken als CRM",
  "Iemand heeft z’n muis ondersteboven liggen",
  "Waarom is mijn bureaublad ineens leeg?! (F5)",
  "Wat is m’n gebruikersnaam ook alweer?",
  "Collega belt: 'Er komt rook uit de computer'",
  "Teams doet raar. Iedereen reboot. Niks helpt.",
  "Jeroen vraagt of zijn iPad op Windows kan",
  "Ik heb per ongeluk alles verwijderd",
  "Waarom doet de koffieautomaat het niet? Is dat ook ICT?",
  "Je mag weer een monitor vervangen van 7 kilo",
  "Outlook vraagt om verificatie… chaos breekt uit",
  "Je wordt live aangekeken tijdens remote control",
  "Je moet uitleggen wat een browser is",
  "Gebruiker belt: Caps Lock stond aan",
  "Mag ik een grotere muismat?",
  "Je derde scherm doet het niet. Je werkt nu op één",
  "Je wordt gechat via 4 kanalen tegelijk. Allemaal spoed.",
  "Wat is een cloud eigenlijk?",
  "Gebruiker belt: speaker staat uit",
  "Serverruimte is 32 graden. Alles smelt",
  "Je krijgt een papieren ticket… van de receptioniste",
  "Gebruiker heeft toetsenbord in AZERTY gezet",
  "Deze laptop is traag sinds 2 dagen. Vervangen graag.",
  "12 openstaande tickets met hoge prioriteit",
  "Iemand heeft de router uitgezet",
  "Management belt: 'Hoe maak ik screenshots?'",
  "Mijn Google is weg",
  "Ticket: 'Het is stuk.'",
  "Printer zegt 404. Betekent dat iets?",
  "Gebruiker zegt: 'Ik snap het nog steeds niet.'",
  "Collega vraagt: 'Wat doe jij eigenlijk de hele dag?'",
  "Je krijgt 3 systemen te beheren — zonder uitleg",
  "Gebruiker slaat bestand op... en vindt het nooit meer terug",
  "Kat zit op het toetsenbord",
  "Je wordt gebeld voor een issue... in een ander land",
  "Melding: URGENT URGENT URGENT",
  "WiFi werkt niet. Stekker eruit",
  "Onderwerp: 'HELP'. Geen inhoud",
  "Hoe werkt dat... dat internet?",
  "Excel wordt gebruikt als tekstverwerker",
  "Outlook resetten want handtekening weg",
  "Wachtwoord moet hoofdletter, cijfer, symbool én je ziel",
  "Ticket: 'Ik wil alles sneller.'",
  "Leveren jullie ook printers voor thuis?",
  "Nieuw systeem uitgerold. Gebruikers in paniek.",
  "Update gehad. Alles doet raar.",
  "Router thuis instellen? Tuurlijk, kom maar op.",
  "Gebeld door iemand… zonder headset",
  "Verwijderd. Kan jij het terugtoveren?",
  "Waarom kunnen we niet gewoon WhatsAppen op werk?",
  "6 tonerpacks sjouwen naar de printer",
  "Waarom moet ik wéér m’n wachtwoord wijzigen?",
  "Scherm zwart. Stekker eruit.",
  "Excel-bestand van 600MB",
  "Afsluiten of slapen? Niemand weet het.",
  "95 ongelezen e-mails in je inbox",
  "Gratis luisterend oor vandaag",
  "Word gebruiken om een mail te typen",
  "58 tabs open. Laptop traag.",
  "Spatiebalk plakt",
  "Icoontjes zijn groot (200%)",
  "Teams verwijderd. Wat nu?",
  "Heb je al opnieuw opgestart?",
  "Collega: 'Ik snap deze melding ook niet.'",
  "Nieuwe collega wil alles zelf doen",
  "Ticket: 'Ik wil een ander lettertype'",
  "Fortnite op werkcomputer installeren?",
  "Muis werkt niet. Draadje los.",
  "Printer zegt: out of paper. Papierlade vol.",
  "AVG geïnstalleerd want dat leek me handig",
  "Computer piept en doet niks meer",
  "Je lunch is klaar. Spoedmelding binnen.",
  "Ticket gesloten… en meteen weer geopend",
  "Spoedaanvraag voor een HDMI-kabel",
  "Kun jij m’n privé-laptop versnellen?",
  "Teams zonder internet gebruiken",
  "Bureaublad per ongeluk versleept",
  "Collega belt… omdat zijn telefoon niet werkt",
  "Einde van de dag: 'Wat heb ik eigenlijk bereikt?'"
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
  messageEl.textContent = options[randomIndex];
  messageEl.style.animation = "none";
  void messageEl.offsetWidth;
  messageEl.style.animation = "fadeInPop 0.5s ease";

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
