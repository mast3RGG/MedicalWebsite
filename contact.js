document.addEventListener('DOMContentLoaded', function() {
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

    document.querySelector('.mobile-menu-btn').addEventListener('click', toggleMobileMenu);
    document.querySelector('.close-btn').addEventListener('click', closeMobileMenu);
    document.getElementById('mobileOverlay').addEventListener('click', closeMobileMenu);

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

    function bookAppointment() {
        const contactForm = document.querySelector('.contact-form-main-container');
        if (contactForm) {
            window.scrollTo({
                top: contactForm.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }

    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', bookAppointment);
    });

    function animateStars() {
        const stars = document.querySelectorAll('.contact-hero-star-element');
        
        stars.forEach((star, index) => {
            const duration = 3 + Math.random() * 2;
            const delay = index * 0.5;
            
            star.style.animation = `floatStar ${duration}s ease-in-out ${delay}s infinite alternate`;
        });
    }

    const animateOnScroll = function() {
        const elementsToAnimate = document.querySelectorAll(
            '.contact-section-hero-banner, .contact-form-main-container, ' +
            '.contact-info-panel, .contact-form-panel, .appointment-banner'
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
                    
                    // Special case for hero banner - animate stars
                    if (entry.target.classList.contains('contact-section-hero-banner')) {
                        animateStars();
                    }
                }
            });
        }, observerOptions);

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    };

    animateOnScroll();

    document.querySelectorAll('.contact-form-input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    const textarea = document.querySelector('.contact-form-textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    document.querySelectorAll('.contact-radio-input').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.contact-radio-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            if (this.checked) {
                this.closest('.contact-radio-option').classList.add('selected');
            }
        });
    });

    document.querySelectorAll('.contact-info-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.querySelector('.contact-info-icon').style.transform = 'scale(1.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.querySelector('.contact-info-icon').style.transform = 'scale(1)';
        });
    });

    document.querySelectorAll('.contact-social-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(15deg) scale(1.2)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0) scale(1)';
        });
    });

    const contactForm = document.querySelector('.contact-form-container');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('.contact-submit-button');
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            submitButton.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                submitButton.textContent = '✓ Message Sent!';
                
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success-message';
                successMessage.textContent = 'Thank you! We will contact you soon.';
                this.appendChild(successMessage);
                
                setTimeout(() => {
                    this.reset();
                    submitButton.textContent = 'Send Message';
                    submitButton.style.backgroundColor = '';
                    submitButton.disabled = false;
                    successMessage.remove();
                    
                    document.querySelectorAll('.contact-form-group').forEach(group => {
                        group.classList.remove('focused');
                    });
                }, 3000);
            }, 1500);
        });
    }

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