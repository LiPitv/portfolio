// =============================================
// UTILITÁRIOS
// =============================================

// Throttle: limita a frequência de execução de funções no scroll
function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

// =============================================
// NAVEGAÇÃO SUAVE
// =============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;

            const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({ top: targetTop, behavior: 'smooth' });

            // Fecha o menu mobile ao clicar num link
            closeMobileMenu();
        });
    });
}

// =============================================
// LINK DE NAVEGAÇÃO ATIVO
// =============================================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;

    let currentId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 20;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            currentId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href')?.substring(1);
        link.classList.toggle('active', href === currentId);
    });
}

// =============================================
// EFEITO DE SCROLL NO CABEÇALHO
// =============================================
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    if (window.scrollY > 80) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// =============================================
// ANIMAÇÕES AO FAZER SCROLL (FADE-IN)
// =============================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Pequeno atraso escalonado para efeito cascata
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// =============================================
// BARRAS DE PROGRESSO DAS HABILIDADES
// =============================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.dataset.width || bar.style.width;
                bar.style.width = '0%';

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 150);
                });

                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    // Guarda a largura original em data-width para não perder o valor
    skillBars.forEach(bar => {
        bar.dataset.width = bar.style.width;
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// =============================================
// MENU MOBILE FUNCIONAL
// =============================================
let mobileMenuOpen = false;

function openMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileBtn = document.querySelector('.mobile-menu');
    if (!navLinks || !mobileBtn) return;

    navLinks.classList.add('mobile-open');
    mobileBtn.setAttribute('aria-expanded', 'true');
    mobileBtn.textContent = '✕';
    mobileMenuOpen = true;

    // Bloqueia scroll do body
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileBtn = document.querySelector('.mobile-menu');
    if (!navLinks || !mobileBtn) return;

    navLinks.classList.remove('mobile-open');
    mobileBtn.setAttribute('aria-expanded', 'false');
    mobileBtn.textContent = '☰';
    mobileMenuOpen = false;

    document.body.style.overflow = '';
}

function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu');
    if (!mobileBtn) return;

    mobileBtn.setAttribute('aria-label', 'Abrir menu de navegação');
    mobileBtn.setAttribute('aria-expanded', 'false');

    mobileBtn.addEventListener('click', () => {
        if (mobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Fecha ao clicar fora do menu
    document.addEventListener('click', (e) => {
        const nav = document.querySelector('nav');
        if (mobileMenuOpen && nav && !nav.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Fecha ao pressionar Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOpen) {
            closeMobileMenu();
        }
    });

    // Fecha ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

// =============================================
// LAZY LOADING DE IMAGENS
// =============================================
function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"], img:not([loading])');

    if ('loading' in HTMLImageElement.prototype) {
        // Suporte nativo: apenas define o atributo
        images.forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Fallback com IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => observer.observe(img));
    }
}

// =============================================
// ANIMAÇÃO DO ANO NO RODAPÉ
// =============================================
function updateFooterYear() {
    const yearEl = document.querySelector('.footer-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// =============================================
// INICIALIZAÇÃO
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initScrollAnimations();
    initSkillBars();
    initMobileMenu();
    initLazyImages();
    updateFooterYear();

    // Combina as funções de scroll com throttle para melhor performance
    const onScroll = throttle(() => {
        updateActiveNav();
        handleHeaderScroll();
    }, 80);

    window.addEventListener('scroll', onScroll, { passive: true });

    // Estado inicial
    updateActiveNav();
    handleHeaderScroll();
});