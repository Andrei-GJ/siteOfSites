import './styles/app.css';

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('site-search');
    const siteCards = document.querySelectorAll('.site-card');
    const noResults = document.getElementById('no-results');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            siteCards.forEach(card => {
                const name = card.getAttribute('data-name');
                if (name.includes(query)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        });
    }

    const ctaBtn = document.getElementById('cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const colors = [
                'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 
                'bg-rose-600', 'bg-amber-600', 'bg-cyan-600'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            console.log('¡Botón pulsado! Cambiando el color del resplandor de fondo.');

            alert('¡Hola Andrei! Esta alerta y la búsqueda en tiempo real se ejecutan mediante JavaScript Vanilla integrado con Symfony y Twig.');
        });
    }
});
