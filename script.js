// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Country tabs
function showCountry(country) {
    // Hide all content
    document.querySelectorAll('.country-content').forEach(content => {
        content.classList.remove('active');
    });
    // Remove active from all tabs
    document.querySelectorAll('.country-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    // Show selected country
    document.getElementById(country).classList.add('active');
    // Add active to clicked tab
    event.target.closest('.country-tab').classList.add('active');
}

// Date format JJ/MM/AAAA
const dateInput = document.getElementById('dateNaissance');
if (dateInput) {
    dateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        let formatted = '';
        if (value.length > 0) {
            formatted = value.slice(0, 2);
            if (value.length > 2) {
                formatted += '/' + value.slice(2, 4);
            }
            if (value.length > 4) {
                formatted += '/' + value.slice(4, 8);
            }
        }
        e.target.value = formatted;
        
        // Auto-jump to next field when complete
        if (formatted.length === 10) {
            const year = parseInt(value.slice(4, 8));
            const currentYear = new Date().getFullYear();
            if (year > currentYear || year < 1900) {
                e.target.value = formatted.slice(0, 6);
                return;
            }
            document.getElementById('telephone').focus();
        }
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
