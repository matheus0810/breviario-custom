const express = require('express');
const router = express.Router();

// Importar constantes
const {
    BASE_STYLES,
    BASE_SCRIPTS
} = require('./constants');

// Função auxiliar para construir navegação
function buildMainNav(activeSection = '') {
    const navSections = [
        { id: 'liturgia', label: 'Liturgia das Horas', href: '/liturgia' },
        { id: 'leituras', label: 'Leituras', href: '/' },
        { id: 'missa', label: 'Missa', href: '/missa' },
        { id: 'oracoes', label: 'Orações e Formação', href: '/oracoes' }
    ];

    return `
        <nav class="main-nav">
            <div class="nav-container">
                <a href="/" class="nav-brand">🙏 Breviário</a>
                <div class="collapse-area">
                    <button class="collapse-toggle" aria-expanded="false" aria-label="Abrir menu"></button>
                    <div class="collapse-menu" aria-hidden="true">
                        <ul>
                            ${navSections.map(section => `
                                <li><a href="${section.href}" class="nav-link ${section.id === activeSection ? 'active' : ''}">${section.label}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <ul class="nav-menu" id="nav-menu">
                    ${navSections.map(section => `
                        <li><a href="${section.href}" class="nav-link ${section.id === activeSection ? 'active' : ''}">${section.label}</a></li>
                    `).join('')}
                </ul>
            </div>
        </nav>
    `;
}

// Rota principal de orações - lista todas as orações disponíveis
router.get('/', (req, res) => {
    const nav = buildMainNav('oracoes');

    // Lista de orações disponíveis (exceto orações eucarísticas que estão na missa)
    const prayers = [
        { id: 'padre-nosso', title: 'Pai Nosso', category: 'Orações Básicas' },
        { id: 'ave-maria', title: 'Ave Maria', category: 'Orações Marianas' },
        { id: 'gloria', title: 'Glória', category: 'Orações de Louvor' },
        { id: 'credo', title: 'Credo', category: 'Profissão de Fé' },
        { id: 'angelus', title: 'Angelus', category: 'Orações Diárias' },
        { id: 'salve-rainha', title: 'Salve Rainha', category: 'Orações Marianas' },
        { id: 'magnificat', title: 'Magnificat', category: 'Cânticos Bíblicos' },
        { id: 'benedictus', title: 'Benedictus', category: 'Cânticos Bíblicos' },
        { id: 'nunc-dimittis', title: 'Nunc Dimittis', category: 'Cânticos Bíblicos' },
        { id: 'salmo-23', title: 'Salmo 23', category: 'Salmos' },
        { id: 'salmo-91', title: 'Salmo 91', category: 'Salmos' },
        { id: 'oracao-sao-francisco', title: 'Oração de São Francisco', category: 'Orações de Santos' },
        { id: 'oracao-santo-ignacio', title: 'Oração de Santo Inácio', category: 'Orações de Santos' },
        { id: 'oracao-manha', title: 'Oração da Manhã', category: 'Orações Diárias' },
        { id: 'oracao-noite', title: 'Oração da Noite', category: 'Orações Diárias' },
        { id: 'rosario', title: 'Terço (Rosário)', category: 'Terços e Devoções' },
        { id: 'terco-misericordia', title: 'Terço da Misericórdia', category: 'Terços e Devoções' },
        { id: 'vinde-espirito-santo', title: 'Invocação ao Espírito Santo', category: 'Orações ao Espírito Santo' },
        { id: 'anjo-da-guarda', title: 'Oração ao Anjo da Guarda', category: 'Orações Diárias' },
        { id: 'oracao-dificuldade', title: 'Oração em momentos difíceis', category: 'Orações para momentos especiais' },
        { id: 'oracao-por-alguem', title: 'Oração por alguém', category: 'Orações para momentos especiais' },
        { id: 'acao-de-gracas', title: 'Oração de ação de graças', category: 'Orações para momentos especiais' },
        { id: 'novena-espirito-santo', title: 'Novena ao Espírito Santo', category: 'Novenas' },
        { id: 'novena-natal', title: 'Novena de preparação para o Natal', category: 'Novenas' },
        { id: 'ato-de-contrição', title: 'Ato de Contrição', category: 'Orações de Penitência' },
        { id: '10-mandamentos', title: 'Os 10 Mandamentos', category: 'Formações Básicas' },
        { id: 'mandamentos-igreja', title: 'Mandamentos da Igreja', category: 'Formações Básicas' },
        { id: '7-sacramentos', title: 'Guia dos 7 Sacramentos', category: 'Formações Básicas' },
        { id: 'sintese-catecismo', title: 'Síntese do Catecismo', category: 'Formações Básicas' },
        { id: 'faq-da-fe', title: 'Dúvidas frequentes sobre a fé', category: 'Formações Básicas' },
        { id: 'dons-espirito-santo', title: 'Dons do Espírito Santo', category: 'Formações Básicas' },
        { id: 'bem-aventuranças', title: 'Bem-Aventuranças', category: 'Formações Básicas' },
        { id: 'credo-explicado', title: 'O Credo explicado', category: 'Formações Básicas' },
        { id: 'virtudes-e-obras-de-misericordia', title: 'Virtudes e obras de misericórdia', category: 'Formações Básicas' },
        { id: 'participar-da-missa', title: 'Como participar da Missa', category: 'Formações Básicas' },
        { id: 'tempos-liturgicos', title: 'Tempos litúrgicos', category: 'Formações Básicas' },
        { id: 'lectio-divina', title: 'Lectio divina', category: 'Formações Básicas' },
        { id: 'exame-de-consciencia', title: 'Exame de consciência', category: 'Formações Básicas' },
        { id: 'introducao-biblia', title: 'Introdução à Bíblia', category: 'Formações Básicas' }
    ];

    // Agrupar orações por categoria
    const categories = {};
    prayers.forEach(prayer => {
        if (!categories[prayer.category]) {
            categories[prayer.category] = [];
        }
        categories[prayer.category].push(prayer);
    });

    // Separar em Orações e Formação
    const prayerCategories = ['Orações Básicas', 'Orações Marianas', 'Terços e Devoções', 'Orações de Louvor', 'Orações ao Espírito Santo', 'Profissão de Fé', 'Orações Diárias', 'Orações para momentos especiais', 'Novenas', 'Cânticos Bíblicos', 'Salmos', 'Orações de Santos', 'Orações de Penitência'];
    const formationCategories = ['Formações Básicas'];
    const allCategories = [...new Set([...prayerCategories, ...formationCategories])].filter(category => categories[category]);
    const renderCards = (items, actionLabel) => items.map(prayer => `
        <div class="prayer-card" data-item-id="${prayer.id}" data-category="${prayer.category}" data-search="${`${prayer.title} ${prayer.category}`.toLocaleLowerCase('pt-BR')}">
            <button class="favorite-toggle" type="button" data-favorite-id="${prayer.id}" data-favorite-title="${prayer.title}" aria-label="Adicionar ${prayer.title} aos favoritos" aria-pressed="false" title="Adicionar aos favoritos">☆</button>
            <h3 class="prayer-title">${prayer.title}</h3>
            <a href="/oracoes/${prayer.id}" class="hour-btn">${actionLabel}</a>
        </div>
    `).join('');

    const prayerSections = prayerCategories.filter(cat => categories[cat]).map(category => `
        <div class="category-section">
            <h2 class="category-title">${category}</h2>
            <div class="prayers-grid">
                ${renderCards(categories[category], 'Ver Oração')}
            </div>
        </div>
    `).join('');

    const formationSections = formationCategories.filter(cat => categories[cat]).map(category => `
        <div class="category-section">
            <h2 class="category-title">${category}</h2>
            <div class="prayers-grid">
                ${renderCards(categories[category], 'Ver Formação')}
            </div>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>Orações e Formação - Breviário</title>
            <!-- Carregar CSS/JS do menu a partir de arquivos estáticos para consistência -->
            <style>${BASE_STYLES}</style>
            <link rel="stylesheet" href="/nav.css">
            <script src="/nav.js" defer></script>
            <style>
                body {
                    font-family: var(--site-font-family);
                }
                .section-title, .category-title, .prayer-title {
                    font-family: var(--site-font-family);
                }
                .section-title {
                    font-size: 2.8rem;
                    font-weight: 600;
                }
                .category-title {
                    font-size: 1.8rem;
                    font-weight: 600;
                }
                .tabs {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid var(--accent-color);
                }
                .tab-button {
                    background: none;
                    border: none;
                    padding: 15px 30px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s ease;
                    color: var(--text-color);
                }
                .tab-button.active {
                    color: var(--primary-color);
                    border-bottom-color: var(--primary-color);
                    font-weight: bold;
                }
                .tab-button:hover {
                    color: var(--primary-color);
                }
                .tab-content {
                    display: none;
                }
                .tab-content.active {
                    display: block;
                }
                .library-controls {
                    display: grid;
                    grid-template-columns: minmax(220px, 2fr) minmax(180px, 1fr) auto;
                    align-items: end;
                    gap: 12px;
                    margin: 0 0 24px;
                }
                .library-field {
                    display: grid;
                    gap: 6px;
                    color: var(--text-color);
                    font-weight: 600;
                }
                .library-field input, .library-field select {
                    min-height: 44px;
                    width: 100%;
                    padding: 9px 12px;
                    border: 1px solid var(--accent-color);
                    border-radius: 6px;
                    background: white;
                    color: var(--text-color);
                    font: inherit;
                }
                .favorites-filter, .favorite-toggle, .content-action {
                    min-height: 42px;
                    border: 1px solid var(--accent-color);
                    border-radius: 6px;
                    background: white;
                    color: var(--primary-color);
                    font: inherit;
                    cursor: pointer;
                }
                .favorites-filter {
                    padding: 8px 14px;
                }
                .favorites-filter[aria-pressed="true"] {
                    background: var(--primary-color);
                    color: white;
                }
                .filter-summary, .empty-state, .action-status {
                    color: var(--text-color);
                }
                .prayer-card {
                    position: relative;
                }
                .favorite-toggle {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 42px;
                    padding: 0;
                    font-size: 1.5rem;
                    line-height: 1;
                }
                .favorite-toggle[aria-pressed="true"] {
                    color: #9a5b00;
                }
                .category-section {
                    margin-bottom: 40px;
                }
                .category-title {
                    font-size: 1.5rem;
                    color: var(--primary-color);
                    margin-bottom: 20px;
                    text-align: center;
                    border-bottom: 1px solid var(--accent-color);
                    padding-bottom: 10px;
                }
                .prayers-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }
                .prayer-card {
                    background: white;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(139, 69, 19, 0.1);
                    border: 1px solid rgba(139, 69, 19, 0.05);
                    text-align: center;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .prayer-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(139, 69, 19, 0.15);
                }
                .prayer-title {
                    font-size: 1.5rem;
                    color: var(--primary-color);
                    margin: 0 30px 15px;
                    font-weight: 600;
                }
                @media (max-width: 768px) {
                    .section-title {
                        font-size: 2.35rem;
                    }
                    .library-controls {
                        grid-template-columns: 1fr;
                    }
                    .prayers-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            <script>
                function showTab(tabName) {
                    // Hide all tabs
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    // Remove active class from all buttons
                    document.querySelectorAll('.tab-button').forEach(button => {
                        button.classList.remove('active');
                    });
                    // Show selected tab
                    document.getElementById(tabName + '-tab').classList.add('active');
                    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
                    applyLibraryFilters();
                }

                const favoritesStorageKey = 'breviario-favoritos';
                function getFavoriteIds() {
                    try {
                        const stored = JSON.parse(localStorage.getItem(favoritesStorageKey) || '[]');
                        return Array.isArray(stored) ? stored : [];
                    } catch {
                        return [];
                    }
                }

                function updateFavoriteButtons() {
                    const favorites = new Set(getFavoriteIds());
                    document.querySelectorAll('[data-favorite-id]').forEach(button => {
                        const isFavorite = favorites.has(button.dataset.favoriteId);
                        button.textContent = isFavorite ? '★' : '☆';
                        button.setAttribute('aria-pressed', String(isFavorite));
                        button.setAttribute('aria-label', (isFavorite ? 'Remover ' : 'Adicionar ') + button.dataset.favoriteTitle + ' ' + (isFavorite ? 'dos' : 'aos') + ' favoritos');
                        button.title = isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
                    });
                }

                function normalizeSearch(value) {
                    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
                }

                function applyLibraryFilters() {
                    const search = normalizeSearch(document.getElementById('content-search').value.trim());
                    const category = document.getElementById('category-filter').value;
                    const favoritesOnly = document.getElementById('favorites-filter').getAttribute('aria-pressed') === 'true';
                    const favorites = new Set(getFavoriteIds());
                    document.querySelectorAll('.tab-content .prayer-card[data-item-id]').forEach(card => {
                        const matchesSearch = normalizeSearch(card.dataset.search).includes(search);
                        const matchesCategory = !category || card.dataset.category === category;
                        const matchesFavorite = !favoritesOnly || favorites.has(card.dataset.itemId);
                        card.hidden = !(matchesSearch && matchesCategory && matchesFavorite);
                    });
                    document.querySelectorAll('.tab-content').forEach(pane => {
                        pane.querySelectorAll('.category-section').forEach(section => {
                            section.hidden = !section.querySelector('.prayer-card[data-item-id]:not([hidden])');
                        });
                    });
                    const activePane = document.querySelector('.tab-content.active');
                    const visibleCount = activePane.querySelectorAll('.prayer-card[data-item-id]:not([hidden])').length;
                    document.getElementById('filter-summary').textContent = visibleCount + (visibleCount === 1 ? ' resultado' : ' resultados');
                    activePane.querySelector('.empty-state').hidden = visibleCount > 0;
                }

                document.addEventListener('click', event => {
                    const favoriteButton = event.target.closest('[data-favorite-id]');
                    if (favoriteButton) {
                        const favorites = new Set(getFavoriteIds());
                        if (favorites.has(favoriteButton.dataset.favoriteId)) {
                            favorites.delete(favoriteButton.dataset.favoriteId);
                        } else {
                            favorites.add(favoriteButton.dataset.favoriteId);
                        }
                        try {
                            localStorage.setItem(favoritesStorageKey, JSON.stringify([...favorites]));
                        } catch {
                            // A sessão ainda pode usar favoritos mesmo se o armazenamento estiver indisponível.
                        }
                        updateFavoriteButtons();
                        if (document.getElementById('content-search')) applyLibraryFilters();
                        return;
                    }

                    if (event.target.id === 'favorites-filter') {
                        const isPressed = event.target.getAttribute('aria-pressed') === 'true';
                        event.target.setAttribute('aria-pressed', String(!isPressed));
                        applyLibraryFilters();
                    }
                });

                // Show prayers tab by default
                document.addEventListener('DOMContentLoaded', function() {
                    document.getElementById('content-search').addEventListener('input', applyLibraryFilters);
                    document.getElementById('category-filter').addEventListener('change', applyLibraryFilters);
                    updateFavoriteButtons();
                    showTab('oracoes');
                });
            </script>
        </head>
        <body>
            ${nav}
            <div class="content">
                <h1 class="section-title">Orações e Formação</h1>
                <p class="rubrica">As Orações Eucarísticas estão disponíveis na seção <a href="/missa">Missa</a>.</p>
                
                <div class="tabs">
                    <button class="tab-button active" data-tab="oracoes" onclick="showTab('oracoes')">Orações</button>
                    <button class="tab-button" data-tab="formacao" onclick="showTab('formacao')">Formação</button>
                </div>

                <div class="library-controls" role="search">
                    <label class="library-field" for="content-search">Buscar por nome, tema ou ocasião
                        <input id="content-search" type="search" placeholder="Ex.: noite, misericórdia, Missa" autocomplete="off">
                    </label>
                    <label class="library-field" for="category-filter">Filtrar por tema ou ocasião
                        <select id="category-filter">
                            <option value="">Todos os temas</option>
                            ${allCategories.map(category => `<option value="${category}">${category}</option>`).join('')}
                        </select>
                    </label>
                    <button id="favorites-filter" class="favorites-filter" type="button" aria-pressed="false">★ Favoritos</button>
                </div>
                <p id="filter-summary" class="filter-summary" aria-live="polite"></p>
                
                <div id="oracoes-tab" class="tab-content">
                    ${prayerSections}
                    <p class="empty-state" hidden>Nenhum item encontrado. Ajuste a busca ou o filtro.</p>
                </div>
                
                <div id="formacao-tab" class="tab-content">
                    ${formationSections}
                    <p class="empty-state" hidden>Nenhum item encontrado. Ajuste a busca ou o filtro.</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Rota para oração específica
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const nav = buildMainNav('oracoes');
    const createFaqEntry = (id, question, keywords, shortAnswer, scripture, patristic, magisterium, quote, quoteSource, module) => ({
        id,
        question,
        keywords,
        shortAnswer,
        scripture,
        patristic,
        magisterium,
        quote,
        quoteSource,
        module
    });

    // Dados das orações básicas
    const prayersData = {
        'padre-nosso': {
            title: 'Pai Nosso',
            category: 'Orações Básicas',
            pt: [
                'Pai nosso que estais nos céus,',
                'santificado seja o vosso nome,',
                'venha a nós o vosso reino,',
                'seja feita a vossa vontade',
                'assim na terra como no céu.',
                'O pão nosso de cada dia nos dai hoje,',
                'perdoai-nos as nossas ofensas,',
                'assim como nós perdoamos a quem nos tem ofendido,',
                'e não nos deixeis cair em tentação,',
                'mas livrai-nos do mal.',
                'Amém.'
            ]
        },
        'ave-maria': {
            title: 'Ave Maria',
            category: 'Orações Marianas',
            pt: [
                'Ave Maria, cheia de graça, o Senhor é convosco.',
                'Bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus.',
                'Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte.',
                'Amém.'
            ]
        },
        'gloria': {
            title: 'Glória',
            category: 'Orações de Louvor',
            pt: [
                'Glória a Deus nas alturas',
                'e paz na terra aos homens por Ele amados.',
                'Senhor Deus, Rei dos céus,',
                'Deus Pai todo-poderoso.',
                'Nós Vos louvamos, nós Vos bendizemos,',
                'nós Vos adoramos, nós Vos glorificamos,',
                'nós Vos damos graças por vossa imensa glória.',
                'Senhor Jesus Cristo, Filho Unigênito,',
                'Senhor Deus, Cordeiro de Deus, Filho de Deus Pai.',
                'Vós que tirais o pecado do mundo, tende piedade de nós;',
                'Vós que tirais o pecado do mundo, acolhei a nossa súplica.',
                'Vós que estais à direita do Pai, tende piedade de nós.',
                'Só Vós sois o Santo, só Vós o Senhor,',
                'só Vós o Altíssimo Jesus Cristo,',
                'com o Espírito Santo, na glória de Deus Pai.',
                'Amém.'
            ]
        },
        'credo': {
            title: 'Credo',
            category: 'Profissão de Fé',
            pt: [
                'Creio em Deus Pai todo-poderoso,',
                'Criador do céu e da terra.',
                'Creio em Jesus Cristo, seu único Filho, nosso Senhor,',
                'que foi concebido pelo poder do Espírito Santo,',
                'nasceu da Virgem Maria,',
                'padeceu sob Pôncio Pilatos,',
                'foi crucificado, morto e sepultado.',
                'Desceu aos infernos,',
                'ressuscitou ao terceiro dia,',
                'subiu aos céus,',
                'está sentado à direita de Deus Pai todo-poderoso,',
                'donde há de vir a julgar os vivos e os mortos.',
                'Creio no Espírito Santo,',
                'na santa Igreja Católica,',
                'na comunhão dos santos,',
                'na remissão dos pecados,',
                'na ressurreição da carne,',
                'na vida eterna.',
                'Amém.'
            ]
        },
        'angelus': {
            title: 'Angelus',
            category: 'Orações Diárias',
            pt: [
                '℣. O Anjo do Senhor anunciou a Maria.',
                '℟. E ela concebeu do Espírito Santo.',
                '',
                'Ave Maria, cheia de graça, o Senhor é convosco.',
                'Bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus.',
                'Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte.',
                'Amém.',
                '',
                '℣. Eis aqui a escrava do Senhor.',
                '℟. Faça-se em mim segundo a vossa palavra.',
                '',
                'Ave Maria...',
                '',
                '℣. E o Verbo se fez carne.',
                '℟. E habitou entre nós.',
                '',
                'Ave Maria...',
                '',
                '℣. Rogai por nós, Santa Mãe de Deus.',
                '℟. Para que sejamos dignos das promessas de Cristo.',
                '',
                'Oremos:',
                'Infundi, Senhor, a vossa graça em nossas almas, para que nós, que pela anunciação do Anjo conhecemos a encarnação de Cristo, vosso Filho, cheguemos, pela sua paixão e cruz, à glória da ressurreição.',
                'Pelo mesmo Cristo, nosso Senhor.',
                'Amém.'
            ]
        },
        'salve-rainha': {
            title: 'Salve Rainha',
            category: 'Orações Marianas',
            pt: [
                'Salve, Rainha, Mãe de misericórdia,',
                'vida, doçura e esperança nossa, salve!',
                'A vós bradamos os degredados filhos de Eva.',
                'A vós suspiramos, gemendo e chorando neste vale de lágrimas.',
                'Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei.',
                'E depois deste desterro nos mostrai Jesus, bendito fruto do vosso ventre.',
                'Ó clemente, ó piedosa, ó doce Virgem Maria!',
                '',
                'Rogai por nós, santa Mãe de Deus,',
                'para que sejamos dignos das promessas de Cristo.',
                'Amém.'
            ]
        },
        'magnificat': {
            title: 'Magnificat',
            category: 'Cânticos Bíblicos',
            pt: [
                'A minha alma glorifica ao Senhor,',
                'e o meu espírito se regozija em Deus, meu Salvador,',
                'porque olhou para a humildade da sua serva.',
                'Doravante todas as gerações me chamarão bem-aventurada,',
                'porque o Todo-poderoso fez em mim grandes coisas.',
                'Santo é o seu nome.',
                'A sua misericórdia se estende de geração em geração',
                'sobre aqueles que o temem.',
                'Manifestou o poder do seu braço,',
                'dispersou os soberbos de coração.',
                'Derrubou os poderosos de seus tronos',
                'e exaltou os humildes.',
                'Encheu de bens os famintos',
                'e despediu os ricos de mãos vazias.',
                'Acolheu a Israel, seu servo,',
                'lembrado da sua misericórdia,',
                'como tinha prometido a nossos pais,',
                'a Abraão e à sua descendência para sempre.',
                'Glória ao Pai e ao Filho e ao Espírito Santo.',
                'Como era no princípio, agora e sempre. Amém.'
            ]
        },
        'benedictus': {
            title: 'Benedictus',
            category: 'Cânticos Bíblicos',
            pt: [
                'Bendito seja o Senhor Deus de Israel,',
                'porque visitou e resgatou o seu povo.',
                'E nos suscitou uma salvação poderosa',
                'na casa de Davi, seu servo,',
                'segundo o que tinha dito pela boca dos seus santos profetas',
                'desde os tempos antigos:',
                'salvação dos nossos inimigos',
                'e das mãos de todos os que nos odeiam.',
                'Para exercer misericórdia com nossos pais',
                'e recordar-se da sua santa aliança,',
                'do juramento que fez a Abraão, nosso pai,',
                'de conceder-nos que, libertados das mãos dos inimigos,',
                'o sirvamos sem temor,',
                'em santidade e justiça perante ele,',
                'todos os dias da nossa vida.',
                'E tu, menino, serás chamado profeta do Altíssimo,',
                'porque irás adiante do Senhor a preparar os seus caminhos,',
                'para dar ao seu povo conhecimento da salvação',
                'pela remissão dos seus pecados,',
                'graças à terna misericórdia do nosso Deus,',
                'pela qual nos visitará do alto uma luz,',
                'para alumiar os que jazem nas trevas e na sombra da morte,',
                'e dirigir os nossos pés pelo caminho da paz.',
                'Glória ao Pai e ao Filho e ao Espírito Santo.',
                'Como era no princípio, agora e sempre. Amém.'
            ]
        },
        'nunc-dimittis': {
            title: 'Nunc Dimittis',
            category: 'Cânticos Bíblicos',
            pt: [
                'Agora, Senhor, conforme a tua palavra,',
                'podes deixar o teu servo partir em paz;',
                'porque os meus olhos viram a tua salvação,',
                'que preparaste diante de todos os povos:',
                'luz para revelação aos gentios',
                'e glória do teu povo Israel.',
                'Glória ao Pai e ao Filho e ao Espírito Santo.',
                'Como era no princípio, agora e sempre. Amém.'
            ]
        },
        'salmo-23': {
            title: 'Salmo 23',
            category: 'Salmos',
            pt: [
                'O Senhor é o meu pastor: nada me faltará.',
                'Em verdes prados me faz repousar,',
                'para as águas tranquilas me conduz.',
                'Refrigera a minha alma;',
                'guia-me pelas veredas da justiça,',
                'por amor do seu nome.',
                'Ainda que eu caminhe pelo vale da sombra da morte,',
                'não temerei mal algum,',
                'porque tu estás comigo:',
                'o teu bordão e o teu cajado me consolam.',
                'Diante de mim preparas uma mesa,',
                'à vista dos meus inimigos;',
                'unges com óleo a minha cabeça,',
                'o meu cálice transborda.',
                'Certamente que a bondade e a misericórdia',
                'me seguirão todos os dias da minha vida;',
                'e habitarei na casa do Senhor',
                'por longos dias.'
            ]
        },
        'salmo-91': {
            title: 'Salmo 91',
            category: 'Salmos',
            pt: [
                'Aquele que habita no esconderijo do Altíssimo',
                'e descansa à sombra do Onipotente,',
                'diz ao Senhor: Meu refúgio e minha fortaleza,',
                'meu Deus, em quem confio.',
                'Porque ele te livrará do laço do passarinheiro',
                'e da peste perniciosa.',
                'Ele te cobrirá com as suas penas,',
                'e debaixo das suas asas estarás seguro;',
                'a sua verdade será o teu escudo e broquel.',
                'Não temerás os terrores da noite,',
                'nem a seta que voa de dia,',
                'nem a peste que anda na escuridão,',
                'nem a mortandade que assola ao meio-dia.',
                'Mil cairão ao teu lado,',
                'e dez mil à tua direita,',
                'mas não chegará a ti.',
                'Somente com os teus olhos contemplarás',
                'e verás a recompensa dos ímpios.',
                'Porque tu, ó Senhor, és o meu refúgio!',
                'No Altíssimo fizeste a tua habitação.',
                'Nenhum mal te sucederá,',
                'nem praga alguma chegará à tua tenda.',
                'Porque aos seus anjos dará ordem a teu respeito,',
                'para te guardarem em todos os teus caminhos.',
                'Eles te sustentarão nas suas mãos,',
                'para que não tropeces com o teu pé em pedra.',
                'Pisarás o leão e a áspide;',
                'calcarás aos pés o filho do leão e a serpente.',
                'Porquanto tão encarecidamente me amou,',
                'também eu o livrarei;',
                'pô-lo-ei em retiro alto,',
                'porque conheceu o meu nome.',
                'Ele me invocará, e eu lhe responderei;',
                'estarei com ele na angústia;',
                'livrá-lo-ei e o glorificarei.',
                'Dar-lhe-ei abundância de dias,',
                'e lhe mostrarei a minha salvação.'
            ]
        },
        'oracao-sao-francisco': {
            title: 'Oração de São Francisco',
            category: 'Orações de Santos',
            pt: [
                'Senhor, fazei-me instrumento da vossa paz.',
                'Onde houver ódio, que eu leve o amor.',
                'Onde houver ofensa, que eu leve o perdão.',
                'Onde houver discórdia, que eu leve a união.',
                'Onde houver dúvida, que eu leve a fé.',
                'Onde houver erro, que eu leve a verdade.',
                'Onde houver desespero, que eu leve a esperança.',
                'Onde houver trevas, que eu leve a luz.',
                'Onde houver tristeza, que eu leve a alegria.',
                'Ó Mestre, fazei que eu procure mais',
                'consolar, que ser consolado;',
                'compreender, que ser compreendido;',
                'amar, que ser amado.',
                'Pois é dando que se recebe,',
                'é perdoando que se é perdoado,',
                'é morrendo que se vive para a vida eterna.',
                'Amém.'
            ]
        },
        'oracao-santo-ignacio': {
            title: 'Oração de Santo Inácio',
            category: 'Orações de Santos',
            pt: [
                'Senhor meu Jesus Cristo,',
                'filho do Deus vivo,',
                'segundo a vontade do Pai',
                'e com a cooperação do Espírito Santo,',
                'que destes a vida a todas as coisas;',
                'e segundo a bondade de vossa providência',
                'me fizestes nascer do nada',
                'e me criastes à vossa imagem e semelhança;',
                'e quando eu me havia perdido',
                'pela minha culpa,',
                'não vos contentastes',
                'com me criar de novo',
                'pelo batismo na água,',
                'mas também na vossa preciosíssima sangue.',
                'E agora, Senhor,',
                'que é que quereis que eu faça?',
                'Ofereço-vos toda a minha liberdade,',
                'a minha memória, o meu entendimento',
                'e toda a minha vontade;',
                'tudo o que tenho e possuo.',
                'Tudo é vosso,',
                'disponde disso segundo a vossa vontade.',
                'Dai-me o amor e a graça,',
                'que isso me basta.',
                'Amém.'
            ]
        },
        'oracao-manha': {
            title: 'Oração da Manhã',
            category: 'Orações Diárias',
            pt: [
                'Senhor, ao despertar, dou-vos graças pela noite passada',
                'e pelo dia que começa.',
                'Acompanhai-me em minhas atividades,',
                'dai-me força para cumprir meus deveres',
                'e alegria para enfrentar as dificuldades.',
                'Guiai meus passos e minhas palavras,',
                'para que eu possa ser testemunha do vosso amor.',
                'Amém.'
            ]
        },
        'oracao-noite': {
            title: 'Oração da Noite',
            category: 'Orações Diárias',
            pt: [
                'Senhor, ao deitar-me, entrego-me em vossas mãos.',
                'Perdoai os pecados do dia que passou',
                'e protegei-me durante a noite.',
                'Dai-me um sono tranquilo e reparador,',
                'para que eu possa acordar renovado',
                'e pronto para servir-vos no novo dia.',
                'Amém.'
            ]
        },
        'rosario': {
            title: 'Terço (Rosário)',
            category: 'Terços e Devoções',
            pt: [
                'O Rosário é uma oração de contemplação dos mistérios da vida de Jesus e de Maria. A cada dia, tradicionalmente, contemplam-se estes mistérios:',
                'Segunda-feira e sábado: mistérios gozosos — Anunciação do Anjo a Maria; Visitação de Maria a Isabel; nascimento de Jesus; apresentação de Jesus no Templo; encontro do Menino Jesus no Templo.',
                'Terça-feira e sexta-feira: mistérios dolorosos — agonia de Jesus no Horto; flagelação; coroação de espinhos; Jesus carrega a cruz; crucifixão e morte.',
                'Quarta-feira e domingo: mistérios gloriosos — Ressurreição de Jesus; Ascensão; vinda do Espírito Santo; Assunção de Maria; coroação de Maria como Rainha do Céu e da Terra.',
                'Quinta-feira: mistérios luminosos — Batismo de Jesus no Jordão; bodas de Caná; anúncio do Reino de Deus; Transfiguração; instituição da Eucaristia.',
                'Como rezar: faça o sinal da cruz e reze o Credo, um Pai-Nosso, três Ave-Marias e um Glória. Anuncie o primeiro mistério e reze um Pai-Nosso; em seguida, dez Ave-Marias meditando o mistério e um Glória. Repita para os cinco mistérios do dia e conclua com a Salve-Rainha.',
                'As orações do Pai-Nosso, da Ave-Maria, do Glória, do Credo e da Salve-Rainha estão disponíveis nesta seção.'
            ]
        },
        'terco-misericordia': {
            title: 'Terço da Misericórdia',
            category: 'Terços e Devoções',
            pt: [
                'Inicie com o sinal da cruz e reze um Pai-Nosso, uma Ave-Maria e o Credo.',
                'Nas contas grandes, reze: Eterno Pai, eu vos ofereço o Corpo e o Sangue, a Alma e a Divindade de vosso diletíssimo Filho, nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos pecados do mundo inteiro.',
                'Nas contas pequenas, reze dez vezes: Pela sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro.',
                'Repita a sequência nas cinco dezenas do terço.',
                'Ao final, reze três vezes: Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro.',
                'Conclua com o sinal da cruz.'
            ]
        },
        'vinde-espirito-santo': {
            title: 'Invocação ao Espírito Santo',
            category: 'Orações ao Espírito Santo',
            pt: [
                'Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.',
                'Enviai o vosso Espírito e tudo será criado, e renovareis a face da terra.',
                'Oremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre de sua consolação. Por Cristo, nosso Senhor. Amém.'
            ]
        },
        'anjo-da-guarda': {
            title: 'Oração ao Anjo da Guarda',
            category: 'Orações Diárias',
            pt: [
                'Santo Anjo do Senhor, meu zeloso guardador,',
                'se a ti me confiou a piedade divina,',
                'sempre me rege, guarda, governa e ilumina. Amém.'
            ]
        },
        'oracao-dificuldade': {
            title: 'Oração em momentos difíceis',
            category: 'Orações para momentos especiais',
            pt: [
                'Senhor, neste momento de dificuldade, acolhei minhas preocupações e dai-me serenidade para atravessar esta situação.',
                'Iluminai minhas decisões, fortalecei minha esperança e ajudai-me a reconhecer o apoio de quem caminha comigo.',
                'Concedei-me coragem para fazer o que está ao meu alcance e confiança para entregar a vós aquilo que não posso controlar. Amém.'
            ]
        },
        'oracao-por-alguem': {
            title: 'Oração por alguém',
            category: 'Orações para momentos especiais',
            pt: [
                'Deus de bondade, hoje vos apresento [nome da pessoa].',
                'Acompanhai esta pessoa em suas necessidades, concedei-lhe força, consolo e esperança, e colocai em seu caminho pessoas dispostas a ajudar.',
                'Ensinai-me também a oferecer apoio com respeito, presença e caridade. Por Cristo, nosso Senhor. Amém.'
            ]
        },
        'acao-de-gracas': {
            title: 'Oração de ação de graças',
            category: 'Orações para momentos especiais',
            pt: [
                'Senhor, eu vos agradeço pelos dons recebidos, pelas pessoas que caminham comigo e por todo bem que hoje pude reconhecer.',
                'Ajudai-me a acolher com humildade as alegrias e os desafios, e a transformar minha gratidão em cuidado e generosidade para com os outros.',
                'Bendito sejais por vosso amor e vossa presença em minha vida. Amém.'
            ]
        },
        'novena-espirito-santo': {
            title: 'Novena ao Espírito Santo',
            category: 'Novenas',
            pt: [
                'Este roteiro sugerido pode ser rezado durante nove dias, especialmente como preparação para Pentecostes. Em cada dia, faça o sinal da cruz, leia a passagem bíblica, apresente sua intenção e reze a invocação ao Espírito Santo disponível nesta seção.',
                '1º dia — A promessa do Espírito: João 14, 15-17. Peça abertura para acolher a presença de Deus.',
                '2º dia — Sabedoria: Isaías 11, 1-2. Peça ajuda para escolher o bem e ver a vida à luz de Deus.',
                '3º dia — Entendimento: Lucas 24, 44-49. Peça compreensão mais profunda da Palavra.',
                '4º dia — Conselho: João 16, 12-15. Peça discernimento para suas decisões.',
                '5º dia — Fortaleza: Atos 4, 23-31. Peça coragem para testemunhar e perseverar no bem.',
                '6º dia — Ciência: Salmo 104(103), 24-30. Peça um olhar agradecido sobre a criação e a vida.',
                '7º dia — Piedade: Romanos 8, 14-17. Peça confiança filial e vida de oração.',
                '8º dia — Temor de Deus: Provérbios 9, 10. Peça reverência e fidelidade a Deus.',
                '9º dia — Os dons e a missão: Atos 2, 1-11. Peça os dons do Espírito e unidade para servir.'
            ]
        },
        'novena-natal': {
            title: 'Novena de preparação para o Natal',
            category: 'Novenas',
            pt: [
                'Este roteiro sugerido percorre nove passagens bíblicas sobre a vinda de Jesus. Reze um dia por vez, de preferência nos nove dias que antecedem o Natal. Comece com o sinal da cruz, leia a passagem, faça sua oração e conclua com um Pai-Nosso.',
                '1º dia — A promessa do Salvador: Isaías 9, 1-6.',
                '2º dia — O anúncio a Zacarias: Lucas 1, 5-17.',
                '3º dia — O anúncio a Maria: Lucas 1, 26-38.',
                '4º dia — A visita a Isabel: Lucas 1, 39-45.',
                '5º dia — O cântico de Maria: Lucas 1, 46-55.',
                '6º dia — O nascimento de João Batista: Lucas 1, 57-66.',
                '7º dia — A viagem a Belém: Lucas 2, 1-5.',
                '8º dia — O nascimento de Jesus: Lucas 2, 6-14.',
                '9º dia — Os pastores encontram o Menino: Lucas 2, 15-20.'
            ]
        },
        'ato-de-contrição': {
            title: 'Ato de Contrição',
            category: 'Orações de Penitência',
            pt: [
                'Meu Deus,',
                'peço humildemente perdão de todos os meus pecados',
                'e detesto-os de todo o coração,',
                'porque pecando ofendi a Vós,',
                'que sois tão bom e tão digno de ser amado.',
                'Proponho firmemente,',
                'com a vossa graça,',
                'não mais pecar e fugir das ocasiões de pecado.',
                'Senhor, misericórdia,',
                'perdoai-me.',
                'Amém.'
            ]
        },
        '10-mandamentos': {
            title: 'Os 10 Mandamentos',
            category: 'Formações Básicas',
            pt: [
                '1. Amar a Deus sobre todas as coisas.',
                '2. Não tomar o nome de Deus em vão.',
                '3. Santificar as festas.',
                '4. Honrar pai e mãe.',
                '5. Não matar.',
                '6. Não cometer adultério.',
                '7. Não furtar.',
                '8. Não levantar falso testemunho.',
                '9. Não desejar a mulher do próximo.',
                '10. Não cobiçar os bens alheios.'
            ]
        },
        'mandamentos-igreja': {
            title: 'Mandamentos da Igreja',
            category: 'Formações Básicas',
            pt: [
                '1. Participar da missa aos domingos e dias santos de obrigação.',
                '2. Confessar os pecados graves ao menos uma vez por ano.',
                '3. Receber a Sagrada Comunhão ao menos na Páscoa.',
                '4. Jejuar e abster-se de carne quando ordenado pela Igreja.',
                '5. Ajudar a Igreja nas suas necessidades.'
            ]
        },
        '7-sacramentos': {
            title: 'Guia dos 7 Sacramentos',
            category: 'Formações Básicas',
            pt: ['Os sacramentos são sinais eficazes da graça, instituídos por Cristo e confiados à Igreja. Este guia resume seu sentido e sua celebração; a preparação concreta deve ser feita com a comunidade e seus responsáveis pastorais (CIC 1113-1134).'],
            sections: [
                {
                    title: 'Batismo',
                    details: [
                        ['Significado', 'Inicia a vida cristã, une a pessoa a Cristo, incorpora-a à Igreja e concede o perdão dos pecados.'],
                        ['Preparação e requisitos', 'Quem ainda não foi batizado pode recebê-lo. Adultos passam por preparação catequética; no batismo de crianças, os pais e padrinhos assumem o compromisso de educá-las na fé.'],
                        ['Rito', 'A água é derramada ou a pessoa é imersa, enquanto o ministro pronuncia a fórmula batismal trinitária; seguem-se sinais como a unção e a veste branca.'],
                        ['Importância pastoral', 'Toda a comunidade é chamada a acolher o batizado e a ajudá-lo a crescer na fé.']
                    ],
                    reference: 'CIC 1213-1284.'
                },
                {
                    title: 'Crisma ou Confirmação',
                    details: [
                        ['Significado', 'Aprofunda a graça batismal e fortalece a união com a Igreja e a missão cristã pelo dom do Espírito Santo.'],
                        ['Preparação e requisitos', 'É recebida por pessoa batizada que ainda não foi confirmada, após preparação adequada e discernimento pastoral; as normas concretas seguem a disciplina da Igreja local.'],
                        ['Rito', 'O bispo, ou ministro autorizado, impõe as mãos e unge a fronte com o santo crisma, pronunciando a fórmula sacramental.'],
                        ['Importância pastoral', 'A comunidade acompanha o confirmado para que testemunhe a fé com responsabilidade e serviço.']
                    ],
                    reference: 'CIC 1285-1321.'
                },
                {
                    title: 'Eucaristia',
                    details: [
                        ['Significado', 'É memorial da Páscoa de Cristo e fonte e ápice da vida cristã; nela a Igreja celebra a presença real de Cristo.'],
                        ['Preparação e requisitos', 'A participação na Comunhão pressupõe batismo e plena comunhão com a Igreja Católica. A pessoa deve estar devidamente disposta; quem tem consciência de pecado grave procura antes o sacramento da Reconciliação.'],
                        ['Rito', 'A Liturgia da Palavra conduz à Liturgia Eucarística, com apresentação das oferendas, oração eucarística, consagração e Comunhão.'],
                        ['Importância pastoral', 'A Eucaristia reúne a comunidade e envia os fiéis a viver a unidade e a caridade.']
                    ],
                    reference: 'CIC 1322-1419.'
                },
                {
                    title: 'Reconciliação ou Confissão',
                    details: [
                        ['Significado', 'Reconcilia com Deus e com a Igreja quem, após o Batismo, busca o perdão dos pecados.'],
                        ['Preparação e requisitos', 'A pessoa examina a consciência, manifesta arrependimento, confessa os pecados ao sacerdote e acolhe a penitência.'],
                        ['Rito', 'O sacerdote escuta a confissão, oferece orientação, propõe uma penitência e pronuncia a absolvição; o penitente procura cumprir a satisfação.'],
                        ['Importância pastoral', 'É caminho de conversão, reconciliação e recomeço, celebrado com respeito à consciência e à história de cada pessoa.']
                    ],
                    reference: 'CIC 1422-1498.'
                },
                {
                    title: 'Matrimônio',
                    details: [
                        ['Significado', 'É a aliança pela qual os cônjuges estabelecem entre si uma comunhão de vida, ordenada ao bem dos esposos e à geração e educação dos filhos.'],
                        ['Preparação e requisitos', 'Requer consentimento livre e válido, ausência de impedimentos e observância da forma canônica aplicável; a preparação é acompanhada pela pastoral da Igreja.'],
                        ['Rito', 'Os noivos manifestam e recebem o consentimento matrimonial diante da Igreja e das testemunhas, conforme o rito e as normas locais.'],
                        ['Importância pastoral', 'A comunidade apoia a vida familiar e acompanha os cônjuges na fidelidade, no cuidado mútuo e na educação dos filhos.']
                    ],
                    reference: 'CIC 1601-1666.'
                },
                {
                    title: 'Ordem',
                    details: [
                        ['Significado', 'É o sacramento do ministério apostólico, celebrado nos graus de episcopado, presbiterado e diaconado.'],
                        ['Preparação e requisitos', 'A admissão depende de discernimento, formação e requisitos estabelecidos pela Igreja; a ordenação válida é conferida a homem batizado.'],
                        ['Rito', 'O bispo impõe as mãos e pronuncia a oração consecratória própria do grau recebido.'],
                        ['Importância pastoral', 'Os ministros ordenados servem à comunhão e à missão da Igreja, cada qual segundo seu grau e encargo.']
                    ],
                    reference: 'CIC 1536-1600.'
                },
                {
                    title: 'Unção dos Enfermos',
                    details: [
                        ['Significado', 'Oferece a graça de Cristo para fortalecer, consolar e unir à sua Paixão quem enfrenta doença grave ou fragilidade da velhice. Não é apenas para os últimos instantes de vida.'],
                        ['Preparação e requisitos', 'Pode recebê-la o fiel que começa a estar em perigo por doença ou idade avançada; o sacramento pode ser repetido se a situação se agravar.'],
                        ['Rito', 'O sacerdote reza pela pessoa e unge sua fronte e suas mãos com o óleo próprio, conforme o rito da Igreja.'],
                        ['Importância pastoral', 'A comunidade é chamada a acompanhar a pessoa enferma com oração, presença e cuidado concreto.']
                    ],
                    reference: 'CIC 1499-1532.'
                }
            ]
        },
        'sintese-catecismo': {
            title: 'Síntese do Catecismo',
            category: 'Formações Básicas',
            pt: ['O Catecismo organiza a vida cristã em quatro partes interligadas: aquilo em que a Igreja crê, celebra, vive e reza. Esta síntese é um ponto de partida para a leitura, não substitui o texto integral.'],
            modules: [
                {
                    id: 'credo',
                    icon: '✦',
                    title: 'I. A fé professada',
                    subtitle: 'O Credo: o que cremos',
                    centralQuestion: 'Quem é Deus e o que Ele realizou por nós?',
                    cards: [
                        { title: 'Deus único e Trino', question: 'Como Deus pode ser um só e três Pessoas?', summary: 'Há um só Deus em três Pessoas realmente distintas: Pai, Filho e Espírito Santo. Não são três deuses nem três partes de Deus; cada Pessoa é plenamente o único Deus.', reference: 'CIC 232-267.', application: 'Faça o sinal da cruz com atenção e recorde que o Batismo nos introduz na vida do Pai, do Filho e do Espírito Santo.' },
                        { title: 'A criação e a queda', question: 'Se Deus criou tudo bom, de onde vem o mal?', summary: 'Deus criou livremente o mundo e o ser humano para o bem e a comunhão. O pecado entrou na história pelo mau uso da liberdade; o pecado original descreve uma condição herdada, não uma culpa pessoal cometida por cada criança.', reference: 'CIC 279-324 e 385-421.', application: 'Acolha a criação como dom e escolha uma atitude concreta de cuidado, responsabilidade e reparação do mal.' },
                        { title: 'A Encarnação e a Redenção', question: 'Por que o Filho de Deus se fez homem?', summary: 'Por amor e para nossa salvação, o Filho assumiu a natureza humana sem deixar de ser Deus. Sua Paixão e Morte revelam a entrega de Deus; sua Ressurreição vence a morte e sua Ascensão inaugura a glorificação da humanidade em Cristo.', reference: 'CIC 456-682.', application: 'Ao enfrentar sofrimento ou culpa, una sua oração à esperança pascal e procure também o apoio concreto de sua comunidade.' },
                        { title: 'A Santa Igreja', question: 'O que significa dizer que a Igreja é una, santa, católica e apostólica?', summary: 'A Igreja é una pela sua fonte e fé, santa porque Cristo a santifica, católica porque anuncia a fé inteira a todos e apostólica por sua origem e missão recebida dos Apóstolos. Em Cristo, seus membros formam um só Corpo; a comunhão dos santos une os fiéis na terra e no Céu.', reference: 'CIC 748-962.', application: 'Construa unidade sem apagar diferenças, participe da comunidade e transforme a comunhão em serviço ao próximo.' },
                        { title: 'Os Novíssimos', question: 'O que a fé cristã anuncia sobre a morte e o destino final?', summary: 'A Igreja ensina a ressurreição e o juízo: após a morte há juízo particular; no fim dos tempos, o juízo universal manifestará plenamente a justiça de Deus. Céu é comunhão definitiva com Deus; purgatório, purificação final dos que morrem em sua graça; inferno, separação definitiva escolhida pela rejeição de Deus.', reference: 'CIC 988-1060, especialmente 1021-1041.', application: 'Viva com esperança e responsabilidade hoje, rezando pelos falecidos e praticando obras de misericórdia.' }
                    ]
                },
                {
                    id: 'sacramentos',
                    icon: '◉',
                    title: 'II. A fé celebrada',
                    subtitle: 'Os sacramentos: como recebemos a graça',
                    centralQuestion: 'Como Cristo age na liturgia e nos sacramentos?',
                    cards: [
                        { title: 'Liturgia e ano litúrgico', question: 'Como o calendário da Igreja nos ajuda a viver o Evangelho?', summary: 'Ao longo do ano, a Igreja celebra os mistérios de Cristo: Advento e Natal, Quaresma e Páscoa, além do Tempo Comum. No rito romano, em geral, usa-se roxo no Advento e na Quaresma, branco ou dourado no Natal e na Páscoa, vermelho em celebrações da Paixão, dos mártires e de Pentecostes, e verde no Tempo Comum; há exceções e usos locais.', reference: 'CIC 1163-1173; Instrução Geral do Missal Romano (IGMR) 346.', application: 'Observe a cor e o tempo litúrgico da semana e escolha uma prática coerente: esperança, conversão, alegria pascal ou perseverança.' },
                        { title: 'Batismo', question: 'O que começa quando alguém é batizado?', summary: 'O Batismo é novo nascimento pela água e pelo Espírito, liberta do pecado, incorpora a pessoa a Cristo e à Igreja e é a porta dos demais sacramentos. Para adultos há preparação catequética; no caso de crianças, pais e padrinhos assumem o compromisso de educá-las na fé.', reference: 'CIC 1213-1284.', application: 'Recorde sua identidade batismal e pratique um gesto de acolhida a alguém que está começando na comunidade.' },
                        { title: 'Crisma ou Confirmação', question: 'O que o Espírito Santo fortalece na Confirmação?', summary: 'A Confirmação aprofunda a graça batismal. O bispo, ou ministro autorizado, impõe as mãos e unge com o santo crisma; o dom do Espírito fortalece para testemunhar e servir, não é uma garantia de maturidade automática.', reference: 'CIC 1285-1321.', application: 'Peça discernimento ao Espírito Santo antes de uma decisão e procure uma forma concreta de servir.' },
                        { title: 'Eucaristia', question: 'O que a Igreja celebra na Eucaristia?', summary: 'A Eucaristia é fonte e ápice da vida cristã: memorial da Páscoa e presença verdadeira, real e substancial de Cristo. Pela consagração, ocorre a mudança de toda a substância do pão e do vinho no Corpo e Sangue de Cristo, chamada transubstanciação.', reference: 'CIC 1322-1419, especialmente 1374-1377.', application: 'Na Missa, o único sacrifício de Cristo na Cruz torna-se presente sacramentalmente; não é repetido. Durante a oração eucarística, una sua vida à oferta de Cristo e, ao comungar, deixe que essa comunhão gere unidade, gratidão e cuidado com quem tem fome.' },
                        { title: 'Penitência ou Confissão', question: 'Como se preparar para uma boa confissão?', summary: 'No sacramento da Reconciliação, Deus oferece perdão e reconciliação a quem, batizado, se arrepende. Os passos incluem exame de consciência, contrição, confissão sincera, acolhida da absolvição e cumprimento da penitência; o sacerdote guarda sigilo absoluto.', reference: 'CIC 1422-1498.', application: 'Examine a consciência à luz do Evangelho, nomeie com sinceridade o que precisa mudar e procure um sacerdote quando estiver preparado.' },
                        { title: 'Unção dos Enfermos', question: 'A Unção é somente para os últimos momentos de vida?', summary: 'Não. Destina-se aos fiéis que começam a enfrentar perigo por doença grave ou idade avançada. A oração e a unção com o óleo fortalecem, consolam e podem unir a pessoa ao sofrimento de Cristo; não substituem tratamento médico.', reference: 'CIC 1499-1532.', application: 'Ofereça presença e escuta a uma pessoa enferma e, se ela desejar, ajude a contatar a comunidade e um sacerdote.' },
                        { title: 'Ordem', question: 'Quais são os graus do sacramento da Ordem?', summary: 'O ministério ordenado tem três graus: bispos, presbíteros e diáconos. Pela imposição das mãos e oração consecratória, recebem uma missão de serviço à Palavra, à liturgia e à comunhão da Igreja, cada qual segundo seu grau.', reference: 'CIC 1536-1600.', application: 'Reze pelos ministros ordenados e colabore com a missão comunitária por meio dos dons e vocações próprios de cada batizado.' },
                        { title: 'Matrimônio', question: 'O que os esposos prometem no Matrimônio?', summary: 'O consentimento livre dos esposos estabelece uma aliança fiel e indissolúvel, ordenada ao bem mútuo e aberta à acolhida e educação dos filhos. A preparação e a celebração seguem as normas da Igreja e requerem acompanhamento pastoral.', reference: 'CIC 1601-1666.', application: 'Fortaleça vínculos familiares com diálogo, fidelidade e cuidado; apoie famílias em situações de dificuldade sem julgamentos apressados.' }
                    ]
                },
                {
                    id: 'mandamentos',
                    icon: '⌁',
                    title: 'III. A fé vivida',
                    subtitle: 'Os mandamentos: como devemos agir',
                    centralQuestion: 'Como amar a Deus e ao próximo nas escolhas concretas?',
                    cards: [
                        { title: 'Dignidade, liberdade e consciência', question: 'Como tomar decisões morais responsáveis?', summary: 'Toda pessoa tem dignidade por ser criada à imagem de Deus. A liberdade permite escolher o bem e traz responsabilidade; a consciência precisa ser formada pela Palavra, pela razão e pelo ensinamento da Igreja. A responsabilidade pode diminuir por fatores como ignorância, medo ou sofrimento psíquico.', reference: 'CIC 1700-1802.', application: 'Antes de decidir, informe-se, examine suas motivações, considere quem será afetado e procure orientação confiável quando necessário.' },
                        { title: 'Virtudes e vícios', question: 'Como crescer no bem e reconhecer hábitos que nos afastam dele?', summary: 'Fé, esperança e caridade orientam para Deus; prudência, justiça, fortaleza e temperança ajudam a agir bem. A tradição identifica orgulho, avareza, inveja, ira, luxúria, gula e preguiça ou acídia como vícios capitais, pois alimentam outros pecados.', reference: 'CIC 1803-1845 e 1866.', application: 'Escolha uma virtude para exercitar nesta semana e identifique um hábito que precisa de apoio, oração ou mudança concreta.' },
                        { title: '1º mandamento: amar a Deus', question: 'O que significa colocar Deus acima de tudo?', summary: 'O primeiro mandamento chama à fé, esperança e caridade e rejeita idolatria, superstição e práticas que tentam substituir a confiança em Deus.', reference: 'CIC 2084-2141.', application: 'Perceba o que ocupa o centro de suas decisões e reserve tempo real para oração, comunidade e serviço.' },
                        { title: '2º mandamento: respeitar o nome de Deus', question: 'Como usar o nome de Deus com reverência?', summary: 'O nome de Deus é santo. O mandamento pede respeito nas palavras e proíbe blasfêmia, falso juramento e usar a fé para legitimar mentira ou violência.', reference: 'CIC 2142-2167.', application: 'Evite usar linguagem religiosa para humilhar, manipular ou espalhar afirmações que não verificou.' },
                        { title: '3º mandamento: santificar o Dia do Senhor', question: 'Por que reservar o domingo?', summary: 'O domingo celebra a Ressurreição. A participação na Missa e o descanso favorecem culto, vida familiar, comunidade e renovação das forças.', reference: 'CIC 2168-2195.', application: 'Proteja um tempo dominical para a celebração, o descanso e a convivência, respeitando quem precisa trabalhar.' },
                        { title: '4º mandamento: honrar pai e mãe', question: 'Como viver o respeito nas relações familiares?', summary: 'O mandamento sustenta deveres de respeito, gratidão e cuidado nas relações entre filhos, pais, família, sociedade e autoridades legítimas; não justifica abuso nem elimina a dignidade e a responsabilidade pessoal.', reference: 'CIC 2197-2257.', application: 'Pratique escuta e cuidado nas relações, mantendo limites seguros diante de violência e buscando ajuda quando necessário.' },
                        { title: '5º mandamento: proteger a vida', question: 'Como defender a vida em situações de sofrimento?', summary: 'A vida humana deve ser protegida desde a concepção até a morte natural. O Catecismo trata aborto e eutanásia como graves atentados à vida; também reconhece que transtornos psíquicos graves podem diminuir a responsabilidade por suicídio. Isso exige cuidado, prevenção e compaixão, nunca estigma.', reference: 'CIC 2258-2330, especialmente 2270-2283.', application: 'Diante de risco de suicídio ou sofrimento intenso, acolha sem julgamento e procure imediatamente profissionais de saúde, serviços de emergência e pessoas de confiança.' },
                        { title: '6º mandamento: viver a sexualidade com dignidade', question: 'Como relacionar amor, corpo e responsabilidade?', summary: 'A sexualidade integra a pessoa e é chamada à dignidade, à fidelidade e ao amor responsável. O ensinamento aborda castidade conforme a vocação de cada pessoa e respeito mútuo no matrimônio.', reference: 'CIC 2331-2400.', application: 'Construa relações com consentimento, honestidade, respeito aos limites e responsabilidade afetiva.' },
                        { title: '7º mandamento: praticar a justiça', question: 'O que a fé pede no uso dos bens?', summary: 'O mandamento protege a propriedade legítima, mas exige justiça, honestidade nos contratos, cuidado com a criação e solidariedade. Os bens têm também uma destinação universal e devem servir ao bem comum.', reference: 'CIC 2401-2463.', application: 'Considere a origem do que compra, cumpra acordos e procure formas concretas de partilhar e combater a exploração.' },
                        { title: '8º mandamento: viver na verdade', question: 'Como comunicar a verdade com caridade?', summary: 'A verdade exige sinceridade, respeito à reputação e responsabilidade ao comunicar. Calúnia, difamação e divulgação irresponsável de informações ferem o próximo.', reference: 'CIC 2464-2513.', application: 'Antes de encaminhar uma notícia, verifique a fonte; nas conversas, corrija erros sem expor ou humilhar pessoas.' },
                        { title: '9º mandamento: guardar a pureza do coração', question: 'Como cultivar um olhar respeitoso?', summary: 'O mandamento chama à pureza de coração e combate a cobiça, que reduz o outro a objeto. A castidade integra desejos e escolhas no amor responsável.', reference: 'CIC 2514-2533.', application: 'Reveja hábitos de consumo de conteúdo e trate cada pessoa como sujeito de dignidade, nunca como objeto.' },
                        { title: '10º mandamento: combater a ganância', question: 'Como lidar com o desejo de possuir?', summary: 'O décimo mandamento combate a cobiça dos bens alheios e convida à simplicidade, à confiança em Deus e à generosidade. A acumulação indiferente à necessidade do próximo contradiz a justiça e a solidariedade.', reference: 'CIC 2534-2557.', application: 'Pratique gratidão, reveja um consumo desnecessário e apoie uma iniciativa que promova dignidade e justiça social.' },
                        { title: 'As Bem-Aventuranças', question: 'Qual é o retrato de vida feliz apresentado por Jesus?', summary: 'No Sermão da Montanha, Jesus chama felizes os pobres em espírito, os mansos, os misericordiosos, os que buscam a justiça e os perseguidos por causa dela. As Bem-Aventuranças revelam o rosto de Cristo e a vocação dos discípulos.', reference: 'Mateus 5, 3-12; CIC 1716-1729.', application: 'Escolha uma Bem-Aventurança e traduza-a em uma atitude verificável nesta semana.' }
                    ]
                },
                {
                    id: 'oracao',
                    icon: '⌂',
                    title: 'IV. A fé rezada',
                    subtitle: 'A oração cristã: como nos relacionamos com Deus',
                    centralQuestion: 'Como cultivar um diálogo contínuo com Deus?',
                    cards: [
                        { title: 'Formas de oração', question: 'De que maneiras podemos nos dirigir a Deus?', summary: 'A bênção reconhece os dons de Deus e responde com louvor; a adoração O reconhece como Senhor; a petição apresenta necessidades; a intercessão pede pelo próximo; a ação de graças agradece; e o louvor glorifica a Deus por quem Ele é.', reference: 'CIC 2626-2643.', application: 'Em sua próxima oração, inclua um momento de adoração, um pedido por outra pessoa e um agradecimento específico.' },
                        { title: 'Expressões da oração', question: 'É possível rezar de modos diferentes?', summary: 'A oração vocal usa palavras e gestos; a meditação envolve pensamento, imaginação e afeto para acolher a Palavra; a contemplação é presença silenciosa e amorosa diante de Deus. As três podem se apoiar mutuamente.', reference: 'CIC 2700-2724.', application: 'Experimente uma leitura bíblica breve, alguns minutos de meditação e um período curto de silêncio.' },
                        { title: 'O combate da oração', question: 'O que fazer quando surgem distração, aridez ou desânimo?', summary: 'Distrações, aridez e dúvidas fazem parte da experiência de oração. Perseverar não significa forçar sentimentos: é voltar com paciência ao encontro com Deus, ajustar o tempo e a forma de rezar e buscar acompanhamento espiritual quando necessário.', reference: 'CIC 2725-2745.', application: 'Quando se distrair, retome com serenidade uma frase da Escritura; em períodos difíceis, mantenha um hábito pequeno e possível.' },
                        { title: 'Pai-Nosso: Pai nosso que estais nos céus', question: 'O que significa chamar Deus de Pai?', summary: 'Jesus nos ensina uma confiança filial que é dom, não posse. O plural “nosso” lembra que a oração nos une como irmãos; “nos céus” fala da transcendência e da presença de Deus.', reference: 'CIC 2759-2761 e 2786-2796.', application: 'Reze lembrando de outras pessoas e reconheça como irmãos também aqueles que você tem dificuldade de acolher.' },
                        { title: '1º pedido: santificado seja o vosso nome', question: 'Como o nome de Deus é santificado em nós?', summary: 'Pedimos que Deus seja conhecido e honrado e que nossa vida não contradiga o nome que professamos. A santidade é dom de Deus e também missão recebida.', reference: 'CIC 2807-2815.', application: 'Escolha uma atitude que torne sua fé mais coerente e acolhedora para quem convive com você.' },
                        { title: '2º pedido: venha a nós o vosso Reino', question: 'Como esperamos e colaboramos com o Reino?', summary: 'O Reino é a ação salvadora de Deus, já presente em Cristo e ainda esperado em sua plenitude. Pedimos sua vinda e nos comprometemos com justiça, paz e reconciliação.', reference: 'CIC 2816-2821.', application: 'Participe de uma ação concreta de serviço, reconciliação ou promoção da justiça.' },
                        { title: '3º pedido: seja feita a vossa vontade', question: 'Como discernir e acolher a vontade de Deus?', summary: 'Pedimos que o desígnio amoroso de Deus se realize na terra como no céu. Isso não significa chamar todo sofrimento de vontade divina; significa cooperar com o bem e confiar em Deus nas provações.', reference: 'CIC 2822-2827.', application: 'Diante de uma decisão, confronte suas opções com o Evangelho, a dignidade das pessoas e o conselho prudente.' },
                        { title: '4º pedido: o pão nosso de cada dia', question: 'Por que pedimos o pão no plural?', summary: 'Pedimos o sustento necessário para hoje e, na tradição cristã, reconhecemos também a dimensão eucarística do pão. A oração compromete a comunidade com quem não tem o necessário.', reference: 'CIC 2828-2837.', application: 'Agradeça pelo alimento e partilhe, de modo concreto, com quem enfrenta insegurança alimentar.' },
                        { title: '5º pedido: perdoai as nossas ofensas', question: 'Como pedir perdão e aprender a perdoar?', summary: 'Reconhecemos que dependemos da misericórdia de Deus e somos chamados a perdoar. Perdoar não significa negar a injustiça nem permanecer em situação de violência; reconciliação pode exigir verdade, proteção e tempo.', reference: 'CIC 2838-2845.', application: 'Peça perdão pelo dano que causou e, se estiver em risco, busque proteção e orientação antes de qualquer reaproximação.' },
                        { title: '6º pedido: não nos deixeis cair em tentação', question: 'Deus nos tenta?', summary: 'Não pedimos que Deus nos poupe de toda prova, mas que nos sustente para não ceder ao mal e nos dê discernimento e perseverança nas tentações.', reference: 'CIC 2846-2849.', application: 'Identifique uma situação que costuma levar você ao erro e prepare uma estratégia de apoio e prevenção.' },
                        { title: '7º pedido: livrai-nos do mal', question: 'O que pedimos ao dizer “livrai-nos do mal”?', summary: 'Pedimos libertação do Maligno e do mal em suas expressões, e aguardamos a vitória definitiva de Cristo. A súplica reconhece nossa vulnerabilidade e a necessidade de permanecer no bem.', reference: 'CIC 2850-2854.', application: 'Peça ajuda quando estiver diante de perigo ou injustiça e apoie outras pessoas a encontrar proteção e cuidado.' }
                    ]
                }
            ]
        },
        'faq-da-fe': {
            title: 'Dúvidas frequentes sobre a fé',
            category: 'Formações Básicas',
            pt: ['Apologética cristã é explicar a esperança com clareza, caridade e respeito (1 Pedro 3, 15). As respostas abaixo são introdutórias: apresentam a posição católica sem caricaturar outras tradições e indicam fontes para aprofundamento.'],
            faq: [
                {
                    id: 'veneracao-imagens',
                    question: 'Os católicos adoram imagens de santos ou estátuas?',
                    keywords: 'estátuas estátuas imagens ídolos santos adoração veneração latria dulia hiperdulia',
                    shortAnswer: ['Não. Na doutrina católica, latria é a adoração devida somente a Deus, Pai, Filho e Espírito Santo. A Igreja distingue essa adoração da honra prestada aos santos, chamada dulia, e da veneração especial a Maria, chamada hiperdulia.', 'A imagem não é tratada como um deus: a honra se dirige à pessoa representada. A Bíblia proíbe fabricar ídolos para adorá-los, mas também descreve imagens religiosas feitas por ordem de Deus, como os querubins da Arca.'],
                    scripture: 'Êxodo 20, 4-5; Êxodo 25, 18-20; João 4, 24.',
                    patristic: 'Basílio de Cesareia, Sobre o Espírito Santo 18,45 (século IV), distingue a imagem de seu protótipo ao tratar da honra; a formulação conciliar sobre ícones é posterior, em Niceia II (787).',
                    magisterium: 'CIC 971, 2112-2114 e 2131-2132; Concílio de Niceia II (787).',
                    quote: 'Adorarás o Senhor, teu Deus, e só a ele prestarás culto.',
                    quoteSource: 'Mateus 4, 10',
                    module: 'credo'
                },
                {
                    id: 'intercessao-santos',
                    question: 'Se Jesus é o único mediador, por que pedir a intercessão dos santos?',
                    keywords: 'intercessão santos mediação único mediador oração céu comunhão',
                    shortAnswer: ['Cristo é o único Mediador da redenção: sua entrega reconcilia a humanidade com o Pai. A intercessão dos santos não acrescenta outro redentor nem compete com Cristo.', 'Na comunhão dos santos, pedimos que os que vivem em Deus intercedam por nós, assim como pedimos oração a outros cristãos. Toda intercessão permanece dependente de Cristo e dirigida a Deus.'],
                    scripture: '1 Timóteo 2, 1-6; Tiago 5, 16; Hebreus 12, 1; Apocalipse 5, 8.',
                    patristic: 'Cirilo de Jerusalém, Catequeses Mistagógicas 5 [23], 9-10 (século IV), descreve a oração e a memória dos santos na liturgia eucarística.',
                    magisterium: 'CIC 956, 2683-2684 e 970.',
                    quote: 'A oração do justo tem grande eficácia.',
                    quoteSource: 'Tiago 5, 16',
                    module: 'credo'
                },
                {
                    id: 'purgatorio',
                    question: 'O Purgatório existe na Bíblia ou foi inventado pela Igreja?',
                    keywords: 'purgatório inventado fogo mortos purificação céu inferno julgamento',
                    shortAnswer: ['A Igreja chama purgatório à purificação final dos que morrem na graça e amizade de Deus, mas ainda precisam ser purificados para entrar na santidade do Céu. Não é um segundo julgamento nem um inferno temporário.', 'A doutrina se apoia na oração pelos mortos e em textos sobre uma salvação que passa por purificação. Cristãos de outras tradições interpretam essas passagens de modo diferente; a resposta católica deve reconhecer essa diferença sem reduzi-la a má-fé.'],
                    scripture: '2 Macabeus 12, 44-46; 1 Coríntios 3, 13-15; Mateus 12, 32.',
                    patristic: 'Tertuliano, De corona 3 (início do século III), testemunha orações e ofertas pelos falecidos; Agostinho, Confissões IX, 13, 34 (século IV), pede orações por sua mãe Mônica.',
                    magisterium: 'CIC 1030-1032; Concílio de Trento, sessão XXV.',
                    quote: 'A obra de cada um será provada pelo fogo.',
                    quoteSource: '1 Coríntios 3, 13',
                    module: 'credo'
                },
                {
                    id: 'sigilo-sacramental',
                    question: 'O padre pode revelar um crime ou pecado ouvido no confessionário?',
                    keywords: 'confissão padre sacerdote segredo crime sigilo sacramental selo excomunhão',
                    shortAnswer: ['Não. O sigilo sacramental é absoluto: o confessor não pode revelar o penitente nem o que soube pela confissão, direta ou indiretamente. A obrigação não deixa de existir por causa da gravidade do relato.', 'A disciplina penal vigente prevê excomunhão automática para a violação direta do sigilo, cuja remissão é reservada à Sé Apostólica. A numeração atual é cân. 1386 §1; antes da reforma do Livro VI, era cân. 1388 §1.'],
                    scripture: 'João 20, 22-23; 2 Coríntios 5, 18-20; 1 Pedro 3, 15.',
                    patristic: 'Orígenes, Homilias sobre o Levítico 2, 4 (século III), testemunha a confissão e o acompanhamento sacerdotal; a formulação jurídica atual do sigilo foi desenvolvida pela disciplina posterior da Igreja.',
                    magisterium: 'CIC 1467; Código de Direito Canônico, cân. 983 §1 e 1386 §1 (numeração atual).',
                    quote: 'O sigilo sacramental é inviolável.',
                    quoteSource: 'Catecismo da Igreja Católica, 1467',
                    module: 'sacramentos'
                },
                {
                    id: 'papado-pedro',
                    question: 'Por que o Papa é a autoridade máxima na Igreja?',
                    keywords: 'papa papado Pedro primado chaves autoridade Vaticano sucessor',
                    shortAnswer: ['A Igreja Católica entende que Cristo confiou a Pedro um serviço particular de unidade e governo, simbolizado pelas chaves do Reino. O Papa, bispo de Roma, é reconhecido como sucessor de Pedro nesse ministério.', 'Esse serviço não significa que o Papa substitua Cristo ou possa ensinar qualquer coisa sem limites: sua autoridade é exercida para guardar e transmitir a fé apostólica, em comunhão com os bispos.'],
                    scripture: 'Mateus 16, 18-19; Lucas 22, 31-32; João 21, 15-17.',
                    patristic: 'Ireneu de Lião, Contra as Heresias III, 3, 2 (século II), recorre à sucessão da Igreja de Roma como testemunho público da tradição apostólica.',
                    magisterium: 'CIC 880-896; Concílio Vaticano I, Pastor aeternus; Concílio Vaticano II, Lumen gentium 22-23.',
                    quote: 'Tu és Pedro, e sobre esta pedra edificarei a minha Igreja.',
                    quoteSource: 'Mateus 16, 18',
                    module: 'credo'
                },
                {
                    id: 'sola-scriptura',
                    question: 'A Bíblia é a única regra de fé? Tudo o que a Igreja ensina precisa estar escrito nela?',
                    keywords: 'sola scriptura bíblia tradição magistério oral regra de fé cânon',
                    shortAnswer: ['A fé católica recebe a Revelação transmitida na Sagrada Escritura e na Sagrada Tradição, unidas no único depósito da fé. A Igreja não ensina que cada formulação doutrinal precise aparecer literalmente em um versículo.', 'O Magistério não está acima da Palavra de Deus: serve-a, escuta-a e a interpreta. Católicos e comunidades protestantes entendem de modo diferente a relação entre Escritura, Tradição e autoridade; convém apresentar essa divergência com precisão.'],
                    scripture: '2 Tessalonicenses 2, 15; 1 Timóteo 3, 15; João 21, 25.',
                    patristic: 'Ireneu de Lião, Contra as Heresias III, 3-4 (século II), apela à sucessão apostólica e à tradição recebida nas Igrejas.',
                    magisterium: 'CIC 74-100; Dei Verbum 9-10.',
                    quote: 'Guardai as tradições que vos ensinamos, de viva voz ou por carta.',
                    quoteSource: '2 Tessalonicenses 2, 15',
                    module: 'credo'
                },
                {
                    id: 'eucaristia-presenca-real',
                    question: 'A Eucaristia é apenas um símbolo ou é realmente o Corpo de Cristo?',
                    keywords: 'eucaristia símbolo corpo sangue transubstanciação missa pão vinho presença real',
                    shortAnswer: ['A Igreja Católica professa a presença verdadeira, real e substancial de Cristo na Eucaristia. “Transubstanciação” é o termo usado para expressar que, na consagração, muda a substância do pão e do vinho, embora permaneçam as aparências sensíveis.', 'A celebração também é memorial da Páscoa e sinal de unidade. Outras tradições cristãs explicam a presença e o simbolismo de maneiras diversas; a posição católica nasce da leitura conjunta da Escritura e da tradição litúrgica.'],
                    scripture: 'João 6, 51-58; Lucas 22, 19-20; 1 Coríntios 10, 16-17.',
                    patristic: 'Inácio de Antioquia, Carta aos Esmirnenses 7, 1 (início do século II), chama a Eucaristia de carne de Jesus Cristo; Justino Mártir, Primeira Apologia 66, 1 (século II), descreve a fé eucarística da comunidade.',
                    magisterium: 'CIC 1373-1381; Concílio de Trento, sessão XIII, capítulo 4.',
                    quote: 'Isto é o meu corpo, que é dado por vós.',
                    quoteSource: 'Lucas 22, 19',
                    module: 'sacramentos'
                },
                {
                    id: 'maria-mae-de-deus',
                    question: 'Por que Maria é chamada Mãe de Deus e Sempre Virgem?',
                    keywords: 'Maria mãe de Deus Theotokos sempre virgem virgindade Éfeso',
                    shortAnswer: ['Maria é chamada Mãe de Deus porque aquele que nasceu dela segundo a humanidade é uma só Pessoa: o Filho eterno de Deus feito homem. O título protege a verdade sobre Jesus; não afirma que Maria seja origem da divindade.', 'A Igreja também professa a virgindade perpétua de Maria. Essas afirmações não diminuem Cristo como único Salvador: apontam para a identidade e a missão singular de Jesus e para a resposta de Maria à graça.'],
                    scripture: 'Lucas 1, 31-35; Lucas 1, 43; João 1, 14.',
                    patristic: 'Gregório Nazianzeno, Carta 101 (século IV), defende chamar Maria de Mãe de Deus para salvaguardar a unidade de Cristo; o Concílio de Éfeso confirmou o título em 431.',
                    magisterium: 'CIC 495-507; Concílio de Éfeso (431).',
                    quote: 'E o Verbo se fez carne e habitou entre nós.',
                    quoteSource: 'João 1, 14',
                    module: 'credo'
                },
                {
                    id: 'canon-73-livros',
                    question: 'Por que a Bíblia Católica tem 73 livros e a Protestante tem 66?',
                    keywords: '73 66 livros deuterocanônicos septuaginta cânon Tobias Judite Macabeus Sabedoria Eclesiástico Baruc',
                    shortAnswer: ['A Bíblia católica conta 46 livros no Antigo Testamento e 27 no Novo. Entre os sete livros chamados deuterocanônicos estão Tobias, Judite, Sabedoria, Eclesiástico, Baruc e 1 e 2 Macabeus; há também passagens adicionais em Ester e Daniel.', 'A diferença vem da história de recepção dos cânones: a Igreja católica reconhece esses livros como Escritura, enquanto a maioria das Bíblias protestantes segue o cânon hebraico para o Antigo Testamento. A Septuaginta foi importante para os cristãos antigos, mas a história do cânon é mais complexa que uma única decisão.'],
                    scripture: 'Lucas 24, 44; 2 Macabeus 12, 39-46; 2 Timóteo 3, 14-17.',
                    patristic: 'Agostinho, A doutrina cristã II, 8, 13 (século IV), enumera os livros recebidos pelas Igrejas; os sínodos de Hipona (393) e Cartago (397) também registram listas do cânon.',
                    magisterium: 'CIC 120; Concílio de Trento, sessão IV (1546).',
                    quote: 'Toda a Escritura é inspirada por Deus.',
                    quoteSource: '2 Timóteo 3, 16',
                    module: 'credo'
                },
                {
                    id: 'escritura-tradicao-magisterio',
                    question: 'Tudo o que a Igreja ensina precisa estar explicitamente na Bíblia?',
                    keywords: 'tríplice mosaico escritura tradição magistério explícito bíblia',
                    shortAnswer: ['A Igreja ensina que Escritura e Tradição transmitem a Palavra de Deus e formam um único depósito da fé. Por isso, uma doutrina pode estar contida na Revelação sem aparecer com a mesma formulação técnica em um versículo.', 'O Magistério tem a tarefa de interpretar autenticamente esse depósito, não de acrescentar uma nova revelação pública. A Bíblia continua sendo normativa e central para a fé católica.'],
                    scripture: '2 Tessalonicenses 2, 15; 1 Timóteo 3, 15; 2 Pedro 1, 20-21.',
                    patristic: 'Tertuliano, Prescrição contra os Hereges 21 (início do século III), argumenta a partir da regra de fé e da tradição apostólica recebida nas Igrejas.',
                    magisterium: 'CIC 80-100; Dei Verbum 9-10.',
                    quote: 'Guardai as tradições que vos ensinamos, de viva voz ou por carta.',
                    quoteSource: '2 Tessalonicenses 2, 15',
                    module: 'credo'
                },
                {
                    id: 'violencia-antigo-testamento',
                    question: 'Como interpretar passagens difíceis ou violentas do Antigo Testamento?',
                    keywords: 'violência guerra antigo testamento genocídio passagens difíceis literal alegórico moral anagógico',
                    shortAnswer: ['A leitura católica considera o gênero literário, o contexto histórico e a unidade de toda a Escritura. A Bíblia registra etapas da história da salvação e também a linguagem e os limites humanos de seus autores; cada texto deve ser lido à luz de Cristo, sem apagar a dificuldade moral.', 'A tradição reconhece sentidos literal e espirituais — alegórico, moral e anagógico —, mas o sentido espiritual não substitui o estudo do texto. Passagens violentas pedem leitura cuidadosa, oração, contexto e diálogo com a exegese responsável.'],
                    scripture: 'Deuteronômio 20; Sabedoria 12, 19; Hebreus 1, 1-2.',
                    patristic: 'Orígenes, Sobre os princípios IV, 2, 9 (século III), observa que certas passagens exigem interpretação além de uma leitura material; Agostinho, A interpretação literal do Gênesis I, 19, 39 (século IV), recomenda prudência diante de interpretações precipitadas.',
                    magisterium: 'CIC 109-119; Dei Verbum 12; Comissão Bíblica Pontifícia, A interpretação da Bíblia na Igreja (1993).',
                    quote: 'Muitas vezes e de muitos modos, Deus falou outrora aos pais pelos profetas.',
                    quoteSource: 'Hebreus 1, 1',
                    module: 'credo'
                },
                {
                    id: 'irmaos-jesus',
                    question: 'Quem são os “irmãos de Jesus” citados nos Evangelhos?',
                    keywords: 'irmãos Jesus primos parentes Maria José irmãos evangelho',
                    shortAnswer: ['Os Evangelhos mencionam irmãos e irmãs de Jesus, mas a palavra usada no contexto semítico podia designar também parentes próximos. A tradição católica interpreta essas passagens sem concluir que Maria teve outros filhos.', 'Essa leitura é antiga, embora cristãos interpretem os textos de modos diferentes. A doutrina da virgindade perpétua não depende de fingir que as passagens não existem: procura lê-las no contexto linguístico e na tradição recebida.'],
                    scripture: 'Marcos 6, 3; Mateus 13, 55-56; João 19, 25.',
                    patristic: 'Jerônimo, Contra Helvídio 19-21 (século IV), defende que os “irmãos” eram parentes; sua obra testemunha uma controvérsia antiga, não uma explicação aceita por todos os leitores modernos.',
                    magisterium: 'CIC 499-501.',
                    quote: 'Não é ele o filho do carpinteiro? Sua mãe não se chama Maria?',
                    quoteSource: 'Mateus 13, 55',
                    module: 'credo'
                },
                {
                    id: 'imaculada-conceicao',
                    question: 'O que significa a Imaculada Conceição? Maria não tinha pecado?',
                    keywords: 'imaculada conceição pecado original dogma 1854 Maria cheia de graça',
                    shortAnswer: ['A Imaculada Conceição significa que Maria, desde o primeiro instante de sua concepção, foi preservada do pecado original por graça singular de Deus, em vista dos méritos de Jesus Cristo. Não significa que Maria não precisasse de Salvador.', 'O dogma foi definido em 1854. A Igreja lê a saudação do anjo e a tradição cristã à luz da redenção de Cristo, que é a fonte de toda graça recebida por Maria.'],
                    scripture: 'Lucas 1, 28; Efésios 1, 3-4; Lucas 1, 47.',
                    patristic: 'Agostinho, A natureza e a graça 36, 42 (século V), ressalva a Virgem Maria ao falar do pecado; a formulação dogmática e seu desenvolvimento são posteriores aos primeiros séculos.',
                    magisterium: 'CIC 490-493; Pio IX, Ineffabilis Deus (1854).',
                    quote: 'Alegra-te, cheia de graça, o Senhor está contigo.',
                    quoteSource: 'Lucas 1, 28',
                    module: 'credo'
                },
                {
                    id: 'aparicoes-marianas',
                    question: 'O católico é obrigado a crer em aparições como Fátima ou Lourdes?',
                    keywords: 'aparições Fátima Lourdes revelação privada obrigação acreditar',
                    shortAnswer: ['Não. A revelação pública, que fundamenta a fé cristã, se completa em Cristo e no testemunho apostólico. Revelações privadas reconhecidas podem ajudar a viver essa fé em determinada época, mas não acrescentam um novo Evangelho.', 'Mesmo uma aprovação eclesial não obriga todos os fiéis a aceitar uma aparição como artigo de fé. O discernimento considera frutos, coerência com o Evangelho e possíveis riscos de exploração ou dano.'],
                    scripture: 'Hebreus 1, 1-2; Judas 3; 1 Tessalonicenses 5, 19-22.',
                    patristic: 'A Didaqué 11-13 (fim do século I ou início do II) orienta as comunidades a discernir a conduta de profetas itinerantes; é um paralelo antigo de prudência, não uma definição das revelações privadas modernas.',
                    magisterium: 'CIC 66-67; Normas para proceder no discernimento de supostos fenômenos sobrenaturais (Dicastério para a Doutrina da Fé, 2024).',
                    quote: 'A fé foi transmitida uma vez por todas aos santos.',
                    quoteSource: 'Judas 3',
                    module: 'credo'
                },
                {
                    id: 'contracepcao-artificial',
                    question: 'Por que a Igreja não aceita métodos contraceptivos artificiais?',
                    keywords: 'contracepção anticoncepcional preservativo contraceptivo métodos artificiais Humanae Vitae planejamento natural',
                    shortAnswer: ['A doutrina católica entende que os significados unitivo e procriativo do ato conjugal não devem ser separados deliberadamente. Por isso distingue a contracepção artificial dos métodos de percepção da fertilidade usados com motivos responsáveis.', 'A aplicação pastoral exige formação, diálogo e respeito à consciência, à saúde e às circunstâncias concretas dos esposos. Para decisões pessoais, procure orientação pastoral e profissional de saúde qualificada.'],
                    scripture: 'Gênesis 1, 27-28; Gênesis 2, 24; Mateus 19, 4-6.',
                    patristic: 'Clemente de Alexandria, O Pedagogo II, 10 (século II), relaciona a vida conjugal à responsabilidade e à geração; a formulação moral contemporânea foi desenvolvida pelo Magistério moderno.',
                    magisterium: 'CIC 2366-2372; Paulo VI, Humanae vitae 11-16.',
                    quote: 'O amor conjugal está ordenado à geração e educação dos filhos.',
                    quoteSource: 'Catecismo da Igreja Católica, 2366',
                    module: 'mandamentos'
                },
                {
                    id: 'aborto-eutanasia',
                    question: 'Qual é a posição da Igreja sobre aborto e eutanásia?',
                    keywords: 'aborto eutanásia vida saúde mental suicídio cuidado',
                    shortAnswer: ['A Igreja afirma a dignidade inviolável da vida humana desde a concepção até a morte natural e rejeita o aborto direto e a eutanásia. Isso não equivale a exigir tratamentos desproporcionais: cuidados paliativos e recusa de meios terapêuticos extraordinários podem ser moralmente legítimos.', 'A avaliação pastoral deve unir defesa da vida, compaixão e cuidado. Sofrimento psíquico pode reduzir a responsabilidade pessoal; ideação suicida requer ajuda imediata de profissionais, serviços de emergência e pessoas de confiança.'],
                    scripture: 'Deuteronômio 30, 19; Salmo 139, 13-16; Êxodo 20, 13.',
                    patristic: 'A Didaqué 2, 2 (fim do século I ou início do II) proíbe matar uma criança por aborto; esse testemunho antigo não substitui a análise médica e pastoral de casos concretos.',
                    magisterium: 'CIC 2270-2283 e 2322; Evangelium vitae 57-65.',
                    quote: 'Escolhe, pois, a vida, para que vivas.',
                    quoteSource: 'Deuteronômio 30, 19',
                    module: 'mandamentos'
                },
                {
                    id: 'divorcio-nulidade',
                    question: 'Divorciados recasados podem comungar? O que é nulidade matrimonial?',
                    keywords: 'divórcio recasados comunhão nulidade matrimonial anulação vínculo',
                    shortAnswer: ['Divórcio civil não dissolve um matrimônio sacramental válido. A declaração de nulidade, por outro lado, é uma decisão judicial eclesiástica de que faltou desde o início um elemento essencial para um vínculo válido; não é “anulação” de um casamento válido.', 'A situação de pessoas divorciadas e recasadas exige discernimento pastoral individual, sem respostas automáticas. A Igreja pede acolhida e acompanhamento; as condições para a Comunhão devem ser tratadas com o pastor e conforme a disciplina vigente.'],
                    scripture: 'Mateus 19, 3-9; 1 Coríntios 7, 10-11.',
                    patristic: 'O Pastor de Hermas, Mandamento IV, 1, 6-8 (século II), trata da separação por infidelidade e da possibilidade de reconciliação; os processos canônicos de nulidade desenvolveram-se posteriormente.',
                    magisterium: 'CIC 1601-1666, especialmente 1629 e 1649-1651; Amoris laetitia 296-312.',
                    quote: 'O que Deus uniu, o homem não separe.',
                    quoteSource: 'Mateus 19, 6',
                    module: 'mandamentos'
                },
                {
                    id: 'evolucao-big-bang',
                    question: 'A Igreja Católica é contra a evolução e o Big Bang?',
                    keywords: 'evolução big bang ciência cosmologia padre Lemaître criação',
                    shortAnswer: ['A Igreja não define o Big Bang ou a evolução biológica como doutrinas de fé. Georges Lemaître, sacerdote e físico, propôs um modelo de universo em expansão; criação “do nada” é uma afirmação teológica sobre a dependência de tudo em relação a Deus, não uma teoria física concorrente.', 'A investigação científica pode estudar mecanismos naturais; a fé responde a perguntas sobre sentido, origem última e dignidade. Teorias científicas continuam sujeitas a evidências e revisão.'],
                    scripture: 'Gênesis 1, 1; Salmo 19, 2; Sabedoria 11, 24-26.',
                    patristic: 'Agostinho, A interpretação literal do Gênesis I, 19, 39 (século IV), recomenda cautela para que cristãos não defendam interpretações bíblicas incompatíveis com conhecimentos bem estabelecidos.',
                    magisterium: 'CIC 282-289; João Paulo II, mensagem à Pontifícia Academia das Ciências (22 de outubro de 1996); Pio XII, Humani generis 36.',
                    quote: 'No princípio, Deus criou o céu e a terra.',
                    quoteSource: 'Gênesis 1, 1',
                    module: 'credo'
                },
                {
                    id: 'fe-ciencia-razao',
                    question: 'A fé é incompatível com a ciência e a razão?',
                    keywords: 'fé ciência razão incompatíveis Fides et Ratio provas',
                    shortAnswer: ['A tradição católica entende fé e razão como modos distintos, mas compatíveis, de buscar a verdade. A ciência investiga fenômenos com métodos próprios; a fé trata da relação com Deus e do sentido último, sem substituir a pesquisa científica.', 'Conflitos podem surgir de interpretações equivocadas ou de limites históricos, e devem ser examinados caso a caso. A Igreja não pede que se neguem fatos demonstrados para crer.'],
                    scripture: 'Sabedoria 13, 1-5; Romanos 1, 19-20; 1 Pedro 3, 15.',
                    patristic: 'Justino Mártir, Segunda Apologia 13 (século II), procura relacionar a busca filosófica da verdade ao Logos; sua reflexão é um antecedente, não uma teoria científica moderna.',
                    magisterium: 'CIC 159; João Paulo II, Fides et ratio 1 e 16.',
                    quote: 'Os céus proclamam a glória de Deus.',
                    quoteSource: 'Salmo 19, 2',
                    module: 'credo'
                },
                {
                    id: 'inquisicao-cruzadas',
                    question: 'O que foram as Inquisições e as Cruzadas?',
                    keywords: 'inquisição cruzadas violência lenda negra historiografia',
                    shortAnswer: ['Foram fenômenos distintos, ocorridos em períodos, regiões e instituições diferentes. As Inquisições foram tribunais eclesiásticos que cooperaram em vários contextos com autoridades civis; as Cruzadas foram campanhas militares convocadas em contextos medievais específicos.', 'Houve coerção, violência e vítimas, que não devem ser minimizadas. Também é preciso evitar números e slogans sem fonte: uma resposta responsável distingue períodos, jurisdições, motivações e evidências, recorrendo à historiografia especializada.'],
                    scripture: 'Mateus 5, 9; Mateus 26, 52; João 18, 36.',
                    patristic: 'Agostinho, Carta 93, 5, 17 (início do século V), debateu a coerção contra donatistas; esse contexto antigo não justifica retrospectivamente as Cruzadas ou as Inquisições.',
                    magisterium: 'CIC 2307-2317; João Paulo II, pedido de perdão do Jubileu de 2000 e discurso sobre o caso Galileu (31 de outubro de 1992).',
                    quote: 'Bem-aventurados os que promovem a paz.',
                    quoteSource: 'Mateus 5, 9',
                    module: 'mandamentos'
                },
                {
                    id: 'riquezas-vaticano',
                    question: 'Por que a Igreja tem tantas riquezas e obras de arte no Vaticano?',
                    keywords: 'riquezas Vaticano obras arte dinheiro patrimônio museus',
                    shortAnswer: ['É importante distinguir recursos financeiros, bens de uso, edifícios e patrimônio cultural. Muitas obras são bens históricos sob guarda pública e conservação; não equivalem automaticamente a dinheiro disponível para despesas correntes.', 'Essa distinção não elimina a obrigação evangélica de transparência, boa administração e solidariedade. A Igreja também deve avaliar criticamente o uso de seus recursos e responder às necessidades dos pobres.'],
                    scripture: 'Atos 2, 44-45; Atos 4, 32-35; Mateus 6, 19-21.',
                    patristic: 'A Didaqué 4, 8-11 (fim do século I ou início do II) recomenda partilhar os bens e socorrer os necessitados; é um testemunho de responsabilidade comunitária, não uma descrição do patrimônio atual do Vaticano.',
                    magisterium: 'CIC 2402-2406 e 2443-2449; cân. 1254-1257 do Código de Direito Canônico.',
                    quote: 'Vendiam suas propriedades e seus bens e repartiam o preço entre todos.',
                    quoteSource: 'Atos 2, 45',
                    module: 'mandamentos'
                },
                {
                    id: 'galileu',
                    question: 'O que aconteceu no caso Galileu Galilei?',
                    keywords: 'Galileu Galilei heliocentrismo Inquisição ciência perdão',
                    shortAnswer: ['Em 1633, Galileu foi julgado pela Inquisição romana por defender o heliocentrismo e foi condenado a prisão domiciliar após retratação. O debate ocorreu num contexto em que as evidências observacionais ainda eram discutidas e autoridades eclesiásticas interpretaram passagens bíblicas de modo inadequado.', 'A pesquisa histórica reconhece responsabilidades e limites daquele processo. Em 1992, João Paulo II apresentou as conclusões de uma comissão e lamentou os erros de julgamento; isso não significa que ciência e fé sejam incompatíveis.'],
                    scripture: 'Josué 10, 12-13; Salmo 19, 2; 1 Tessalonicenses 5, 21.',
                    patristic: 'Agostinho, A interpretação literal do Gênesis I, 19, 39 (século IV), já advertia contra afirmações precipitadas sobre a natureza feitas em nome da Escritura.',
                    magisterium: 'João Paulo II, discurso à Pontifícia Academia das Ciências sobre Galileu (31 de outubro de 1992); CIC 159.',
                    quote: 'Examinai tudo e ficai com o que é bom.',
                    quoteSource: '1 Tessalonicenses 5, 21',
                    module: 'credo'
                },
                {
                    id: 'celibato-sacerdotal',
                    question: 'Por que o celibato é exigido dos padres de rito latino?',
                    keywords: 'celibato padre sacerdote disciplina dogma rito latino padres casados',
                    shortAnswer: ['No rito latino, o celibato sacerdotal é uma disciplina eclesiástica, não um dogma que declare o matrimônio incompatível com o sacerdócio. Igrejas católicas orientais ordenam homens casados em determinadas condições; bispos normalmente são escolhidos entre celibatários.', 'A disciplina latina é entendida como sinal de dedicação ao Reino e serviço pastoral. Sua história tem desenvolvimento próprio e não deve ser apresentada como regra universal de todos os ritos católicos.'],
                    scripture: 'Mateus 19, 12; 1 Coríntios 7, 32-35.',
                    patristic: 'Jerônimo, Contra Joviniano I, 34 (século IV), defende a continência por causa do Reino; a disciplina latina atual não se reduz a uma única prática patrística.',
                    magisterium: 'CIC 1579-1580; cân. 277 §1 e 1037 do Código de Direito Canônico.',
                    quote: 'Há eunucos que se fizeram tais por causa do Reino dos Céus.',
                    quoteSource: 'Mateus 19, 12',
                    module: 'sacramentos'
                },
                {
                    id: 'ocultismo-reiki',
                    question: 'Por que o católico não deve consultar horóscopo, tarô ou mapa astral?',
                    keywords: 'horóscopo tarot tarô mapa astral astrologia adivinhação Reiki energia superstição esoterismo',
                    shortAnswer: ['O Catecismo rejeita a adivinhação e a tentativa de obter orientação espiritual por astrologia ou tarô, pois a vida cristã se apoia na liberdade, na providência e na confiança em Deus. Ler algo por curiosidade não permite, por si só, julgar a consciência ou a responsabilidade de alguém.', 'Reiki é uma prática moderna, não tratada pelos textos antigos. A Igreja adverte contra atribuir poder espiritual ou cura a uma energia impessoal; cuidados de saúde devem recorrer a profissionais qualificados, e práticas de relaxamento não substituem tratamento médico.'],
                    scripture: 'Deuteronômio 18, 10-12; Isaías 8, 19; Atos 19, 18-20.',
                    patristic: 'Tertuliano, Sobre a idolatria 9 (século III), critica a astrologia e práticas divinatórias de seu contexto; ele não tratou do Reiki, que surgiu muitos séculos depois.',
                    magisterium: 'CIC 2110-2117; Conferência dos Bispos Católicos dos Estados Unidos, Guidelines for Evaluating Reiki as an Alternative Therapy (2009).',
                    quote: 'Não se ache no meio de ti quem pratique adivinhação.',
                    quoteSource: 'Deuteronômio 18, 10',
                    module: 'mandamentos'
                },
                {
                    id: 'reencarnacao',
                    question: 'A reencarnação existe? O que a Igreja ensina sobre a comunicação com quem morreu?',
                    keywords: 'reencarnação espiritismo mortos espíritos comunicação necromancia ressurreição vida após morte karma',
                    shortAnswer: ['A reencarnação não faz parte da fé cristã: a Igreja professa uma vida terrena, seguida do juízo, e espera a ressurreição da pessoa inteira, corpo e alma. A esperança não é retornar em outra vida, mas viver em comunhão com Deus.', 'A Igreja distingue a oração pelos falecidos e a comunhão dos santos da tentativa de evocar ou consultar os mortos, prática que rejeita. A saudade e a lembrança de quem morreu não são, por si, uma tentativa de comunicação espiritual.'],
                    scripture: 'Hebreus 9, 27; 1 Coríntios 15, 12-22; Deuteronômio 18, 10-12; 2 Macabeus 12, 44-46.',
                    patristic: 'Tertuliano, Sobre a ressurreição da carne 1-2 (século III), defende a ressurreição corporal contra concepções que a negavam.',
                    magisterium: 'CIC 988-1019, especialmente 1013; CIC 2116-2117.',
                    quote: 'Aos homens está ordenado morrer uma só vez.',
                    quoteSource: 'Hebreus 9, 27',
                    module: 'credo'
                },
                {
                    id: 'possessao-exorcismo',
                    question: 'Qual é a visão católica sobre a ação do demônio, a possessão e o exorcismo?',
                    keywords: 'possessão exorcismo demônio padre psiquiátrica psicológica saúde mental',
                    shortAnswer: ['A fé católica reconhece a existência do demônio e a realidade da tentação, mas não atribui automaticamente doenças, conflitos ou sofrimento à ação demoníaca. O exorcismo maior é uma oração litúrgica excepcional e só pode ser realizado por sacerdote com licença expressa do bispo.', 'Sintomas incomuns não provam possessão. A Igreja exige discernimento cuidadoso e avaliação médica e psicológica; a pessoa e sua família precisam de proteção, respeito, consentimento e acompanhamento responsável. O exorcismo nunca substitui cuidados de saúde.'],
                    scripture: 'Marcos 1, 23-27; Marcos 9, 14-29; Lucas 10, 17-20.',
                    patristic: 'Justino Mártir, Primeira Apologia 6 (século II), menciona orações cristãs de libertação; o discernimento pastoral atual não pode ser substituído por relatos antigos.',
                    magisterium: 'CIC 1673; Código de Direito Canônico, cân. 1172; Ritual de Exorcismos e orações relacionadas (1999).',
                    quote: 'Em meu nome expulsarão demônios.',
                    quoteSource: 'Marcos 16, 17',
                    module: 'oracao'
                },
                ...[
                    createFaqEntry('sinal-cruz', 'Por que os católicos fazem o Sinal da Cruz e o que ele significa?', 'sinal da cruz gesto trindade cruz começo oração', [
                        'O Sinal da Cruz é uma profissão breve da fé na Santíssima Trindade e uma lembrança da Paixão de Cristo. Ao traçá-lo sobre o corpo, o cristão recorda que pertence a Cristo pelo Batismo.',
                        'Não é gesto mágico nem garantia automática de proteção: é oração corporal que expressa a fé e acompanha a vida litúrgica. Pode ser feito com reverência ao iniciar e concluir uma oração.'
                    ], 'Mateus 28, 19; Gálatas 6, 14; 1 Coríntios 1, 18.', 'Tertuliano, De corona 3 (início do século III), testemunha o costume cristão de traçar o sinal da cruz na fronte em atos cotidianos.', 'CIC 1235 e 2157.', 'Ide, pois, e ensinai a todas as nações, batizando-as em nome do Pai, do Filho e do Espírito Santo.', 'Mateus 28, 19', 'credo'),
                    createFaqEntry('domingo-dia-senhor', 'Por que o dia de Missa e descanso é o domingo e não o sábado?', 'domingo sábado dia do Senhor descanso missa sabbath', [
                        'O domingo é celebrado pelos cristãos como o Dia do Senhor porque recorda a Ressurreição de Jesus, ocorrida no primeiro dia da semana. A Missa dominical reúne a comunidade para a Eucaristia e a escuta da Palavra.',
                        'O domingo não é uma rejeição do povo judeu nem da importância bíblica do sábado. Para os cristãos, ele celebra a nova criação em Cristo e inclui descanso, família, culto e cuidado dos necessitados.'
                    ], 'Marcos 16, 2; Atos 20, 7; 1 Coríntios 16, 2; Apocalipse 1, 10.', 'A Didaqué 14 (fim do século I ou início do II) orienta a reunião no Dia do Senhor; Justino, Primeira Apologia 67 (século II), descreve a assembleia cristã dominical.', 'CIC 2174-2188.', 'Este é o dia que o Senhor fez: exultemos e alegremo-nos nele.', 'Salmo 118, 24', 'mandamentos'),
                    createFaqEntry('sacramentais-amuletos', 'Para que servem água benta, medalhas e terço? Funcionam como amuletos?', 'água benta medalhas terço sacramentais amuleto magia', [
                        'Sacramentais são sinais sagrados instituídos pela Igreja que dispõem a pessoa para acolher a graça e santificam situações da vida. A água benta recorda o Batismo; medalhas e o terço podem favorecer a oração e a memória da fé.',
                        'Eles não agem como amuletos nem obrigam Deus a conceder algo. Usá-los com superstição, como se tivessem poder automático, contradiz seu sentido; o essencial é a fé, a oração e a vida cristã.'
                    ], 'Números 21, 8-9; Atos 19, 11-12; Tiago 5, 14-16.', 'A Didaqué 3, 4 (fim do século I ou início do II) adverte contra a magia; sacramentais como medalhas e práticas atuais desenvolveram-se posteriormente na vida da Igreja.', 'CIC 1667-1679 e 2111.', 'Não terás outros deuses diante de mim.', 'Êxodo 20, 3', 'sacramentos'),
                    createFaqEntry('simbolos-missa', 'Por que a Igreja usa velas, incenso, imagens e vestimentas especiais na Missa?', 'velas incenso imagens vestimentas símbolos liturgia missa', [
                        'A liturgia usa sinais visíveis para envolver o corpo e os sentidos na oração: a luz pode recordar Cristo, o incenso expressa honra e oração, as vestes indicam o serviço litúrgico e as imagens remetem às pessoas e mistérios representados.',
                        'Esses sinais não são decoração indispensável nem objetos de adoração. Seu uso segue livros litúrgicos e tradições legítimas; o centro da Missa é Cristo e a celebração de sua Páscoa.'
                    ], 'Êxodo 25, 18-20; Salmo 141, 2; Apocalipse 8, 3-4.', 'Justino, Primeira Apologia 65-67 (século II), descreve uma celebração cristã dominical estruturada; os detalhes de velas, incenso e vestes tiveram desenvolvimento histórico posterior.', 'CIC 1145-1162 e 1179-1186; Instrução Geral do Missal Romano 335-347.', 'Suba a minha oração como incenso à tua presença.', 'Salmo 141, 2', 'sacramentos'),
                    createFaqEntry('religiao-organizada', 'Preciso ter uma religião organizada ou basta crer em Deus e ser uma boa pessoa?', 'religião organizada igreja crer em Deus boa pessoa comunidade', [
                        'A fé cristã não reduz a salvação a pertencer formalmente a uma instituição, nem ensina que boas obras comprem a graça. A pessoa é chamada a buscar a verdade, amar a Deus e ao próximo e responder à graça recebida.',
                        'Ao mesmo tempo, Jesus reúne discípulos numa comunidade, e a vida cristã é alimentada pela Palavra, pelos sacramentos e pelo serviço comum. A Igreja é caminho ordinário de vida cristã, não motivo para desprezar quem está fora dela.'
                    ], 'Mateus 22, 37-40; Hebreus 10, 24-25; Tiago 2, 14-17.', 'Justino, Primeira Apologia 67 (século II), descreve a oração, a Eucaristia e a partilha como práticas da comunidade cristã reunida.', 'CIC 27-30, 44-45 e 836-838.', 'Amarás o Senhor teu Deus e o teu próximo como a ti mesmo.', 'Mateus 22, 37-39', 'credo'),
                    createFaqEntry('salvacao-nao-catolicos', 'Quem não é católico ou não conhece a Igreja pode ir para o Céu?', 'salvação não católico outras religiões ignorância invencível céu', [
                        'A Igreja ensina que toda salvação vem de Cristo e está relacionada, de modo conhecido por Deus, à Igreja. Quem, sem culpa própria, não conhece o Evangelho nem a Igreja, mas busca sinceramente a verdade e procura fazer o bem segundo a consciência, pode alcançar a salvação pela graça.',
                        'Isso não significa que todas as religiões sejam iguais ou que a missão cristã seja desnecessária. Também não cabe a nós declarar o destino eterno de uma pessoa: o juízo pertence a Deus, que conhece cada consciência.'
                    ], '1 Timóteo 2, 3-6; Atos 10, 34-35; Romanos 2, 14-16.', 'Justino, Primeira Apologia 46 (século II), fala de pessoas que viveram segundo o Logos antes de conhecer Cristo; essa reflexão antiga não substitui a formulação posterior do Magistério.', 'CIC 846-848; Lumen gentium 14-16.', 'Deus quer que todos sejam salvos e cheguem ao conhecimento da verdade.', '1 Timóteo 2, 4', 'credo'),
                    createFaqEntry('diferencas-catolicos-evangelicos', 'Qual é a diferença fundamental entre a Igreja Católica e as denominações evangélicas?', 'diferenças católicos evangélicos protestantes autoridade sacramentos', [
                        '“Evangélicas” reúne comunidades diversas. Muitas partilham com os católicos a fé na Trindade, em Jesus Cristo e na Bíblia; as diferenças variam, mas costumam envolver autoridade da Igreja e da Tradição, número e compreensão dos sacramentos e ministério ordenado.',
                        'O diálogo católico reconhece elementos de santificação e verdade em outras comunidades cristãs. É melhor comparar uma doutrina concreta e a comunidade específica, sem tratar todos os evangélicos como se ensinassem exatamente o mesmo.'
                    ], 'João 17, 20-23; Efésios 4, 4-6; 2 Tessalonicenses 2, 15.', 'Ireneu de Lião, Contra as Heresias III, 3-4 (século II), descreve a transmissão da fé apostólica nas Igrejas; as divisões confessionais atuais surgiram muitos séculos depois.', 'CIC 817-822; Unitatis redintegratio 3 e 11.', 'Que todos sejam um.', 'João 17, 21', 'credo'),
                    createFaqEntry('nome-igreja-catolica', 'Por que a Igreja é chamada de Católica, Apostólica e Romana?', 'católica apostólica romana nome origem igreja universal', [
                        'Católica significa universal: a Igreja anuncia Cristo a todos e guarda a plenitude da fé. Apostólica indica sua origem nos Apóstolos e a continuidade de sua missão e ensinamento.',
                        'Romana identifica a comunhão com a Igreja de Roma e seu bispo, o Papa, no serviço de unidade. Não significa que a Igreja seja restrita a uma etnia, nacionalidade ou cultura romana.'
                    ], 'Mateus 16, 18-19; Atos 1, 8; Apocalipse 7, 9.', 'Inácio de Antioquia, Carta aos Esmirnenses 8, 2 (início do século II), é um dos primeiros testemunhos escritos do uso da expressão “Igreja Católica”.', 'CIC 830-856 e 880-896.', 'Onde está Cristo Jesus, aí está a Igreja Católica.', 'Inácio de Antioquia, Carta aos Esmirnenses 8, 2', 'credo'),
                    createFaqEntry('batismo-infantil', 'Por que batizar bebês se eles ainda não podem escolher a própria fé?', 'batismo infantil bebês escolha fé pecado original pais padrinhos', [
                        'O Batismo é dom de Deus e início da vida cristã, não prêmio por uma escolha já plenamente consciente. A Igreja batiza crianças na fé da comunidade; pais e padrinhos assumem o compromisso de ajudá-las a conhecer e viver essa fé.',
                        'Quando crescer, a pessoa poderá acolher livremente o dom recebido. A preparação dos pais e o acompanhamento da comunidade são importantes para que o Batismo não fique isolado da vida cristã.'
                    ], 'Marcos 10, 13-16; Atos 2, 38-39; Colossenses 2, 11-12.', 'Orígenes, Homilias sobre o Levítico 8, 3 (século III), testemunha o Batismo de crianças como prática recebida na Igreja.', 'CIC 1250-1255.', 'Deixai vir a mim as crianças.', 'Marcos 10, 14', 'sacramentos'),
                    createFaqEntry('confissao-padre', 'Por que confessar meus pecados ao padre e não só a Deus em meu quarto?', 'confessar padre confissão direto com Deus pecado sacerdote absolvição', [
                        'A oração pessoal e o arrependimento diante de Deus são essenciais. No sacramento da Reconciliação, porém, Cristo confiou à Igreja um ministério de perdão: o sacerdote escuta e pronuncia a absolvição em nome de Cristo e da Igreja.',
                        'A confissão não é contar a um homem para que ele substitua Deus; é receber sacramentalmente o perdão e a reconciliação. A Igreja recomenda confessar os pecados graves e prevê preparação com exame de consciência e contrição.'
                    ], 'João 20, 22-23; Tiago 5, 16; 2 Coríntios 5, 18-20.', 'Orígenes, Homilias sobre o Levítico 2, 4 (século III), descreve a confissão ao sacerdote como parte do cuidado espiritual da comunidade.', 'CIC 1441-1442, 1455-1458.', 'A quem perdoardes os pecados, ser-lhes-ão perdoados.', 'João 20, 23', 'sacramentos'),
                    createFaqEntry('comunhao-pecado-grave', 'O que acontece se alguém comungar estando em pecado grave?', 'comungar comunhão pecado mortal grave eucaristia confissão', [
                        'A Igreja orienta que quem tem consciência de pecado grave não receba a Comunhão antes da absolvição sacramental, salvo a exceção estrita prevista no direito canônico quando há grave razão, não é possível confessar e existe contrição perfeita com propósito de confessar-se quanto antes.',
                        'Isso não é convite ao desespero nem julgamento sobre outras pessoas. Quem está em dúvida pode conversar reservadamente com um sacerdote; ninguém deve ser exposto ou tratado com desprezo.'
                    ], '1 Coríntios 11, 27-29; Salmo 32, 1-5.', 'Cipriano de Cartago, A queda 15-16 (século III), aborda pastoralmente a recepção da Eucaristia por cristãos que haviam falhado durante a perseguição.', 'CIC 1385 e 1457; Código de Direito Canônico, cân. 916.', 'Examine-se cada um a si mesmo e, assim, coma do pão e beba do cálice.', '1 Coríntios 11, 28', 'sacramentos'),
                    createFaqEntry('titulo-sacerdotal-pai', 'Por que chamamos o sacerdote de “Padre” se Jesus disse para não chamar ninguém de pai?', 'padre pai sacerdote Mateus 23 pai espiritual título', [
                        'Em Mateus 23, Jesus critica a busca de títulos que exalta pessoas e ocupa o lugar de Deus. A própria Bíblia usa “pai” em sentido familiar e espiritual, sem atribuir a alguém a paternidade absoluta que pertence a Deus.',
                        '“Padre” é um tratamento pastoral tradicional para o sacerdote, cuja missão deve ser serviço, não domínio. O título não é obrigatório em toda situação e nunca torna o sacerdote infalível ou acima de correção.'
                    ], 'Mateus 23, 8-12; 1 Coríntios 4, 14-16; Efésios 3, 14-15.', 'Clemente de Roma, Primeira Carta aos Coríntios 21 e 42 (fim do século I), testemunha a linguagem de cuidado e serviço dos ministros; Paulo já usa a imagem da paternidade espiritual em 1 Coríntios 4, 15.', 'CIC 1548; Presbyterorum ordinis 2 e 9.', 'Um só é o vosso Pai, aquele que está nos céus.', 'Mateus 23, 9', 'sacramentos'),
                    createFaqEntry('pecado-mortal-venial', 'Qual é a diferença prática entre pecado mortal e pecado venial?', 'pecado mortal venial matéria grave consentimento conhecimento confissão', [
                        'Para haver pecado mortal, precisam estar presentes juntos matéria grave, pleno conhecimento e consentimento deliberado. Se falta uma dessas condições, a responsabilidade pode ser menor; isso não transforma o mal em bem nem autoriza julgar a consciência alheia.',
                        'O pecado venial fere a caridade, mas não rompe a amizade com Deus. Em qualquer caso, a resposta cristã é conversão, reparação quando possível e confiança na misericórdia, não escrúpulo ou indiferença.'
                    ], '1 João 5, 16-17; Tiago 1, 14-15; Lucas 18, 13-14.', 'Agostinho, Enchiridion 64-65 (século V), distingue pecados que ferem a vida cristã sem destruí-la; a formulação técnica posterior requer os critérios ensinados pelo Catecismo.', 'CIC 1854-1864, especialmente 1857-1860.', 'Se reconhecemos os nossos pecados, Deus é fiel e justo para nos perdoar.', '1 João 1, 9', 'mandamentos'),
                    createFaqEntry('problema-do-mal', 'Se Deus é bom e todo-poderoso, por que permite doenças, dores e tragédias?', 'problema do mal sofrimento doença tragédia Deus bom poderoso', [
                        'A fé não oferece uma explicação simples para cada sofrimento. O mal não é apresentado como algo criado ou querido por Deus; envolve a liberdade humana, a fragilidade da criação e causas que muitas vezes não compreendemos.',
                        'Cristãos creem que Deus não abandona quem sofre: Cristo participa da dor humana e a Ressurreição promete que o mal não terá a última palavra. Isso não substitui tratamento, justiça, luto ou ajuda profissional.'
                    ], 'Jó 1-2; João 9, 1-3; Romanos 8, 18-39.', 'Agostinho, Enchiridion 11 (século V), reflete sobre a permissão do mal sem atribuí-lo à bondade criadora de Deus; sua resposta não pretende explicar todo sofrimento individual.', 'CIC 309-324 e 1500-1505.', 'O Senhor está perto dos que têm o coração ferido.', 'Salmo 34, 19', 'credo'),
                    createFaqEntry('oracao-nao-atendida', 'Por que parece que Deus não ouve ou não responde às minhas orações?', 'oração não atendida silêncio de Deus pedido resposta espera', [
                        'A oração não é uma fórmula para obter o resultado desejado. Os Salmos mostram que é legítimo lamentar e perguntar; Jesus também rezou no Getsêmani. A resposta pode não ser imediata ou assumir uma forma que não esperávamos.',
                        'Perseverar não significa negar a dor nem deixar de buscar ajuda. É possível pedir apoio à comunidade, a um orientador espiritual ou a profissionais, enquanto se continua a rezar com honestidade.'
                    ], 'Salmo 13; Marcos 14, 32-36; 2 Coríntios 12, 7-10.', 'Agostinho, Carta 130 a Proba, 8, 17 (século V), ensina que a oração também educa o desejo e a esperança; isso não diminui a dor de quem espera.', 'CIC 2734-2741 e 2629-2633.', 'Meu Deus, meu Deus, por que me abandonaste?', 'Salmo 22, 2', 'oracao'),
                    createFaqEntry('conteudo-secular', 'O católico pode ouvir músicas, assistir a filmes ou consumir conteúdos não religiosos?', 'música filmes secular entretenimento mídia conteúdo cultura', [
                        'Sim. A fé católica não exige que toda obra cultural seja explicitamente religiosa. Música, cinema e literatura podem revelar beleza e verdade mesmo fora de um contexto de culto.',
                        'O discernimento considera conteúdo, contexto, efeitos sobre a consciência e respeito à dignidade humana. Não é preciso consumir tudo: é legítimo escolher limites e conversar sobre obras difíceis sem reduzir cultura a uma lista de proibições.'
                    ], 'Filipenses 4, 8; 1 Tessalonicenses 5, 21; 1 Coríntios 10, 23-24.', 'Basílio de Cesareia, Discurso aos jovens sobre como tirar proveito das letras gregas (século IV), recomenda discernir e acolher o que conduz ao bem na cultura de seu tempo.', 'CIC 2500-2503 e 2525-2527; Inter mirifica 9-10.', 'Tudo o que é verdadeiro, nobre, justo e puro, levai-o em consideração.', 'Filipenses 4, 8', 'mandamentos')
                ]
            ]
        },
        'dons-espirito-santo': {
            title: 'Dons do Espírito Santo',
            category: 'Formações Básicas',
            pt: [
                '1. Sabedoria',
                '2. Entendimento',
                '3. Conselho',
                '4. Fortaleza',
                '5. Ciência',
                '6. Piedade',
                '7. Temor de Deus'
            ]
        },
        'bem-aventuranças': {
            title: 'Bem-Aventuranças',
            category: 'Formações Básicas',
            pt: [
                'Bem-aventurados os pobres em espírito, porque deles é o Reino dos Céus.',
                'Bem-aventurados os que choram, porque serão consolados.',
                'Bem-aventurados os mansos, porque possuirão a terra.',
                'Bem-aventurados os que têm fome e sede de justiça, porque serão saciados.',
                'Bem-aventurados os misericordiosos, porque alcançarão misericórdia.',
                'Bem-aventurados os puros de coração, porque verão a Deus.',
                'Bem-aventurados os pacíficos, porque serão chamados filhos de Deus.',
                'Bem-aventurados os que sofrem perseguição por causa da justiça, porque deles é o Reino dos Céus.'
            ]
        },
        'credo-explicado': {
            title: 'O Credo explicado',
            category: 'Formações Básicas',
            pt: [
                'O Credo reúne os principais artigos da fé cristã. A primeira parte professa a fé em Deus Pai, Criador e Senhor de todas as coisas (Catecismo da Igreja Católica, CIC 198-421).',
                'A segunda parte anuncia Jesus Cristo: Filho de Deus, que se encarnou, morreu e ressuscitou para a nossa salvação, subiu ao céu e virá julgar os vivos e os mortos (CIC 422-682).',
                'A terceira parte professa a fé no Espírito Santo, que dá vida e santifica a Igreja (CIC 683-747).',
                'A Igreja é una, santa, católica e apostólica. Nela professamos a comunhão dos santos e a esperança do perdão dos pecados (CIC 748-987).',
                'Por fim, professamos a ressurreição dos mortos e a vida eterna, esperança que orienta a vida cristã (CIC 988-1065).',
                'Para rezar o Credo com atenção, faça uma pausa em cada artigo e pergunte: o que esta verdade revela sobre Deus e como ela ilumina minha vida?'
            ]
        },
        'virtudes-e-obras-de-misericordia': {
            title: 'Virtudes e obras de misericórdia',
            category: 'Formações Básicas',
            pt: [
                'As virtudes são disposições firmes para praticar o bem. As virtudes cardeais são prudência, justiça, fortaleza e temperança (CIC 1803-1811).',
                'As virtudes teologais são fé, esperança e caridade. São dons de Deus que orientam a pessoa para Ele e sustentam a vida cristã (CIC 1812-1829).',
                'Os frutos do Espírito Santo são caridade, alegria, paz, paciência, benignidade, bondade, longanimidade, mansidão, fidelidade, modéstia, continência e castidade (CIC 1832).',
                'As obras de misericórdia corporais são: dar de comer a quem tem fome, dar de beber a quem tem sede, vestir quem está sem roupa, acolher quem não tem moradia, visitar os enfermos e encarcerados e sepultar os mortos.',
                'As obras de misericórdia espirituais são: aconselhar, ensinar, corrigir com caridade, consolar, perdoar, suportar com paciência e rezar pelos vivos e pelos mortos.',
                'As obras de misericórdia expressam o amor ao próximo em necessidades concretas (CIC 2447). Escolha uma atitude possível para praticar nesta semana.'
            ]
        },
        'participar-da-missa': {
            title: 'Como participar da Missa',
            category: 'Formações Básicas',
            pt: [
                'A Missa é a celebração da Eucaristia e se organiza em Liturgia da Palavra e Liturgia Eucarística, precedidas pelos ritos iniciais e concluídas pelos ritos finais (CIC 1345-1355).',
                'Nos ritos iniciais, reúna sua atenção e participe das respostas, cantos e orações da assembleia.',
                'Na Liturgia da Palavra, escute as leituras, o salmo, o Evangelho e a homilia. A profissão de fé e a oração dos fiéis respondem à Palavra escutada.',
                'Na Liturgia Eucarística, acompanhe a apresentação das oferendas, a oração eucarística e a consagração com reverência. Reze em união com a comunidade.',
                'Na Comunhão, aproxime-se conforme as orientações da Igreja e da comunidade local. Quem não puder comungar pode permanecer em oração.',
                'Ao final, acolha o envio como convite a viver no cotidiano aquilo que celebrou. A estrutura e o sentido da celebração são apresentados no CIC 1345-1408.'
            ]
        },
        'tempos-liturgicos': {
            title: 'Tempos litúrgicos',
            category: 'Formações Básicas',
            pt: [
                'O ano litúrgico celebra os mistérios de Cristo ao longo do tempo e ajuda a comunidade a percorrer sua vida, morte e ressurreição (CIC 1163-1173).',
                'O Advento é tempo de preparação e esperança; o Natal celebra o nascimento de Jesus e sua manifestação ao mundo.',
                'A Quaresma prepara para a Páscoa por meio da oração, da penitência e da caridade. O Tríduo Pascal celebra a Paixão, Morte e Ressurreição do Senhor.',
                'O Tempo Pascal prolonga a alegria da Ressurreição até Pentecostes, quando a Igreja celebra a vinda do Espírito Santo.',
                'No Tempo Comum, a comunidade contempla a vida e os ensinamentos de Jesus. As solenidades e festas dos santos recordam testemunhas da fé.'
            ]
        },
        'lectio-divina': {
            title: 'Lectio divina',
            category: 'Formações Básicas',
            pt: [
                'Lectio divina é uma forma de rezar com a Bíblia. Escolha um trecho breve, reserve alguns minutos de silêncio e comece pedindo a Deus atenção e abertura.',
                '1. Leitura: leia o texto devagar, mais de uma vez. Observe palavras, personagens e acontecimentos.',
                '2. Meditação: pergunte o que o texto revela e que palavra toca sua vida hoje.',
                '3. Oração: responda a Deus com palavras próprias, louvor, pedido de ajuda ou agradecimento.',
                '4. Contemplação: permaneça alguns instantes em silêncio, acolhendo a presença de Deus.',
                '5. Ação: escolha uma atitude concreta para viver aquilo que rezou. A Igreja recomenda a leitura frequente das Escrituras e sua relação com a oração (CIC 2653-2654).'
            ]
        },
        'exame-de-consciencia': {
            title: 'Exame de consciência',
            category: 'Formações Básicas',
            pt: [
                'O exame de consciência é uma revisão sincera da vida diante de Deus. Pode ser feito diariamente e também como preparação para o sacramento da Reconciliação (CIC 1454).',
                '1. Peça a Deus luz e serenidade para olhar o dia com verdade, sem desânimo.',
                '2. Agradeça pelo bem recebido e pelas oportunidades de amar e servir.',
                '3. Relembre palavras, atitudes e omissões. Pergunte como tratou a Deus, a si mesmo e ao próximo, à luz do Evangelho e dos mandamentos.',
                '4. Reconheça aquilo que precisa de perdão, manifeste arrependimento e confie na misericórdia de Deus.',
                '5. Escolha um passo concreto para reparar o que for possível e agir melhor. Para a confissão, prepare-se com sinceridade e procure um sacerdote.'
            ]
        },
        'introducao-biblia': {
            title: 'Introdução à Bíblia',
            category: 'Formações Básicas',
            pt: [
                'A Bíblia é uma coleção de livros sagrados que a Igreja recebe como Palavra de Deus. O Antigo Testamento narra a história da aliança e prepara para Cristo; o Novo Testamento anuncia Jesus e a vida da Igreja (CIC 120-130).',
                'Entre os principais gêneros bíblicos estão narrativas, leis, poesia e salmos, profecia, evangelhos, cartas e textos de sabedoria. Identificar o gênero ajuda a compreender cada passagem.',
                'Para começar, escolha um dos Evangelhos, como Marcos ou Lucas. Leia uma passagem curta por dia, observe o contexto e anote uma pergunta ou ideia importante.',
                'Os capítulos e versículos ajudam a localizar trechos; por exemplo, Mc 1, 1-8 indica o Evangelho de Marcos, capítulo 1, versículos 1 a 8.',
                'Leia a Escritura considerando a unidade de toda a Bíblia, a Tradição viva da Igreja e a coerência da fé (CIC 109-119). Uma edição católica inclui os livros recebidos no cânon da Igreja.'
            ]
        }
    };

    const formationReferences = {
        '10-mandamentos': 'Êxodo 20, 1-17; Deuteronômio 5, 6-21; Catecismo da Igreja Católica (CIC) 2052-2557.',
        'mandamentos-igreja': 'Catecismo da Igreja Católica (CIC) 2041-2043.',
        '7-sacramentos': 'Catecismo da Igreja Católica (CIC) 1210-1666.',
        'sintese-catecismo': 'Catecismo da Igreja Católica (CIC) 26-2865, organizado em quatro partes.',
        'faq-da-fe': 'Catecismo da Igreja Católica; os parágrafos específicos são indicados em cada resposta.',
        'dons-espirito-santo': 'Catecismo da Igreja Católica (CIC) 1830-1831.',
        'bem-aventuranças': 'Mateus 5, 3-12; Catecismo da Igreja Católica (CIC) 1716-1729.',
        'credo-explicado': 'Catecismo da Igreja Católica (CIC) 185-197 e 198-1065.',
        'virtudes-e-obras-de-misericordia': 'Catecismo da Igreja Católica (CIC) 1803-1845 e 2447.',
        'participar-da-missa': 'Catecismo da Igreja Católica (CIC) 1345-1408.',
        'tempos-liturgicos': 'Catecismo da Igreja Católica (CIC) 1163-1173.',
        'lectio-divina': 'Catecismo da Igreja Católica (CIC) 2653-2654.',
        'exame-de-consciencia': 'Catecismo da Igreja Católica (CIC) 1454.',
        'introducao-biblia': 'Catecismo da Igreja Católica (CIC) 109-130.'
    };
    const prayerVariants = {
        'credo': 'Esta página apresenta o Símbolo dos Apóstolos. Na Missa também pode ser rezado o Símbolo Niceno-Constantinopolitano, com texto mais extenso.',
        'gloria': 'Este é o hino Glória a Deus nas alturas, usado na Missa. No Rosário, a doxologia rezada ao fim de cada dezena é o Glória ao Pai.',
        'angelus': 'Há pequenas diferenças de tradução nas respostas e na oração final. A versão aqui apresentada é uma forma tradicional em português.',
        'salve-rainha': 'Há variantes de tradução, como “degredados” e “exilados”. A formulação pode mudar conforme o livro de oração ou a edição litúrgica.',
        'magnificat': 'O texto pode apresentar diferenças de tradução conforme a edição bíblica ou litúrgica utilizada.',
        'benedictus': 'O texto pode apresentar diferenças de tradução conforme a edição bíblica ou litúrgica utilizada.',
        'nunc-dimittis': 'O texto pode apresentar diferenças de tradução conforme a edição bíblica ou litúrgica utilizada.',
        'salmo-23': 'A numeração e a tradução dos salmos podem variar entre edições bíblicas; algumas identificam este texto como Salmo 22.',
        'salmo-91': 'A numeração e a tradução dos salmos podem variar entre edições bíblicas; algumas identificam este texto como Salmo 90.',
        'oracao-sao-francisco': 'Circulam versões com diferenças de tradução; a atribuição a São Francisco é tradicional.',
        'ato-de-contrição': 'Existem diferentes fórmulas de Ato de Contrição aprovadas e difundidas. Esta é uma das formas tradicionais.',
        'rosario': 'A distribuição dos mistérios por dia apresentada aqui é a forma tradicional mais difundida; costumes locais podem variar.'
    };
    const referenceNote = formationReferences[id]
        ? `<p class="source-note"><strong>Referência:</strong> ${formationReferences[id]}</p>`
        : '';
    const variantNote = prayerVariants[id]
        ? `<p class="variant-note"><strong>Nota sobre variantes:</strong> ${prayerVariants[id]}</p>`
        : '';

    const prayer = prayersData[id];

    if (!prayer) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Orações e Formação - Breviário</title>
                <link rel="stylesheet" href="/nav.css">
                <script src="/nav.js"></script>
            </head>
            <body>
                ${nav}
                <div class="content">
                    <h1 class="section-title">Orações e Formação</h1>
                    <p>Orações não encontrada.</p>
                    <a href="/oracoes" class="hour-btn">Voltar à lista</a>
                </div>
            </body>
            </html>
        `);
    }

    // Encontrar índices para navegação
    const prayerIds = Object.keys(prayersData);
    const currentIndex = prayerIds.indexOf(id);
    const prevId = currentIndex > 0 ? prayerIds[currentIndex - 1] : null;
    const nextId = currentIndex < prayerIds.length - 1 ? prayerIds[currentIndex + 1] : null;

    const navigation = `
        <div class="prayer-navigation">
            ${prevId ? `<a href="/oracoes/${prevId}" class="nav-arrow prev">← Anterior</a>` : '<span class="nav-placeholder"></span>'}
            <a href="/oracoes" class="nav-center">Lista de Orações</a>
            ${nextId ? `<a href="/oracoes/${nextId}" class="nav-arrow next">Próxima →</a>` : '<span class="nav-placeholder"></span>'}
        </div>
    `;

    // Agrupar etapas e mistérios para facilitar a leitura e a oração.
    const contentParts = [];
    let numberedItems = [];
    const versePrayerIds = new Set([
        'padre-nosso', 'ave-maria', 'gloria', 'credo', 'angelus', 'salve-rainha',
        'magnificat', 'benedictus', 'nunc-dimittis', 'salmo-23', 'salmo-91',
        'oracao-sao-francisco', 'oracao-santo-ignacio', 'oracao-manha', 'oracao-noite',
        'ato-de-contrição', 'anjo-da-guarda', 'vinde-espirito-santo'
    ]);
    const flushNumberedItems = () => {
        if (!numberedItems.length) return;
        contentParts.push(`<ol class="prayer-steps">${numberedItems.join('')}</ol>`);
        numberedItems = [];
    };

    if (Array.isArray(prayer.modules)) {
        contentParts.push(`<p class="content-lead">${prayer.pt[0]}</p>`);
        contentParts.push(`
            <nav class="catechism-nav" aria-label="Módulos do Catecismo">
                ${prayer.modules.map((module, index) => `<a href="#catechism-${module.id}"><span aria-hidden="true">${module.icon}</span><span>${index + 1}. ${module.subtitle.split(' — ')[0]}</span></a>`).join('')}
            </nav>
        `);
        contentParts.push(prayer.modules.map((module, moduleIndex) => `
            <section class="catechism-module" id="catechism-${module.id}">
                <header class="module-heading">
                    <span class="module-icon" aria-hidden="true">${module.icon}</span>
                    <div>
                        <p class="module-kicker">Módulo ${moduleIndex + 1} de ${prayer.modules.length}</p>
                        <h2>${module.title}</h2>
                        <p>${module.subtitle}</p>
                    </div>
                </header>
                <p class="module-question">${module.centralQuestion}</p>
                <div class="reading-grid">
                    ${module.cards.map((card, cardIndex) => `
                        <article class="reading-card">
                            <p class="reading-number">Ficha ${String(cardIndex + 1).padStart(2, '0')}</p>
                            <h3>${card.title}</h3>
                            <p class="reading-question"><strong>Pergunta central</strong>${card.question}</p>
                            <p class="reading-summary"><strong>Em resumo</strong>${card.summary}</p>
                            <p class="reading-reference"><strong>Referência</strong>${card.reference}</p>
                            <p class="reading-application"><strong>Na prática</strong>${card.application}</p>
                        </article>
                    `).join('')}
                </div>
            </section>
        `).join(''));
    } else if (Array.isArray(prayer.sections)) {
        contentParts.push(`<p class="content-lead">${prayer.pt[0]}</p>`);
        contentParts.push(prayer.sections.map(section => `
            <section class="formation-section">
                <h3>${section.title}</h3>
                ${section.details.map(([label, description]) => `<p class="formation-detail"><strong>${label}:</strong> ${description}</p>`).join('')}
                <p class="section-reference"><strong>Referência:</strong> ${section.reference}</p>
            </section>
        `).join(''));
    } else if (Array.isArray(prayer.faq)) {
        const faqIndexGroups = [
            { title: 'Práticas, símbolos e tradições', ids: ['sinal-cruz', 'domingo-dia-senhor', 'sacramentais-amuletos', 'simbolos-missa'] },
            { title: 'Igreja, culto e salvação', ids: ['veneracao-imagens', 'intercessao-santos', 'purgatorio', 'papado-pedro', 'religiao-organizada', 'salvacao-nao-catolicos', 'diferencas-catolicos-evangelicos', 'nome-igreja-catolica'] },
            { title: 'Bíblia e Tradição', ids: ['sola-scriptura', 'canon-73-livros', 'escritura-tradicao-magisterio', 'violencia-antigo-testamento'] },
            { title: 'Maria e revelações', ids: ['maria-mae-de-deus', 'irmaos-jesus', 'imaculada-conceicao', 'aparicoes-marianas'] },
            { title: 'Sacramentos na prática', ids: ['sigilo-sacramental', 'eucaristia-presenca-real', 'batismo-infantil', 'confissao-padre', 'comunhao-pecado-grave', 'titulo-sacerdotal-pai'] },
            { title: 'Moral, vida e família', ids: ['contracepcao-artificial', 'aborto-eutanasia', 'divorcio-nulidade', 'celibato-sacerdotal', 'pecado-mortal-venial'] },
            { title: 'Fé, ciência e história', ids: ['evolucao-big-bang', 'fe-ciencia-razao', 'inquisicao-cruzadas', 'riquezas-vaticano', 'galileu'] },
            { title: 'Espiritualidade', ids: ['ocultismo-reiki', 'reencarnacao', 'possessao-exorcismo'] },
            { title: 'Sofrimento, oração e cultura', ids: ['problema-do-mal', 'oracao-nao-atendida', 'conteudo-secular'] }
        ];
        const faqById = new Map(prayer.faq.map(item => [item.id, item]));
        contentParts.push(`<p class="content-lead">${prayer.pt[0]}</p>`);
        contentParts.push(`
            <div class="faq-tools">
                <label for="faq-search">Buscar dúvida, tema ou palavra-chave</label>
                <input id="faq-search" type="search" list="faq-question-list" autocomplete="off" placeholder="Ex.: estátuas, Papa, reencarnação">
                <datalist id="faq-question-list">${prayer.faq.map(item => `<option value="${item.question}"></option>`).join('')}</datalist>
                <div id="faq-suggestions" class="faq-suggestions" role="listbox" aria-label="Sugestões de respostas" hidden></div>
                <p id="faq-result-count" class="faq-result-count" aria-live="polite"></p>
            </div>
            <p id="faq-empty" class="faq-empty" hidden>Nenhuma resposta encontrada. Tente outro termo.</p>
        `);
        contentParts.push(`
            <nav class="faq-index" aria-labelledby="faq-index-heading">
                <h2 id="faq-index-heading">Índice de dúvidas</h2>
                <div class="faq-index-grid">
                    ${faqIndexGroups.map(group => `
                        <section class="faq-index-group">
                            <h3>${group.title}</h3>
                            <ul>
                                ${group.ids.map(faqId => {
                                    const item = faqById.get(faqId);
                                    return item ? `<li><a class="faq-index-link" href="#faq-${item.id}" data-faq-index-target="${item.id}">${item.question}</a></li>` : '';
                                }).join('')}
                            </ul>
                        </section>
                    `).join('')}
                </div>
            </nav>
        `);
        contentParts.push(prayer.faq.map(item => `
            <details class="faq-item" id="faq-${item.id}" data-faq-search="${[item.question, item.keywords, ...item.shortAnswer, item.scripture, item.patristic, item.magisterium].join(' ').toLocaleLowerCase('pt-BR')}">
                <summary class="faq-summary">
                    <span class="faq-summary-question">${item.question}</span>
                    <span class="faq-summary-hint" aria-hidden="true"></span>
                </summary>
                <div class="faq-detail-content">
                    <p class="faq-label">Objeção / dúvida comum</p>
                    <div class="faq-answer">
                        ${item.shortAnswer.map((paragraph, index) => `<p><strong>Resposta curta ${index + 1}</strong>${paragraph}</p>`).join('')}
                    </div>
                    <div class="faq-source-block">
                        <h4>Fundamentação bíblica</h4>
                        <p>${item.scripture}</p>
                    </div>
                    <div class="faq-source-block">
                        <h4>Testemunho histórico-patrístico</h4>
                        <p>${item.patristic}</p>
                    </div>
                    <div class="faq-source-block">
                        <h4>Catecismo e Magistério</h4>
                        <p>${item.magisterium}</p>
                    </div>
                    <figure class="faq-quote" id="faq-quote-${item.id}">
                        <blockquote>“${item.quote}”</blockquote>
                        <figcaption>${item.quoteSource}</figcaption>
                    </figure>
                    <div class="faq-actions">
                        <button class="content-action copy-quote" type="button" data-quote-target="faq-quote-${item.id}">Copiar citação</button>
                        <a href="/oracoes/sintese-catecismo#catechism-${item.module}" class="faq-crosslink">Aprofundar na síntese do Catecismo</a>
                    </div>
                </div>
            </details>
        `).join(''));
    } else if (versePrayerIds.has(id)) {
        const verses = prayer.pt.map((paragraph, index) => {
            if (!paragraph.trim()) return '<p class="verse-stanza-break" aria-hidden="true"></p>';
            const verseClass = `prayer-verse${index === 0 ? ' prayer-opening' : ''}`;
            const responseMatch = paragraph.match(/^(℣\.|℟\.)\s*(.*)$/);
            const prayerLabelMatch = paragraph.match(/^(Oremos:)(.*)$/i);
            if (responseMatch) return `<p class="${verseClass}"><strong class="verse-role">${responseMatch[1]}</strong> ${responseMatch[2]}</p>`;
            if (prayerLabelMatch) return `<p class="${verseClass}"><strong class="verse-role">${prayerLabelMatch[1]}</strong>${prayerLabelMatch[2]}</p>`;
            return `<p class="${verseClass}">${paragraph}</p>`;
        }).join('');
        contentParts.push(`<div class="prayer-verses">${verses}</div>`);
    } else {
        prayer.pt.forEach((paragraph, index) => {
            const mysteryMatch = id === 'rosario'
                ? paragraph.match(/^(.+?):\s*(mistérios [^—]+?)\s+—\s+(.+)$/i)
                : null;
            if (mysteryMatch) {
                flushNumberedItems();
                const mysteries = mysteryMatch[3].split(';').map(mystery => mystery.trim());
                contentParts.push(`
                    <section class="devotion-group">
                        <p class="devotion-days">${mysteryMatch[1]}</p>
                        <h3>${mysteryMatch[2]}</h3>
                        <ol class="mystery-list">${mysteries.map(mystery => `<li>${mystery}</li>`).join('')}</ol>
                    </section>
                `);
                return;
            }

            const numberedMatch = paragraph.match(/^(\d+(?:º|°|\.)\s*(?:dia\s*—\s*)?)(.*)$/i);
            if (numberedMatch) {
                numberedItems.push(`<li><strong>${numberedMatch[1]}</strong>${numberedMatch[2] ? ` ${numberedMatch[2]}` : ''}</li>`);
                return;
            }

            flushNumberedItems();
            const instructionMatch = paragraph.match(/^(Como rezar|Início):\s*(.+)$/i);
            if (instructionMatch) {
                contentParts.push(`<aside class="prayer-instructions"><h3>${instructionMatch[1]}</h3><p>${instructionMatch[2]}</p></aside>`);
                return;
            }

            contentParts.push(`<p${index === 0 ? ' class="content-lead"' : ''}>${paragraph}</p>`);
        });
    }
    flushNumberedItems();
    const content = contentParts.join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>${prayer.title} - Breviário</title>
            <style>${BASE_STYLES}</style><link rel="stylesheet" href="/nav.css"><script src="/nav.js"></script><style>
                body {
                    font-family: var(--site-font-family);
                }
                .section-title {
                    font-family: var(--site-font-family);
                    font-size: 2.8rem;
                    font-weight: 600;
                    line-height: 1.05;
                }
                .content-category {
                    margin: 0 0 18px;
                }
                .content-category span {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 4px;
                    background: rgba(139, 69, 19, 0.08);
                    color: var(--primary-color);
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .prayer-card {
                    padding: clamp(24px, 5vw, 48px);
                    border-radius: 12px;
                }
                .prayer-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(139, 69, 19, 0.1);
                }
                .nav-arrow, .nav-center {
                    color: var(--primary-color);
                    text-decoration: none;
                    font-weight: bold;
                    padding: 10px 15px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                .nav-arrow:hover, .nav-center:hover {
                    background: var(--primary-color);
                    color: white;
                }
                .nav-placeholder {
                    width: 100px;
                }
                .prayer-content {
                    max-width: 70ch;
                    margin: 0 auto;
                    font-family: var(--site-font-family);
                    font-size: 1.12rem;
                    line-height: 1.85;
                    color: #34271f;
                }
                .prayer-content p {
                    margin: 0 0 12px;
                    text-align: left;
                }
                .prayer-content .content-lead {
                    margin: 0 0 28px;
                    color: var(--primary-color);
                    font-size: 1.22rem;
                    font-weight: 500;
                    line-height: 1.7;
                }
                .prayer-verses {
                    padding: 8px 0;
                }
                .prayer-content .prayer-verse {
                    margin: 0 0 7px;
                    line-height: 1.65;
                }
                .prayer-content .prayer-opening {
                    margin-bottom: 15px;
                    color: var(--primary-color);
                    font-size: 1.22rem;
                    font-weight: 600;
                }
                .prayer-content .verse-stanza-break {
                    height: 14px;
                    margin: 0;
                }
                .verse-role {
                    color: var(--primary-color);
                    font-family: var(--site-font-family);
                    font-size: 0.92em;
                    font-weight: 700;
                }
                .prayer-content h3 {
                    margin: 0 0 8px;
                    color: var(--primary-color);
                    font-family: var(--site-font-family);
                    font-size: 1.45rem;
                    font-weight: 700;
                    line-height: 1.15;
                }
                .formation-section, .faq-item {
                    padding: 20px 0 8px;
                    border-top: 1px solid var(--accent-color);
                }
                .faq-item {
                    scroll-margin-top: 88px;
                    margin: 0;
                    padding: 0;
                }
                .faq-index {
                    margin: 22px 0 34px;
                    padding: 18px 0 22px;
                    border-top: 2px solid var(--accent-color);
                    border-bottom: 1px solid var(--accent-color);
                }
                .faq-index > h2 {
                    margin: 0 0 16px;
                    color: var(--primary-color);
                    font-size: 1.55rem;
                }
                .faq-index-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 18px 28px;
                }
                .faq-index-group h3 {
                    margin: 0 0 7px;
                    color: var(--primary-color);
                    font-size: 1.08rem;
                }
                .faq-index-group ul {
                    margin: 0;
                    padding-left: 20px;
                }
                .faq-index-group li {
                    margin: 0 0 4px;
                    line-height: 1.4;
                }
                .faq-index-link {
                    display: inline-block;
                    scroll-margin-top: 100px;
                    color: var(--text-color);
                    text-decoration-thickness: 1px;
                    text-underline-offset: 2px;
                }
                .faq-index-link:hover, .faq-index-link:focus-visible {
                    color: var(--primary-color);
                }
                .faq-summary {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 14px;
                    padding: 17px 8px;
                    border-top: 1px solid var(--accent-color);
                    color: var(--primary-color);
                    cursor: pointer;
                    list-style: none;
                }
                .faq-summary::-webkit-details-marker {
                    display: none;
                }
                .faq-summary-question {
                    font-size: 1.12rem;
                    font-weight: 700;
                    line-height: 1.4;
                }
                .faq-summary-hint {
                    flex: 0 0 30px;
                    width: 30px;
                    height: 30px;
                    border: 1px solid var(--accent-color);
                    border-radius: 50%;
                    color: var(--primary-color);
                    font-size: 0;
                    text-align: center;
                }
                .faq-summary-hint::before {
                    content: '+';
                    font-size: 1.25rem;
                    line-height: 27px;
                }
                .faq-item[open] .faq-summary-hint::before {
                    content: '−';
                }
                .faq-detail-content {
                    padding: 0 8px 25px;
                }
                .faq-item[open] .faq-summary {
                    padding-bottom: 12px;
                }
                .faq-item[open] .faq-summary-question {
                    text-decoration: underline;
                    text-decoration-thickness: 1px;
                    text-underline-offset: 4px;
                }
                .faq-tools {
                    position: relative;
                    margin: 24px 0 18px;
                }
                .faq-tools label {
                    display: block;
                    margin-bottom: 7px;
                    color: var(--primary-color);
                    font-size: 0.92rem;
                    font-weight: 700;
                }
                .faq-tools input {
                    width: min(100%, 720px);
                    min-height: 48px;
                    padding: 10px 14px;
                    border: 1px solid var(--accent-color);
                    border-radius: 6px;
                    background: white;
                    color: var(--text-color);
                    font: inherit;
                }
                .faq-tools input:focus-visible {
                    outline: 2px solid var(--primary-color);
                    outline-offset: 2px;
                }
                .faq-suggestions {
                    display: grid;
                    width: min(100%, 720px);
                    margin-top: 5px;
                    border: 1px solid var(--accent-color);
                    border-radius: 6px;
                    background: white;
                    box-shadow: 0 8px 18px rgba(44, 31, 19, 0.08);
                }
                .faq-suggestions[hidden] {
                    display: none;
                }
                .faq-suggestion {
                    padding: 10px 13px;
                    border: 0;
                    border-bottom: 1px solid rgba(139, 69, 19, 0.12);
                    background: transparent;
                    color: var(--text-color);
                    font: inherit;
                    text-align: left;
                    cursor: pointer;
                }
                .faq-suggestion:last-child {
                    border-bottom: 0;
                }
                .faq-suggestion:hover, .faq-suggestion:focus-visible {
                    background: rgba(139, 69, 19, 0.07);
                    color: var(--primary-color);
                }
                .faq-result-count, .faq-empty {
                    margin: 8px 0 0 !important;
                    color: var(--muted-color, var(--text-color));
                    font-size: 0.9rem;
                }
                .faq-item[hidden] {
                    display: none;
                }
                .faq-label {
                    margin: 0 0 5px !important;
                    color: var(--primary-color);
                    font-size: 0.78rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .faq-objection h3 {
                    margin-bottom: 18px;
                    font-size: 1.55rem;
                }
                .faq-answer {
                    margin-bottom: 20px;
                    padding: 16px 18px;
                    border-left: 4px solid var(--primary-color);
                    background: rgba(139, 69, 19, 0.06);
                }
                .faq-answer p {
                    margin: 0 0 12px;
                    line-height: 1.7;
                }
                .faq-answer p:last-child {
                    margin-bottom: 0;
                }
                .faq-answer strong, .faq-source-block h4 {
                    display: block;
                    margin: 0 0 4px;
                    color: var(--primary-color);
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .faq-source-block {
                    margin: 15px 0;
                }
                .faq-source-block p {
                    margin: 0;
                    line-height: 1.65;
                }
                .faq-quote {
                    margin: 20px 0 14px;
                    padding: 15px 18px;
                    border-left: 3px solid var(--accent-color);
                    background: rgba(255, 255, 255, 0.72);
                }
                .faq-quote blockquote {
                    margin: 0;
                    color: var(--primary-color);
                    font-size: 1.12rem;
                    font-style: italic;
                    font-weight: 600;
                    line-height: 1.55;
                }
                .faq-quote figcaption {
                    margin-top: 6px;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .faq-actions {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 12px;
                }
                .faq-crosslink {
                    color: var(--primary-color);
                    font-weight: 700;
                    text-decoration-thickness: 1px;
                    text-underline-offset: 3px;
                }
                .faq-crosslink:hover, .faq-crosslink:focus-visible {
                    color: var(--secondary-color);
                }
                .module-reader {
                    width: 100%;
                    padding: 0;
                    border: 0;
                    background: transparent;
                    box-shadow: none;
                }
                .module-content {
                    width: 100%;
                    max-width: none;
                }
                .catechism-nav {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin: 24px 0 38px;
                }
                .catechism-nav a {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    min-height: 42px;
                    padding: 8px 13px;
                    border: 1px solid var(--accent-color);
                    border-radius: 6px;
                    color: var(--primary-color);
                    font-size: 0.95rem;
                    font-weight: 700;
                    text-decoration: none;
                }
                .catechism-nav a:hover, .catechism-nav a:focus-visible {
                    background: var(--primary-color);
                    color: white;
                }
                .catechism-module {
                    scroll-margin-top: 24px;
                    margin-bottom: 46px;
                }
                .module-heading {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding-bottom: 18px;
                    border-bottom: 2px solid var(--accent-color);
                }
                .module-icon {
                    display: grid;
                    flex: 0 0 54px;
                    width: 54px;
                    height: 54px;
                    place-items: center;
                    border-radius: 50%;
                    background: rgba(139, 69, 19, 0.1);
                    color: var(--primary-color);
                    font-size: 1.7rem;
                }
                .module-kicker, .reading-number {
                    margin: 0 0 4px !important;
                    color: var(--primary-color);
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .module-heading h2 {
                    margin: 0;
                    color: var(--primary-color);
                    font-size: 1.8rem;
                    line-height: 1.15;
                }
                .module-heading div > p:last-child {
                    margin: 3px 0 0;
                    font-size: 1rem;
                }
                .module-question {
                    margin: 18px 0 22px !important;
                    color: var(--primary-color);
                    font-size: 1.15rem;
                    font-weight: 700;
                }
                .reading-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 16px;
                }
                .reading-card {
                    min-width: 0;
                    padding: 20px;
                    border: 1px solid var(--accent-color);
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.78);
                }
                .reading-card h3 {
                    margin: 0 0 16px;
                    color: var(--primary-color);
                    font-size: 1.38rem;
                    line-height: 1.2;
                }
                .reading-card > p:not(.reading-number) {
                    margin: 0 0 12px;
                    font-size: 1rem;
                    line-height: 1.65;
                }
                .reading-card strong {
                    display: block;
                    margin-bottom: 3px;
                    color: var(--primary-color);
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .reading-card .reading-question {
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--accent-color);
                    font-weight: 600;
                }
                .reading-card .reading-reference {
                    font-size: 0.92rem !important;
                }
                .reading-card .reading-application {
                    margin-bottom: 0 !important;
                    padding: 11px 12px;
                    border-left: 3px solid var(--primary-color);
                    background: rgba(139, 69, 19, 0.06);
                }
                .formation-detail {
                    margin-bottom: 10px !important;
                }
                .formation-detail strong {
                    color: var(--primary-color);
                    font-family: var(--site-font-family);
                    font-weight: 700;
                }
                .section-reference {
                    margin: 12px 0 0 !important;
                    color: var(--primary-color);
                    font-family: var(--site-font-family);
                    font-size: 0.92rem;
                }
                .prayer-steps, .mystery-list {
                    margin: 0 0 20px;
                    padding-left: 1.6rem;
                }
                .prayer-steps li, .mystery-list li {
                    margin: 0 0 8px;
                    padding-left: 4px;
                    line-height: 1.7;
                }
                .devotion-group {
                    margin: 0 0 18px;
                    padding: 16px 0 8px;
                    border-top: 1px solid var(--accent-color);
                }
                .devotion-days {
                    margin: 0 0 5px !important;
                    color: var(--text-color);
                    font-family: var(--site-font-family);
                    font-size: 0.9rem;
                    font-weight: 700;
                }
                .prayer-instructions {
                    margin: 22px 0;
                    padding: 15px 19px;
                    border-left: 4px solid var(--primary-color);
                    background: rgba(139, 69, 19, 0.06);
                }
                .prayer-instructions p {
                    margin: 0;
                }
                .prayer-content strong {
                    color: var(--primary-color);
                    font-weight: 700;
                }
                .content-actions {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 10px;
                    margin: 18px 0;
                }
                .content-action {
                    padding: 8px 14px;
                }
                .content-action:hover, .content-action:focus-visible,
                .favorite-toggle:hover, .favorite-toggle:focus-visible,
                .favorites-filter:hover, .favorites-filter:focus-visible {
                    outline: 2px solid var(--primary-color);
                    outline-offset: 2px;
                }
                .source-note, .variant-note {
                    padding-top: 12px;
                    border-top: 1px solid var(--accent-color);
                    font-size: 0.95rem;
                    text-align: left !important;
                }
                .source-note strong, .variant-note strong {
                    display: block;
                    margin-bottom: 4px;
                    color: var(--primary-color);
                    font-family: var(--site-font-family);
                    font-size: 0.82rem;
                    text-transform: uppercase;
                }
                .action-status {
                    min-height: 1.5em;
                    margin: 0 0 12px;
                }
                @media (max-width: 768px) {
                    .section-title {
                        font-size: 2.35rem;
                    }
                    .faq-index-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                    .faq-index {
                        margin-top: 18px;
                    }
                    .faq-summary {
                        gap: 10px;
                        padding: 14px 4px;
                    }
                    .faq-summary-question {
                        font-size: 1rem;
                    }
                    .reading-grid {
                        grid-template-columns: 1fr;
                    }
                    .module-heading h2 {
                        font-size: 1.55rem;
                    }
                    .catechism-nav {
                        gap: 6px;
                    }
                    .catechism-nav a {
                        flex: 1 1 45%;
                    }
                    .prayer-content {
                        font-size: 1.04rem;
                    }
                    .prayer-navigation {
                        flex-direction: column;
                        gap: 10px;
                    }
                    .nav-arrow, .nav-center {
                        width: 100%;
                        text-align: center;
                    }
                    .nav-placeholder {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            ${nav}
            <div class="content">
                <h1 class="section-title">${prayer.title}</h1>
                <p class="content-category"><span>${prayer.category}</span></p>
                ${navigation}
                <div class="content-actions" aria-label="Ações do conteúdo">
                    <button class="content-action favorite-toggle" type="button" data-favorite-id="${id}" data-favorite-title="${prayer.title}" aria-label="Adicionar ${prayer.title} aos favoritos" aria-pressed="false" title="Adicionar aos favoritos">☆</button>
                    <button id="copy-content" class="content-action" type="button">Copiar conteúdo</button>
                    <button id="share-content" class="content-action" type="button">Compartilhar</button>
                </div>
                <p id="action-status" class="action-status" role="status" aria-live="polite"></p>
                <div class="${Array.isArray(prayer.modules) ? 'module-reader' : 'prayer-card'}">
                    <div class="prayer-content${Array.isArray(prayer.modules) ? ' module-content' : ''}">
                        ${content}
                        ${Array.isArray(prayer.modules) || Array.isArray(prayer.faq) ? '' : referenceNote}
                        ${variantNote}
                    </div>
                </div>
            </div>
            <script>
                const favoritesStorageKey = 'breviario-favoritos';
                const favoriteButton = document.querySelector('[data-favorite-id]');
                const actionStatus = document.getElementById('action-status');

                function getFavoriteIds() {
                    try {
                        const stored = JSON.parse(localStorage.getItem(favoritesStorageKey) || '[]');
                        return Array.isArray(stored) ? stored : [];
                    } catch {
                        return [];
                    }
                }

                function updateFavoriteButton() {
                    const isFavorite = getFavoriteIds().includes(favoriteButton.dataset.favoriteId);
                    favoriteButton.textContent = isFavorite ? '★' : '☆';
                    favoriteButton.setAttribute('aria-pressed', String(isFavorite));
                    favoriteButton.setAttribute('aria-label', (isFavorite ? 'Remover ' : 'Adicionar ') + favoriteButton.dataset.favoriteTitle + ' ' + (isFavorite ? 'dos' : 'aos') + ' favoritos');
                    favoriteButton.title = isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
                }

                favoriteButton.addEventListener('click', () => {
                    const favorites = new Set(getFavoriteIds());
                    if (favorites.has(favoriteButton.dataset.favoriteId)) {
                        favorites.delete(favoriteButton.dataset.favoriteId);
                    } else {
                        favorites.add(favoriteButton.dataset.favoriteId);
                    }
                    try {
                        localStorage.setItem(favoritesStorageKey, JSON.stringify([...favorites]));
                    } catch {
                        actionStatus.textContent = 'Não foi possível salvar o favorito neste navegador.';
                    }
                    updateFavoriteButton();
                });

                async function copyText(text) {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(text);
                        return;
                    }
                    const temporaryInput = document.createElement('textarea');
                    temporaryInput.value = text;
                    temporaryInput.style.position = 'fixed';
                    temporaryInput.style.opacity = '0';
                    document.body.appendChild(temporaryInput);
                    temporaryInput.select();
                    const copied = document.execCommand('copy');
                    temporaryInput.remove();
                    if (!copied) throw new Error('Cópia indisponível');
                }

                function getContentText() {
                    return document.querySelector('.prayer-content').innerText.trim();
                }

                document.getElementById('copy-content').addEventListener('click', async () => {
                    try {
                        await copyText(document.querySelector('.section-title').textContent + String.fromCharCode(10, 10) + getContentText());
                        actionStatus.textContent = 'Conteúdo copiado.';
                    } catch {
                        actionStatus.textContent = 'Não foi possível copiar o conteúdo.';
                    }
                });

                document.getElementById('share-content').addEventListener('click', async () => {
                    const text = document.querySelector('.section-title').textContent + String.fromCharCode(10, 10) + getContentText();
                    try {
                        if (navigator.share) {
                            await navigator.share({ title: document.title, text, url: window.location.href });
                            actionStatus.textContent = 'Compartilhamento concluído.';
                        } else {
                            await copyText(text + String.fromCharCode(10, 10) + window.location.href);
                            actionStatus.textContent = 'Link e conteúdo copiados para compartilhar.';
                        }
                    } catch (error) {
                        if (error.name !== 'AbortError') actionStatus.textContent = 'Não foi possível compartilhar o conteúdo.';
                    }
                });

                document.querySelectorAll('.copy-quote').forEach(button => {
                    button.addEventListener('click', async () => {
                        const quote = document.getElementById(button.dataset.quoteTarget);
                        try {
                            await copyText(quote.querySelector('blockquote').textContent + String.fromCharCode(10) + quote.querySelector('figcaption').textContent);
                            actionStatus.textContent = 'Citação e referência copiadas.';
                        } catch {
                            actionStatus.textContent = 'Não foi possível copiar a citação.';
                        }
                    });
                });

                const faqSearch = document.getElementById('faq-search');
                if (faqSearch) {
                    const faqCards = [...document.querySelectorAll('.faq-item')];
                    const faqSuggestions = document.getElementById('faq-suggestions');
                    const normalizeFaqText = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

                    function updateFaqSearch() {
                        const query = normalizeFaqText(faqSearch.value.trim());
                        const matches = faqCards.filter(card => normalizeFaqText(card.dataset.faqSearch).includes(query));
                        faqCards.forEach(card => {
                            card.hidden = !matches.includes(card);
                        });
                        if (query && matches.length === 1) matches[0].open = true;
                        document.querySelectorAll('.faq-index-link').forEach(link => {
                            const target = document.getElementById('faq-' + link.dataset.faqIndexTarget);
                            link.parentElement.hidden = target.hidden;
                        });
                        document.querySelectorAll('.faq-index-group').forEach(group => {
                            group.hidden = ![...group.querySelectorAll('.faq-index-link')].some(link => !link.parentElement.hidden);
                        });
                        document.getElementById('faq-empty').hidden = matches.length > 0;
                        document.getElementById('faq-result-count').textContent = query
                            ? matches.length + ' ' + (matches.length === 1 ? 'resposta encontrada' : 'respostas encontradas')
                            : matches.length + ' respostas disponíveis';

                        faqSuggestions.replaceChildren();
                        matches.slice(0, 5).forEach(card => {
                            const suggestion = document.createElement('button');
                            suggestion.type = 'button';
                            suggestion.className = 'faq-suggestion';
                            suggestion.dataset.faqTarget = card.id;
                            suggestion.dataset.faqQuestion = card.querySelector('.faq-summary-question').textContent;
                            suggestion.textContent = card.querySelector('.faq-summary-question').textContent;
                            faqSuggestions.appendChild(suggestion);
                        });
                        faqSuggestions.hidden = !query || matches.length === 0;
                    }

                    faqSearch.addEventListener('input', updateFaqSearch);
                    faqSuggestions.addEventListener('click', event => {
                        const suggestion = event.target.closest('[data-faq-target]');
                        if (!suggestion) return;
                        faqSearch.value = suggestion.dataset.faqQuestion;
                        updateFaqSearch();
                        const target = document.getElementById(suggestion.dataset.faqTarget);
                        target.open = true;
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        target.querySelector('summary').focus({ preventScroll: true });
                    });

                    document.querySelector('.faq-index').addEventListener('click', event => {
                        const link = event.target.closest('[data-faq-index-target]');
                        if (link) document.getElementById('faq-' + link.dataset.faqIndexTarget).open = true;
                    });

                    function openFaqFromHash() {
                        const targetId = location.hash.slice(1);
                        if (!targetId) return;
                        const target = document.getElementById(targetId);
                        if (target && target.matches('.faq-item')) target.open = true;
                    }

                    window.addEventListener('hashchange', openFaqFromHash);
                    openFaqFromHash();
                    updateFaqSearch();
                }

                updateFavoriteButton();
            </script>
        </body>
        </html>
    `);
});

module.exports = router;
