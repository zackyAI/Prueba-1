  "use strict";

    /* ---------------------------------------
       1. DATOS PERSONALIZABLES DEL EVENTO

       Modifica estos valores para cada invitación.
    --------------------------------------- */

    const CONFIG = {
      nombre: "Karyme Vanesa",

      // Formato ISO 8601 con zona horaria de México.
      // Cambia -06:00 si el lugar usa otro horario.
      fechaEvento: "2027-11-30T15:00:00-06:00",

      fechaTexto: "Martes · 30 de Nobiembre · 2027",

      padres: "Ignacio Pérez Santos Y Yeni Riveras",

      iglesia: {
        nombre: "Parroquia de San José",
        hora: "17:00 h",
        direccion: "Dirección de la iglesia, ciudad, estado"
      },
      padrinos: "Padrinos: Ana y Carlos Hernández",

      salon: {
        nombre: "Salón Jardín Imperial",
        hora: "19:00 h",
        direccion: "Dirección del salón, ciudad, estado"
      },

      vestimenta: "Formal elegante",

      notaVestimenta:
        "Damas: vestido de noche o de cóctel elegante. Caballeros: traje, camisa formal y calzado elegante. Agradecemos su presencia y les invitamos a vestir acorde con esta ocasión tan especial. Por respeto a la quinceañera, se recomienda evitar el color de su vestido.",

      regalos:
        "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle, agradeceremos mucho una lluvia de sobres.",

      notaRegalos:
        "Gracias por formar parte de este día inolvidable.",

      // Escribe el teléfono completo con código de país,
      // solo números. Ejemplo: 521234567890.
      whatsapp: "529131060363",

      // Personaliza los horarios del itinerario.
      itinerario: [
        { hora: "19:00 h", titulo: "Recepción de invitados" },
        { hora: "20:00 h", titulo: "Entrada y vals" },
        { hora: "21:00 h", titulo: "Cena" },
        { hora: "22:00 h", titulo: "Baile y celebración" }
      ]
    };

    /* ---------------------------------------
       2. ACTUALIZAR INFORMACIÓN DEL EVENTO
    --------------------------------------- */

    function setText(id, value) {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = value;
      }
    }

    function mapLinks(address) {
      const encoded = encodeURIComponent(address);

      return {
        google: "https://www.google.com/maps/@18.4145854,-92.9646459,45m/data=!3m1!1e3?hl=es&entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D" + encoded,
      };
    }

    function updateLocation(prefix, place) {
      setText(prefix + "-name", place.nombre);
      setText(prefix + "-time", place.hora);
      setText(prefix + "-address", place.direccion);

      const links = mapLinks(place.direccion + ", " + place.nombre);

      document.getElementById("church-maps").href
    }

    function formatDate(date) {
      return new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "America/Mexico_City"
      }).format(date);
    }

    function initializeInvitation() {
      setText("hero-name", CONFIG.nombre);
      setText("footer-name", CONFIG.nombre);
      setText("hero-date", CONFIG.fechaTexto);
      setText("footer-date", "Mis XV Años · " + new Date(CONFIG.fechaEvento).getFullYear());

      setText("parents-names", CONFIG.padres);
      setText("godparents", CONFIG.padrinos);

      setText("dress-code", CONFIG.vestimenta);
      setText("dress-note", CONFIG.notaVestimenta);
      setText("gift-message", CONFIG.regalos);
      setText("gift-extra", CONFIG.notaRegalos);

      document.querySelectorAll(".event-date-text").forEach(element => {
        element.textContent = formatDate(new Date(CONFIG.fechaEvento));
      });

      
      updateLocation("venue", CONFIG.salon);

      renderTimeline();
    }

    /* ---------------------------------------
       3. CUENTA REGRESIVA
    --------------------------------------- */

    const countdownDate = new Date(CONFIG.fechaEvento).getTime();

    function updateCountdown() {
      const now = Date.now();
      const difference = countdownDate - now;
      const message = document.getElementById("countdown-message");

      if (!Number.isFinite(countdownDate)) {
        message.textContent = "Configura la fecha del evento.";
        return;
      }

      if (difference <= 0) {
        setText("days", "000");
        setText("hours", "00");
        setText("minutes", "00");
        setText("seconds", "00");

        message.textContent =
          difference > -86400000
            ? "¡Hoy es el gran día! Gracias por acompañarnos."
            : "Gracias por compartir este momento tan especial.";

        return;
      }

      const days = Math.floor(difference / 86400000);
      const hours = Math.floor((difference % 86400000) / 3600000);
      const minutes = Math.floor((difference % 3600000) / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);

      setText("days", String(days).padStart(3, "0"));
      setText("hours", String(hours).padStart(2, "0"));
      setText("minutes", String(minutes).padStart(2, "0"));
      setText("seconds", String(seconds).padStart(2, "0"));

      message.textContent = "Cada vez falta menos para celebrar.";
    }

    /* ---------------------------------------
       4. ITINERARIO DINÁMICO
    --------------------------------------- */

    function renderTimeline() {
      const timeline = document.querySelector(".timeline");

      timeline.replaceChildren();

      CONFIG.itinerario.forEach(item => {
        const article = document.createElement("article");
        article.className = "timeline-item reveal";

        const time = document.createElement("time");
        time.className = "timeline-time";
        time.textContent = item.hora;

        const content = document.createElement("div");
        const heading = document.createElement("h3");
        heading.textContent = item.titulo;

        content.appendChild(heading);
        article.append(time, content);
        timeline.appendChild(article);
      });

      observeRevealElements();
    }

    /* ---------------------------------------
       5. CONFIRMACIÓN POR WHATSAPP
    --------------------------------------- */

    const attendanceSelect = document.getElementById("attendance");
    const guestsGroup = document.getElementById("guests-group");
    const guestCount = document.getElementById("guest-count");

    function updateGuestOptions() {
      const attending = attendanceSelect.value === "Sí, asistiré";

      guestsGroup.hidden = !attending;
      guestCount.required = attending;
      guestCount.disabled = !attending;
    }

    attendanceSelect.addEventListener("change", updateGuestOptions);

    document.getElementById("rsvp-form").addEventListener("submit", event => {
      event.preventDefault();

      const name = document.getElementById("guest-name").value.trim();
      const attendance = attendanceSelect.value;
      const guests = guestCount.value;

      if (!name) {
        document.getElementById("guest-name").focus();
        return;
      }

      if (!/^\d{10,15}$/.test(CONFIG.whatsapp)) {
        alert("Configura el número de WhatsApp en el objeto CONFIG.");
        return;
      }

      let message =
        "Por medio de la presente, confirmo formalmente mi asistencia a la celebración de los XV años de " +
        CONFIG.nombre + ".\n\n" +
        "Nombre: " + name + "\n" +
        "Asistencia: " + attendance;

      if (attendance === "Sí, asistiré") {
        message += "\nNúmero de personas: " + guests;
      }

      message += "\n\nFecha del evento: " + CONFIG.fechaTexto;

      const whatsappUrl =
        "https://wa.me/" + CONFIG.whatsapp +
        "?text=" + encodeURIComponent(message);

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });

    updateGuestOptions();
    
/* =========================================
   6. REPRODUCTOR DE MÚSICA
========================================= */

const music = document.getElementById("background-music");
const musicButton = document.getElementById("music-toggle");
const musicStatus = document.getElementById("music-status");

// Actualizar el botón según el estado de la música
function actualizarReproductor(reproduciendo) {
  musicButton.textContent = reproduciendo ? "Ⅱ" : "▶";

  musicButton.setAttribute(
    "aria-label",
    reproduciendo ? "Pausar música" : "Reproducir música"
  );

  musicButton.setAttribute(
    "aria-pressed",
    reproduciendo ? "true" : "false"
  );

  musicStatus.textContent = reproduciendo
    ? "Música activada"
    : "Activar música";
}

// Intentar reproducir automáticamente al abrir la página
async function iniciarMusica() {
  try {
    await music.play();
    actualizarReproductor(true);
  } catch (error) {
    // El navegador puede bloquear la reproducción automática
    actualizarReproductor(false);
    musicStatus.textContent = "Toca para activar la música";
  }
}

// Pausar o reproducir manualmente
musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      actualizarReproductor(true);
    } catch (error) {
      musicStatus.textContent = "No se pudo reproducir la música";
    }
  } else {
    music.pause();
    actualizarReproductor(false);
  }
});

// Mantener actualizado el estado
music.addEventListener("play", () => actualizarReproductor(true));
music.addEventListener("pause", () => actualizarReproductor(false));

music.addEventListener("error", () => {
  musicStatus.textContent = "Revisa el archivo de música";
});

// Ejecutar al cargar el sitio
iniciarMusica();

    /* ---------------------------------------
       7. GALERÍA Y VISOR DE IMÁGENES
    --------------------------------------- */

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeLightbox = document.getElementById("lightbox-close");

    let previousFocus = null;

    document.querySelectorAll(".gallery-item").forEach(button => {
      button.addEventListener("click", () => {
        const image = button.querySelector("img");

        previousFocus = button;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;

        lightbox.hidden = false;
        closeLightbox.focus();
      });
    });

    function hideLightbox() {
      lightbox.hidden = true;
      lightboxImage.removeAttribute("src");

      if (previousFocus) {
        previousFocus.focus();
      }
    }

    closeLightbox.addEventListener("click", hideLightbox);

    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) {
        hideLightbox();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !lightbox.hidden) {
        hideLightbox();
      }
    });

    /* ---------------------------------------
       8. ANIMACIONES AL DESPLAZARSE
    --------------------------------------- */

    let revealObserver;

    function observeRevealElements() {
      const elements = document.querySelectorAll(
        ".reveal:not(.visible)"
      );

      if (!("IntersectionObserver" in window)) {
        elements.forEach(element => element.classList.add("visible"));
        return;
      }

      if (revealObserver) {
        revealObserver.disconnect();
      }

      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12
      });

      elements.forEach(element => revealObserver.observe(element));
    }

    /* ---------------------------------------
       9. INICIALIZACIÓN
    --------------------------------------- */

    initializeInvitation();
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
    observeRevealElements();