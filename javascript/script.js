// OPEN WEATHER 
function openWeather() {
  const weatherPanel = document.getElementById('weather');

  weatherPanel.style.display = 'block';
  weatherPanel.classList.add('active');
  weatherPanel.style.left = '50%';
  weatherPanel.style.top = '50%';
  weatherPanel.style.transform = 'translate(-50%, -50%)';

  if (typeof bringToFront === 'function' ) {
    bringToFront(weatherPanel);
  }
};

// HELP WINDOW
function openHelpWindow() {
    let helpWindow = document.getElementById('help-window');
    let helpMessage = document.getElementById('help-message');

    if (!helpWindow) {
        helpWindow = document.createElement('div');
        helpWindow.id = 'help-window';
        helpWindow.className = 'window-panel';
        helpWindow.innerHTML = `
            <div class="title-bar">
                <span>Help</span>
                <button class="close-button" onclick="closeHelpWindow()">X</button>
            </div>
            <div class="window-content">
                <p id="help-message">Loading helpful information...</p>
                <button onclick="randomizeHelpMessage()">More Help</button>
            </div>
            `;
        document.body.appendChild(helpWindow);
    }
    helpWindow.style.display = 'block';
    helpWindow.classList.add('active');
    helpWindow.style.left = '50%';
    helpWindow.style.top = '50%';
    helpWindow.style.transform = 'translate(-50%, -50%)';


    bringToFront(helpWindow);
    randomizeHelpMessage();
}

// close help window
function closeHelpWindow () {
    const helpWindow = document.getElementById('help-window');
    if (helpWindow) {
        helpWindow.classList.remove('active');
        helpWindow.style.display = 'none';
    }
}

// random help message generation
function randomizeHelpMessage() {
    const messages = [
        "Did you mean to press 'Help' or were you just curious? Either way, this is all you get.",
        "Try clicking on different things across the screen. Maybe that'll do something.",
        "Consult the user manual before submitting a help ticket. Please.",
        "Have you tried turning it off and turning it back on?",
        "If you get stuck, you can always ask ORCA for assistance.",
        "Missing a document? Be sure you didn't accidentally send it to recycling.",
        "Remember to clear your cache!",
        "If any of these aren't helpful, you can always submit a support ticket to LINDHOLM@ARCTIC.CIRCLE"
    ];
    document.getElementById('help-message').textContent = messages[Math.floor(Math.random() * messages.length)];
}

// ensures help button in the start menu opens the window
window.onload = function() {
    document.querySelectorAll('.start-menu button').forEach(button => {
        if (button.textContent.includes('Help')) {
            button.setAttribute('onclick', 'openHelpWindow()');
        }
    })
}

// locked documents
document.addEventListener('DOMContentLoaded', function() {
    let highestZIndex = 1;
    
    function bringToFront(panel) {
        highestZIndex++;
        panel.style.zIndex = highestZIndex;
    }

    // Passwords
    const documentPasswords = {
        "classified-report.html": "pakicetus98"
    };

    // Pop-up elements
    const passwordPopup = document.getElementById('password-popup');
    const passwordInput = document.getElementById('document-password');
    const passwordError = document.getElementById('password-error');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordCancel = document.getElementById('password-cancel');

    let lockedFileToOpen = null;

    // Handle clicking on document buttons inside "My Documents"
    document.querySelectorAll('.document-icon').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const file = this.getAttribute('data-file');
            const isLocked = this.getAttribute('data-locked') === "true";
            
            if (isLocked) {
                // Show the password pop-up instead of the document
                passwordPopup.style.display = 'block';
                passwordInput.value = '';
                passwordError.style.display = 'none';
                lockedFileToOpen = file; // Store file name for later
                
                // Bring pop-up to front
                highestZIndex++;
                passwordPopup.style.zIndex = highestZIndex;
            } else {
                openDocument(file);
            }
        });
    });
    
    // Function to open document after password entry
    function openDocument(file) {
        const documentViewer = document.getElementById('document-viewer');
        const documentTitle = document.getElementById('document-title');
        const documentContent = document.getElementById('document-content');
    
        fetch(file)
            .then(response => response.text())
            .then(data => {
                documentContent.innerHTML = data;
                documentTitle.textContent = file.split('/').pop();
            })
            .catch(() => {
                documentContent.innerHTML = "<p>Error loading document.</p>";
            });
    
        // Ensure "My Documents" is also brought to the front
        const documentsWindow = document.getElementById('documents');
        if (documentsWindow) {
            bringToFront(documentsWindow);
        }
    
        // Display and bring document viewer to the front
        documentViewer.style.display = 'block';
        documentViewer.style.left = '50%';
        documentViewer.style.top = '50%';
        documentViewer.style.transform = 'translate(-50%, -50%)';
        documentViewer.classList.add('active');
    
        bringToFront(documentViewer);
    }

    // Handle password submission
    passwordSubmit.addEventListener('click', function() {
        if (lockedFileToOpen && passwordInput.value === documentPasswords[lockedFileToOpen]) {
            passwordPopup.style.display = 'none';
    
            // Delay opening document viewer until AFTER password is accepted
            setTimeout(() => {
                openDocument(lockedFileToOpen);
            }, 300);
        } else {
            passwordError.style.display = 'block';
        }
    });

    // Cancel password entry
    passwordCancel.addEventListener('click', function() {
        passwordPopup.style.display = 'none';
    });
});

window.openHelpWindow = openHelpWindow;
window.openWeather = openWeather;
window.randomizeHelpMessage = randomizeHelpMessage;