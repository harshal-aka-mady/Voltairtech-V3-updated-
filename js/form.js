// Contact Form Handler with Google Sheets Integration

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

// Google Sheets Web App URL - YOU NEED TO REPLACE THIS
const CONTACT_FORM_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxUDk83iqBUdqNETVFcYY7Xabys9q9ok0_6VuLPehwCu_vGeRGWiUEQR3TgTiDwxcKI/exec';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Get form data
    const formData = {
        timestamp: new Date().toISOString(),
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        service: contactForm.service.value,
        company: contactForm.company.value || 'N/A',
        message: contactForm.message.value
    };

    try {
        // Send to Google Sheets
        await fetch(CONTACT_FORM_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Show success message
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';

        // Reset form
        contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.style.display = 'none';
            contactForm.style.display = 'block';
        }, 5000);

    } catch (error) {
        console.error('Form submission error:', error);
        formError.style.display = 'block';

        setTimeout(() => {
            formError.style.display = 'none';
        }, 5000);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

