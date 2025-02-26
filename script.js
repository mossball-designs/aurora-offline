// WINDOW PANELS
document.addEventListener('DOMContentLoaded', function() {
    let highestZIndex = 1;

    function bringToFront(panel) {
        highestZIndex++;
        panel.style.zIndex = highestZIndex;
    }

    // Handle clicking on document buttons inside "My Documents"
    document.querySelectorAll('.document-icon').forEach(button => {
        button.addEventListener('click', function() {
            const file = this.getAttribute('data-file');
            const documentViewer = document.getElementById('document-viewer');
            const documentTitle = document.getElementById('document-title');
            const documentContent = document.getElementById('document-content');
    
            if (file) {
                fetch(file)
                    .then(response => response.text())
                    .then(data => {
                        documentContent.innerHTML = data;
                        documentTitle.textContent = this.textContent;
                    })
                    .catch(() => {
                        documentContent.innerHTML = "<p>Error loading document.</p>";
                    });

                documentViewer.style.left = '50%';
                documentViewer.style.top = '50%';
                documentViewer.style.transform = 'translate(-50%, -50%)';
                documentViewer.classList.add('active');
                bringToFront(documentViewer);

              
              if (windowId === 'connect') {
                  startConnectionAnimation();
              }
          }
      });
  });

  // Also bring window to front when clicking anywhere on it
  document.querySelectorAll('.window-panel').forEach(panel => {
      panel.addEventListener('mousedown', function() {
          bringToFront(this);
      });
  });

  // Handle closing windows
  document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        const panel = this.closest('.window-panel');
        panel.classList.remove('active');
        
        if (panel.id === 'document-viewer') {
            panel.style.display = 'none';  // Hide document viewer on close
            }
      });
  });

  // Make windows draggable
  document.querySelectorAll('.window-panel').forEach(panel => {
      let isDragging = false;
      let startX, startY, offsetX = 0, offsetY = 0;

      panel.querySelector('.title-bar').addEventListener('mousedown', startDragging);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDragging);

      function startDragging(e) {
          if (e.target.closest('.close-button')) return;

          isDragging = true;
          const rect = panel.getBoundingClientRect();

          offsetX = rect.left + rect.width / 2 - window.innerWidth / 2;
          offsetY = rect.top + rect.height / 2 - window.innerHeight / 2;

          startX = e.clientX - offsetX;
          startY = e.clientY - offsetY;

          panel.querySelector('.title-bar').style.cursor = 'grabbing';

          // Bring window to front when starting to drag
          bringToFront(panel);
      }

      function drag(e) {
          if (!isDragging) return;

          e.preventDefault();

          offsetX = e.clientX - startX;
          offsetY = e.clientY - startY;

          panel.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      }

      function stopDragging() {
          isDragging = false;
          if (panel.querySelector('.title-bar')) {
              panel.querySelector('.title-bar').style.cursor = 'grab';
          }
      }
  });

  // Connection animation start when window active
  document.getElementById('connect').addEventListener('click', () => {
      startConnectionAnimation();
  });

  // faux internet connection
  function startConnectionAnimation() {
      const panel = document.getElementById('connect');
      const progressBar = panel.querySelector('.progress-bar');
      const statusMessage = panel.querySelector('.status-message');
      const retryButton = panel.querySelector('.retry-button');

      let progress = 0;
      progressBar.style.width = '0%';
      statusMessage.textContent = 'Initializing connection...';
      retryButton.style.display = 'none';

      const getConnectionMessage = (progress) => {
          if (progress < 20) return 'Dialing...';
          if (progress < 40) return 'Verifying username and password...';
          if (progress < 60) return 'Connecting to network...';
          if (progress < 80) return 'Establishing PPP link...';
          return 'Connection failed. Please try again.';
      };

      const interval = setInterval(() => {
          if (progress >= 85 || !panel.classList.contains('active')) {
              clearInterval(interval);
              if (panel.classList.contains('active')) {
                  statusMessage.textContent = 'Connection failed. Please try again.';
                  retryButton.style.display = 'block';
              }
              return;
          }
          progress += Math.random() * 5;
          progress = Math.min(progress, 85);
          progressBar.style.width = `${progress}%`;
          statusMessage.textContent = getConnectionMessage(progress);
      }, 1200);

      retryButton.querySelector('button').onclick = () => {
          progress = 0;
          startConnectionAnimation();
      };
  }
});


// START MENU
document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('start-menu');

  startMenu.style.display = 'none';

  startButton.addEventListener('click', function() {
      if (startMenu.style.display === 'block') {
          startMenu.style.display = 'none';
      } else {
          startMenu.style.display = 'flex';
      }
  });

  // Close Start Menu when clicking elsewhere
  document.addEventListener('click', function(event) {
      if (!startButton.contains(event.target) && !startMenu.contains(event.target)) {
          startMenu.style.display = 'none';
      }
  });

  // Function to open windows from the start menu
  window.openWindow = function(windowId) {
      const panel = document.getElementById(windowId);
      if (panel) {
          panel.style.left = '50%';
          panel.style.top = '50%';
          panel.style.transform = 'translate(-50%, -50%)';
          panel.classList.add('active');
      }
  };

  // Example shutdown function
  window.shutdown = function() {
      alert('Shutting down...');
  };
});

// OPEN WEATHER 
function openWeather() {
  const weatherPanel = document.getElementById('weather');

  weatherPanel.style.left = '50%';
  weatherPanel.style.top = '50%';

  weatherPanel.classList.add('active');

  if (typeof bringToFront === 'function' ) {
    bringToFront(weatherPanel);
  }
};

// HELP WINDOW
function openHelpWindow() {
    let helpWindow = document.getElementById('help-window');
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
    helpWindow.style.left = '50%';
    helpWindow.style.top = '50%';
    helpWindow.style.transform = 'translate(-50%, -50%)';
    helpWindow.classList.add('active');
    bringToFront(helpWindow);
    randomizeHelpMessage();
}

// close help window
function closeHelpWindow () {
    const helpWindow = document.getElementById('help-window');
    if (helpWindow) {
        helpWindow.classList.remove('active');
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