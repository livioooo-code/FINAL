/**
 * Mobilne animacje dla aplikacji PWA - wyłączone
 * Te funkcje zostały wyłączone na prośbę użytkownika
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sprawdź czy urządzenie jest mobilne
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        console.log('Mobile device detected, but animations are disabled');
        
        // Dodaj klasę do body
        document.body.classList.add('mobile-device-no-animations');
    }
    
    // Tylko zachowujemy podstawową funkcjonalność kontrolki swipe-to-start
    // bez efektów wizualnych i animacji
    const swipeToStart = document.getElementById('swipe-to-start');
    if (swipeToStart) {
        const thumb = swipeToStart.querySelector('.swipe-thumb');
        if (thumb) {
            thumb.addEventListener('click', function() {
                const targetAction = swipeToStart.getAttribute('data-action');
                if (targetAction === 'navigate') {
                    if (typeof startNavigation === 'function') {
                        startNavigation();
                    }
                } else if (targetAction === 'complete') {
                    if (typeof completeRoute === 'function') {
                        completeRoute();
                    }
                }
            });
        }
    }
});