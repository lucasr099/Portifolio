
const API_URL = "https://port.squareweb.app/ai/gerar-resposta";
let backendOnline = true; // controla fallback automático



const dadosLucas = {
    apresentacao: "Olá! Sou a assistente virtual de Lucas Costa, utilizando Inteligência Artificial.",
    
    perguntaInicial: "O que você deseja saber?",
    
    sobre: "Lucas Costa é um desenvolvedor backend especializado em Java e Python, com foco em APIs robustas, escaláveis e organizadas com padrões profissionais.",

    formacao: "Lucas está cursando Engenharia de Software na Anhanguera, com previsão de conclusão em 05/2027. Estuda diariamente backend avançado, arquitetura e boas práticas.",

    experiencia: 
        "Possui experiência real em Java com Spring Boot, Python (Flask/Selenium), MySQL, PostgreSQL, SQLite, JPA, Hibernate, Git e MongoDB. " +
        "Trabalha com criação de APIs REST, integrações, automações e sistemas completos.",

    projetos: [
        {
            nome: "Golden Placa",
            desc: "Sistema completo usando Python + Flask + SQLite, com login, posts, autenticação e design moderno."
        },
        {
            nome: "Bot Selenium",
            desc: "Automação profissional usando Python + Selenium WebDriver para tarefas repetitivas."
        },
        {
            nome: "API Java Spring",
            desc: "API REST completa com CRUD, autenticação, serviços, repositórios e documentação."
        },
        {
            nome: "Web Integrations",
            desc: "Microprojetos de integração com APIs externas, rotas otimizadas e utilidades backend."
        }
    ]
};


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


// =========================================
// FALLBACK LOCAL
// =========================================
function respostaOffline(tipo) {
    if (tipo === "projetos") {
        return dadosLucas.projetos
            .map(p => `• <strong>${p.nome}</strong>: ${p.desc}`)
            .join("<br>");
    }
    return dadosLucas[tipo];
}


// =========================================
// TENTATIVA DE USAR O BACKEND
// =========================================
async function chamarBackend(texto) {
    if (!backendOnline) return null; // NÃO tenta mais se já caiu uma vez

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensagem: texto })
        });

        if (!res.ok) throw new Error("Erro no backend");

        const data = await res.json();

        // se backend respondeu vazio ou sem IA configurada
        if (!data || !data.resposta) {
            backendOnline = false;
            return null;
        }

        return data.resposta;

    } catch (error) {
        backendOnline = false; // MARCA COMO OFFLINE
        return null;
    }
}


// =========================================
// FLUXO PRINCIPAL
// =========================================

let apresentou = false;

function iniciarFluxo() {
    if (apresentou) return;
    apresentou = true;

    appendMessage("IA", dadosLucas.apresentacao);

    setTimeout(() => {
        appendMessage("IA", dadosLucas.perguntaInicial);
        mostrarTopicos();
    }, 500);
}

function mostrarTopicos() {
    appendOptions([
        { label: "Sobre Lucas", onClick: () => mostrarInfo("sobre") },
        { label: "Formação", onClick: () => mostrarInfo("formacao") },
        { label: "Experiência", onClick: () => mostrarInfo("experiencia") },
        { label: "Projetos", onClick: () => mostrarInfo("projetos") }
    ]);
}

async function mostrarInfo(tipo) {
    appendMessage("IA", "Buscando informações...");

    let respostaFinal = null;

    if (backendOnline) respostaFinal = await chamarBackend(tipo);

    // remove "Buscando..."
    document.getElementById("chat-output").lastChild.remove();

    if (!respostaFinal) respostaFinal = respostaOffline(tipo);

    appendMessage("IA", respostaFinal);

    setTimeout(() => {
        appendMessage("IA", "Deseja saber mais alguma coisa?");
        mostrarTopicos();
    }, 400);
}


// =========================================
// ENVIO DO USUÁRIO
// =========================================
function sendUserInput() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (text === "") return;

    appendMessage("Você", text);
    input.value = "";

    iniciarFluxo(); // inicia apresentação automática
}


// =========================================
// CONTROLE DO CHATBOT
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

        } else {
            chat.classList.add("hidden");
            chat.setAttribute("aria-hidden", "true");
        }
    });

    sendBtn.addEventListener("click", sendUserInput);

    document.getElementById("chat-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendUserInput();
    });
});
