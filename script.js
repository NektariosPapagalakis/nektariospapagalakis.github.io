const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

// =========================
// Canvas Size
// =========================
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// =========================
// Mouse
// =========================
const mouse = {
    x: undefined,
    y: undefined,
    radius: 220
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// =========================
// Particle Class
// =========================
class Particle {

    constructor() {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 2 + 1;

        // αυτόνομη κίνηση
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;

        // smooth interaction
        this.pushX = 0;
        this.pushY = 0;
    }

    update() {

        // =========================
        // Normal movement
        // =========================
        this.x += this.vx;
        this.y += this.vy;

        // inertia
        this.pushX *= 0.95;
        this.pushY *= 0.95;

        this.x += this.pushX;
        this.y += this.pushY;

        // =========================
        // Bounce edges
        // =========================
        if (this.x <= 0 || this.x >= canvas.width) {
            this.vx *= -1;
        }

        if (this.y <= 0 || this.y >= canvas.height) {
            this.vy *= -1;
        }

        // =========================
        // Mouse Interaction
        // =========================
        if (mouse.x && mouse.y) {

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {

                const force = (mouse.radius - distance) / mouse.radius;

                const angle = Math.atan2(dy, dx);

                // repel effect
                this.pushX -= Math.cos(angle) * force * 1.5;
                this.pushY -= Math.sin(angle) * force * 1.5;
            }
        }
    }

    draw() {

        ctx.beginPath();

        ctx.fillStyle = "rgba(255,255,255,0.8)";

        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        ctx.fill();
    }
}

// =========================
// Create Particles
// =========================
const particles = [];

const particleCount = 250;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// =========================
// Connect Lines
// =========================
function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

        for (let b = a; b < particles.length; b++) {

            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {

                ctx.strokeStyle = `rgba(255,255,255,${
                    1 - distance / 100
                })`;

                ctx.lineWidth = 0.5;

                ctx.beginPath();

                ctx.moveTo(particles[a].x, particles[a].y);

                ctx.lineTo(particles[b].x, particles[b].y);

                ctx.stroke();
            }
        }
    }
}

// =========================
// Animation
// =========================
function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let particle of particles) {

        particle.update();

        particle.draw();
    }

    connectParticles();

    requestAnimationFrame(animate);
}

animate();