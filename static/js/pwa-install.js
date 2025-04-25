/**
 * Obsługa instalacji aplikacji PWA
 */

// Przechowywanie zdarzenia beforeinstallprompt
let deferredPrompt;
let installButton;

// Nasłuchiwanie zdarzenia beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Zapobiegaj automatycznemu pokazywaniu promptu
    e.preventDefault();
    
    // Zapisz zdarzenie, aby użyć go później
    deferredPrompt = e;
    
    // Pokaż przycisk instalacji
    showInstallButton();
});

// Obsługa zakończonej instalacji
window.addEventListener('appinstalled', () => {
    // Ukryj przycisk instalacji
    hideInstallButton();
    
    // Wyczyść zapisane zdarzenie
    deferredPrompt = null;
    
    // Opcjonalnie - wyświetl potwierdzenie instalacji
    showInstallationConfirmation();
    
    console.log('Aplikacja została zainstalowana!');
});

/**
 * Wyświetla przycisk instalacji
 */
function showInstallButton() {
    // Sprawdź czy przycisk już istnieje, jeśli nie - stwórz go
    if (!installButton) {
        installButton = document.createElement('button');
        installButton.className = 'pwa-install-btn';
        installButton.innerHTML = '<i class="fas fa-download"></i>';
        installButton.setAttribute('title', 'Zainstaluj aplikację');
        installButton.addEventListener('click', installApp);
        
        document.body.appendChild(installButton);
    }
    
    // Pokaż przycisk
    installButton.style.display = 'flex';
}

/**
 * Ukrywa przycisk instalacji
 */
function hideInstallButton() {
    if (installButton) {
        installButton.style.display = 'none';
    }
}

/**
 * Wywołuje prompt instalacji
 */
function installApp() {
    // Sprawdź, czy zdarzenie beforeinstallprompt jest zapisane
    if (!deferredPrompt) {
        console.log('Prompt instalacji nie jest dostępny');
        return;
    }
    
    // Pokaż prompt instalacji
    deferredPrompt.prompt();
    
    // Czekaj na odpowiedź użytkownika
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('Użytkownik zaakceptował prompt instalacji');
        } else {
            console.log('Użytkownik odrzucił prompt instalacji');
        }
        
        // Resetuj deferredPrompt
        deferredPrompt = null;
    });
}

/**
 * Wyświetla potwierdzenie udanej instalacji
 */
function showInstallationConfirmation() {
    const confirmationToast = document.createElement('div');
    confirmationToast.className = 'offline-toast';
    confirmationToast.style.backgroundColor = '#198754'; // zielony kolor
    
    confirmationToast.innerHTML = `
        <div class="offline-toast-content">
            <i class="fas fa-check-circle"></i>
            <span>Aplikacja została pomyślnie zainstalowana!</span>
        </div>
    `;
    
    document.body.appendChild(confirmationToast);
    
    // Usuń powiadomienie po 5 sekundach
    setTimeout(() => {
        if (confirmationToast.parentNode) {
            confirmationToast.parentNode.removeChild(confirmationToast);
        }
    }, 5000);
}

/**
 * Wykrywa urządzenia iOS i wyświetla informacje o instalacji
 */
function detectIOS() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS && !isInStandaloneMode()) {
        // Na iOS nie ma standardowego API do instalacji PWA
        // Zamiast tego pokaż instrukcję instalacji dla iOS
        showIOSInstallInstructions();
    }
}

/**
 * Sprawdza, czy aplikacja jest uruchomiona w trybie standalone
 */
function isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

/**
 * Wyświetla instrukcje instalacji dla iOS
 */
function showIOSInstallInstructions() {
    // Sprawdź, czy prompt już istnieje
    if (document.querySelector('.ios-install-prompt')) {
        return;
    }
    
    // Utwórz element promptu
    const iosPrompt = document.createElement('div');
    iosPrompt.className = 'ios-install-prompt';
    iosPrompt.innerHTML = `
        <div class="ios-prompt-container">
            <p>
                <i class="fas fa-plus-square me-2"></i>
                Dodaj tę aplikację do ekranu głównego! Dotknij 
                <i class="fas fa-share me-1 ms-1"></i> 
                a następnie "Dodaj do ekranu głównego".
            </p>
            <button class="btn-close btn-close-white ios-prompt-close" aria-label="Close"></button>
        </div>
    `;
    
    // Dodaj do dokumentu
    document.body.appendChild(iosPrompt);
    
    // Pokaż prompt z animacją
    setTimeout(() => {
        iosPrompt.style.display = 'block';
    }, 1000);
    
    // Dodaj obsługę przycisku zamknięcia
    iosPrompt.querySelector('.ios-prompt-close').addEventListener('click', () => {
        iosPrompt.style.display = 'none';
        
        // Zapisz w localStorage, aby nie pokazywać ponownie
        localStorage.setItem('iosPromptClosed', 'true');
        
        // Po 400ms usuń element
        setTimeout(() => {
            if (iosPrompt.parentNode) {
                iosPrompt.parentNode.removeChild(iosPrompt);
            }
        }, 400);
    });
}

// Sprawdź urządzenie iOS po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    // Sprawdź, czy użytkownik nie zamknął już promptu iOS
    if (!localStorage.getItem('iosPromptClosed')) {
        detectIOS();
    }
});