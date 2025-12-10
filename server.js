// Estado da aplicação
let currentTipo = 'laudes';
let currentData = new Date().toISOString().split('T')[0];

// Elementos DOM
const loadingElement = document.getElementById('loading');
const liturgiaContainer = document.getElementById('liturgia-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const dataAtual = document.getElementById('data-atual');
const tempoLiturgico = document.getElementById('tempo-liturgico');
const navButtons = document.querySelectorAll('.nav-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando aplicação...');
    console.log('Elementos encontrados:');
    console.log('- loadingElement:', document.getElementById('loading'));
    console.log('- liturgiaContainer:', document.getElementById('liturgia-container'));
    console.log('- errorContainer:', document.getElementById('error-container'));
    initApp();
});

function initApp() {
    updateDataDisplay();
    setupEventListeners();
    setupNavigationButtons();
    loadLiturgia(currentTipo);
}

// Configurar os botões de navegação
function setupNavigationButtons() {
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tipo = this.dataset.tipo;
            if (tipo !== currentTipo) {
                // Remover classe active de todos os botões
                navButtons.forEach(b => b.classList.remove('active'));
                // Adicionar classe active ao botão clicado
                this.classList.add('active');
                
                currentTipo = tipo;
                loadLiturgia(currentTipo);
            }
        });
    });
}

function updateDataDisplay() {
    const hoje = new Date();
    const opcoes = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'America/Sao_Paulo'
    };
    
    if (dataAtual) {
        dataAtual.textContent = hoje.toLocaleDateString('pt-BR', opcoes);
    }
}

function setupEventListeners() {
    // Botões de navegação
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tipo = btn.dataset.tipo;
            if (tipo && tipo !== currentTipo) {
                setActiveButton(btn);
                currentTipo = tipo;
                loadLiturgia(tipo);
            }
        });
    });
    
    // Botão retry
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            loadLiturgia(currentTipo);
        });
    }
}

function setActiveButton(activeBtn) {
    navButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function showLoading() {
    if (loadingElement) {
        loadingElement.style.display = 'block';
        loadingElement.classList.add('show');
    }
    if (liturgiaContainer) liturgiaContainer.style.display = 'none';
    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.classList.remove('show');
    }
}

function hideLoading() {
    if (loadingElement) {
        loadingElement.style.display = 'none';
        loadingElement.classList.remove('show');
    }
}

function showContent() {
    if (liturgiaContainer) liturgiaContainer.style.display = 'block';
    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.classList.remove('show');
    }
    hideLoading();
}

function showError(message) {
    if (errorMessage) errorMessage.textContent = message;
    if (errorContainer) {
        errorContainer.style.display = 'block';
        errorContainer.classList.add('show');
    }
    if (liturgiaContainer) liturgiaContainer.style.display = 'none';
    hideLoading();
}

async function loadLiturgia(tipo) {
    console.log('=== INICIO loadLiturgia ===');
    showLoading();
    
    try {
        console.log(`Carregando ${tipo} para ${currentData}...`);
        
        const url = `/api/liturgia?tipo=${tipo}&data=${currentData}`;
        console.log('URL da requisição:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        if (data.erro) {
            throw new Error(data.mensagem || 'Erro desconhecido');
        }
        
        console.log('Chamando displayLiturgia...');
        displayLiturgia(data);
        console.log('Chamando showContent...');
        showContent();
        
    } catch (error) {
        console.error('Erro ao carregar liturgia:', error);
        showError(`Não foi possível carregar a liturgia: ${error.message}`);
    }
    
    hideLoading();
    console.log('=== FIM loadLiturgia ===');
}

function displayLiturgia(data) {
    const { conteudo, tipo } = data;
    
    console.log('Exibindo liturgia:', conteudo);
    
    // Limpar container
    if (liturgiaContainer) {
        liturgiaContainer.innerHTML = '';
    } else {
        console.error('Container da liturgia não encontrado');
        return;
    }
    
    // Criar título principal
    const titleElement = document.createElement('h1');
    titleElement.className = 'liturgia-title';
    titleElement.textContent = conteudo.titulo || 'Laudes';
    liturgiaContainer.appendChild(titleElement);
    
    // Verificar se há texto completo
    if (!conteudo.texto_completo) {
        const noContentElement = document.createElement('div');
        noContentElement.className = 'liturgia-section';
        noContentElement.innerHTML = `
            <div class="section-title">Conteúdo não disponível</div>
            <div class="section-content">
                Não foi possível carregar o conteúdo da liturgia.
            </div>
        `;
        liturgiaContainer.appendChild(noContentElement);
        return;
    }
    
    // Exibir o texto completo
    const contentElement = document.createElement('div');
    contentElement.className = 'liturgia-section';
    
    // Converter quebras de linha em elementos HTML
    const textoFormatado = conteudo.texto_completo
        .replace(/\n/g, '<br>')
        .replace(/\r/g, '');
    
    contentElement.innerHTML = `
        <div class="section-content" style="white-space: pre-line; line-height: 1.6;">
            ${textoFormatado}
        </div>
    `;
    
    liturgiaContainer.appendChild(contentElement);
}

// Utilidades
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}

// Executar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
