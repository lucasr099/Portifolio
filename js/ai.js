// =========================================
// CONFIGURAÇÃO DO BACKEND
// =========================================
const API_URL = "https://port.squareweb.app";


// =========================================
// FUNÇÕES PARA MENSAGENS NO CHAT
// =========================================

function appendMessage(who, text) {
    const output = document.getElementById("chat-output");
    const msg = document.createElement("div");

    msg.style.margin = "8px 0";
    msg.innerHTML = `<strong>${who}:</strong> ${text}`;

    output.appendChild(msg);
    output.scrollTop = output.scrollHeight;
}

function appendOptions(options) {
    const output = document.getElementById("chat-output");

    const box = document.createElement("div");
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.gap = "6px";
    box.style.marginTop = "10px";

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt.label;

        btn.style.padding = "8px";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.border = "1px solid #0ef";
        btn.style.background = "#1f242d";
        btn.style.color = "#0ef";
        btn.style.fontSize = "14px";

        btn.addEventListener("click", () => {
            opt.onClick();
            box.remove();
        });

        box.appendChild(btn);
    });

    output.appendChild(box);
    output.scrollTop = output.scrollHeight;
}

function sendUserInput() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (text === "") return;

    appendMessage("Você", text);

    input.value = "";
    enviarParaBackend(text);
}


// =========================================
// ENVIO PARA O BACKEND
// =========================================

async function enviarParaBackend(text) {
    appendMessage("IA", "Digitando...");

    const prompt = `
Você é uma assistente profissional que responde exclusivamente sobre o desenvolvedor Lucas Costa. 
Sempre responda de forma educada, clara, técnica e com foco profissional.
Nunca diga que é uma IA; apenas responda.
Pergunta do recrutador: "${text}"
`;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mensagem: prompt
            })
        });

        const data = await res.json();

        // remove "Digitando..."
        const output = document.getElementById("chat-output");
        output.lastChild.remove();

        appendMessage("IA", data.resposta);

        perguntarMais();

    } catch (error) {
        appendMessage("IA", "Erro ao conectar com o servidor.");
    }
}


// =========================================
// FLUXO GUIADO
// =========================================

const respostasGuiadas = {
    sobre: "Sou Lucas Costa, desenvolvedor backend com foco forte em Java e Python. Crio APIs robustas, aplicações escaláveis e automações eficientes.",
    formacao: "Curso Análise e Desenvolvimento de Sistemas. Além disso, estudo diariamente conceitos avançados de backend e arquitetura.",
    tecnologias: "Java (Spring Boot), Python (Flask/Selenium), MySQL, PostgreSQL, SQLite, JPA/Hibernate, Git, Docker básico.",
    projetos: [
        {
            nome: "Golden Placa",
            descricao: "Aplicação completa em Python + Flask + SQLite. Inclui sistema de usuários, postagens, login e interface moderna."
        },
        {
            nome: "Bot Selenium",
            descricao: "Automação web avançada para tarefas repetitivas usando Python + Selenium WebDriver."
        },
        {
            nome: "API Java Spring",
            descricao: "API REST completa com autenticação, CRUD, serviços, repositórios e documentação."
        },
        {
            nome: "Web Integrations",
            descricao: "Integrações backend com APIs externas, rotas otimizadas e microprojetos utilitários."
        }
    ]
};

function iniciarChat() {
    appendMessage("IA", "Olá! Sou a assistente do Lucas. Quer conhecer mais sobre ele?");

    appendOptions([
        { label: "Sim", onClick: mostrarTopicos },
        { label: "Não", onClick: () => appendMessage("IA", "Tudo bem! Estou aqui se precisar.") }
    ]);
}

function mostrarTopicos() {
    appendMessage("IA", "Sobre o que você quer saber?");

    appendOptions([
        { label: "Sobre mim", onClick: () => { appendMessage("IA", respostasGuiadas.sobre); perguntarMais(); } },
        { label: "Formação", onClick: () => { appendMessage("IA", respostasGuiadas.formacao); perguntarMais(); } },
        { label: "Tecnologias", onClick: () => { appendMessage("IA", respostasGuiadas.tecnologias); perguntarMais(); } },
        { label: "Projetos", onClick: escolherProjeto }
    ]);
}

function escolherProjeto() {
    appendMessage("IA", "Escolha um dos projetos:");

    const botoes = respostasGuiadas.projetos.map(p => ({
        label: p.nome,
        onClick: () => {
            appendMessage("IA", p.descricao);
            perguntarMais();
        }
    }));

    botoes.push({ label: "Voltar", onClick: mostrarTopicos });

    appendOptions(botoes);
}

function perguntarMais() {
    appendOptions([
        { label: "Sim", onClick: mostrarTopicos },
        { label: "Não", onClick: () => appendMessage("IA", "Obrigado por visitar o portfólio do Lucas!") }
    ]);
}


// =========================================
// CONTROLE DO ROBÔ
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const bot = document.getElementById("ai-bot");
    const chat = document.getElementById("ai-chat");
    const sendBtn = document.getElementById("chat-send");

    bot.addEventListener("click", () => {
        const hidden = chat.classList.contains("hidden");

        if (hidden) {
            chat.classList.remove("hidden");
            chat.setAttribute("aria-hidden", "false");

            if (!chat.dataset.started) {
                iniciarChat();
                chat.dataset.started = "true";
            }

        } else {
            chat.classList.add("hidden");
            chat.setAttribute("aria-hidden", "true");
        }
    });

    sendBtn.addEventListener("click", sendUserInput);

    document.getElementById("chat-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendUserInput();
    });
    document.addEventListener("DOMContentLoaded", () => {
    const bot = document.getElementById("ai-bot");
    const chat = document.getElementById("ai-chat");
    const sendBtn = document.getElementById("chat-send");

    bot.addEventListener("click", () => {
        if (chat.classList.contains("hidden")) {
            chat.classList.remove("hidden");
            chat.setAttribute("aria-hidden", "false");

            if (!chat.dataset.started) {
                iniciarChat();
                chat.dataset.started = "true";
            }

        } else {
            chat.classList.add("hidden");
            chat.setAttribute("aria-hidden", "true");
        }
    });

    sendBtn.addEventListener("click", sendUserInput);

    document.getElementById("chat-input")
        .addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendUserInput();
        });
});

});



