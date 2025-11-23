// Gestion du loader
document.body.classList.add('loading');

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        // Attendre un peu pour que l'animation soit visible
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            // Retirer le loader du DOM après la transition
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500); // Afficher le loader pendant 1.5 secondes minimum
    }
});

// Smooth scroll pour la navigation
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
    });
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Observer les items d'objectif (les cartes de personnages sont maintenant dans un carousel)

// Observer les items d'objectif
document.querySelectorAll('.objectif-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Navbar background au scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Carousel vertical avec swipe pour les personnages
(function() {
    let carousel, indicators, cards, wrapper;
    let currentIndex = 0;
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTranslate = 0;
    let currentTranslate = 0;
    let cardHeight = 600;
    
    function initCarousel() {
        carousel = document.getElementById('personnagesCarousel');
        indicators = document.querySelectorAll('.indicator');
        cards = document.querySelectorAll('.personnage-card');
        wrapper = document.querySelector('.personnages-carousel-wrapper');
        
        if (!carousel || cards.length === 0) return;
        
        // Fonction pour obtenir la hauteur d'une carte
        function getCardHeight() {
            if (wrapper) {
                return wrapper.clientHeight;
            }
            return 600;
        }
        
        cardHeight = getCardHeight();
        
        // S'assurer que toutes les cartes ont la même hauteur
        cards.forEach(card => {
            card.style.height = cardHeight + 'px';
            card.style.minHeight = cardHeight + 'px';
            card.style.flexShrink = '0';
        });
        
        // Fonction pour mettre à jour la position du carousel
        function updateCarousel() {
            const translateY = -currentIndex * cardHeight;
            carousel.style.transform = `translateY(${translateY}px)`;
            
            // Mettre à jour les indicateurs
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        // Mettre à jour la hauteur au redimensionnement
        window.addEventListener('resize', () => {
            cardHeight = getCardHeight();
            cards.forEach(card => {
                card.style.height = cardHeight + 'px';
                card.style.minHeight = cardHeight + 'px';
            });
            updateCarousel();
        });
    
        
        // Fonction pour aller à un index spécifique
        function goToIndex(index) {
            if (index < 0) index = 0;
            if (index >= cards.length) index = cards.length - 1;
            currentIndex = index;
            updateCarousel();
        }
        
        // Gestion du swipe avec la souris
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startTranslate = -currentIndex * cardHeight;
            carousel.style.transition = 'none';
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentY = e.clientY;
            currentTranslate = startTranslate + (currentY - startY);
            carousel.style.transform = `translateY(${currentTranslate}px)`;
        });
        
        carousel.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            const diff = startY - currentY;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentIndex < cards.length - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            
            updateCarousel();
        });
        
        carousel.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                carousel.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                updateCarousel();
            }
        });
        
        // Gestion du swipe tactile (mobile)
        carousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startY = e.touches[0].clientY;
            startTranslate = -currentIndex * cardHeight;
            carousel.style.transition = 'none';
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentY = e.touches[0].clientY;
            currentTranslate = startTranslate + (currentY - startY);
            carousel.style.transform = `translateY(${currentTranslate}px)`;
        });
        
        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            const diff = startY - currentY;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentIndex < cards.length - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            
            updateCarousel();
        });
        
        // Gestion des indicateurs
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToIndex(index);
            });
        });
        
        // Gestion de la molette de la souris
        wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0 && currentIndex < cards.length - 1) {
                currentIndex++;
            } else if (e.deltaY < 0 && currentIndex > 0) {
                currentIndex--;
            }
            updateCarousel();
        });
        
        // Initialisation
        updateCarousel();
    }
    
    // Initialiser le carousel quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
})();

// Gestion de l'affichage des images de personnages
document.addEventListener('DOMContentLoaded', () => {
    const personnageImages = document.querySelectorAll('.personnage-img');
    
    personnageImages.forEach(img => {
        // Vérifier si l'image a une source valide
        if (img.src && img.src !== window.location.href && img.src.trim() !== '') {
            const placeholder = img.parentElement.querySelector('.placeholder-text');
            
            // Si l'image est déjà chargée
            if (img.complete && img.naturalHeight !== 0) {
                img.style.display = 'block';
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            } else {
                // Sinon, attendre le chargement
                img.onload = () => {
                    img.style.display = 'block';
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                };
                img.onerror = () => {
                    img.style.display = 'none';
                    if (placeholder) {
                        placeholder.style.display = 'block';
                    }
                };
            }
        }
    });
});

// Gestion de l'affichage des images de style
document.addEventListener('DOMContentLoaded', () => {
    const styleImages = document.querySelectorAll('.style-image');
    
    styleImages.forEach(img => {
        // Vérifier si l'image a une source valide
        if (img.src && img.src !== window.location.href && img.src.trim() !== '') {
            const placeholder = img.parentElement.querySelector('.image-placeholder');
            
            // Si l'image est déjà chargée
            if (img.complete && img.naturalHeight !== 0) {
                img.style.display = 'block';
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            } else {
                // Sinon, attendre le chargement
                img.onload = () => {
                    img.style.display = 'block';
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                };
                img.onerror = () => {
                    img.style.display = 'none';
                    if (placeholder) {
                        placeholder.style.display = 'flex';
                    }
                };
            }
        }
    });
});

