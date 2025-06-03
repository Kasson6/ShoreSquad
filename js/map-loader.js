// Map iframe loading handler
document.addEventListener('DOMContentLoaded', () => {
    const mapIframe = document.querySelector('.map-container iframe');
    if (mapIframe) {
        mapIframe.addEventListener('load', function() {
            this.setAttribute('loaded', 'true');
        });
        
        mapIframe.addEventListener('error', function() {
            const fallback = document.querySelector('.map-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }
        });
    }
});
