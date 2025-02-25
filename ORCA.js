import { startDialogueTree } from '/ORCA-dialogue.js';

document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('chat-messages');

    const welcomeSequence = [
        { message: "Dr. Mercer! It's wonderful to SEA you again.", delay: 2000 },
        { message: "Haha! Did you... SEA what I did there?", delay: 3600 },
        { message: "...are my jokes stale today, Dr. Mercer?", delay: 4800 }
    ];

    function showWelcomeSequence(callback) {
        let totalDelay = 0;
        welcomeSequence.forEach((item, index) => {
            totalDelay += item.delay;
            setTimeout(() => {
                const typingIndicator = showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator(typingIndicator);
                    addMessage(item.message, false);
                    if (index === welcomeSequence.length - 1 && callback) {
                        callback(); // Trigger dialogue tree after last message
                    }
                }, 300);
            }, totalDelay);
        });
    }

    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
        const senderSpan = document.createElement('span');
        senderSpan.className = 'message-sender';
        senderSpan.textContent = isUser ? 'Dr. Mercer' : 'ORCA';
    
        const contentSpan = document.createElement('span');
        contentSpan.className = 'message-content';
        contentSpan.textContent = message;
    
        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(contentSpan);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
        // Play sound only when ORCA sends a message
        if (!isUser) {
            playMessageSound();
        }
    }

    function playMessageSound() {
        const audio = new Audio('/assets/ORCA_message.wav');
        audio.volume = 0.5;
        audio.play().catch(error => console.warn("Sound playback failed:", error));
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.textContent = 'ORCA is typing...';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    function removeTypingIndicator(indicator) {
        if (indicator && indicator.parentElement) {
            indicator.remove();
        }
    }

    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const windowId = this.getAttribute('data-window');
            const panel = document.getElementById(windowId);

            if (windowId === 'ORCA') {
                messagesContainer.innerHTML = ''; // Clear previous messages
                showWelcomeSequence(() => startDialogueTree(addMessage)); // Start dialogue after greeting
            }

            panel.style.left = '50%';
            panel.style.top = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.classList.add('active');
            bringToFront(panel);
        });
    });

    sendButton.addEventListener('click', () => handleSend(chatInput.value.trim()));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend(chatInput.value.trim());
    });
});