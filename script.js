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
   6 variants: fade-up, slide-left/right,
   zoom-in, rotate-in, cascade stagger,
   typewriter, parallax depth
   ============================================ */
function initScrollReveal() {

    // ---- 1. Section headers: slide-up with typewriter on title ----
    document.querySelectorAll('.section__header').forEach(header => {
        header.classList.add('reveal', 'reveal--up');

        // Typewriter on the section title
        const title = header.querySelector('.section__title');
        if (title) {
            title.classList.add('typewriter');
        }
    });

    // ---- 2. Skill cards: cascade stagger (wave effect) ----
    document.querySelectorAll('.skill-card').forEach((card, i) => {
        card.classList.add('reveal', 'reveal--zoom');
        card.classList.add(`reveal--delay-${Math.min(i + 1, 8)}`);
    });

    // ---- 3. Project cards: alternate slide-left / slide-right ----
    document.querySelectorAll('.project-card').forEach((card, i) => {
        card.classList.add('reveal');
        card.classList.add(i % 2 === 0 ? 'reveal--left' : 'reveal--right');
        card.classList.add(`reveal--delay-${Math.min(i + 1, 8)}`);
    });

    // ---- 4. About cards: rotate-in with stagger ----
    document.querySelectorAll('.about__card').forEach((card, i) => {
        card.classList.add('reveal', 'reveal--rotate');
        card.classList.add(`reveal--delay-${Math.min(i + 1, 8)}`);
    });

    // ---- 5. Terminal: zoom-in ----
    document.querySelectorAll('.about__terminal').forEach(el => {
        el.classList.add('reveal', 'reveal--zoom');
    });

    // ---- 6. Contact: slide from sides ----
    document.querySelectorAll('.contact__form').forEach(el => {
        el.classList.add('reveal', 'reveal--left');
    });
    document.querySelectorAll('.contact__info').forEach(el => {
        el.classList.add('reveal', 'reveal--right');
    });

    // ---- Intersection Observer for reveal ----
    const allReveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    allReveals.forEach(el => revealObserver.observe(el));

    // ---- Typewriter Observer ----
    const typewriterElements = document.querySelectorAll('.typewriter');
    const typeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('typewriter--active');
                    // Remove caret after animation finishes
                    entry.target.addEventListener('animationend', (e) => {
                        if (e.animationName === 'typewrite') {
                            entry.target.classList.add('typewriter--done');
                        }
                    }, { once: true });
                    typeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    typewriterElements.forEach(el => typeObserver.observe(el));

    // ---- Parallax Depth Scrolling ----
    if (window.innerWidth > 768) {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, i) => {
            // Alternate speeds: odd sections move slower for depth
            const speed = (i % 2 === 0) ? 0.03 : -0.02;
            section.dataset.parallaxSpeed = speed;
            section.classList.add('parallax-layer');
        });

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    sections.forEach(section => {
                        const speed = parseFloat(section.dataset.parallaxSpeed);
                        const rect = section.getBoundingClientRect();
                        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
                        section.style.transform = `translateY(${offset}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
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
    // Skip on mobile entirely
    if (window.innerWidth <= 1024) return;

    const codeWindow = document.querySelector('.code-window');

    // Subtle tilt on the code-window
    if (codeWindow) {
        let tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;

        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            targetTiltX = (e.clientX - centerX) / 80 * 0.3;
            targetTiltY = -(e.clientY - centerY) / 80 * 0.3;
        }, { passive: true });

        function animateTilt() {
            tiltX += (targetTiltX - tiltX) * 0.08;
            tiltY += (targetTiltY - tiltY) * 0.08;
            codeWindow.style.transform = `perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
            requestAnimationFrame(animateTilt);
        }
        requestAnimationFrame(animateTilt);
    }

    // Parallax ambient glows — throttled
    const glows = document.querySelectorAll('.ambient-glow');
    let glowTicking = false;
    window.addEventListener('scroll', () => {
        if (!glowTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                glows.forEach((glow, i) => {
                    glow.style.transform = `translateY(${scrollY * (i + 1) * 0.05}px)`;
                });
                glowTicking = false;
            });
            glowTicking = true;
        }
    }, { passive: true });
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

    // LERP animation loop for the ring — frame-rate independent
    let lastTime = performance.now();
    function animateRing(now) {
        const dt = Math.min((now - lastTime) / 16.67, 2); // normalize to 60fps baseline
        lastTime = now;

        ringX += (mouseX - ringX) * lerpFactor * dt;
        ringY += (mouseY - ringY) * lerpFactor * dt;

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
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
        }, { passive: true });
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

    const ctx = canvas.getContext('2d', { alpha: true });

    // Detect device capability
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Adaptive config based on device
    const CONFIG = {
        particleCount: isMobile ? 30 : isTablet ? 50 : Math.min(80, Math.floor(window.innerWidth / 18)),
        connectionDistance: isMobile ? 100 : 140,
        mouseRadius: 180,
        mouseRepelStrength: 0.02,
        particleSpeed: 0.3,
        particleMinSize: 1,
        particleMaxSize: isMobile ? 2 : 2.5,
        lineOpacity: 0.12,
        dotOpacity: 0.4,
        accentColor: { r: 108, g: 92, b: 231 },
        tealColor: { r: 0, g: 206, b: 201 },
    };

    // Pre-cache color strings to avoid per-frame concatenation
    const accentStr = `${CONFIG.accentColor.r}, ${CONFIG.accentColor.g}, ${CONFIG.accentColor.b}`;
    const tealStr = `${CONFIG.tealColor.r}, ${CONFIG.tealColor.g}, ${CONFIG.tealColor.b}`;

    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animId;

    // Debounced resize
    let resizeTimeout;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            const newCount = isMobile ? 30 : isTablet ? 50 : Math.min(80, Math.floor(window.innerWidth / 18));
            if (Math.abs(newCount - particles.length) > 10) {
                particles = createParticles(newCount);
            }
        }, 200);
    }, { passive: true });

    // Mouse tracking — skip on mobile
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });
    }

    // Create particles with pre-cached color strings
    function createParticles(count) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            const useTeal = Math.random() < 0.3;
            const colorStr = useTeal ? tealStr : accentStr;
            const alpha = 0.2 + Math.random() * (CONFIG.dotOpacity - 0.2);
            arr.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * CONFIG.particleSpeed,
                vy: (Math.random() - 0.5) * CONFIG.particleSpeed,
                size: CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize),
                fillStyle: `rgba(${colorStr}, ${alpha})`,
            });
        }
        return arr;
    }
    particles = createParticles(CONFIG.particleCount);

    // Spatial grid for O(n) connection checks
    const gridCellSize = CONFIG.connectionDistance;
    let grid = {};

    function buildGrid() {
        grid = {};
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const cellX = Math.floor(p.x / gridCellSize);
            const cellY = Math.floor(p.y / gridCellSize);
            const key = `${cellX},${cellY}`;
            if (!grid[key]) grid[key] = [];
            grid[key].push(i);
        }
    }

    function getNeighborIndices(p) {
        const cellX = Math.floor(p.x / gridCellSize);
        const cellY = Math.floor(p.y / gridCellSize);
        const neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const key = `${cellX + dx},${cellY + dy}`;
                if (grid[key]) {
                    for (let k = 0; k < grid[key].length; k++) {
                        neighbors.push(grid[key][k]);
                    }
                }
            }
        }
        return neighbors;
    }

    // Animation loop — optimized for 120Hz
    const connDistSq = CONFIG.connectionDistance * CONFIG.connectionDistance;
    const mouseRadSq = CONFIG.mouseRadius * CONFIG.mouseRadius;

    function animate() {
        ctx.clearRect(0, 0, width, height);
        buildGrid();

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Mouse repulsion — squared distance (no sqrt)
            if (!isMobile) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < mouseRadSq && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                    p.vx += (dx / dist) * force * CONFIG.mouseRepelStrength;
                    p.vy += (dy / dist) * force * CONFIG.mouseRepelStrength;
                }
            }

            // Dampen
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Min speed
            const speedSq = p.vx * p.vx + p.vy * p.vy;
            if (speedSq < 0.01) {
                const angle = Math.random() * 6.2832;
                p.vx = Math.cos(angle) * 0.15;
                p.vy = Math.sin(angle) * 0.15;
            }

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap
            if (p.x < -20) p.x = width + 20;
            else if (p.x > width + 20) p.x = -20;
            if (p.y < -20) p.y = height + 20;
            else if (p.y > height + 20) p.y = -20;

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, 6.2832);
            ctx.fillStyle = p.fillStyle;
            ctx.fill();

            // Draw connections via spatial grid
            const neighbors = getNeighborIndices(p);
            for (let k = 0; k < neighbors.length; k++) {
                const j = neighbors[k];
                if (j <= i) continue;
                const p2 = particles[j];
                const cdx = p.x - p2.x;
                const cdy = p.y - p2.y;
                const dSq = cdx * cdx + cdy * cdy;

                if (dSq < connDistSq) {
                    const opacity = (1 - Math.sqrt(dSq) / CONFIG.connectionDistance) * CONFIG.lineOpacity;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${accentStr}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(animate);
    }
    animate();

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            animate();
        }
    });
}
