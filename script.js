// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const applyModal = document.getElementById('applyModal');
const modalClose = document.getElementById('modalClose');
const jobTitle = document.getElementById('jobTitle');

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Premium Sticky Navbar =====
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.scrollY;

            if (currentScroll > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===== Fast Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 75;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Enhanced Scroll Animations with Stagger =====
function initScrollAnimations() {
    // Fade-in-up elements
    const fadeUpElements = document.querySelectorAll(
        '.service-card, .stat-card, .job-card, .fare-card, .info-block, .quotation-section, .testimonial-card, .alert'
    );
    fadeUpElements.forEach(el => el.classList.add('fade-in'));

    // Fade-in-left elements
    const fadeLeftElements = document.querySelectorAll(
        '.about-text, .contact-info'
    );
    fadeLeftElements.forEach(el => el.classList.add('fade-in-left'));

    // Fade-in-right elements
    const fadeRightElements = document.querySelectorAll(
        '.about-stats, .contact-form-wrapper'
    );
    fadeRightElements.forEach(el => el.classList.add('fade-in-right'));

    // Create observer with stagger support
    const observer = new IntersectionObserver((entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        visibleEntries.forEach((entry, index) => {
            // Stagger the animations
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.06,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });

    // Section title animations
    const titles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('title-visible');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    titles.forEach(title => titleObserver.observe(title));
}

// ===== Premium Counter Animation =====
function animateCounters() {
    const statCards = document.querySelectorAll('.stat-card h3');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = text.replace(/[0-9,]/g, '');
                let current = 0;
                const duration = 2000;
                const startTime = performance.now();

                function easeOutQuart(t) {
                    return 1 - Math.pow(1 - t, 4);
                }

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = easeOutQuart(progress);
                    current = Math.floor(eased * number);

                    target.textContent = current.toLocaleString() + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = number.toLocaleString() + suffix;
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => counterObserver.observe(card));
}

// ===== Parallax Effects =====
function initParallax() {
    const heroContent = document.querySelector('.hero-content');
    const heroParticles = document.querySelector('.hero-particles');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrolled < heroHeight) {
            const progress = scrolled / heroHeight;

            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
                heroContent.style.opacity = 1 - progress * 0.9;
            }

            if (heroParticles) {
                heroParticles.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
        }
    });
}

// ===== Magnetic Hover Effect on Cards =====
function initMagneticCards() {
    const cards = document.querySelectorAll('.service-card, .stat-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ===== Apply Modal =====
function openApplyModal(position) {
    jobTitle.textContent = position;
    applyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

modalClose.addEventListener('click', closeModal);

applyModal.addEventListener('click', (e) => {
    if (e.target === applyModal) {
        closeModal();
    }
});

function closeModal() {
    applyModal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('applyForm').reset();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && applyModal.classList.contains('active')) {
        closeModal();
    }
});

// ===== Premium Toast Notifications =====
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.toast-notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        </div>
        <div class="toast-body">
            <p class="toast-title">${type === 'success' ? 'Success!' : 'Error'}</p>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" aria-label="Close">&times;</button>
        <div class="toast-progress"></div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 95px;
        right: 24px;
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 20px 24px;
        background: white;
        border-radius: 16px;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(120%) scale(0.9);
        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        max-width: 400px;
        border-left: 5px solid ${type === 'success' ? '#1a8c3f' : '#e74c3c'};
        overflow: hidden;
    `;

    document.body.appendChild(notification);

    // Style inner elements
    const icon = notification.querySelector('.toast-icon');
    icon.style.cssText = `
        width: 36px; height: 36px; border-radius: 50%;
        background: ${type === 'success' ? 'linear-gradient(135deg, #1a8c3f, #0d5e2b)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    `;
    icon.querySelector('i').style.cssText = 'color: white; font-size: 1rem;';

    const title = notification.querySelector('.toast-title');
    title.style.cssText = 'font-weight: 600; font-size: 0.9rem; color: #1a2e23; margin-bottom: 2px;';

    const msg = notification.querySelector('.toast-message');
    msg.style.cssText = 'font-size: 0.82rem; color: #4a5e52; line-height: 1.5;';

    const closeBtn = notification.querySelector('.toast-close');
    closeBtn.style.cssText = `
        background: none; border: none; font-size: 1.4rem; color: #6c757d;
        cursor: pointer; padding: 0; line-height: 1; margin-left: auto;
    `;
    closeBtn.addEventListener('click', () => removeToast(notification));

    const progress = notification.querySelector('.toast-progress');
    progress.style.cssText = `
        position: absolute; bottom: 0; left: 0; height: 3px; width: 100%;
        background: ${type === 'success' ? '#1a8c3f' : '#e74c3c'};
        animation: toastProgress 5s linear forwards;
    `;

    // Add progress animation
    const style = document.createElement('style');
    style.textContent = '@keyframes toastProgress { from { width: 100%; } to { width: 0%; } }';
    if (!document.querySelector('[data-toast-style]')) {
        style.setAttribute('data-toast-style', '');
        document.head.appendChild(style);
    }

    // Slide in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0) scale(1)';
    });

    // Auto remove
    setTimeout(() => removeToast(notification), 5000);
}

function removeToast(el) {
    if (el && el.parentNode) {
        el.style.transform = 'translateX(120%) scale(0.9)';
        setTimeout(() => el.remove(), 500);
    }
}

// ===== Form Submissions =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Your message has been sent. We will get back to you within 24 hours.');
    e.target.reset();
});

document.getElementById('quotationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Quotation request submitted! Our team will prepare your quote and contact you shortly.');
    e.target.reset();
});

document.getElementById('applyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Application submitted successfully! We will review your details and be in touch.');
    closeModal();
});

// ===== Typing Effect for Hero (Premium Touch) =====
function initTypingEffect() {
    const tagline = document.querySelector('.hero-content .tagline');
    if (!tagline) return;

    const words = ['Safe', 'Reliable', 'Comfortable'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const baseText = ', , Travel';

    function type() {
        // Keep the tagline static for now — the animation is in CSS
        // This function is reserved for future dynamic typing
    }
}

// ===== Scroll Progress Indicator =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        width: 0%;
        background: linear-gradient(90deg, var(--green-primary), var(--yellow-primary));
        z-index: 1001;
        transition: width 0.1s linear;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    animateCounters();
    highlightNavLink();
    initParallax();
    initMagneticCards();
    initScrollProgress();

    // Timetable tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tabId = btn.getAttribute('data-tab');
            document.getElementById('tab-city').style.display = tabId === 'city' ? 'block' : 'none';
            document.getElementById('tab-longdist').style.display = tabId === 'longdist' ? 'block' : 'none';
        });
    });

    // Add loaded class for page entrance
    setTimeout(() => document.body.classList.add('loaded'), 100);
});
