// ==========================================================================
// 1. PARTICLES CANVAS SYSTEM
// ==========================================================================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const mouse = {
    x: undefined,
    y: undefined,
    radius: 220
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.pushX = 0;
        this.pushY = 0;
        this.alpha = 0; 
        this.fadeInSpeed = Math.random() * 0.02 + 0.01; 
        this.life = 1; 
        this.decay = Math.random() * 0.002 + 0.001; 
        this.isFadingOut = false;
    }

    update() {
        if (!this.isFadingOut) {
            if (this.alpha < 1) this.alpha += this.fadeInSpeed;
            this.life -= this.decay;
            if (this.life <= 0) this.isFadingOut = true;
        } else {
            this.alpha -= 0.02; 
            if (this.alpha <= 0) {
                this.reset(); 
            }
        }

        this.x += this.vx;
        this.y += this.vy;

        this.pushX *= 0.95;
        this.pushY *= 0.95;
        this.x += this.pushX;
        this.y += this.pushY;

        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                this.pushX -= Math.cos(angle) * force * 1.5;
                this.pushY -= Math.sin(angle) * force * 1.5;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.8})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
const particleCount = 250;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const minAlpha = Math.min(particles[a].alpha, particles[b].alpha);
                const lineAlpha = (1 - distance / 100) * minAlpha;

                ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

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

// ==========================================================================
// 2. FEATURED PROJECTS INTERACTION (VIEW TRANSITIONS API)
// ==========================================================================
const projects = document.querySelectorAll('.projects_parent .prj');

projects.forEach(project => {
    project.addEventListener('click', (e) => {
        // Αποφυγή αλλαγής layout αν ο χρήστης πατήσει πάνω στα κουμπιά, τα SVG ή τα span κείμενά τους
        if (e.target.closest('.github-btn') || e.target.closest('.linkedin-btn')) return;

        // Έλεγχος υποστήριξης για το Native View Transitions API
        if (!document.startViewTransition) {
            changeSelectedProject(project);
            return;
        }

        // Εκτέλεση ομαλού animation αλλαγής θέσης στο Grid
        document.startViewTransition(() => {
            changeSelectedProject(project);
        });
    });
});

function changeSelectedProject(targetProject) {
    document.querySelector('.projects_parent .selected_prj')?.classList.remove('selected_prj');
    targetProject.classList.add('selected_prj');
}

// ==========================================================================
// 3. TIMELINE ITEMS SINGLE-ACTIVE TOGGLE (ACCORDION BEHAVIOR)
// ==========================================================================
const timelineItems = document.querySelectorAll('.horizontal-timeline .ht-item');

timelineItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // 1. Ελέγχουμε αν το στοιχείο που πατήθηκε είναι ήδη ενεργό
        const isActive = item.classList.contains('active');

        // 2. Αφαιρούμε την κλάση 'active' από ΟΛΑ τα στοιχεία του timeline
        timelineItems.forEach(i => i.classList.remove('active'));

        // 3. Αν δεν ήταν ήδη ενεργό, το κάνουμε τώρα ενεργό
        // (Αν ήταν ενεργό, απλά μένει κλειστό αφού αφαιρέθηκε η κλάση παραπάνω)
        if (!isActive) {
            item.classList.add('active');
        }
    });
});


// ==========================================================================
// 4. STAGGERED SKILLS REVEAL ANIMATION (INTERSECTION OBSERVER)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    if (skillCards.length === 0) return;

    const skillObserverOptions = {
        root: null,
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Επιλογή όλων των ορατών καρτών για να εφαρμοστεί το staggered delay
                skillCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, index * 80); // 80ms καθυστέρηση ανά κάρτα για waterfall εφέ
                });
                // Αφού ενεργοποιηθεί η εμφάνιση, σταματάμε την παρακολούθηση
                observer.disconnect();
            }
        });
    }, skillObserverOptions);

    skillObserver.observe(document.querySelector('.skills_parent'));
});

// ==========================================================================\r
// 5. SHOW/HIDE NAVBAR ON SCROLL\r
// ==========================================================================\r
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector('nav.navbar');
    
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        // Αν το scroll ξεπεράσει τα 60px, εμφάνισε το navbar, αλλιώς κρύψτο
        if (window.scrollY > 60) {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }
    });
});

