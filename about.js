// about.js - Animation Script for NovaMeds About Page

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        
        if (mobileMenu.style.transform === 'translateX(0%)') {
            mobileMenu.style.transform = 'translateX(100%)';
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        } else {
            mobileMenu.style.transform = 'translateX(0%)';
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        }
    }

    function closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        
        mobileMenu.style.transform = 'translateX(100%)';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }

    // Assign event listeners
    document.querySelector('.mobile-menu-btn').addEventListener('click', toggleMobileMenu);
    document.querySelector('.close-btn').addEventListener('click', closeMobileMenu);
    document.getElementById('mobileOverlay').addEventListener('click', closeMobileMenu);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Book Appointment button functionality
    function bookAppointment() {
        // In a real implementation, this would open a booking modal or redirect
        console.log('Booking appointment...');
        // For demo purposes, we'll scroll to the appointment banner
        const banner = document.querySelector('.appointment-banner');
        if (banner) {
            window.scrollTo({
                top: banner.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }

    // Assign book appointment handlers
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', bookAppointment);
    });

    // Intersection Observer for scroll animations
    const animateOnScroll = function() {
        const elementsToAnimate = document.querySelectorAll(
            '.container-2, .conainer-3, .stats-container, .intro-container, ' +
            '.cards-container, .img-container, .team-section, .team-container, ' +
            '.appointment-banner'
        );

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize scroll animations
    animateOnScroll();

    // Logo hover animation
    const logoText = document.getElementById('logoText');
    if (logoText) {
        logoText.addEventListener('mouseenter', () => {
            logoText.style.transform = 'scale(1.1)';
            logoText.style.color = '#4a90e2';
            setTimeout(() => {
                logoText.style.transform = 'scale(1)';
                logoText.style.color = '';
            }, 500);
        });
    }

    // Card hover effects
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Team card hover effects
    document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.querySelector('.card-image-container').style.transform = 'scale(1.05)';
            card.querySelector('.appointment-link').style.opacity = '1';
            card.querySelector('.appointment-link').style.transform = 'translateY(0)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.querySelector('.card-image-container').style.transform = 'scale(1)';
            card.querySelector('.appointment-link').style.opacity = '0';
            card.querySelector('.appointment-link').style.transform = 'translateY(20px)';
        });
    });

    // Stats counter animation
    const animateStats = function() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            const target = +item.querySelector('.stat-number').textContent.replace(/\D/g, '');
            const suffix = item.querySelector('.stat-number').textContent.replace(/[0-9]/g, '');
            const duration = 2000; // Animation duration in ms
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentValue = Math.floor(progress * target);
                
                item.querySelector('.stat-number').textContent = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        });
    };

    // Only animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // Newsletter form animation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const button = this.querySelector('button');
            
            // Animate submission
            button.textContent = 'Sending...';
            button.style.backgroundColor = '#4CAF50';
            
            // Simulate submission
            setTimeout(() => {
                button.textContent = '✓ Subscribed!';
                input.value = '';
                
                // Reset after animation
                setTimeout(() => {
                    button.textContent = 'Subscribe';
                    button.style.backgroundColor = '';
                }, 2000);
            }, 1000);
        });
    }

    // Footer social icons hover effect
    document.querySelectorAll('.social-icon-2').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = '';
        });
    });

    // Back to top button
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.title = 'Back to top';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.pointerEvents = 'auto';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.pointerEvents = 'none';
        }
    });
});