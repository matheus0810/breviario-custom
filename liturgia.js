const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const SAO_PAULO_TZ = 'America/Sao_Paulo';
const CALENDARIO_URL = 'https://liturgiadashoras.online/calendario/';
const BASE_SITE_URL = 'https://liturgiadashoras.online/';
const FIXED_DATE_LINKS = {};

const NAV_SECTIONS = [
    { id: 'liturgia', label: 'Liturgia das Horas', href: '/?tipo=laudes' },
    { id: 'leituras', label: 'Leituras', href: '/leituras' },
    { id: 'missa', label: 'Missa', href: '/missa' },
    { id: 'oracoes', label: 'Orações e Formação', href: '/oracoes' }
];

// importar scripts compartilhados (se disponíveis)
let BASE_SCRIPTS = '';
try {
    ({ BASE_SCRIPTS } = require('./constants'));
} catch (e) {
    BASE_SCRIPTS = '';
}

const HORA_OPTIONS = [
    { tipo: 'invitatorio', label: 'Invitatório', periodo: 'Início' },
    { tipo: 'laudes', label: 'Laudes', periodo: 'Manhã' },
    { tipo: 'vesperas', label: 'Vésperas', periodo: 'Tarde' },
    { tipo: 'completas', label: 'Completas', periodo: 'Noite' }
];

const INVITATORIO_CONTENT = `
<h2>Invitatório</h2>

<p>O Invitatório tem seu lugar no início da oração cotidiana, ou seja, antepõe-se ao Ofício das Leituras, ou às Laudes, conforme se comece o dia por uma ou por outra ação litúrgica.</p>

<p>V. Abri os meus lábios, ó Senhor.<br>
R. E minha boca anunciará vosso louvor.</p>

<p>Em seguida diz-se o Salmo 94(95) com sua antífona, em forma responsorial. Anuncia-se a antífona e imediatamente repete-se a mesma. Depois de cada estrofe, repete-se de novo.</p>

<p>Na recitação individual não é necessário repetir a antífona; basta dizê-la no começo e no fim do salmo.</p>

<h3>Salmo 94(95)</h3>

<p><strong>Convite ao louvor de Deus</strong></p>

<p><em>Animai-vos uns aos outros, dia após dia, enquanto ainda se disser 'hoje' (Hb 3,13).</em></p>

<p>Um solista canta ou reza a antífona, e a assembléia a repete.</p>

<p>–1 Vinde, exultemos de alegria no Senhor, *<br>
aclamemos o Rochedo que nos salva!<br>
–2 Ao seu encontro caminhemos com louvores, *<br>
e com cantos de alegria o celebremos!</p>

<p><em>Repete-se a antífona.</em></p>

<p>–3 Na verdade, o Senhor é o grande Deus, *<br>
o grande Rei, muito maior que os deuses todos.<br>
–4 Tem nas mãos as profundezas dos abismos, *<br>
e as alturas das montanhas lhe pertencem;<br>
–5 o mar é dele, pois foi ele quem o fez, *<br>
e a terra firme suas mãos a modelaram.</p>

<p><em>Repete-se a antífona.</em></p>

<p>–6 Vinde adoremos e prostremo-nos por terra, *<br>
e ajoelhemos ante o Deus que nos criou!<br>
=7 Porque ele é o nosso Deus, nosso Pastor, †<br>
e nós somos o seu povo e seu rebanho, *<br>
as ovelhas que conduz com sua mão.</p>

<p><em>Repete-se a antífona.</em></p>

<p>=8 Oxalá ouvísseis hoje a sua voz: †<br>
"Não fecheis os corações como em Meriba, *<br>
9 como em Massa, no deserto, aquele dia,<br>
– em que outrora vossos pais me provocaram, *<br>
apesar de terem visto as minhas obras".</p>

<p><em>Repete-se a antífona.</em></p>

<p>=10 Quarenta anos desgostou-me aquela raça †<br>
e eu disse: "Eis um povo transviado, *<br>
11 seu coração não conheceu os meus caminhos!"<br>
– E por isso lhes jurei na minha ira: *<br>
"Não entrarão no meu repouso prometido!"</p>

<p><em>Repete-se a antífona.</em></p>

<p><strong>(Cantado)</strong></p>

<p>Demos glória a Deus Pai onipotente<br>
e a seu Filho, Jesus Cristo, Senhor nosso, †<br>
e ao Espírito que habita em nosso peito *<br>
pelos séculos dos séculos. Amém.</p>

<p><strong>(Rezado):</strong></p>

<p>– Glória ao Pai e ao Filho e ao Espírito Santo. *<br>
Como era no princípio, agora e sempre. Amém.</p>

<p><em>Repete-se a antífona.</em></p>

<p>O salmo 94(95) pode ser substituído pelo salmo (99)100, salmo 66(67), ou salmo 23(24), abaixo. Se um destes salmos ocorre no Ofício, em seu lugar diz-se o salmo 94(95).</p>

<p>Quando o Invitatório é recitado antes das Laudes, pode ser omitido o salmo com sua antífona, conforme as circunstâncias.</p>

<h3>Salmo 23(24)</h3>

<p><strong>Entrada do Senhor no templo</strong></p>

<p><em>Na ascensão, as portas do céu se abriram para o Cristo (Sto. Irineu).</em></p>

<p>–1 Ao Senhor pertence a terra e o que ela encerra, *<br>
o mundo inteiro com os seres que o povoam;<br>
–2 porque ele a tornou firme sobre os mares, *<br>
e sobre as águas a mantém inabalável.</p>

<p>R.</p>

<p>–3 "Quem subirá até o monte do Senhor, *<br>
quem ficará em sua santa habitação?"<br>
=4 "Quem tem mãos puras e inocente coração, †<br>
quem não dirige sua mente para o crime, *<br>
nem jura falso para o dano de seu próximo.</p>

<p>R.</p>

<p>–5 Sobre este desce a bênção do Senhor *<br>
e a recompensa de seu Deus e Salvador".<br>
–6 "É assim a geração dos que o procuram, *<br>
e do Deus de Israel buscam a face".</p>

<p>R.</p>

<p>=7 "Ó portas, levantai vossos frontões! †<br>
Elevai-vos bem mais alto, antigas portas, *<br>
a fim de que o Rei da glória possa entrar!"</p>

<p>R.</p>

<p>=8 Dizei-nos: "Quem é este Rei da glória?" †<br>
"É o Senhor, o valoroso, o onipotente, *<br>
o Senhor, o poderoso nas batalhas!"</p>

<p>R.</p>

<p>=9 "Ó portas, levantai vossos frontões! †<br>
Elevai-vos bem mais alto, antigas portas, *<br>
a fim de que o Rei da glória possa entrar!"</p>

<p>R.</p>

<p>=10 Dizei-nos: "Quem é este Rei da glória?" †<br>
"O Rei da glória é o Senhor onipotente, *<br>
o Rei da glória é o Senhor Deus do universo!"</p>

<p>R.</p>

<p>– Glória ao Pai e ao Filho e ao Espírito Santo. *<br>
Como era no princípio, agora e sempre. Amém.</p>

<p>R.</p>

<h3>Salmo 66(67)</h3>

<p><strong>Todos os povos celebrem o Senhor</strong></p>

<p><em>Sabei, pois, que esta salvação de Deus já foi comunicada aos pagãos! (At 28,28).</em></p>

<p>–2 Que Deus nos dê a sua graça e sua bênção, *<br>
e sua face resplandeça sobre nós!<br>
–3 Que na terra se conheça o seu caminho *<br>
e a sua salvação por entre os povos.</p>

<p>R.</p>

<p>–4 Que as nações vos glorifiquem, ó Senhor, *<br>
que todas as nações vos glorifiquem!</p>

<p>R.</p>

<p>–5 Exulte de alegria a terra inteira, *<br>
pois julgais o universo com justiça;<br>
– os povos governais com retidão, *<br>
e guiais, em toda a terra, as nações.</p>

<p>R.</p>

<p>–6 Que as nações vos glorifiquem, ó Senhor, *<br>
que todas as nações vos glorifiquem!</p>

<p>R.</p>

<p>–7 A terra produziu sua colheita: *<br>
o Senhor e nosso Deus nos abençoa.<br>
–8 Que o Senhor e nosso Deus nos abençoe, *<br>
e o respeitem os confins de toda terra!</p>

<p>R.</p>

<p>– Glória ao Pai e ao Filho e ao Espírito Santo. *<br>
Como era no princípio, agora e sempre. Amém.</p>

<p>R.</p>

<h3>Salmo 99(100)</h3>

<p><strong>Alegria dos que entram no templo</strong></p>

<p><em>O Senhor ordena aos que foram salvos que cantem o hino de vitória (Sto. Atanásio).</em></p>

<p>=2 Aclamai o Senhor, ó terra inteira, †<br>
servi ao Senhor com alegria, *<br>
ide a ele cantando jubilosos!</p>

<p>R.</p>

<p>=3 Sabei que o Senhor, só ele, é Deus †<br>
Ele mesmo nos fez, e somos seus, *<br>
nós somos seu povo e seu rebanho.</p>

<p>R.</p>

<p>=4 Entrai por suas portas dando graças, †<br>
e em seus átrios com hinos de louvor, *<br>
dai-lhe graças, seu nome bendizei!</p>

<p>R.</p>

<p>=5 Sim, é bom o Senhor e nosso Deus, †<br>
sua bondade perdura para sempre, *<br>
seu amor é fiel eternamente!</p>

<p>R.</p>

<p>– Glória ao Pai e ao Filho, e ao Espírito Santo. *<br>
Como era no princípio, agora e sempre. Amém.</p>

<p>R.</p>
`;

// Importar estilos base (assumindo que será passado do server principal)
const BASE_STYLES = `
    :root {
        --primary-color: #8B4513;
        --secondary-color: #A0522D;
        --accent-color: #CD853F;
        --text-color: #2F1B14;
        --bg-color: #F5F5DC;
        --light-bg: #FAF9F5;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Times New Roman', serif;
        line-height: 1.6;
        color: var(--text-color);
        background: var(--bg-color);
    }

    .main-nav {
        background: rgba(255, 255, 255, 0.95);
        border-bottom: 1px solid rgba(139, 69, 19, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
        backdrop-filter: blur(10px);
    }

    .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
    }

    .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
        text-decoration: none;
    }

    .nav-menu {
        display: flex;
        gap: 30px;
    }

    .nav-item {
        color: var(--secondary-color);
        text-decoration: none;
        padding: 15px 0;
        font-weight: 500;
        transition: color 0.3s ease;
        position: relative;
    }

    .nav-item:hover,
    .nav-item.active {
        color: var(--primary-color);
    }

    .nav-item.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--accent-color);
    }

    .hours-selector {
        background: rgba(255, 255, 255, 0.9);
        border-bottom: 1px solid rgba(139, 69, 19, 0.1);
        padding: 10px 0;
    }

    .selector-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        gap: 15px;
        padding: 0 20px;
    }

    .hour-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 16px;
        border-radius: 20px;
        text-decoration: none;
        color: var(--secondary-color);
        background: rgba(139, 69, 19, 0.05);
        border: 1px solid rgba(139, 69, 19, 0.1);
        transition: all 0.3s ease;
        font-size: 14px;
    }

    .hour-chip:hover {
        background: rgba(139, 69, 19, 0.1);
        color: var(--primary-color);
    }

    .hour-chip.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .hour-chip span {
        font-weight: 600;
    }

    .hour-chip small {
        font-size: 11px;
        opacity: 0.8;
    }

    .liturgia-info-banner {
        background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(205, 133, 63, 0.1));
        border-bottom: 1px solid rgba(139, 69, 19, 0.2);
        padding: 12px 0;
    }

    .liturgia-info-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        gap: 30px;
        padding: 0 20px;
    }

    .liturgia-info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .liturgia-info-label {
        font-size: 12px;
        color: var(--secondary-color);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
    }

    .liturgia-info-value {
        font-size: 16px;
        color: var(--primary-color);
        font-weight: 600;
    }

    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }

        .nav-container {
            padding: 0 15px;
        }

        .selector-container {
            flex-wrap: wrap;
            gap: 10px;
        }

        .liturgia-info-container {
            flex-direction: column;
            gap: 15px;
            align-items: center;
        }
    }
`;

function buildMainNav(activeSection = 'liturgia') {
    const sections = [
        { id: 'liturgia', label: 'Liturgia das Horas', href: '/?tipo=laudes' },
        { id: 'leituras', label: 'Leituras', href: '/leituras' },
        { id: 'missa', label: 'Missa', href: '/missa' },
        { id: 'oracoes', label: 'Orações e Formação', href: '/oracoes' }
    ];

    const links = sections.map(section => `
        <li><a href="${section.href}" class="nav-link ${section.id === activeSection ? 'active' : ''}">${section.label}</a></li>
    `).join('');

    return `
        <nav class="main-nav">
            <div class="nav-container">
                <a class="nav-brand" href="/">🙏 Breviário</a>
                <div class="collapse-area">
                    <button class="collapse-toggle" aria-expanded="false" aria-label="Abrir menu"></button>
                    <div class="collapse-menu" aria-hidden="true">
                        <ul>
                            ${NAV_SECTIONS.map(section => `
                                <li><a href="${section.href}" class="nav-link ${section.id === activeSection ? 'active' : ''}">${section.label}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <ul class="nav-menu" id="nav-menu">
                    ${links}
                </ul>
            </div>
        </nav>
    `;
}

function buildHoursSelector(tipoAtivo = 'laudes') {
    return `
        <div class="hours-selector">
            <div class="selector-container">
                ${HORA_OPTIONS.map(option => `
                    <a href="/?tipo=${option.tipo}" class="hour-chip ${option.tipo === tipoAtivo ? 'active' : ''}">
                        <span>${option.label}</span>
                        <small>${option.periodo}</small>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

function normalizeSpacing($) {
    // Não remover <br> duplicados para preservar formatação de hinos
    // $('br + br').remove();

    ['p', 'div'].forEach((selector) => {
        $(selector).each(function() {
            const text = $(this).text().replace(/\u00a0/g, '').trim();
            if (!text && $(this).children().length === 0) {
                $(this).remove();
            }
        });
    });
}

function getTodayInSaoPaulo() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: SAO_PAULO_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [year, month, day] = formatter.format(new Date()).split('-').map(Number);
    return new Date(year, month - 1, day, 12);
}

function parseSaoPauloDate(param) {
    if (!param) {
        return getTodayInSaoPaulo();
    }

    const parts = param.split('-').map(Number);
    if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) {
        return getTodayInSaoPaulo();
    }

    const [year, month, day] = parts;
    return new Date(year, month - 1, day, 12);
}

function formatDateForApi(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return null;
    }

    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function normalizeText(value = '') {
    if (!value) return '';
    return value
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizarLiturgiaParaUrl(textoLiturgia) {
    // Ex: "Imaculada Conceição da Bem-aventurada Virgem Maria, Solenidade"
    // → "solenidade-da-imaculada-conceicao-da-bem-aventurada-virgem-maria"
    
    let texto = textoLiturgia.toLowerCase();
    
    // Remover pontuação (vírgulas, etc)
    texto = texto.replace(/[,;.!?]/g, '');
    
    // Normalizar acentos
    texto = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Se contém "solenidade", mover para o início
    if (texto.includes('solenidade')) {
        texto = texto.replace(/\s*solenidade\s*/gi, '');
        texto = 'solenidade da ' + texto.trim();
    }
    
    // Se contém "festa", mover para o início
    if (texto.includes('festa')) {
        texto = texto.replace(/\s*festa\s*/gi, '');
        texto = 'festa de ' + texto.trim();
    }
    
    // Substituir espaços por hífens
    texto = texto.replace(/\s+/g, '-');
    
    // Remover hífens duplicados
    texto = texto.replace(/-+/g, '-');
    
    return texto;
}

async function obterDadosLiturgiaAPI(data = getTodayInSaoPaulo()) {
    try {
        const apiUrl = new URL('https://liturgia.up.railway.app/');
        const dataFormatada = formatDateForApi(data);

        if (dataFormatada) {
            apiUrl.searchParams.set('data', dataFormatada);
            console.log(`📡 Consultando API de liturgia (${dataFormatada})...`);
        } else {
            console.log(`📡 Consultando API de liturgia...`);
        }
        
        // API retorna automaticamente o dia de hoje quando chamada sem parâmetros
        const response = await fetch(apiUrl.href);
        if (!response.ok) {
            console.log(`✗ API retornou ${response.status}`);
            return null;
        }
        
        const apiData = await response.json();
        
        if (!apiData.liturgia) {
            console.log('✗ API não retornou campo "liturgia"');
            return null;
        }
        
        console.log(`✓ Liturgia do dia: "${apiData.liturgia}"`);
        
        return {
            data: apiData.data,
            liturgia: apiData.liturgia,
            cor: apiData.cor
        };
    } catch (err) {
        console.error('Falha ao consultar API de liturgia:', err.message);
        return null;
    }
}

async function obterLiturgiaDoApiEGerarUrl(data = getTodayInSaoPaulo(), tipoOracao = 'laudes') {
    try {
        const dadosAPI = await obterDadosLiturgiaAPI(data);
        
        if (!dadosAPI) {
            return null;
        }
        
        const liturgia = dadosAPI.liturgia;
        
        // Se não é solenidade, festa ou memória especial, não gerar URL
        const textoLower = liturgia.toLowerCase();
        if (!textoLower.includes('solenidade') && 
            !textoLower.includes('festa') && 
            !textoLower.includes('memória') &&
            !textoLower.includes('memoria')) {
            console.log('→ Dia litúrgico comum (não é solenidade/festa), usando geração padrão');
            return null;
        }
        
        // Normalizar para URL
        const slugLiturgia = normalizarLiturgiaParaUrl(liturgia);
        const urlCandidata = `${BASE_SITE_URL}${tipoOracao}-${slugLiturgia}/`;
        
        console.log(`→ URL candidata: ${urlCandidata}`);
        
        // Testar se a URL existe
        const testeResp = await fetch(urlCandidata, { method: 'HEAD', redirect: 'follow' });
        if (testeResp.ok) {
            console.log(`✓ URL válida! (${testeResp.status})`);
            return urlCandidata;
        } else {
            console.log(`✗ URL não encontrada (${testeResp.status})`);
            return null;
        }
    } catch (err) {
        console.error('Falha ao consultar API de liturgia:', err.message);
        return null;
    }
}

async function obterLinkDoCalendario(data = getTodayInSaoPaulo()) {
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const dia = data.getDate();
    const mes = data.getMonth();
    const mesNome = meses[mes];
    
    // Primeiro: obter dados da API para saber o dia litúrgico correto
    let liturgiaAPI = null;
    try {
        const dadosAPI = await obterDadosLiturgiaAPI(data);
        if (dadosAPI && dadosAPI.liturgia) {
            liturgiaAPI = dadosAPI.liturgia;
            console.log(`📖 Liturgia da API: "${dadosAPI.liturgia}"`);
        }
    } catch (err) {
        console.log('⚠️ Erro ao buscar dados da API:', err.message);
    }

    console.log(`🔍 Buscando no calendário: dia ${dia} de ${mesNome}`);

    try {
        const response = await fetch(CALENDARIO_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        let linkEncontrado = null;

        if (liturgiaAPI) {
            const liturgiaNorm = normalizeText(liturgiaAPI);
            const categorias = [];
            const adicionarCategoria = (...tokens) => {
                const normalizados = tokens
                    .map((token) => normalizeText(token))
                    .filter(Boolean);
                if (normalizados.length) {
                    categorias.push(normalizados);
                }
            };

            const adicionarDiaSemanaVariacoes = (slug) => {
                if (!slug) return;
                if (slug === 'domingo' || slug === 'sabado') {
                    adicionarCategoria(slug);
                    return;
                }
                adicionarCategoria(slug, `${slug}-feira`, `${slug} feira`);
            };

            const diasSemanaPorNumero = {
                '2': 'segunda',
                '3': 'terca',
                '4': 'quarta',
                '5': 'quinta',
                '6': 'sexta',
                '7': 'sabado'
            };

            let diaSemanaDetectado = null;
            const matchFeira = liturgiaNorm.match(/(\d+)[ªº]?\s*feira/);
            if (matchFeira && diasSemanaPorNumero[matchFeira[1]]) {
                diaSemanaDetectado = diasSemanaPorNumero[matchFeira[1]];
            }

            if (!diaSemanaDetectado) {
                const padroesDias = [
                    { slug: 'domingo', patterns: ['domingo'] },
                    { slug: 'segunda', patterns: ['segunda-feira', 'segunda feira'] },
                    { slug: 'terca', patterns: ['terca-feira', 'terca feira'] },
                    { slug: 'quarta', patterns: ['quarta-feira', 'quarta feira'] },
                    { slug: 'quinta', patterns: ['quinta-feira', 'quinta feira'] },
                    { slug: 'sexta', patterns: ['sexta-feira', 'sexta feira'] },
                    { slug: 'sabado', patterns: ['sabado'] }
                ];

                padroesDias.some(({ slug, patterns }) => {
                    const encontrado = patterns.some((pattern) => liturgiaNorm.includes(pattern));
                    if (encontrado) {
                        diaSemanaDetectado = slug;
                        return true;
                    }
                    return false;
                });
            }

            adicionarDiaSemanaVariacoes(diaSemanaDetectado);

            const matchSemana = liturgiaNorm.match(/(\d+)[ªº]?\s*semana/);
            if (matchSemana) {
                const num = matchSemana[1];
                const ordinal = `${num}a`;
                adicionarCategoria(ordinal, `${ordinal} semana`, `${ordinal}-semana`);

                const numerosPorExtenso = {
                    '1': 'primeira',
                    '2': 'segunda',
                    '3': 'terceira',
                    '4': 'quarta',
                    '5': 'quinta',
                    '6': 'sexta'
                };
                if (numerosPorExtenso[num]) {
                    const porExtenso = `${numerosPorExtenso[num]} semana`;
                    adicionarCategoria(porExtenso, porExtenso.replace(/\s+/g, '-'));
                }
            }

            const adicionarTempoComponentes = (valor) => {
                if (!valor) return;
                adicionarCategoria(valor, valor.replace(/\s+/g, '-'));
            };

            if (liturgiaNorm.includes('tempo comum')) adicionarTempoComponentes('tempo comum');
            if (liturgiaNorm.includes('tempo pascal')) adicionarTempoComponentes('tempo pascal');
            if (liturgiaNorm.includes('tempo do natal') || liturgiaNorm.includes('tempo de natal')) {
                adicionarTempoComponentes('tempo do natal');
            }
            if (liturgiaNorm.includes('quaresma')) adicionarCategoria('quaresma');
            if (liturgiaNorm.includes('advento')) adicionarCategoria('advento');
            if (liturgiaNorm.includes('natal')) adicionarCategoria('natal');

            if (liturgiaNorm.includes('solenidade')) adicionarCategoria('solenidade');
            if (liturgiaNorm.includes('festa')) adicionarCategoria('festa');
            if (liturgiaNorm.includes('memoria')) adicionarCategoria('memoria');

            // Adicionar variações slug (com e sem o tipo da celebração)
            const slugCompleto = liturgiaNorm.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            adicionarCategoria(slugCompleto);

            const liturgiaSemTipo = liturgiaNorm
                .replace(/\b(memoria obrigatoria|memoria facultativa|memoria|solenidade|festa)\b/g, '')
                .replace(/[^\w\s-]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            const slugSemTipo = liturgiaSemTipo.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            if (slugSemTipo) {
                adicionarCategoria(slugSemTipo);
            }

            const categoriasResumo = categorias.map((tokens) => tokens[0]);
            console.log(`📋 Categorias da liturgia:`, categoriasResumo);

            if (categorias.length > 0) {
                $('a').each((i, elem) => {
                    if (linkEncontrado) return false;

                    const href = $(elem).attr('href');
                    if (!href) return;

                    const texto = $(elem).text().trim();
                    const textoNorm = normalizeText(texto);
                    const hrefNorm = normalizeText(href);

                    let matches = 0;
                    const encontrados = [];

                    categorias.forEach((tokens) => {
                        const possuiAlgum = tokens.some((token) => textoNorm.includes(token) || hrefNorm.includes(token));
                        if (possuiAlgum) {
                            matches++;
                            encontrados.push(tokens[0]);
                        }
                    });

                    let minimo = Math.max(1, Math.ceil(categorias.length * 0.6));
                    if (categorias.length <= 2) {
                        minimo = categorias.length;
                    }

                    if (matches >= minimo) {
                        linkEncontrado = href.startsWith('http') ? href : new URL(href, CALENDARIO_URL).href;
                        console.log(`✓ Liturgia encontrada (${matches}/${categorias.length} categorias): "${texto.substring(0, 80)}" -> ${linkEncontrado}`);
                        if (encontrados.length) {
                            console.log('   Componentes correspondentes:', encontrados);
                        }
                        return false;
                    }
                });
            }
        }

        if (!linkEncontrado) {
            console.log('📅 Buscando por data explícita...');

            $('a').each((_, el) => {
                const href = $(el).attr('href');
                const texto = $(el).text().trim();
                if (!href) return;

                const textoNorm = normalizeText(texto);
                const mesNomeNorm = normalizeText(mesNome);

                const diaComZero = String(dia).padStart(2, '0');
                const padroesDia = [
                    new RegExp(`\\b${dia}\\s+de\\s+${mesNomeNorm}`, 'i'),
                    new RegExp(`\\b${diaComZero}\\s+de\\s+${mesNomeNorm}`, 'i'),
                    new RegExp(`\\b${dia}/${mes + 1}\\b`, 'i'),
                    new RegExp(`\\b${diaComZero}/${String(mes + 1).padStart(2, '0')}\\b`, 'i')
                ];

                const mencionaDia = padroesDia.some((padrao) => padrao.test(textoNorm));

                if (mencionaDia) {
                    linkEncontrado = href.startsWith('http') ? href : new URL(href, CALENDARIO_URL).href;
                    console.log(`✓ Data encontrada: "${texto.substring(0, 60)}" -> ${linkEncontrado}`);
                    return false;
                }
            });
        }

        if (!linkEncontrado) {
            console.log(`✗ Nenhum link encontrado no calendário para ${dia} de ${mesNome}`);
        }

        return linkEncontrado;
    } catch (err) {
        console.error('Falha ao consultar calendário:', err.message);
        return null;
    }
}

function obterLinkFixoPorDataETipo(data = getTodayInSaoPaulo(), tipo = 'laudes') {
    const key = `${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    const mapa = FIXED_DATE_LINKS[key];
    if (!mapa) return null;
    return mapa[tipo] || mapa.laudes || null;
}

async function encontrarLinkNaPaginaDoDia(baseUrl, tipoOracao) {
    if (!baseUrl) return null;

    try {
        const resp = await fetch(baseUrl);
        if (!resp.ok) return null;

        const html = await resp.text();
        const j = cheerio.load(html);
        const tipo = (tipoOracao || '').toLowerCase();

        let melhorMatch = null;
        let melhorPeso = 0;
        
        j('a').each((_, el) => {
            const hrefRaw = (j(el).attr('href') || '').trim();
            const texto = j(el).text().toLowerCase().trim();
            if (!hrefRaw || hrefRaw.startsWith('#')) return;

            let hrefAbs;
            try {
                hrefAbs = hrefRaw.startsWith('http') ? hrefRaw : new URL(hrefRaw, baseUrl).href;
            } catch {
                return;
            }

            const hrefLower = hrefAbs.toLowerCase();
            if (hrefLower.includes('/wp-json/')) return;
            
            const palavraChaveTipo = tipo === 'vesperas' ? 'vésperas' : tipo;
            const contemTipo = hrefLower.includes(`/${tipo}-`) || hrefLower.includes(`-${tipo}-`) || 
                              texto.includes(palavraChaveTipo) || texto.includes(tipo);
            
            if (!contemTipo) return;

            let peso = 1;
            if (hrefLower.includes('solenidade')) peso += 4;
            if (tipo === 'vesperas') {
                if (hrefLower.includes('/i-vesperas-')) {
                    peso += 5;
                } else if (hrefLower.includes('/ii-vesperas-')) {
                    peso += 4;
                } else if (hrefLower.includes('/vesperas-')) {
                    peso += 2;
                }
            }

            if (!melhorMatch || peso > melhorPeso) {
                melhorMatch = hrefAbs;
                melhorPeso = peso;
            }
        });

        if (melhorMatch) {
            console.log(`Melhor link encontrado para ${tipo}: ${melhorMatch}`);
        }
        return melhorMatch;
    } catch (err) {
        console.error('Falha ao procurar link específico na página do dia:', err.message);
        return null;
    }
}

async function tentarUrlEspecificaPorHora(baseUrl, tipoOracao) {
    if (!baseUrl) return null;

    try {
        const urlObj = new URL(baseUrl);
        const slug = urlObj.pathname.replace(/^\//, '').replace(/\/$/, '');
        if (!slug) return null;

        const slugComTipo = `${tipoOracao}-${slug}`;
        const candidato = new URL(slugComTipo + '/', BASE_SITE_URL).href;

        const resp = await fetch(candidato, {
            method: 'HEAD',
            redirect: 'follow'
        });

        if (resp.ok) return candidato;
    } catch (err) {
        console.error('Falha ao validar URL específica por hora:', err.message);
    }

    return null;
}

// Funções para calendário litúrgico
function obterDiaDaSemana(data = getTodayInSaoPaulo()) {
    const dias = ['domingo', 'segunda-feira', 'terca-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado'];
    return dias[data.getDay()];
}

function obterTempoLiturgico(data = getTodayInSaoPaulo()) {
    const mes = data.getMonth() + 1;
    const dia = data.getDate();
    
    // Advento (aproximação: dezembro até 24)
    if (mes === 12 && dia <= 24) return 'advento';
    
    // Tempo do Natal (25 de dezembro até 13 de janeiro)
    if ((mes === 12 && dia >= 25) || (mes === 1 && dia <= 13)) return 'natal';
    
    // Quaresma (aproximação: fevereiro/março/abril)
    if ((mes === 2 && dia >= 15) || mes === 3 || (mes === 4 && dia <= 15)) return 'quaresma';
    
    // Páscoa (aproximação: abril/maio/junho)
    if ((mes === 4 && dia >= 16) || mes === 5 || (mes === 6 && dia <= 15)) return 'pascoa';
    
    // Tempo Comum
    return 'tempo-comum';
}

function obterSemanaDoTempo(data = getTodayInSaoPaulo()) {
    const tempo = obterTempoLiturgico(data);
    
    if (tempo === 'advento') {
        // Calcular semana do Advento
        const natal = new Date(data.getFullYear(), 11, 25);
        const inicioAdvento = new Date(natal);
        inicioAdvento.setDate(natal.getDate() - (natal.getDay() === 0 ? 21 : (28 - natal.getDay())));
        
        const diffTime = data.getTime() - inicioAdvento.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const semana = Math.ceil(diffDays / 7);
        
        return `${semana}a-semana`;
    }
    
    // Para outros tempos, usar 1ª semana como padrão
    return '1a-semana';
}

function gerarUrlLiturgia(tipoOracao, data = getTodayInSaoPaulo()) {
    const diaSemana = obterDiaDaSemana(data);
    
    // Completas: sempre usa apenas o dia da semana
    if (tipoOracao === 'completas') {
        return `completas-de-${diaSemana}/`;
    }
    
    // Para Laudes e Vésperas: incluir tempo litúrgico
    const tempo = obterTempoLiturgico(data);
    const semana = obterSemanaDoTempo(data);
    
    // Formato: {tipo}-de-{dia}-da-{semana}-do-{tempo}
    let url = `${tipoOracao}-de-${diaSemana}-da-${semana}`;
    
    if (tempo !== 'tempo-comum') {
        url += `-do-${tempo}`;
    } else {
        url += `-do-tempo-comum`;
    }
    
    return url + '/';
}

// Rota principal - Liturgia das Horas
router.get('/', async (req, res) => {
    try {
        // Determinar tipo de oração
        const tipoOracao = req.query.tipo || 'laudes';
        const dataCustom = parseSaoPauloDate(req.query.data);
        const horaAtiva = HORA_OPTIONS.some(option => option.tipo === tipoOracao) ? tipoOracao : 'laudes';
        
        console.log(`Tipo de oração recebido: ${tipoOracao}`);

        // Buscar dados da API de liturgia cedo para montar o banner (aplicável a laudes/vesperas/completas/invitatorio)
        let bannerHTML = '';
        try {
            const dadosParaBanner = await obterDadosLiturgiaAPI(dataCustom);
            if (dadosParaBanner) {
                bannerHTML = `
                    <div class="liturgia-info-banner">
                        <div class="liturgia-info-container">
                            <div class="liturgia-info-item">
                                <span class="liturgia-info-label">Data:</span>
                                <span class="liturgia-info-value">${dadosParaBanner.data}</span>
                            </div>
                            <div class="liturgia-info-item">
                                <span class="liturgia-info-label">Dia Litúrgico:</span>
                                <span class="liturgia-info-value">${dadosParaBanner.liturgia}</span>
                            </div>
                            <div class="liturgia-info-item">
                                <span class="liturgia-info-label">Cor:</span>
                                <span class="liturgia-info-value">${dadosParaBanner.cor}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            bannerHTML = '';
        }

        // Se for Invitatório, retornar conteúdo fixo
        if (tipoOracao === 'invitatorio') {
            const $ = cheerio.load(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="icon" href="data:,">
                    <title>Invitatório - Liturgia das Horas</title>
                </head>
                <body>
                    <div class="wp-site-blocks">
                        ${INVITATORIO_CONTENT}
                    </div>
                </body>
                </html>
            `);
            
            // Remover todas as tags de favicon/ícones
            $('link[rel="icon"]').remove();
            $('link[rel="shortcut icon"]').remove();
            $('link[rel="apple-touch-icon"]').remove();
            $('link[rel="apple-touch-icon-precomposed"]').remove();
            
            // Remover divs específicas indesejadas
            $('div[style*="margin-bottom:var(--wp--preset--spacing--40)"]').remove();
            // Remove divs com margin-bottom e padding-top específicos
            $('div').filter(function() {
                const style = $(this).attr('style');
                return style && style.includes('margin-bottom:var(--wp--preset--spacing--40);') && style.includes('padding-top:var(--wp--preset--spacing--50);');
            }).remove();
            $('div.wp-block-group.is-vertical.is-content-justification-stretch.is-layout-flex').remove();
            // Remoção robusta: qualquer elemento cuja lista de classes contenha
            // 'wp-block-comments' (cobre 'wp-block-comments' e 'wp-block-comments-query-loop').
            $('*[class*="wp-block-comments"]').remove();
            // Remoção ampla: qualquer elemento com estilo referenciando variáveis
            // de espaçamento do WP (por exemplo '--wp--preset--spacing--40').
            $('*[style*="--wp--preset--spacing"]').remove();
            
            // (nav and hours-selector will be prepended after styles/banner below)
            $('head').prepend(`
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="icon" href="data:,">
                <title>Invitatório - Liturgia das Horas</title>
            `);
            $('head').append(`<style>${BASE_STYLES}</style><link rel="stylesheet" href="/nav.css"><script src="/nav.js"></script><style>
                .wp-site-blocks {
                    padding: 20px;
                    line-height: 1.8;
                }
                .wp-site-blocks h2 {
                    margin-bottom: 15px;
                }
                .wp-site-blocks p {
                    margin-bottom: 10px;
                }
                .wp-site-blocks em {
                    font-style: italic;
                    color: var(--secondary-color);
                }
                .wp-site-blocks strong {
                    font-weight: bold;
                    color: var(--primary-color);
                }
                /* Centralizar conteúdo principal */
                .wp-site-blocks, .entry-content, .liturgia-info-container { max-width: 980px; margin: 0 auto; }
                .wp-site-blocks { box-sizing: border-box; }
            </style>`);
            // Garantir que não haja duplicatas e inserir na ordem: nav -> banner -> hours
            $('body').find('.liturgia-info-banner, .main-nav, .hours-selector').remove();
            $('body').prepend(buildMainNav('liturgia'));
            if (bannerHTML) {
                $('.main-nav').after(bannerHTML);
                $('.liturgia-info-banner').after(buildHoursSelector(horaAtiva));
            } else {
                // Se não houver banner, apenas garantir nav + hours no topo
                $('.main-nav').after(buildHoursSelector(horaAtiva));
            }

            return res.send($.html());
        }
        
        let targetUrl = null;
        let response = null;

        // 1) Primeiro: tentar API de liturgia (detecta solenidades automaticamente)
        targetUrl = await obterLiturgiaDoApiEGerarUrl(dataCustom, tipoOracao);
        
        if (targetUrl) {
            console.log(`Tentando URL da API de liturgia: ${targetUrl}`);
            try {
                response = await fetch(targetUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                if (!response.ok) {
                    console.log(`URL da API falhou (${response.status}), tentando calendário...`);
                    response = null;
                    targetUrl = null;
                }
            } catch (err) {
                console.log(`Erro ao acessar URL da API: ${err.message}`);
                response = null;
                targetUrl = null;
            }
        }

        // 2) Segundo: tentar obter link direto do calendário oficial para a data
        if (!response) {
            targetUrl = await obterLinkDoCalendario(dataCustom);

            // 2.a) Se houver link do dia, tentar achar dentro da página o link específico da hora
            if (targetUrl) {
                const encontradoNaPagina = await encontrarLinkNaPaginaDoDia(targetUrl, tipoOracao);
                if (encontradoNaPagina) {
                    targetUrl = encontradoNaPagina;
                }
            }

            // 2.b) Se ainda não achou, tentar formar a URL específica da hora (laudes/vesperas/completas)
            if (targetUrl) {
                const urlComHora = await tentarUrlEspecificaPorHora(targetUrl, tipoOracao);
                if (urlComHora) {
                    targetUrl = urlComHora;
                }
            }

            // 2.c) Se encontrou URL do calendário, tentar acessar
            if (targetUrl) {
                console.log(`Tentando URL do calendário: ${targetUrl}`);
                try {
                    response = await fetch(targetUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    });
                    if (!response.ok) {
                        console.log(`URL do calendário falhou (${response.status}), tentando URL gerada...`);
                        response = null;
                    }
                } catch (err) {
                    console.log(`Erro ao acessar URL do calendário: ${err.message}`);
                    response = null;
                }
            }
        }

        // 3) Terceiro: se não encontrou no calendário ou falhou, gerar URL automática e tentar
        if (!response) {
            const urlGerada = gerarUrlLiturgia(tipoOracao, dataCustom);
            targetUrl = `${BASE_SITE_URL}${urlGerada}`;
            console.log(`Tentando URL gerada: ${targetUrl}`);
            
            response = await fetch(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log(`✓ Sucesso: ${targetUrl}`);
        
        let html = await response.text();
        const $ = cheerio.load(html);
        
        // Limpar elementos desnecessários
        $('script[src*="google"], script[src*="ads"], script[src*="analytics"]').remove();
        $('.ads, .advertisement, [class*="ad-"], .banner, .popup').remove();
        $('#sidebar, .sidebar, nav:not(.liturgia-nav)').remove();
        
        // Remover embeds do SoundCloud e outros embeds
        $('[class*="soundcloud"]').remove();
        $('[class*="wp-block-embed"]').remove();
        $('[class*="wp-block-audio"]').remove();
        $('iframe[src*="soundcloud"]').remove();
        
        // Remover divs de navegação do WordPress (botões de Laudes, Vésperas, etc.)
        $('.wp-block-button').remove();
        $('[class*="wp-block-buttons"]').remove();
        
        // Remover divs com classes específicas do WordPress
        $('.wp-block-group.alignwide.is-vertical').remove();
        $('.wp-block-template-part').remove();
        $('.wp-block-post-featured-image').remove();
        $('.wp-block-image.size-large').remove();
        
        // Remover classes CSS específicas indesejadas
        $('*').each(function() {
            const classes = $(this).attr('class');
            if (classes) {
                // Remove as classes específicas
                let newClasses = classes
                    .replace(/wp-block-group alignwide is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-[a-f0-9]+ wp-block-group-is-layout-flex/g, '')
                    .replace(/wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained/g, '')
                    .replace(/wp-block-buttons is-layout-flex wp-block-buttons-is-layout-flex/g, '')
                    .replace(/wp-block-template-part/g, '')
                    .replace(/liturgia-nav/g, '')
                    .trim()
                    .replace(/\s+/g, ' '); // Remove espaços duplos
                
                // Se ficou vazio, remove o atributo class
                if (newClasses === '') {
                    $(this).removeAttr('class');
                } else {
                    $(this).attr('class', newClasses);
                }
            }
        });

        // Remover todas as instâncias da div com a classe 'wp-block-post-title has-x-large-font-size'
        $('.wp-block-post-title.has-x-large-font-size').each(function() {
            $(this).remove();
        });
        
        // Remover 'spacer' divs vindas do site original que usam as variáveis
        // de espaçamento do tema WordPress (ex: var(--wp--preset--spacing--40)).
        // Critério: contém referência a "--wp--preset--spacing" no atributo style.
        $('*[style*="--wp--preset--spacing"]').remove();

        // Também remover quaisquer divs com style contendo os dois trechos específicos,
        // independentemente de ordem/espacos.
        $('div').filter(function() {
            const s = $(this).attr('style') || '';
            const hasMargin = /margin-bottom\s*:\s*var\(--wp--preset--spacing--40\)/i.test(s);
            const hasPadding = /padding-top\s*:\s*var\(--wp--preset--spacing--50\)/i.test(s);
            return hasMargin && hasPadding;
        }).remove();

        normalizeSpacing($);
        
        // Remover todas as tags de favicon/ícones do site original
        $('link[rel="icon"]').remove();
        $('link[rel="shortcut icon"]').remove();
        $('link[rel="apple-touch-icon"]').remove();
        $('link[rel="apple-touch-icon-precomposed"]').remove();
        
        // Adicionar na ordem correta: nav -> banner -> hours
        $('body').prepend(buildMainNav('liturgia'));
        if (bannerHTML) {
            $('.main-nav').after(bannerHTML);
            $('.liturgia-info-banner').after(buildHoursSelector(horaAtiva));
        } else {
            $('.main-nav').after(buildHoursSelector(horaAtiva));
        }
        
        $('head').prepend(`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>Breviário</title>
        `);
            $('head').append(`<style>${BASE_STYLES}</style><link rel="stylesheet" href="/nav.css"><script src="/nav.js"></script>`);
        $('head').append(`
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    function doToggle(menu) {
                        if (!menu) return;
                        menu.classList.toggle('open');
                    }

                    document.querySelectorAll('.hamburger-btn').forEach(btn => {
                        btn.addEventListener('click', function (e) {
                            e.preventDefault();
                            const container = btn.closest('.nav-container');
                            const menu = container ? (container.querySelector('#nav-menu') || container.querySelector('.nav-menu')) : document.getElementById('nav-menu');
                            doToggle(menu);
                        });

                        btn.addEventListener('touchstart', function (e) {
                            e.preventDefault();
                            btn.click();
                        }, { passive: false });
                    });
                });
            </script>
        `);

        res.send($.html());
        
    } catch (error) {
        console.error('Erro ao carregar liturgia:', error);
        
        // Página de erro amigável
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro - Liturgia das Horas</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        margin: 0;
                        padding: 50px 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .error-container {
                        background: white;
                        padding: 40px;
                        border-radius: 15px;
                        text-align: center;
                        max-width: 500px;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    }
                    h1 { color: #dc2626; }
                    p { color: #666; margin: 20px 0; }
                    a {
                        display: inline-block;
                        padding: 12px 24px;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h1>⚠️ Oops!</h1>
                    <p>Não foi possível carregar a liturgia para hoje.</p>
                    <p>Erro: ${error.message}</p>
                    <a href="/">🔄 Tentar novamente</a>
                    <a href="/?tipo=laudes">📖 Ir para Laudes</a>
                </div>
            </body>
            </html>
        `);
    }
});

module.exports = router;
