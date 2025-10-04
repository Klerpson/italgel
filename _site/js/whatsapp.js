document.addEventListener("DOMContentLoaded", function() {
    // Detectar si el usuario está en móvil o escritorio
    var isMobile = /iPhone|Android|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);

    // Obtener la URL actual de la página
    var currentURL = window.location.href;

    // Obtener todos los enlaces de WhatsApp en la página
    var whatsappLinks = document.querySelectorAll("a#lead_whatsapp");

    // Recorrer los enlaces y cambiar el href según el dispositivo
    whatsappLinks.forEach(function(link) {
        // Mensaje con la URL actual
        var message = "Hola! Me regalas más info sobre esto que vi en tu web: " + encodeURIComponent(currentURL);

        // Enlaces de WhatsApp para móvil y escritorio con el mensaje dinámico
        var mobileLink = "https://wa.me/573186455181?text=" + message;
        var desktopLink = "https://web.whatsapp.com/send?phone=573186455181&text=" + message;

        // Asignar el enlace adecuado según el dispositivo
        if (isMobile) {
            link.setAttribute("href", mobileLink);
        } else {
            link.setAttribute("href", desktopLink);
        }
    });

    // Scroll to top button functionality
    const scrollUpBtn = document.querySelector('.scroll-up-btn');
    if (scrollUpBtn) {
        // Show/hide scroll-up-btn on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollUpBtn.classList.add('visible');
            } else {
                scrollUpBtn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        scrollUpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

