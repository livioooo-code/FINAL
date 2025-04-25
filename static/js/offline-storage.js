/**
 * Moduł do obsługi przechowywania tras offline
 */

// Nazwa klucza w localStorage
const ROUTES_STORAGE_KEY = 'saved_routes';
const MAX_STORED_ROUTES = 20;

/**
 * Zapisuje trasę w localStorage
 * @param {Object} route Obiekt trasy do zapisania
 */
function saveRouteOffline(route) {
    try {
        // Pobierz istniejące trasy z localStorage
        const savedRoutes = getStoredRoutes();
        
        // Dodaj nową trasę na początek
        savedRoutes.unshift({
            ...route,
            id: Date.now(), // Generuj unikalny ID na podstawie czasu
            created_at: new Date().toISOString()
        });
        
        // Ogranicz liczbę przechowywanych tras
        if (savedRoutes.length > MAX_STORED_ROUTES) {
            savedRoutes.length = MAX_STORED_ROUTES;
        }
        
        // Zapisz zaktualizowaną listę tras
        localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(savedRoutes));
        
        // Zarejestruj synchronizację, jeśli serviceWorker jest dostępny
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready
                .then(function(registration) {
                    registration.sync.register('sync-routes');
                })
                .catch(function(err) {
                    console.error('Błąd rejestracji synchronizacji:', err);
                });
        }
        
        return true;
    } catch (error) {
        console.error('Błąd zapisywania trasy offline:', error);
        return false;
    }
}

/**
 * Pobiera listę tras z localStorage
 * @returns {Array} Lista zapisanych tras
 */
function getStoredRoutes() {
    try {
        const storedRoutes = localStorage.getItem(ROUTES_STORAGE_KEY);
        return storedRoutes ? JSON.parse(storedRoutes) : [];
    } catch (error) {
        console.error('Błąd pobierania tras z localStorage:', error);
        return [];
    }
}

/**
 * Usuwa trasę z localStorage
 * @param {string|number} routeId ID trasy do usunięcia
 */
function deleteStoredRoute(routeId) {
    try {
        const savedRoutes = getStoredRoutes();
        const updatedRoutes = savedRoutes.filter(route => route.id !== routeId);
        localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(updatedRoutes));
        return true;
    } catch (error) {
        console.error('Błąd usuwania trasy z localStorage:', error);
        return false;
    }
}

/**
 * Sprawdza stan połączenia z internetem
 * @returns {boolean} True jeśli jest online, false jeśli offline
 */
function isOnline() {
    return navigator.onLine;
}

/**
 * Wyświetla powiadomienie o trybie offline
 */
function showOfflineNotification() {
    // Implementuj wyświetlanie powiadomienia o trybie offline
    const offlineToast = document.createElement('div');
    offlineToast.className = 'offline-toast';
    offlineToast.innerHTML = `
        <div class="offline-toast-content">
            <i class="fas fa-wifi-slash"></i>
            <span>Pracujesz w trybie offline. Niektóre funkcje mogą być niedostępne.</span>
        </div>
    `;
    
    document.body.appendChild(offlineToast);
    
    // Usuń powiadomienie po 5 sekundach
    setTimeout(() => {
        if (offlineToast.parentNode) {
            offlineToast.parentNode.removeChild(offlineToast);
        }
    }, 5000);
}

/**
 * Nasłuchuje na zmiany stanu połączenia
 */
function setupOfflineListener() {
    window.addEventListener('online', function() {
        console.log('Połączono z internetem');
        // Implementuj logikę po przywróceniu połączenia
    });
    
    window.addEventListener('offline', function() {
        console.log('Utracono połączenie z internetem');
        showOfflineNotification();
    });
    
    // Sprawdź stan przy ładowaniu strony
    if (!isOnline()) {
        showOfflineNotification();
    }
}

// Uruchom nasłuchiwanie przy załadowaniu strony
document.addEventListener('DOMContentLoaded', setupOfflineListener);