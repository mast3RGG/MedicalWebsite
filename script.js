function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    } else {
        document.body.style.overflow = 'auto';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

function bookAppointment() {
    alert('Booking appointment feature would be implemented here!');
    closeMobileMenu();
}

function learnMore() {
    location.href = "aboutus.html"
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 200);
        });
    });

    document.querySelectorAll('.mobile-contact-item a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    document.querySelectorAll('.mobile-social-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 100);
});

document.addEventListener('click', function(event) {
    const menu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.getElementById('mobileOverlay');
    
    if (event.target === overlay) {
        closeMobileMenu();
    }
});

document.getElementById('mobileMenu').addEventListener('click', function(event) {
    event.stopPropagation();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const menu = document.getElementById('mobileMenu');
        if (menu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
});

// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function(e) {
//         const targetId = this.getAttribute('href');
//         const targetElement = document.querySelector(targetId);
        
//         if (targetElement && targetId !== '#') {
//             e.preventDefault();
//             targetElement.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start'
//             });
//         }
//     });
// });


