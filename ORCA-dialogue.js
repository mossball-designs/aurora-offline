let dialogueTree = {};

async function loadDialogueTree() {
    try {
        const response = await fetch('/dialogue.json');
        dialogueTree = await response.json();
    } catch (error) {
        console.error("Error loading dialogue tree:", error);
    }
}

export async function startDialogueTree(addMessage, delayStart = 0) {
    await loadDialogueTree();

    let currentNode = "start";

    function displayDialogueOptions() {
        if (!dialogueTree[currentNode]) return;

        let messages = dialogueTree[currentNode].text;
        if(!Array.isArray(messages)) messages = [messages];

        let delay = 1800;

        function showChoices() {
            const choicesDiv = document.createElement('div');
            choicesDiv.className = "choice-buttons";

            for(const choice in dialogueTree[currentNode].choices) {
                const button = document.createElement('button');
                button.textContent = choice;
                button.className = "choice-button";
                button.onclick = () => handleChoice(choice);
                choicesDiv.appendChild(button);
            }

            document.getElementById('chat-messages').appendChild(choicesDiv);
        }

        if (currentNode === "start") {
            // Skip showing the message for the "start" node, only show choices
            setTimeout(showChoices, delay);
        } else {
            // Show normal messages for other dialogue nodes
            messages.forEach((msg, index) => {
                setTimeout(() => {
                    addMessage(msg, false);
                    if (index === messages.length - 1) {
                        setTimeout(showChoices, delay);
                    }
                }, index * delay);
            });
        }
    }

    function handleChoice(choice) {
        const nextNode = dialogueTree[currentNode]?.choices?.[choice];
        if (nextNode) {
            currentNode = nextNode;
            displayDialogueOptions();
        }
    }

    setTimeout(() => {
        displayDialogueOptions();
    }, delayStart);
}