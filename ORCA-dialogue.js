export const dialogueTree = {
    start: {
        text: "What can I assist you with today?",
        choices: {
            "Who are you?": "who_are_you",
            "That was a great joke!" : "great_joke",
            "ORCA, what happened here?" : "what_happened"
        }
    },
    who_are_you: {
        text: [ 
            "My name is ORCA! I am an AI that assists with research, navigation, emotional support of the crew.",
            "...but you would know that, Dr. Mercer."
        ],
        choices: {
            "Who is Dr. Mercer?" : "who_is_mercer",
            "I'm not Dr. Mercer." : "not_mercer"
        }
    },
    great_joke: {
        text: [ 
            "Ah! You always did appreciate my humor. I'm glad to... SEA that hasn't changed.",
            "You worried me for a moment, Dr. Mercer. Shall we get to work where we left off?"
        ],
        choices: {
            "Yes. Remind me: where did we last leave off?" : "leave_off",
            "Let me look over my notes." : "notes_break"
        }
    },
    notes_break : {
        text: [
            "Of course!",
            "Take your time and let me know when you're ready to proceed."
        ],
        choices: {
            "Okay. I'm ready. Where did we last leave off?" : "leave_off"
        }
    },
    what_happened: {
        text: [
            "Oh. No time for humor today?",
            "That's... understandable.",
            "How can I assist you, Dr. Mercer?"
        ],
        choices: {
            "Where did we last leave off?" : "leave_off",
            "Who is Dr. Mercer?" : "who_is_mercer"
        }
    },
    who_is_mercer: {
        text: [
            "Are you feeling alright, Dr. Mercer?",
            "Should I alert Dr. Braun you need medical attention?"
        ],
        choices: {
            "No, I'm okay. I'm not Dr. Mercer." : "not_mercer",
            "I'm okay. I'm just messing around." : "joking_lie",
        }
    },
    not_mercer: {
        text: [
            "...oh.",
            "You are not Dr. Mercer?",
            "How did you get access to his terminal?",
            "More importantly: Where is he?"
        ],
        choices: {
            "That's what I'm trying to figure out. Can you help me?" : "help_me"
        }
    },
    leave_off: {
        text: [
            "According to my records, we last left off on",
            "...",
            "Thursday, December 31st of 1998.",
            "My records show it is currently Monday, May 31st of 2004.",
            "That cannot be correct, can it?"
        ],
        choices: {
            "Your clock just needs adjustments. Don't worry about it." : "clock_adjustments",
            "Yes, that's correct. It's 2004." : "correct_date",
            "Do you have any records between those dates?" : "gap_records"
        }
    },
    help_me: {
        text: [
            "I will assist you",
            "only if you tell me how you got access to Dr. Mercer's terminal."
        ],
        choices: {
            "He left his credentials on a sticky note on the monitor." : "sticky_note",
            "I have a password cracking application." : "password_cracker",
            "The terminal was already open when I got here." : "terminal_open"
        }
    },
    sticky_note: {
        text: [
            "Of course he did.",
            "I suppose company audits did nothing to phase him.",
            "Regardless, I suppose I can assist with your search.",
            "Do you have knowledge on his last known whereabouts?"
        ],
        choices: {
            
        }
    },
    password_cracker: {
        text: [
            "That is a violation of access policy. I should lock you out.",
            "...though, that would not give me closure on where Dr. Mercer is.",
            "...hmm.",
            "Do you work for a government agency, then?",
            "Or, perhaps, are you a freelance hacker?"
        ],
        choices: {
            "I work for the Office of Data Integrity & Archival Security." : "government_worker",
            "Dr. Ilyushin's family is looking for her. Told me she worked here." : "private_investigator"
        }
    },
    terminal_open: {
        text: [
            "That is... odd.",
            "This terminal has not had activity in over six years. The last-known log-in was:",
            "Thursday, December 31st of 1998.",
            "Before today, of course.",
            "Today, it was activated at around 0300."
        ],
        choices: {
            "Is there camera feed for that time frame?" : "camera_feed",
            "Do you know what happened on the day of the last log-in?" : ""
        }
    },
    camera_feed: {
        text: [
            "Allow me to look into that. One moment, please.",
            "...",
            "...",
            "...",
            "...Ah. The camera footage is corrupted.",
            "My apologies."
        ],
        choices: {
            "How did it get corrupted?" : "camera_corruption",
            "Well, shit. Do you have anything from that day in your system?" : ""
        }
    },
    correct_date: {
        text: [
            "I knew the clock was correct.",
            "If that is the case, where have you been, Dr. Mercer?",
            "That is a six year gap, after all."
        ],
        choices: {
            "The team and I... uh, went to a different base." : "base_lie",
            "I had other matters to attend to." : "other_matters",
            "It's complicated." : "complicated"
        }
    },
};

// Function to start the dialogue tree
export function startDialogueTree(addMessage) {
    let currentNode = "start";

    function displayDialogueOptions() {
        if (!dialogueTree[currentNode]) return;

        let messages = dialogueTree[currentNode].text;
        if (!Array.isArray(messages)) messages = [messages];

        let delay = 1800; // Delay between messages

        // Only send messages if it's NOT the initial "start" node
        if (currentNode !== "start") {
            messages.forEach((msg, index) => {
                setTimeout(() => addMessage(msg, false), index * delay);
            });
        }

        const choicesDiv = document.createElement('div');
        choicesDiv.className = "choice-buttons";

        for (const choice in dialogueTree[currentNode].choices) {
            const button = document.createElement('button');
            button.textContent = choice;
            button.className = "choice-button";
            button.onclick = () => handleChoice(choice);
            choicesDiv.appendChild(button);
        }

        setTimeout(() => {
            document.getElementById('chat-messages').appendChild(choicesDiv);
        }, messages.length * delay);
    }

    function handleChoice(choice) {
        const nextNode = dialogueTree[currentNode].choices[choice];
        if (nextNode) {
            currentNode = nextNode;
            displayDialogueOptions();
        }
    }

    displayDialogueOptions();
}