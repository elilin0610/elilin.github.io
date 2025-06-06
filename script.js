document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const groqApiKey = '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'; // 請在此處填入您的 Groq API 金鑰

    async function sendMessageToGroq(message) {
        if (!groqApiKey) {
            appendMessage('請先在此頁面的 JavaScript 程式碼中設定您的 Groq API 金鑰。', 'assistant');
            return;
        }

        appendMessage(message, 'user');
        userInput.value = '';

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    model: 'llama-3.3-70b-versatile'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Groq API 錯誤:', errorData);
                appendMessage(`API 錯誤: ${errorData.error?.message || response.statusText}`, 'assistant');
                return;
            }

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                const assistantMessage = data.choices[0].message.content;
                appendMessage(assistantMessage, 'assistant');
            } else {
                appendMessage('抱歉，我沒有得到回應。', 'assistant');
            }
        } catch (error) {
            console.error('與 Groq API 通訊時發生錯誤:', error);
            appendMessage('抱歉，與伺服器通訊時發生問題。', 'assistant');
        }
    }

    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessageToGroq(message);
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                sendMessageToGroq(message);
            }
        }
    });
});