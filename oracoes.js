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
        { id: 'ato-de-contrição', title: 'Ato de Contrição', category: 'Orações de Penitência' },
        { id: '10-mandamentos', title: 'Os 10 Mandamentos', category: 'Formações Básicas' },
        { id: 'mandamentos-igreja', title: 'Mandamentos da Igreja', category: 'Formações Básicas' },
        { id: '7-sacramentos', title: 'Os 7 Sacramentos', category: 'Formações Básicas' },
        { id: 'dons-espirito-santo', title: 'Dons do Espírito Santo', category: 'Formações Básicas' },
        { id: 'bem-aventuranças', title: 'Bem-Aventuranças', category: 'Formações Básicas' }
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
    const prayerCategories = ['Orações Básicas', 'Orações Marianas', 'Orações de Louvor', 'Profissão de Fé', 'Orações Diárias', 'Cânticos Bíblicos', 'Salmos', 'Orações de Santos', 'Orações de Penitência'];
    const formationCategories = ['Formações Básicas'];

    const prayerSections = prayerCategories.filter(cat => categories[cat]).map(category => `
        <div class="category-section">
            <h2 class="category-title">${category}</h2>
            <div class="prayers-grid">
                ${categories[category].map(prayer => `
                    <div class="prayer-card">
                        <h3 class="prayer-title">${prayer.title}</h3>
                        <a href="/oracoes/${prayer.id}" class="hour-btn">Ver Oração</a>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    const formationSections = formationCategories.filter(cat => categories[cat]).map(category => `
        <div class="category-section">
            <h2 class="category-title">${category}</h2>
            <div class="prayers-grid">
                ${categories[category].map(prayer => `
                    <div class="prayer-card">
                        <h3 class="prayer-title">${prayer.title}</h3>
                        <a href="/oracoes/${prayer.id}" class="hour-btn">Ver Formação</a>
                    </div>
                `).join('')}
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
                    font-size: 1.2rem;
                    color: var(--primary-color);
                    margin-bottom: 15px;
                    font-weight: bold;
                }
                @media (max-width: 768px) {
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
                }
                // Show prayers tab by default
                document.addEventListener('DOMContentLoaded', function() {
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
                
                <div id="oracoes-tab" class="tab-content">
                    ${prayerSections}
                </div>
                
                <div id="formacao-tab" class="tab-content">
                    ${formationSections}
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
            title: 'Os 7 Sacramentos',
            category: 'Formações Básicas',
            pt: [
                '1. Batismo',
                '2. Confirmação',
                '3. Eucaristia',
                '4. Penitência',
                '5. Unção dos Enfermos',
                '6. Ordem Sacerdotal',
                '7. Matrimônio'
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
        }
    };

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

    // Renderizar conteúdo da oração
    const content = prayer.pt.map(paragraph => `<p>${paragraph}</p>`).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>${prayer.title} - Breviário</title>
            <style>${BASE_STYLES}</style><link rel="stylesheet" href="/nav.css"><script src="/nav.js"></script><style>
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
                    line-height: 1.8;
                    font-size: 1.1rem;
                }
                .prayer-content p {
                    margin-bottom: 15px;
                    text-align: justify;
                }
                .prayer-content strong {
                    color: var(--primary-color);
                    font-weight: bold;
                }
                @media (max-width: 768px) {
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
                <p><strong>Categoria:</strong> ${prayer.category}</p>
                ${navigation}
                <div class="prayer-card">
                    <div class="prayer-content">
                        ${content}
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

module.exports = router;
