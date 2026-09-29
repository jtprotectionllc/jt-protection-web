import './style.css';
document.addEventListener('DOMContentLoaded', () => {
    // EFECTO TYPEWRITER
    const textArray = [
        "Safety, Our Standard.", 
        "Trust, Our Commitment."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const el = document.querySelector('.dynamic-text');
    
    function typeEffect() {
        const currentWord = textArray[wordIndex];
        
        if (isDeleting) {
            el.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typingSpeed = isDeleting ? 30 : 70; 
        
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 3000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % textArray.length; 
            typingSpeed = 500;
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    if(el) {
        setTimeout(typeEffect, 1000);
    }

    // HERO BACKGROUND SLIDER
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, 5000);

    // SLIDER DE SERVICIOS
    const track = document.getElementById('services-track');
    const btnPrev = document.getElementById('serv-prev');
    const btnNext = document.getElementById('serv-next');
    
    const scrollBehav = window.innerWidth > 768 ? 'smooth' : 'auto';

    if (btnNext && track) {
        // Desplaza 350px (una tarjeta) en lugar del 80% de la pantalla
        btnNext.addEventListener('click', () => track.scrollBy({ left: 700, behavior: scrollBehav }));
        btnPrev.addEventListener('click', () => track.scrollBy({ left: -700, behavior: scrollBehav }));
    }
    
    // LÓGICA DROPDOWN DE SERVICIOS MÓVIL (Doble Sincronización)
    const mobileSelect = document.getElementById('mobile-service-select');
    if (mobileSelect && track) {
        mobileSelect.addEventListener('change', (e) => {
            const index = parseInt(e.target.value);
            const card = track.children[index];
            if (card) {
                const scrollPos = card.offsetLeft - track.offsetLeft - 20;
                track.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        });

        let scrollTimeout;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                let closestIndex = 0;
                let minDistance = Infinity;
                const trackCenter = track.getBoundingClientRect().left + (track.offsetWidth / 2);
                
                Array.from(track.children).forEach((card, index) => {
                    const cardCenter = card.getBoundingClientRect().left + (card.offsetWidth / 2);
                    const distance = Math.abs(cardCenter - trackCenter);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                });
                
                if (mobileSelect.value !== closestIndex.toString()) {
                    mobileSelect.value = closestIndex.toString();
                }
            }, 100); 
        }, { passive: true });
    }

    // SLIDER DE NUESTRO EQUIPO (MÓVIL)
    const teamTrack = document.getElementById('team-track');
    const teamPrev = document.getElementById('team-prev');
    const teamNext = document.getElementById('team-next');
    if (teamNext && teamTrack) {
        teamNext.addEventListener('click', () => teamTrack.scrollBy({ left: window.innerWidth * 0.8, behavior: scrollBehav }));
        teamPrev.addEventListener('click', () => teamTrack.scrollBy({ left: -(window.innerWidth * 0.8), behavior: scrollBehav }));
    }

    // SCROLL REVEAL
    const sr = ScrollReveal({ origin: 'bottom', distance: '50px', duration: 1000, delay: 200, reset: false });
    sr.reveal('.sr-bottom');
    sr.reveal('.sr-fade', { distance: '0px', opacity: 0 });
    sr.reveal('.sr-left', { origin: 'left' });
    sr.reveal('.sr-right', { origin: 'right' });

    // LÓGICA DEL MENÚ HAMBURGUESA
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }
    const navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // FLIP CARDS
    const flipButtonsFront = document.querySelectorAll('.front-flip');
    const flipButtonsBack = document.querySelectorAll('.back-flip');
    flipButtonsFront.forEach(btn => btn.addEventListener('click', (e) => e.target.closest('.service-card').classList.add('flipped')));
    flipButtonsBack.forEach(btn => btn.addEventListener('click', (e) => e.target.closest('.service-card').classList.remove('flipped')));

    // ACORDEÓN PARA "OUR PROCESS"
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            if (currentItem.classList.contains('active')) return;

            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            currentItem.classList.add('active');
        });
    });

    // AUTO-POPULATE CONTACT FORM SERVICE ON "REQUEST" BUTTON CLICK
    const requestBtns = document.querySelectorAll('.btn-request');
    const serviceSelect = document.getElementById('service-needed');

    requestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceType = btn.getAttribute('data-service');
            if (serviceType && serviceSelect) {
                serviceSelect.value = serviceType;
            }
        });
    });

    // ENVÍO DE FORMULARIO SIN RECARGAR LA PÁGINA (CON SOPORTE PARA ARCHIVOS BASE64)
    const jsForms = document.querySelectorAll('.js-form');
    jsForms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault(); 
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const actionUrl = form.getAttribute('action');
            const fileInput = form.querySelector('input[type="file"]');
            
            let payload = {};
            const formData = new FormData(form);
            formData.forEach((value, key) => {
                if (key !== 'resume_file') {
                    payload[key] = value;
                }
            });

            const sendData = (dataPayload) => {
                fetch(actionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify(dataPayload)
                })
                .then(response => response.text())
                .then(data => {
                    alert('Success! Your message has been sent.');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                })
                .catch(error => {
                    alert('An error occurred. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
            };

            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64Data = event.target.result.split(',')[1];
                    payload.fileData = base64Data;
                    payload.mimeType = file.type;
                    payload.fileName = file.name;
                    sendData(payload);
                };
                reader.readAsDataURL(file);
            } else {
                sendData(payload);
            }
        });
    });
});
// ===== URLS LIMPIAS: /services, /contact, etc. =====
const SECCIONES = ['services', 'coverage-area', 'our-team', 'join-our-team', 'contact'];

function irASeccion(id, suave = true) {
    const destino = document.getElementById(id);
    if (destino) destino.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
}

// Clic en links internos (menú, botones, footer, logo)
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();

    const id = link.getAttribute('href').slice(1);
    if (SECCIONES.includes(id)) {
        history.pushState(null, '', '/' + id);
        irASeccion(id);
    } else {
        history.pushState(null, '', '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Al entrar directo a /services, /contact, etc., o al usar "atrás"
function seccionDesdeURL(suave) {
    const hash = location.hash.slice(1);
    if (hash) history.replaceState(null, '', SECCIONES.includes(hash) ? '/' + hash : location.pathname);

    const ruta = location.pathname.replace(/^\/|\/$/g, '');
    if (SECCIONES.includes(ruta)) irASeccion(ruta, suave);
    else if (ruta === '') window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' });
}
window.addEventListener('load', () => seccionDesdeURL(false));
window.addEventListener('popstate', () => seccionDesdeURL(true));