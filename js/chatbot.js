// AI Chatbot Logic with Lead Capture

const chatbotButton = document.getElementById('chatbot-button');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input-field');
const chatbotSend = document.getElementById('chatbot-send');

let requiresContact = false;
let userDetails = null;
let chatHistory = [];

// Knowledge Base - Preset Q&A
const knowledgeBase = {
    'services': {
        question: 'What services do you offer?',
        answer: 'We offer 7 core services: AI Automation Solutions, Website Development, Chatbot Development, Data Scraping & Analytics, Pitch Deck Creation, Business Process Automation, and Custom Software Solutions.'
    },
    'ai-automation': {
        question: ' Tell me about AI automation',
        answer: 'AI Automation helps streamline your business processes using intelligent systems. We can automate repetitive tasks, data entry, customer service, and workflow optimization to save time and reduce costs.'
    },
    'chatbot': {
        question: 'What is a chatbot?',
        answer: 'A chatbot is an AI-powered program that can have conversations with your customers 24/7. It can answer questions, collect leads, schedule appointments, and provide support without human intervention.'
    },
    'web-scraping': {
        question: 'Tell me about web scraping',
        answer: 'Web scraping is the automated extraction of data from websites. We help businesses collect market data, competitor pricing, product information, and other valuable insights from the web.'
    },
    'pricing': {
        question: 'What are your pricing rates?',
        answer: 'REQUIRES_CONTACT',
        needsContact: true
    },
    'get-started': {
        question: 'How do I get started?',
        answer: 'REQUIRES_CONTACT',
        needsContact: true
    },
    'custom-project': {
        question: 'I need a custom project',
        answer: 'REQUIRES_CONTACT',
        needsContact: true
    }
};

// Toggle chatbot
chatbotButton.addEventListener('click', () => {
    chatbotWindow.style.display = 'flex';
    chatbotButton.style.display = 'none';
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.style.display = 'none';
    chatbotButton.style.display = 'flex';
});

// Quick button handler
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-btn')) {
        const question = e.target.getAttribute('data-question');
        handleUserMessage(knowledgeBase[question].question, question);
    }
});

// Send message on Enter key
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Send button handler
chatbotSend.addEventListener('click', sendMessage);

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    chatbotInput.value = '';

    // Process message
    processMessage(message);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';

    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);

    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Save to history
    chatHistory.push({ sender, text, timestamp: new Date() });
}

function handleUserMessage(userQuestion, key) {
    const data = knowledgeBase[key];

    addMessage(userQuestion, 'user');

    if (data.needsContact && !userDetails) {
        setTimeout(() => {
            addMessage("I'd love to help! To provide detailed information, may I have your name and email?", 'bot');
            setTimeout(() => {
                showContactForm();
            }, 500);
        }, 500);
    } else if (data.needsContact && userDetails) {
        setTimeout(() => {
            const detailedAnswer = getDetailedAnswer(key);
            addMessage(detailedAnswer, 'bot');
        }, 500);
    } else {
        setTimeout(() => {
            addMessage(data.answer, 'bot');
        }, 500);
    }
}

function processMessage(message) {
    const lowerMessage = message.toLowerCase();

    // Check for keywords
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
        handleUserMessage(message, 'pricing');
    } else if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('get started')) {
        handleUserMessage(message, 'get-started');
    } else if (lowerMessage.includes('service')) {
        handleUserMessage(message, 'services');
    } else if (lowerMessage.includes('chatbot') || lowerMessage.includes('bot')) {
        handleUserMessage(message, 'chatbot');
    } else if (lowerMessage.includes('automat')) {
        handleUserMessage(message, 'ai-automation');
    } else if (lowerMessage.includes('scrap') || lowerMessage.includes('data')) {
        handleUserMessage(message, 'web-scraping');
    } else {
        setTimeout(() => {
            addMessage("That's a great question! Our team can provide detailed information. Would you like to share your contact details so we can assist you better?", 'bot');
            setTimeout(() => {
                showContactForm();
            }, 500);
        }, 500);
    }
}

function showContactForm() {
    const formHTML = `
        <div class="contact-capture-form" style="margin-top: 10px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px;">
            <input type="text" id="chat-name" placeholder="Your Name" style="width: 100%; padding: 10px; margin-bottom: 10px; background: rgba(26,26,26,0.8); border: 1px solid #D4AF37; border-radius: 5px; color: white;">
            <input type="email" id="chat-email" placeholder="Your Email" style="width: 100%; padding: 10px; margin-bottom: 10px; background: rgba(26,26,26,0.8); border: 1px solid #D4AF37; border-radius: 5px; color: white;">
            <input type="tel" id="chat-phone" placeholder="Phone (Optional)" style="width: 100%; padding: 10px; margin-bottom: 10px; background: rgba(26,26,26,0.8); border: 1px solid #D4AF37; border-radius: 5px; color: white;">
            <button id="submit-contact" style="width: 100%; padding: 10px; background: #D4AF37; color: black; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Submit</button>
        </div>
    `;

    const formDiv = document.createElement('div');
    formDiv.className = 'bot-message';
    formDiv.innerHTML = formHTML;
    chatbotMessages.appendChild(formDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    document.getElementById('submit-contact').addEventListener('click', submitContactDetails);
}

function submitContactDetails() {
    const name = document.getElementById('chat-name').value.trim();
    const email = document.getElementById('chat-email').value.trim();
    const phone = document.getElementById('chat-phone').value.trim();

    if (!name || !email) {
        alert('Please provide your name and email');
        return;
    }

    userDetails = { name, email, phone };

    // Save to Google Sheets (Chatbot_Leads)
    saveChatbotLead();

    setTimeout(() => {
        addMessage(`Thank you, ${name}! I can now provide you with detailed information. What would you like to know?`, 'bot');
    }, 500);
}

function saveChatbotLead() {
    // Google Sheets Web App URL - YOU NEED TO REPLACE THIS
    const CHATBOT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxEaxCbWp2l8G3t9hchWEFIEavjSgkVfgU-oYhOxNrfnLDtK1I1SpbY-2PduLCU_N3X2w/exec';

    const data = {
        timestamp: new Date().toISOString(),
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone || 'N/A',
        initial_question: chatHistory[0]?.text || 'N/A',
        chat_history: JSON.stringify(chatHistory)
    };

    fetch(CHATBOT_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(err => console.error('Chatbot lead save error:', err));
}

function getDetailedAnswer(key) {
    const answers = {
        'pricing': `Great! Our pricing is flexible and depends on your specific needs. For AI Automation projects, we typically start at ₹50,000. For websites, it ranges from ₹30,000 to ₹2,00,000 depending on complexity. Let's schedule a call to discuss your requirements in detail!`,
        'get-started': `Excellent! Here's how we'll get started:\n1. We'll schedule a free consultation call\n2. Discuss your requirements and goals\n3. Provide a detailed proposal with timeline\n4. Begin development once approved\n\nOur team will reach out to you within 24 hours at ${userDetails.email}!`,
        'custom-project': `Perfect! For custom projects, we follow an agile approach. We'll work closely with you to understand your vision, create a roadmap, and deliver in iterations. Our team will contact you shortly to discuss your project requirements!`
    };

    return answers[key] || "Our team will reach out to you with detailed information shortly!";
}


