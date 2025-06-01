document.getElementById("therapy-but").addEventListener("click" , () => {
    location.href = "pricesPhisicalTherapy.html"
})

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
    document.getElementById('mobileOverlay').classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.getElementById('mobileOverlay').classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function bookAppointment() {
    const btn = event.currentTarget;
    btn.classList.add('clicked');
    setTimeout(() => {
        btn.classList.remove('clicked');
        alert('Appointment booking system would open here');
    }, 300);
}

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', createRipple);
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 600ms linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button.clicked {
        transform: scale(0.95);
    }
`;
document.head.appendChild(rippleStyle);

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

const header = document.querySelector('.header');
header.style.transform = 'translateY(-20px)';
header.style.opacity = '0';
header.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';

setTimeout(() => {
    header.style.transform = 'translateY(0)';
    header.style.opacity = '1';
}, 100);

const heroElements = document.querySelectorAll('.pricing-hero-section > *');
heroElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }, 300 + (index * 100));
});

const stars = document.querySelectorAll('.star');
stars.forEach((star, index) => {
    star.style.opacity = '0';
    star.style.transform = 'scale(0.5)';
    star.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
    
    setTimeout(() => {
        star.style.opacity = '1';
        star.style.transform = 'scale(1)';
    }, 500 + (index * 200));
    
    star.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite alternate`;
});

const floatAnimation = document.createElement('style');
floatAnimation.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        100% {
            transform: translateY(-10px) rotate(5deg);
        }
    }
`;
document.head.appendChild(floatAnimation);

const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    
    scrollObserver.observe(card);
    
    card.addEventListener('mouseenter', () => {
        if (card.classList.contains('featured')) {
            card.style.transform = 'translateY(-15px) scale(1.03)';
        } else {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

const serviceCards = document.querySelectorAll('.healthcare-service-card');
serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    scrollObserver.observe(card);
    
    const discountBadge = card.querySelector('.discount-badge');
    if (discountBadge) {
        discountBadge.style.animation = 'pulse 2s infinite';
    }
});

const pulseAnimation = document.createElement('style');
pulseAnimation.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
    }
`;
document.head.appendChild(pulseAnimation);

const appointmentBanner = document.querySelector('.appointment-banner');
appointmentBanner.style.opacity = '0';
appointmentBanner.style.transform = 'translateX(-50px)';
appointmentBanner.style.transition = 'all 0.8s ease 0.3s';

scrollObserver.observe(appointmentBanner);

const footerSections = document.querySelectorAll('.footer-section');
footerSections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = `all 0.6s ease ${index * 0.1}s`;
    
    scrollObserver.observe(section);
});

// Animate footer bottom on load
setTimeout(() => {
    const footerBottom = document.querySelector('.footer-bottom');
    footerBottom.style.opacity = '0';
    footerBottom.style.transform = 'translateY(20px)';
    footerBottom.style.transition = 'all 0.6s ease 0.4s';
    
    setTimeout(() => {
        footerBottom.style.opacity = '1';
        footerBottom.style.transform = 'translateY(0)';
    }, 400);
}, 1000);

document.querySelectorAll('.social-icon, .social-icon-2').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'translateY(-3px) scale(1.1)';
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translateY(0) scale(1)';
    });
});

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(-10px)';
    item.style.transition = `all 0.4s ease ${index * 0.1}s`;
    
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 500 + (index * 100));
});

const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
mobileNavItems.forEach((item, index) => {
    item.style.opacity = '100';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `all 0.4s ease ${index * 0.1}s`;
    item.style.marginLeft = "25px";
});

document.getElementById('mobileMenu').addEventListener('click', function(e) {
    if (e.target === this) { // Only run when clicking on menu background
        mobileNavItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 200 + (index * 100));
        });
    }
});

document.querySelectorAll('button, .btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    });
});

document.querySelectorAll('.healthcare-service-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        icon.style.boxShadow = '0 15px 30px rgba(79, 172, 254, 0.4)';
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0)';
        icon.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.3)';
    });
});

document.querySelectorAll('.pricing-feature').forEach(feature => {
    feature.style.transition = 'all 0.3s ease';
    feature.addEventListener('mouseenter', () => {
        feature.style.transform = 'translateX(5px)';
        feature.style.backgroundColor = 'rgba(79, 172, 254, 0.1)';
    });
    feature.addEventListener('mouseleave', () => {
        feature.style.transform = 'translateX(0)';
        feature.style.backgroundColor = 'transparent';
    });
});

