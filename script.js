// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Date de naissance - format JJ/MM/AAAA avec validation
const dateInput = document.getElementById('dateNaissance');
dateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        let day = parseInt(value.substring(0, 2));
        if (day > 31) day = 31;
        if (day < 1 && value.length >= 2) day = '01';
        value = String(day).padStart(2, '0') + value.substring(2);
    }
    
    if (value.length >= 4) {
        let month = parseInt(value.substring(2, 4));
        if (month > 12) month = 12;
        if (month < 1 && value.length >= 4) month = '01';
        value = value.substring(0, 2) + String(month).padStart(2, '0') + value.substring(4);
    }
    
    if (value.length >= 8) {
        let year = parseInt(value.substring(4, 8));
        const currentYear = new Date().getFullYear();
        if (year > currentYear) year = currentYear;
        if (year < 1900) year = 1900;
        value = value.substring(0, 4) + String(year);
    }
    
    // Format avec slashes
    let formatted = '';
    if (value.length > 0) formatted = value.substring(0, 2);
    if (value.length > 2) formatted += '/' + value.substring(2, 4);
    if (value.length > 4) formatted += '/' + value.substring(4, 8);
    
    e.target.value = formatted;
    
    // Auto-jump to next field when complete
    if (formatted.length === 10) {
        const nextField = document.getElementById('nationalite');
        if (nextField) nextField.focus();
    }
});

// Auto-jump pour tous les champs
const formFields = ['nom', 'prenom', 'dateNaissance', 'nationalite', 'email', 'telephone', 'adresse', 'destination', 'volet'];
formFields.forEach((fieldId, index) => {
    const field = document.getElementById(fieldId);
    if (field && field.tagName !== 'SELECT') {
        field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = index + 1;
                if (nextIndex < formFields.length) {
                    const nextField = document.getElementById(formFields[nextIndex]);
                    if (nextField) nextField.focus();
                }
            }
        });
    }
});

// Show/hide niveau d'études based on volet selection
const voletSelect = document.getElementById('volet');
const niveauEtudeGroup = document.getElementById('niveauEtudeGroup');

voletSelect.addEventListener('change', () => {
    if (voletSelect.value === 'etudiant') {
        niveauEtudeGroup.style.display = 'block';
    } else {
        niveauEtudeGroup.style.display = 'none';
    }
    // Auto-jump
    if (voletSelect.value) {
        const nextField = voletSelect.value === 'etudiant' ? document.getElementById('niveauEtude') : document.getElementById('message');
        if (nextField) nextField.focus();
    }
});

// Form submission with Formspree
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    
    try {
        const response = await fetch('https://formspree.io/f/xaqdlppy', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            window.scrollTo({ top: formSuccess.offsetTop - 100, behavior: 'smooth' });
        } else {
            alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        }
    } catch (error) {
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    }
});

// Smooth scroll for navigation links
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
        navLinks.classList.remove('active');
    });
});