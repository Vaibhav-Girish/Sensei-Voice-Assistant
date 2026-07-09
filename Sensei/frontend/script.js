// ==========================================================================
// 1. DOM ELEMENT REFERENCES
// ==========================================================================
const orb = document.getElementById('orb');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const micBtn = document.getElementById('mic-btn');
const settingsBtn = document.getElementById('settings-btn');
const chatWindow = document.getElementById('chat-window');

// ==========================================================================
// 2. CENTRALIZED APPLICATION STATE
// ==========================================================================
const appState = {
    currentState: 'ready', // Supported states: 'ready', 'listening', 'understanding', 'thinking', 'speaking'
};

// ==========================================================================
// 3. STATE MANAGEMENT
// ==========================================================================
/**
 * Transitions the application state and synchronizes corresponding UI elements.
 * @param {string} newState - The state value to switch the application to.
 */
function setState(newState) {
    const validStates = ['ready', 'listening', 'understanding', 'thinking', 'speaking'];
    if (!validStates.includes(newState)) {
        console.error(`Attempted invalid state transition to: "${newState}"`);
        return;
    }

    // Save state in the centralized state object
    appState.currentState = newState;

    // Map internal states to class prefixes and human-readable names
    // Note: 'ready' state corresponds to 'state-idle' in stylesheet layout
    const stateConfig = {
        ready: { className: 'state-idle', label: 'Idle' },
        listening: { className: 'state-listening', label: 'Listening...' },
        understanding: { className: 'state-thinking', label: 'Understanding...' }, // Fallback to thinking styles
        thinking: { className: 'state-thinking', label: 'Thinking...' },
        speaking: { className: 'state-speaking', label: 'Speaking...' }
    };

    const config = stateConfig[newState];

    // List of CSS classes to remove during states cleanup
    const classesToRemove = ['state-idle', 'state-listening', 'state-thinking', 'state-speaking'];

    // 1. Update Orb Visual State Classes
    if (orb) {
        classesToRemove.forEach(cls => orb.classList.remove(cls));
        orb.classList.add(config.className);
    }

    // 2. Update Status Indicator Classes
    if (statusIndicator) {
        classesToRemove.forEach(cls => statusIndicator.classList.remove(cls));
        statusIndicator.classList.add(config.className);
    }

    // 3. Update Microphone Button Classes
    if (micBtn) {
        classesToRemove.forEach(cls => micBtn.classList.remove(cls));
        micBtn.classList.add(config.className);
    }

    // 4. Update Status Text Label
    if (statusText) {
        statusText.textContent = config.label;
    }
}

// ==========================================================================
// CHAT MANAGER
// ==========================================================================

/**
 * Appends a user message card to the chat window and scrolls it into view.
 * @param {string} message - The text content of the user's message.
 */
function addUserMessage(message) {
    if (!chatWindow) return;

    const messageCard = document.createElement('div');
    messageCard.className = 'message-card user-message';
    messageCard.innerHTML = `
        <div class="message-sender">User</div>
        <div class="message-text"></div>
    `;

    // Safely insert user message text to prevent script injection/XSS
    messageCard.querySelector('.message-text').textContent = message;

    chatWindow.appendChild(messageCard);
    scrollToBottom();
}

/**
 * Appends an assistant (Sensei) message card to the chat window and scrolls it into view.
 * @param {string} message - The text content of the assistant's reply.
 */
function addAssistantMessage(message) {
    if (!chatWindow) return;

    const messageCard = document.createElement('div');
    messageCard.className = 'message-card assistant-message';
    messageCard.innerHTML = `
        <div class="message-sender">Sensei</div>
        <div class="message-text"></div>
    `;

    // Safely insert assistant response text
    messageCard.querySelector('.message-text').textContent = message;

    chatWindow.appendChild(messageCard);
    scrollToBottom();
}

/**
 * Displays the typing indicator if it is not already visible.
 */
function showTypingIndicator() {
    if (!chatWindow) return;

    // Prevent duplicate typing indicators
    if (document.getElementById('typing-indicator')) {
        return;
    }

    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    chatWindow.appendChild(indicator);
    scrollToBottom();
}

/**
 * Hides and removes the typing indicator if it exists in the chat window.
 */
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Smoothly scrolls the chat window to the bottom to display the latest message.
 */
function scrollToBottom() {
    if (chatWindow) {
        chatWindow.scrollTo({
            top: chatWindow.scrollHeight,
            behavior: 'smooth'
        });
    }
}

// ==========================================================================
// API CLIENT
// ==========================================================================

/**
 * Sends a message to the backend API, transitioning states and rendering responses.
 * @param {string} message - The text message to send to the backend.
 * @returns {Promise<string|null>} The assistant's response text, or null in case of error.
 */
async function sendMessage(message) {
    if (!message || typeof message !== 'string' || !message.trim()) {
        console.warn('Cannot send empty or invalid message.');
        return null;
    }

    const trimmedMessage = message.trim();

    // 1. Add user message to chat view
    addUserMessage(trimmedMessage);

    try {
        // 2. Transition to understanding state
        setState('understanding');

        // 3. Artificially wait 300ms
        await new Promise(resolve => setTimeout(resolve, 300));

        // 4. Transition to thinking state and show typing animation
        setState('thinking');
        showTypingIndicator();

        // 5. Perform HTTP request to local backend service
        const response = await fetch('http://127.0.0.1:8000/api/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: trimmedMessage })
        });

        if (!response.ok) {
            throw new Error(`HTTP network error. Status: ${response.status}`);
        }

        const data = await response.json();
        const assistantReply = data.response;

        // 6. Hide typing indicator
        hideTypingIndicator();

        // 7. Add reply to chat window
        addAssistantMessage(assistantReply);

        // 8. Speak assistant response aloud
        await speak(assistantReply);

        return assistantReply;

    } catch (error) {
        console.error('API call failed:', error);

        // Hide typing indicator in case of failure
        hideTypingIndicator();

        // Present clean fallback message to the user
        addAssistantMessage('Sorry, I encountered an error communicating with the backend. Please ensure the server is running and try again.');

        return null;
    } finally {
        // Always return the application state to "ready"
        setState('ready');
    }
}

// ==========================================================================
// VOICE OUTPUT
// ==========================================================================

/**
 * Uses the browser Web Speech Synthesis API to speak the provided text aloud.
 * @param {string} text - The text content to speak.
 * @returns {Promise<void>} Resolves when the speaking finishes or fails.
 */
function speak(text) {
    return new Promise((resolve) => {
        // 1. Check browser compatibility for SpeechSynthesis
        if (!window.speechSynthesis) {
            console.warn('Speech synthesis not supported by this browser.');
            resolve();
            return;
        }

        // 2. Cancel any ongoing speech operations
        window.speechSynthesis.cancel();

        if (!text || typeof text !== 'string' || !text.trim()) {
            resolve();
            return;
        }

        // 3. Create Speech Synthesis Utterance
        const utterance = new SpeechSynthesisUtterance(text);

        // 4. Configure options
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        // 5. Handle start event
        utterance.onstart = () => {
            setState('speaking');
        };

        // 6. Handle end event
        utterance.onend = () => {
            setState('ready');
            resolve();
        };

        // Handle error event to prevent unresolved promise
        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance error:', event);
            setState('ready');
            resolve();
        };

        // 7. Speak text
        window.speechSynthesis.speak(utterance);
    });
}

// ==========================================================================
// VOICE INPUT
// ==========================================================================

// Check browser support for standard or prefixed Speech Recognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SpeechRecognition) {
    // Instantiate a single speech recognition instance
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    let hasReceivedResult = false;

    // Fired when the speech service starts listening
    recognition.onstart = () => {
        isListening = true;
        hasReceivedResult = false;
        setState('listening');
    };

    // Fired when the speech service returns a result
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
            hasReceivedResult = true;
            // Terminate speech recognition cleanly
            recognition.stop();
            // Send the transcribed speech to the assistant
            await sendMessage(transcript);
        }
    };

    // Fired when the speech service ends
    recognition.onend = () => {
        isListening = false;
        // If the service shut down without capturing speech, return to ready state
        if (!hasReceivedResult) {
            setState('ready');
        }
    };

    // Fired when speech recognition encounters an error
    recognition.onerror = (event) => {
        console.error('Speech recognition error event:', event.error);
        isListening = false;
        setState('ready');
    };
} else {
    console.warn('Speech Recognition API is not supported in this browser.');
}

/**
 * Triggers speech recognition.
 */
function startListening() {
    if (!recognition) {
        console.error('Speech recognition is not initialized or supported in this browser.');
        return;
    }
    
    // Toggle active state
    if (isListening) {
        recognition.stop();
        return;
    }

    try {
        // Cancel any ongoing speech output before starting to listen
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        recognition.start();
    } catch (error) {
        console.error('Speech recognition start failed:', error);
        setState('ready');
    }
}

// Hook up the microphone button event listener to trigger recognition
if (micBtn) {
    micBtn.addEventListener('click', () => {
        // Only trigger recognition when the app is idle (ready) or currently listening (to toggle off)
        if (appState.currentState === 'ready' || appState.currentState === 'listening') {
            startListening();
        }
    });
}

// ==========================================================================
// 4. INITIALIZATION
// ==========================================================================
/**
 * Initializes frontend components, dependencies, and state variables.
 */
function initializeApp() {
    // Instantiate Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    } else {
        console.warn('Lucide icon package was not loaded or is unavailable.');
    }

    // Boot state to ready
    setState('ready');
}

// Run initialization when DOM loading completes
window.addEventListener('DOMContentLoaded', initializeApp);
