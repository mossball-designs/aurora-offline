// START MENU
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('start-menu');
    const helpButton = document.querySelector('.start-menu button[data-action="help"]');
    const weatherButton = document.querySelector('.start-menu button[data-action="weather"]');
  
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

    // ensures "help" button opens help window
    if (helpButton) {
        helpButton.addEventListener('click', function() {
            openWindow('help-window');
        });
    }

    // ensure "weather" button opens weather window
    if (weatherButton) {
        weatherButton.addEventListener('click', function() {
            openWindow('weather');
        });
    }
  
    // Function to open windows from the start menu
    window.openWindow = function(windowId) {
        const panel = document.getElementById(windowId);
        if (panel) {
          panel.style.display = 'block';
          panel.classList.add('active');
          panel.style.left = '50%';
          panel.style.top = '50%';
          panel.style.transform = 'translate(-50%, -50%)';
          bringToFront(panel);
        }
    };
  
    // Example shutdown function
    window.shutdown = function() {
        alert('Shutting down...');
    };
  });