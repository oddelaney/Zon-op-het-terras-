const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultText = document.getElementById("result");

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

const colors = ["#FF9999", "#FFCC99", "#FFFF99", "#CCFF99", "#99FFCC", "#99CCFF", "#CC99FF", "#FF99CC"];

let angle = 0;
let spinning = false;

function drawWheel() {
    const numOptions = options.length;
    const anglePerSlice = (2 * Math.PI) / numOptions;

    for (let i = 0; i < numOptions; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, anglePerSlice * i, anglePerSlice * (i + 1));
        ctx.lineTo(200, 200);
        ctx.fill();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(anglePerSlice * i + anglePerSlice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "14px Arial";
        ctx.fillText(options[i], 180, 5);
        ctx.restore();
    }
}

function spinWheel() {
    if (spinning) return;
    spinning = true;
    resultText.textContent = "";

    const totalSpins = Math.random() * 2000 + 2000;
    let currentSpin = 0;
    const spinSpeed = 10;

    const spinInterval = setInterval(() => {
        angle += 0.1;
        ctx.clearRect(0, 0, 400, 400);
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle);
        ctx.translate(-200, -200);
        drawWheel();
        ctx.restore();

        currentSpin += spinSpeed;
        if (currentSpin >= totalSpins) {
            clearInterval(spinInterval);
            spinning = false;

            const degrees = (angle * 180) / Math.PI;
            const selected = options.length - Math.floor((degrees % 360) / (360 / options.length)) - 1;
            const finalIndex = (selected + options.length) % options.length;

            resultText.textContent = `👉 ${options[finalIndex]}`;
        }
    }, 10);
}

drawWheel();
spinButton.addEventListener("click", spinWheel);
