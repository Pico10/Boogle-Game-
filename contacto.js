const form = document.getElementById('contact-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!validateName(name)) {
        errorMessage.textContent = 'El nombre debe ser alfanumérico';
        return;
    }

    if (!validateEmail(email)) {
        errorMessage.textContent = 'El correo electrónico no es válido';
        return;
    }

    if (!validateMessage(message)) {
        errorMessage.textContent = 'El mensaje debe tener más de 5 caracteres';
        return;
    }

    const subject = 'Mensaje desde la página de contacto';
    const body = `Nombre: ${name}\nCorreo electrónico: ${email}\nMensaje: ${message}`;
    const mailto = `mailto:?subject=${subject}&body=${body}`;

    window.location.href = mailto;
});

function validateName(name) {
    return /^[a-zA-Z0-9]+$/.test(name);
}

function validateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validateMessage(message) {
    return message.length > 5;
}

