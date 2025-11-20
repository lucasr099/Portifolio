document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.querySelector('.chat-button');
    const chatbox = document.getElementById('chatbox');
    const messages = document.getElementById('bot-messages');
    const input = document.getElementById('bot-input');
    const send = document.getElementById('bot-send');

    chatButton.addEventListener('click', () => {
        chatbox.style.display = chatbox.style.display === "flex" ? "none" : "flex";
    });

    send.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => { if(e.key === 'Enter') sendMessage(); });

    function sendMessage() {
        const text = input.value.trim();
        if(!text) return;
        addMessage(text, 'user');
        input.value = '';

        // Chamadas para backend aqui (ainda não precisa)
    }

    function addMessage(text, type){
        const div = document.createElement('div');
        div.className = 'msg ' + type;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
});
