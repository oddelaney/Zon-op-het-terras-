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
  "Ticket #1205: 'Laptop traag sinds maandag - vervanging gewenst'",
  "Ticket #5540: 'Wat is mijn gebruikersnaam ook alweer?'",
  "Ticket #2022: 'Ik zie geen muis meer op het scherm'",
  "Ticket #7700: 'Gebruiker heeft per ongeluk alles verwijderd'",
  "Ticket #8423: 'Bureaublad icoontjes zijn ineens reusachtig'",
  "Ticket #3103: 'Vraag: kunnen we WhatsApp zakelijk gebruiken?'",
  "Ticket #4561: 'Toetsenbord heeft ineens een andere indeling (AZERTY)'",
  "Ticket #1411: 'Gebruiker belt: 'Mijn Google is weg''",
  "Ticket #2888: 'Er komt rook uit een computerkast op afdeling B'",
  "Ticket #5111: 'Hoe werkt internet eigenlijk?'",
  "Ticket #3156: 'Ticket bevat alleen: 'Het werkt niet''",
  "Ticket #1123: 'Outlook handtekening verdwenen, graag herstellen'",
  "Ticket #8190: 'Gebruiker vraagt of hij thuis ook support krijgt'",
  "Ticket #3939: 'Excel wordt gebruikt als database met 5000 rijen'",
  "Ticket #9990: 'Laptop maakt piep en gaat niet aan'",
  "Ticket #4810: 'Vraag: hoe maak ik een document op in Comic Sans?'",
  "Ticket #5403: 'Mijn scherm is zwart - stekker blijkt eruit te zijn'",
  "Ticket #7777: 'Gebruiker meldt: spatiebalk blijft hangen'",
  "Ticket #6767: 'Kat heeft over toetsenbord gelopen'",
  "Ticket #8811: 'Gebruiker vraagt of privé laptop sneller gemaakt kan worden'",
  "Ticket #6666: 'Er staat 404 op het printerdisplay'",
  "Ticket #3144: 'Waarom moet ik mijn wachtwoord wéér wijzigen?'",
  "Ticket #3333: 'Gebruiker meldt: 'Mijn icoontjes dansen over het scherm''",
  "Ticket #4141: 'Gebruiker installeerde per ongeluk antivirus van 2007'",
  "Ticket #8181: 'Vraag: hoe reset ik mijn computer met een hamer?'",
  "Ticket #9009: 'Gebruiker belt: ik zie niks meer (monitor uit)'",
  "Ticket #0070: 'Gebruiker wil Outlook gebruiken om te tekenen'",
  "Ticket #1234: 'Vraag: kan ik Word gebruiken zonder Office?'",
  "Ticket #8819: 'Laptop valt uit bij aanraking USB-poort'",
  "Ticket #4321: 'Mag ik een ander lettertype in de hele organisatie?'",
  "Ticket #4444: 'Gebruiker vraagt om Fortnite op de werk-laptop te installeren'",
  "Ticket #5555: 'Excel crasht bij openen van 700MB bestand'",
  "Ticket #1001: 'Spoed: HDMI-kabel kwijt op directie-etage'",
  "Ticket #9900: 'Teams verwijderd per ongeluk, graag herstellen'",
  "Ticket #2345: 'Gebruiker heeft bureaublad per ongeluk verplaatst'",
  "Ticket #2020: 'Mailt met onderwerp HELP. Geen inhoud.'",
  "Ticket #9090: 'Laptop start op in veilige modus — zonder reden'",
  "Ticket #8888: 'Waarom zijn de icoontjes op het bureaublad verdwenen?'",
  "Ticket #7770: 'VPN werkt alleen thuis, niet op kantoor'",
  "Ticket #6543: 'Gebruiker vraagt: waar sla ik het op?'",
  "Ticket #6060: 'Printer: 'Out of paper' terwijl papierlade vol is'",
  "Ticket #5050: 'Laptop maakt ventilatorgeluid, gebruiker denkt dat hij opstijgt'",
  "Ticket #4441: 'Vraag: wat is het verschil tussen internet en WiFi?'",
  "Ticket #4333: 'Gebruiker ziet blauw scherm, denkt dat dit normaal is'",
  "Ticket #3210: 'Spoed: naam op e-mailhandtekening is verkeerd gespeld'",
  "Ticket #7890: 'Serverruimte bereikt 35 graden — alarm gaat af'",
  "Ticket #3100: 'Vraag: kan ik met een screenshot printen?'",
  "Ticket #8700: 'Gebruiker gebruikt rekenmachine in Word'",
  "Ticket #4123: 'Bestand opgeslagen… en nu kwijt'",
  "Ticket #3141: 'Vraag: waarom moet ik dubbelklikken?'",
  "Ticket #1414: 'Gebruiker heeft bureaublad opgedeeld in 6 mappen genaamd 1 t/m 6'",
  "Ticket #5151: 'Waarom moet ik m’n muis opladen?'",
  "Ticket #7070: 'Kan ik ergens zien wat mijn wachtwoord is?'",
  "Ticket #6161: 'Gebruiker meldt dat zijn bureaustoel kraakt — bij IT-ticket ingediend'",
  "Ticket #3030: 'Mijn laptop ruikt raar. Is dat normaal?'",
  "Ticket #2929: 'Help, mijn toetsenbord heeft ineens een Q op de A plek!'",
  "Ticket #3434: 'Gebruiker vraagt of je thuis kan komen installeren'",
  "Ticket #3737: 'Waarom werkt het toetsenbord niet als ik het in de muispoort steek?'",
  "Ticket #6262: 'Vraag: wat is een desktop precies?'",
  "Ticket #0101: 'Gebruiker meldt dat de kalender een dag voorloopt'",
  "Ticket #0808: 'Mag ik een langere USB-kabel? Deze is te kort voor koffie'",
  "Ticket #0707: 'Vraag: waarom gaan mijn mailtjes naar 'Verzonden'?'"  
];

 = document.getElementById("message");
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


const permissionBtn = document.getElementById("permissionBtn");
permissionBtn.addEventListener("click", () => {
  initMotion();
  console.log("Toestemming knop geklikt");
});


// Fallback om te testen of beweging wordt geregistreerd
document.addEventListener("click", () => {
  console.log("Klik gedetecteerd – fallback actief.");
});
