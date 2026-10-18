/* =====================================================
   MEKAPAWS - JAVASCRIPT
   Responsive, mobile-safe y chatbot local
   ===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    /* ---------- AOS ---------- */
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            once: true,
            easing: "ease-in-out",
            disable: prefersReducedMotion
        });
    }

    /* ---------- Navbar ---------- */
    const navbar = document.querySelector(".navbar");

    const updateNavbar = () => {
        if (!navbar) return;
        navbar.classList.toggle("shadow", window.scrollY > 60);
    };

    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();

    /* ---------- Mobile navbar ---------- */
    const menu = document.getElementById("menu");

    document.querySelectorAll("#menu a[href^='#']").forEach(link => {
        link.addEventListener("click", () => {
            if (menu && menu.classList.contains("show") && window.bootstrap) {
                const collapse = bootstrap.Collapse.getOrCreateInstance(menu);
                collapse.hide();
            }
        });
    });

    /* ---------- Smooth scroll ---------- */
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", event => {
            const selector = anchor.getAttribute("href");
            if (!selector || selector === "#") return;

            const target = document.querySelector(selector);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* ---------- Back to top ---------- */
    const btnTop = document.getElementById("btnTop");

    const updateBackToTop = () => {
        if (!btnTop) return;
        btnTop.style.display = window.scrollY > 500 ? "flex" : "none";
    };

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    if (btnTop) {
        btnTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    /* ---------- Counters ---------- */
    const counters = document.querySelectorAll(".counter");
    const counterSection = document.querySelector(".counter-section");

    if (counterSection && counters.length) {
        let started = false;

        const startCounters = () => {
            if (started) return;
            started = true;

            counters.forEach(counter => {
                const target = Number(counter.dataset.target || 0);

                if (prefersReducedMotion) {
                    counter.textContent = target;
                    return;
                }

                const duration = 1200;
                const start = performance.now();

                const animate = now => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(target * eased);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.textContent = target;
                    }
                };

                requestAnimationFrame(animate);
            });
        };

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    startCounters();
                    observer.disconnect();
                }
            }, { threshold: 0.25 });

            observer.observe(counterSection);
        } else {
            startCounters();
        }
    }

    /* ---------- Formulario de valoración -> WhatsApp ---------- */
    const valoracionForm = document.getElementById("valoracionForm");
    const WHATSAPP_NUMBER = "573138010759";

    const openWhatsApp = message => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    if (valoracionForm) {
        valoracionForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!valoracionForm.checkValidity()) {
                valoracionForm.classList.add("was-validated");
                const firstInvalid = valoracionForm.querySelector(":invalid");
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const data = new FormData(valoracionForm);

            const message =
`🐾 *Solicitud de valoración - MekaPaws*

*Nombre:* ${data.get("nombre")}
*Teléfono:* ${data.get("telefono")}
*Correo:* ${data.get("correo") || "No indicado"}
*Ciudad:* ${data.get("ciudad")}
*Tipo de mascota:* ${data.get("mascota")}
*Situación:* ${data.get("situacion")}

*Descripción del caso:*
${data.get("mensaje")}

Hola, quiero solicitar una valoración para mi mascota.`;

            openWhatsApp(message);
        });
    }

    /* =================================================
       CHATBOT LOCAL
       ================================================= */

    const chatbot = document.getElementById("mekapawsChatbot");
    const toggle = document.getElementById("chatbotToggle");
    const close = document.getElementById("chatbotClose");
    const windowChat = document.getElementById("chatbotWindow");
    const messages = document.getElementById("chatbotMessages");
    const options = document.getElementById("chatbotOptions");
    const inputForm = document.getElementById("chatbotInputForm");
    const input = document.getElementById("chatbotInput");
    const notification = document.querySelector(".chatbot-notification");

    if (!chatbot || !toggle || !windowChat || !messages) return;

    const knowledge = {
        valoracion: {
            text: "Claro. Para iniciar una valoración necesitamos conocer algunos datos de tu mascota y su situación. Puedes llenar el formulario de valoración o enviarnos la información directamente por WhatsApp.",
            buttons: [
                ["📋 Llenar formulario", "#contacto"],
                ["📲 Solicitar por WhatsApp", "whatsapp"]
            ]
        },
        protesis: {
            text: "MekaPaws trabaja con prótesis delanteras, traseras y parciales. La opción adecuada depende de la amputación, anatomía, movilidad y necesidades de cada mascota. Por eso cada caso se evalúa individualmente.",
            buttons: [
                ["📋 Solicitar valoración", "#contacto"],
                ["📲 Consultar por WhatsApp", "whatsapp"]
            ]
        },
        proceso: {
            text: "El proceso contempla: 1) valoración del caso, 2) medición, 3) diseño 3D, 4) impresión 3D, 5) ajustes y 6) seguimiento durante la adaptación.",
            buttons: [
                ["📋 Iniciar valoración", "#contacto"],
                ["📲 Hablar por WhatsApp", "whatsapp"]
            ]
        },
        tiempo: {
            text: "La información actual de MekaPaws indica una fabricación aproximada de una semana, aunque la FAQ especifica que el proceso puede tardar entre una y dos semanas dependiendo del caso.",
            buttons: [
                ["📋 Consultar mi caso", "#contacto"],
                ["📲 Preguntar por WhatsApp", "whatsapp"]
            ]
        },
        precio: {
            text: "El costo depende de las características y necesidades de cada prótesis. Lo más adecuado es solicitar una valoración para conocer el caso y definir la alternativa correspondiente.",
            buttons: [
                ["📋 Solicitar valoración", "#contacto"],
                ["📲 Consultar costo", "whatsapp"]
            ]
        },
        cobertura: {
            text: "MekaPaws indica atención en Bogotá, Boyacá y municipios cercanos. También evalúa solicitudes de otras regiones del país.",
            buttons: [
                ["📋 Solicitar valoración", "#contacto"],
                ["📲 Consultar cobertura", "whatsapp"]
            ]
        },
        garantia: {
            text: "La información publicada indica garantía contra defectos de fabricación, ajustes posteriores y seguimiento personalizado. También se especifica una garantía de seis meses.",
            buttons: [
                ["📲 Consultar condiciones", "whatsapp"],
                ["📋 Solicitar valoración", "#contacto"]
            ]
        }
    };

    const addMessage = (text, type = "bot") => {
        const wrapper = document.createElement("div");
        wrapper.className = `chatbot-message ${type}`;

        const bubble = document.createElement("span");
        bubble.textContent = text;

        wrapper.appendChild(bubble);
        messages.appendChild(wrapper);
        messages.scrollTop = messages.scrollHeight;
    };

    const addButtons = buttonList => {
        const group = document.createElement("div");
        group.className = "chatbot-options";

        buttonList.forEach(([label, action]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.dataset.chatAction = action;
            group.appendChild(button);
        });

        messages.appendChild(group);
        messages.scrollTop = messages.scrollHeight;
    };

    const showTyping = () => {
        const wrapper = document.createElement("div");
        wrapper.className = "chatbot-message bot";
        wrapper.id = "chatbotTyping";

        const bubble = document.createElement("span");
        bubble.className = "chatbot-typing";
        bubble.textContent = "Escribiendo…";

        wrapper.appendChild(bubble);
        messages.appendChild(wrapper);
        messages.scrollTop = messages.scrollHeight;
    };

    const removeTyping = () => {
        document.getElementById("chatbotTyping")?.remove();
    };

    const goToContact = () => {
        const target = document.querySelector("#contacto");
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        }
        closeChat();
    };

    const sendToWhatsApp = () => {
        openWhatsApp(
`🐾 *Hola MekaPaws*

Quiero recibir orientación y solicitar una valoración para mi mascota.

¿Podrían indicarme cómo continuar con el proceso?`
        );
    };

    const answer = action => {
        if (action === "whatsapp") {
            sendToWhatsApp();
            return;
        }

        if (action === "#contacto") {
            goToContact();
            return;
        }

        const item = knowledge[action];
        if (!item) return;

        showTyping();

        window.setTimeout(() => {
            removeTyping();
            addMessage(item.text);
            if (item.buttons) addButtons(item.buttons);
        }, prefersReducedMotion ? 0 : 350);
    };

    const normalize = value =>
        value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    const detectIntent = value => {
        const text = normalize(value);

        if (/(precio|costo|vale|cuanto cuesta|cotizacion)/.test(text)) return "precio";
        if (/(valoracion|valoracion|evaluacion|cita|agendar|agenda|quiero una cita)/.test(text)) return "valoracion";
        if (/(protesis|protesi|pata|pierna|amput)/.test(text)) return "protesis";
        if (/(proceso|como funciona|pasos|fabrican|fabricacion)/.test(text)) return "proceso";
        if (/(cuanto tarda|tiempo|dias|demora|rapido)/.test(text)) return "tiempo";
        if (/(donde|ubicacion|bogota|boyaca|cobertura|region)/.test(text)) return "cobertura";
        if (/(garantia|garantía|ajuste|seguimiento)/.test(text)) return "garantia";

        return null;
    };

    const openChat = () => {
        chatbot.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        windowChat.setAttribute("aria-hidden", "false");
        if (notification) notification.style.display = "none";
        if (!prefersReducedMotion) setTimeout(() => input?.focus(), 180);
    };

    const closeChat = () => {
        chatbot.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        windowChat.setAttribute("aria-hidden", "true");
    };

    toggle.addEventListener("click", () => {
        chatbot.classList.contains("is-open") ? closeChat() : openChat();
    });

    close?.addEventListener("click", closeChat);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeChat();
    });

    options?.addEventListener("click", event => {
        const button = event.target.closest("[data-chat-action]");
        if (!button) return;

        const action = button.dataset.chatAction;

        if (action === "valoracion") {
            addMessage(button.textContent, "user");
        }

        answer(action);
    });

    messages.addEventListener("click", event => {
        const button = event.target.closest("[data-chat-action]");
        if (!button) return;

        const action = button.dataset.chatAction;
        addMessage(button.textContent, "user");
        answer(action);
    });

    inputForm?.addEventListener("submit", event => {
        event.preventDefault();

        const value = input.value.trim();
        if (!value) return;

        addMessage(value, "user");
        input.value = "";

        const intent = detectIntent(value);

        showTyping();

        window.setTimeout(() => {
            removeTyping();

            if (intent) {
                const item = knowledge[intent];
                addMessage(item.text);
                addButtons(item.buttons);
            } else {
                addMessage(
                    "Puedo ayudarte con valoración, tipos de prótesis, proceso, tiempos, costos, cobertura y garantía. Si tu pregunta es más específica, también puedes continuar directamente por WhatsApp."
                );
                addButtons([
                    ["📋 Solicitar valoración", "#contacto"],
                    ["📲 Hablar por WhatsApp", "whatsapp"]
                ]);
            }
        }, prefersReducedMotion ? 0 : 350);
    });

    /* ---------- Escape de chat al hacer clic fuera en escritorio ---------- */
    document.addEventListener("click", event => {
        if (!chatbot.contains(event.target) && chatbot.classList.contains("is-open")) {
            closeChat();
        }
    });

    /* ---------- Efectos desktop: sin interferir con touch ---------- */
    if (!isTouchDevice && !prefersReducedMotion) {
        document.querySelectorAll(".card, .process-card").forEach(card => {
            card.addEventListener("pointermove", event => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                card.style.transform =
                    `perspective(900px) rotateX(${y * -2}deg) rotateY(${x * 2}deg) translateY(-2px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* ---------- Footer year ---------- */
    const footerText = document.querySelector("footer .text-center p");
    if (footerText) {
        footerText.innerHTML =
            `© ${new Date().getFullYear()} MekaPaws. Todos los derechos reservados.`;
    }

    console.log("MekaPaws: página y chatbot local cargados correctamente.");
});
