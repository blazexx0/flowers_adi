// --- 1. READ THE URL DATA ---
const urlParams = new URLSearchParams(window.location.search);
document.getElementById('to-text').textContent = urlParams.get('to') || 'My Special Someone';
document.getElementById('occasion-text').textContent = urlParams.get('occasion') || 'JUST THINKING OF YOU';
const msg = urlParams.get('msg') || 'A little garden blooming just for you,|to remind you how deeply loved you are.';

const messageContainer = document.getElementById('message-container');
msg.split('|').forEach(line => {
    const p = document.createElement('p');
    p.textContent = line.trim();
    messageContainer.appendChild(p);
});

// --- 2. GENERATIVE FLOWER ANIMATION & INTERACTIVITY ---
const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

const flowerColors = [
    ['#f48fb1', '#ad1457'],
    ['#ffe082', '#ff8f00'],
    ['#ffab91', '#d84315'],
    ['#ce93d8', '#6a1b9a']
];

class Flower {
    // We added x and targetY parameters so we can tell the flower exactly where to grow
    constructor(x = null, targetY = null) {
        this.x = x !== null ? x : Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.targetY = targetY !== null ? targetY : canvas.height - (Math.random() * (canvas.height * 0.6) + 150);
        this.swayOffset = Math.random() * 1000;
        this.progress = 0;
        this.speed = Math.random() * 0.003 + 0.002;
        this.color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        this.size = Math.random() * 15 + 18;
        this.bloomed = 0;
        this.petalCount = Math.floor(Math.random() * 4) + 6;
    }

    draw() {
        const sway = Math.sin(Date.now() * 0.001 + this.swayOffset) * 15;
        const currentY = this.y - (this.y - this.targetY) * this.progress;
        const currentX = this.x + (sway * this.progress);

        // Draw Stem
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.quadraticCurveTo(this.x, currentY + 100, currentX, currentY);
        ctx.strokeStyle = '#2d5a27';
        ctx.lineWidth = 4;
        ctx.stroke();

        if (this.progress < 1) {
            this.progress += this.speed;
        } else if (this.bloomed < 1) {
            this.bloomed += 0.04;
        }

        // Draw Flower
        if (this.progress >= 1) {
            ctx.save();
            ctx.translate(currentX, currentY);
            ctx.scale(this.bloomed, this.bloomed);

            for (let i = 0; i < this.petalCount; i++) {
                ctx.rotate((Math.PI * 2) / this.petalCount);
                ctx.beginPath();
                ctx.fillStyle = this.color[0];
                ctx.ellipse(this.size, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color[1];
            ctx.fill();
            ctx.restore();
        }
    }
}

class Petal {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.size = Math.random() * 6 + 4;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.05 - 0.025;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01);
        this.angle += this.spin;
        if (this.y > canvas.height + 50) {
            this.y = -50;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'rgba(244, 143, 177, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const flowers = [];
for (let i = 0; i < 40; i++) {
    setTimeout(() => {
        flowers.push(new Flower());
    }, i * 200);
}
const fallingPetals = Array.from({length: 30}, () => new Petal());

// --- INTERACTIVITY: Grow flowers on click or tap ---
window.addEventListener('click', (e) => {
    flowers.push(new Flower(e.clientX, e.clientY));
});

window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    flowers.push(new Flower(touch.clientX, touch.clientY));
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fallingPetals.forEach(p => { p.update(); p.draw(); });

    flowers.sort((a, b) => b.targetY - a.targetY);
    flowers.forEach(f => f.draw());

    requestAnimationFrame(animate);
}

animate();
window.addEventListener('resize', resizeCanvas);
