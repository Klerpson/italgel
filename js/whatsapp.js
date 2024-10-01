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
        var message = "Hola! Me gustaría recibir más asesoría sobre esta información: " + encodeURIComponent(currentURL);

        // Enlaces de WhatsApp para móvil y escritorio con el mensaje dinámico
        var mobileLink = "https://wa.me/573123278881?text=" + message;
        var desktopLink = "https://web.whatsapp.com/send?phone=573123278881&text=" + message;
        
        // Asignar el enlace adecuado según el dispositivo
        if (isMobile) {
            link.setAttribute("href", mobileLink);
        } else {
            link.setAttribute("href", desktopLink);
        }
    });
});
