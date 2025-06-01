document.addEventListener('DOMContentLoaded', function() {
    animateHeroSection();
    
    animateFloatingElements();
    
    animateStatsCounter();
    
    setupScrollAnimations();
    
    setupHoverAnimations();
    
    animateFooter();
    
    injectAnimationStyles();
});
function animateHeroSection() {
    const hero = document.querySelector('.department-section');
    if (!hero) return;
    
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(50px) scale(0.98)';
    hero.style.transition = 'all 800ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    setTimeout(() => {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0) scale(1)';
    }, 100);
}

function animateFloatingElements() {
    const floaters = document.querySelectorAll('.floating-elements, .floating-dots');
    floaters.forEach((el, i) => {
        const duration = 2000 + (i * 300);
        const delay = i * 200;
        el.style.transform = 'translateY(0)';
        el.style.animation = `
            float${i % 2 ? 'Reverse' : ''} 
            ${duration}ms 
            cubic-bezier(0.445, 0.05, 0.55, 0.95) 
            ${delay}ms 
            infinite 
            alternate
        `;
    });
}

function animateStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach((stat, i) => {
        const target = parseInt(stat.textContent.replace('+', ''));
        let current = 0;
        const increment = target / 20; 
        
        const icon = stat.closest('.stat-item').querySelector('.stat-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transition = 'transform 300ms ease-out';
                icon.style.transform = 'scale(1)';
            }, 300);
        }
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(counter);
                current = target;
                stat.style.transform = 'scale(1.1)';
                setTimeout(() => stat.style.transform = 'scale(1)', 200);
            }
            stat.textContent = Math.floor(current) + (target > 100 ? '+' : '');
        }, 40);
    });
}


function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('medical-service-card')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) rotateY(0) scale(1)';
                    
                    if (element.classList.contains('featured-medical-card')) {
                        setTimeout(() => {
                            element.style.animation = 'subtlePulse 3s infinite ease-in-out';
                        }, 1000);
                    }
                }
                
                if (element.classList.contains('image-card') || 
                    element.classList.contains('image-card-department')) {
                    element.style.opacity = '1';
                    element.style.transform = 'perspective(1000px) rotateX(0) translateX(0)';
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.medical-service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) rotateY(15deg) scale(0.9)';
        card.style.transition = 'all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        observer.observe(card);
    });

    document.querySelectorAll('.image-card, .image-card-department').forEach(img => {
        img.style.opacity = '0';
        img.style.transform = `perspective(1000px) rotateX(${Math.random() > 0.5 ? 15 : -15}deg) translateX(${Math.random() > 0.5 ? '60px' : '-60px'})`;
        img.style.transition = 'all 700ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(img);
    });
}

function setupHoverAnimations() {
    document.querySelectorAll('.medical-service-card').forEach(card => {
        const body = card.querySelector('.medical-service-body');
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.03) rotateY(0)';
            body.style.transform = 'translateY(-10px)';
            body.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('featured-medical-card')) {
                card.style.transform = 'translateY(0) scale(1) rotateY(0)';
            } else {
                card.style.transform = 'translateY(0) scale(1) rotateY(0)';
            }
            body.style.transform = 'translateY(0)';
            body.style.boxShadow = 'none';
        });
    });
}

function setupImageAnimations() {
    const images = document.querySelectorAll('.image-card, .image-card-department');
    images.forEach((img, i) => {
        img.style.opacity = '0';
        img.style.transform = `perspective(1000px) rotateX(${i % 2 ? 15 : -15}deg) translateX(${i % 2 ? '60px' : '-60px'})`;
        img.style.transition = `all 700ms cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 150}ms`;
        
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'perspective(1000px) rotateX(0) translateX(0)';
        }, 50);
    });
}

function animateFooter() {
    const footerSections = document.querySelectorAll('.footer-section');
    footerSections.forEach((section, i) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `all 600ms ease-out ${300 + (i * 100)}ms`;
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 50);
    });
}

function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Floating animations */
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-30px) rotate(5deg) scale(1.05); }
            100% { transform: translateY(-10px) rotate(-2deg) scale(1); }
        }
        
        @keyframes floatReverse {
            0% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-25px) rotate(-5deg) scale(1.05); }
            100% { transform: translateY(-5px) rotate(2deg) scale(1); }
        }
        
        /* Card animations */
        .medical-service-card {
            perspective: 1000px;
            transform-style: preserve-3d;
            will-change: transform, opacity;
        }
        
        .medical-service-body {
            transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transform-origin: center bottom;
            will-change: transform, box-shadow;
        }
        
        .medical-service-card:hover .medical-service-body {
            background: linear-gradient(to bottom, #ffffff, #f9f9f9);
        }
        
        .medical-service-content {
            transition: transform 400ms ease-out;
        }
        
        .medical-service-card:hover .medical-service-content {
            transform: translateY(-5px);
        }
        
        .medical-learn-more {
            transition: all 300ms ease-out;
            transform: translateY(5px);
            opacity: 0.8;
        }
        
        .medical-service-card:hover .medical-learn-more {
            transform: translateY(0);
            opacity: 1;
            color: #2a6496;
        }
        
        @keyframes subtlePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        
        .featured-medical-card {
            animation: subtlePulse 3s infinite ease-in-out;
        }
        
        /* Will-change optimizations */
        .department-section,
        .floating-elements,
        .floating-dots,
        .stat-item,
        .image-card,
        .image-card-department,
        .footer-section {
            will-change: transform, opacity;
        }
        
        /* Add subtle hover effects */
        .medical-service-card:hover {
            transform: translateY(-5px) scale(1.02) !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
            transition: all 300ms ease-out !important;
        }
        
        .btn-department:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
        }
    `;
    document.head.appendChild(style);
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('medical-service-card')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) rotateY(0) scale(1)';
                }
                
                if (element.classList.contains('image-card') || 
                    element.classList.contains('image-card-department')) {
                    element.style.opacity = '1';
                    element.style.transform = 'perspective(1000px) rotateX(0) translateX(0)';
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll(
        '.medical-service-card, .image-card, .image-card-department'
    ).forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    setupScrollAnimations();
});