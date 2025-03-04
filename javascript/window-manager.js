// WINDOW PANELS
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const windowID = this.getAttribute('data-window');
            openWindow(windowID);
        });
    });

    function openWindow(windowId) {
        const panel = document.getElementById(windowId);
        if (panel) {
            // Make sure it's visible again when reopened
            panel.style.display = 'block';
            panel.classList.add('active');
            panel.style.left = '50%';
            panel.style.top = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
    
            bringToFront(panel);
        }
    }

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

        // brief delay for closing window
        setTimeout(() => {
            panel.classList.remove('active');
            panel.style.display = 'none';
        }, 50);
        
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

window.bringToFront = bringToFront;