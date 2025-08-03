 // Navegação suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Link de navegação ativo
        function updateActiveNav() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        }
        
        // Animações de scroll
        function animateOnScroll() {
            const elements = document.querySelectorAll('.fade-in');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            elements.forEach(el => observer.observe(el));
        }
        
        // Efeito de scroll no cabeçalho
        function handleHeaderScroll() {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        // Animar barras de progresso de habilidades
        function animateSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress-bar');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = entry.target.style.width;
                        entry.target.style.width = '0%';
                        setTimeout(() => {
                            entry.target.style.width = width;
                        }, 200);
                    }
                });
            });
            
            skillBars.forEach(bar => observer.observe(bar));
        }
        
        // Inicializar todas as funções
        document.addEventListener('DOMContentLoaded', function() {
            animateOnScroll();
            animateSkillBars();
            
            window.addEventListener('scroll', () => {
                updateActiveNav();
                handleHeaderScroll();
            });
            
            // Chamadas iniciais
            updateActiveNav();
            handleHeaderScroll();
        });
        
        // Menu mobile (funcionalidade básica)
        document.querySelector('.mobile-menu').addEventListener('click', function() {
            alert('Menu mobile em desenvolvimento. Use os links de navegação no desktop.');
        });