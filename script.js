/* ============================================
   PORTFOLIO INTERACTIVE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initLoader(() => {
        initNavigation();
        initScrollReveal();
        initCounterAnimation();
        initContactForm();
        initSmoothScroll();
        initParallax();
        initCustomCursor();
        initCardSpotlight();
        initParticleNetwork();
    });
});

/* ============================================
   LOADING SCREEN
   Animated progress bar → reveal site
   ============================================ */
function initLoader(onComplete) {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loaderBar');
    const percent = document.getElementById('loaderPercent');

    if (!loader || !bar || !percent) {
        onComplete();
        return;
    }

    document.body.classList.add('is-loading');

    let progress = 0;
    const duration = 2000; // 2 seconds total
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const raw = Math.min(elapsed / duration, 1);

        // Eased progress — starts slow, accelerates, then eases to 100
        progress = Math.round(easeInOutCubic(raw) * 100);

        bar.style.width = `${progress}%`;
        percent.textContent = `${progress}%`;

        if (raw < 1) {
            requestAnimationFrame(update);
        } else {
            // Loading complete — reveal site
            setTimeout(() => {
                loader.classList.add('loader--done');
                document.body.classList.remove('is-loading');

                // Remove loader from DOM after transition
                setTimeout(() => {
                    loader.remove();
                }, 600);

                onComplete();
            }, 300); // Brief pause at 100% before reveal
        }
    }

    requestAnimationFrame(update);
}

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = document.querySelectorAll('.nav__link');

    // Scroll-based navigation styling
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('nav__toggle--active');
        navLinks.classList.toggle('nav__links--open');
        document.body.style.overflow = navLinks.classList.contains('nav__links--open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('nav__toggle--active');
            navLinks.classList.remove('nav__links--open');
            document.body.style.overflow = '';
        });
    });

    // Active link tracking based on scroll position
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinkElements.forEach(link => {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = [
        ...document.querySelectorAll('.skill-card'),
        ...document.querySelectorAll('.project-card'),
        ...document.querySelectorAll('.about__card'),
        ...document.querySelectorAll('.about__terminal'),
        ...document.querySelectorAll('.contact__form'),
        ...document.querySelectorAll('.contact__info'),
        ...document.querySelectorAll('.section__header'),
    ];

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        // Add stagger delay within groups
        const siblings = el.parentElement.children;
        const siblingIndex = Array.from(siblings).indexOf(el);
        if (siblingIndex < 4) {
            el.classList.add(`reveal--delay-${siblingIndex + 1}`);
        }
    });

    // Intersection Observer for reveal
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.hero__stat-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    };

    // Trigger when hero is visible
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => animateCounter(counter));
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) observer.observe(heroStats);
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;

        // Simple validation
        if (!name || !email || !message) return;

        // Show success state
        form.innerHTML = `
            <div class="form-success">
                <div class="form-success__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <h3>Message Sent!</h3>
                <p>Thank you, ${escapeHtml(name)}! I'll get back to you soon.</p>
            </div>
        `;
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   PARALLAX & MOUSE EFFECTS
   ============================================ */
function initParallax() {
    const codeWindow = document.querySelector('.code-window');

    // Subtle tilt on the code-window — layers on top of the CSS floatingDrift
    if (codeWindow && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = (clientX - centerX) / 80;
            const moveY = (clientY - centerY) / 80;

            requestAnimationFrame(() => {
                codeWindow.style.transform = `perspective(1000px) rotateY(${moveX * 0.3}deg) rotateX(${-moveY * 0.3}deg)`;
            });
        });
    }

    // Parallax ambient glows
    const glows = document.querySelectorAll('.ambient-glow');
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            glows.forEach((glow, i) => {
                const speed = (i + 1) * 0.05;
                requestAnimationFrame(() => {
                    glow.style.transform = `translateY(${scrollY * speed}px)`;
                });
            });
        }, { passive: true });
    }
}

/* ============================================
   CUSTOM INTERACTIVE MOUSE CURSOR
   Dual setup: center dot (instant) + outer ring (LERP trail)
   ============================================ */
function initCustomCursor() {
    // Skip on touch/coarse-pointer or small screens
    const isTouch = window.matchMedia('(pointer: coarse)').matches
        || window.matchMedia('(hover: none)').matches
        || window.innerWidth < 769;

    if (isTouch) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    if (!dot || !ring) return;

    // State
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isVisible = false;

    // LERP factor — lower = smoother trail
    const lerpFactor = 0.15;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows instantly via direct positioning
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;

        if (!isVisible) {
            isVisible = true;
            dot.classList.remove('cursor-dot--hidden');
            ring.classList.remove('cursor-ring--hidden');
        }
    }, { passive: true });

    // Hide when mouse leaves viewport
    document.addEventListener('mouseleave', () => {
        isVisible = false;
        dot.classList.add('cursor-dot--hidden');
        ring.classList.add('cursor-ring--hidden');
    });

    document.addEventListener('mouseenter', () => {
        isVisible = true;
        dot.classList.remove('cursor-dot--hidden');
        ring.classList.remove('cursor-ring--hidden');
    });

    // LERP animation loop for the ring
    function animateRing() {
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(animateRing);
    }
    // Initialize ring position
    ringX = mouseX;
    ringY = mouseY;
    requestAnimationFrame(animateRing);

    // --- Hover detection ---
    // Interactive elements: links, buttons
    const interactiveElements = document.querySelectorAll('a, button, .btn, .social-btn, .pill, .nav__link, .nav__toggle');
    // Card elements: skill-card, project-card
    const cardElements = document.querySelectorAll('.skill-card, .project-card, .about__card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('cursor-dot--hover');
            ring.classList.add('cursor-ring--hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('cursor-dot--hover');
            ring.classList.remove('cursor-ring--hover');
        });
    });

    cardElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('cursor-dot--hover');
            ring.classList.add('cursor-ring--card');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('cursor-dot--hover');
            ring.classList.remove('cursor-ring--card');
        });
    });
}

/* ============================================
   MOUSE SPOTLIGHT GLOW ON CARDS
   Sets --mouse-x / --mouse-y CSS properties
   ============================================ */
function initCardSpotlight() {
    // Only on fine-pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 769;
    if (isTouch) return;

    const spotlightCards = document.querySelectorAll('.skill-card, .project-card');

    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
        });
    });
}

/* ============================================
   PARTICLE NETWORK BACKGROUND
   Floating dots with proximity connections
   and mouse repulsion for interactive depth
   ============================================ */
function initParticleNetwork() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Config
    const CONFIG = {
        particleCount: Math.min(80, Math.floor(window.innerWidth / 18)),
        connectionDistance: 140,
        mouseRadius: 180,
        mouseRepelStrength: 0.02,
        particleSpeed: 0.3,
        particleMinSize: 1,
        particleMaxSize: 2.5,
        lineOpacity: 0.12,
        dotOpacity: 0.4,
        accentColor: { r: 108, g: 92, b: 231 },   // --accent-primary
        tealColor: { r: 0, g: 206, b: 201 },       // --accent-secondary
    };

    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animId;

    // Resize handler
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => {
        resize();
        // Re-create particles if count changed significantly
        const newCount = Math.min(80, Math.floor(window.innerWidth / 18));
        if (Math.abs(newCount - particles.length) > 10) {
            particles = createParticles(newCount);
        }
    });

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Create particles
    function createParticles(count) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            const useTeal = Math.random() < 0.3;
            const color = useTeal ? CONFIG.tealColor : CONFIG.accentColor;
            arr.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * CONFIG.particleSpeed,
                vy: (Math.random() - 0.5) * CONFIG.particleSpeed,
                size: CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize),
                color: color,
                alpha: 0.2 + Math.random() * (CONFIG.dotOpacity - 0.2),
            });
        }
        return arr;
    }
    particles = createParticles(CONFIG.particleCount);

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Mouse repulsion
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distMouse = Math.sqrt(dx * dx + dy * dy);
            if (distMouse < CONFIG.mouseRadius && distMouse > 0) {
                const force = (CONFIG.mouseRadius - distMouse) / CONFIG.mouseRadius;
                p.vx += (dx / distMouse) * force * CONFIG.mouseRepelStrength;
                p.vy += (dy / distMouse) * force * CONFIG.mouseRepelStrength;
            }

            // Dampen velocity
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Enforce min speed so particles don't stall
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed < 0.1) {
                const angle = Math.random() * Math.PI * 2;
                p.vx = Math.cos(angle) * 0.15;
                p.vy = Math.sin(angle) * 0.15;
            }

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            if (p.y < -20) p.y = height + 20;
            if (p.y > height + 20) p.y = -20;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
            ctx.fill();

            // Draw connections to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const connDx = p.x - p2.x;
                const connDy = p.y - p2.y;
                const dist = Math.sqrt(connDx * connDx + connDy * connDy);

                if (dist < CONFIG.connectionDistance) {
                    const opacity = (1 - dist / CONFIG.connectionDistance) * CONFIG.lineOpacity;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${CONFIG.accentColor.r}, ${CONFIG.accentColor.g}, ${CONFIG.accentColor.b}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(animate);
    }
    animate();

    // Pause when tab is not visible for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            animate();
        }
    });
}
