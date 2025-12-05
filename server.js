const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

const HORA_OPTIONS = [
    { tipo: 'laudes', label: 'Laudes', periodo: 'Manha' },
    { tipo: 'vesperas', label: 'Vesperas', periodo: 'Tarde' },
    { tipo: 'completas', label: 'Completas', periodo: 'Noite' }
];

const NAV_SECTIONS = [
    { id: 'liturgia', label: 'Liturgia das Horas', href: '/?tipo=laudes' },
    { id: 'leituras', label: 'Leituras', href: '/leituras' }
];

const BASE_STYLES = `
    :root {
        --bg-color: #f6efe6;
        --surface-color: #ffffff;
        --border-color: #e4d8c6;
        --text-color: #2c1f13;
        --muted-color: #6b5a4a;
        --accent-color: #8c5c2c;
        --accent-light: #f4e1c1;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
        background: var(--bg-color) !important;
        color: var(--text-color) !important;
        margin: 0;
        padding: 0 0 48px;
        line-height: 1.65 !important;
    }

    .main-nav {
        background: var(--surface-color);
        border-bottom: 1px solid var(--border-color);
        padding: 16px 0;
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .nav-container {
        max-width: 960px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .nav-brand {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
        text-decoration: none;
    }

    .nav-menu {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .nav-item {
        padding: 8px 14px;
        border-radius: 999px;
        text-decoration: none;
        color: var(--muted-color);
        font-size: 0.95rem;
        font-weight: 500;
        border: 1px solid transparent;
        transition: all 0.2s ease;
    }

    .nav-item:hover {
        border-color: var(--border-color);
        color: var(--text-color);
    }

    .nav-item.active {
        background: var(--accent-light);
        border-color: var(--accent-color);
        color: var(--accent-color);
    }

    .hours-selector {
        background: #fffaf3;
        border-bottom: 1px solid var(--border-color);
    }

    .selector-container {
        max-width: 960px;
        margin: 0 auto;
        padding: 14px 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .hour-chip {
        flex: 1;
        min-width: 180px;
        text-decoration: none;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 12px 16px;
        color: var(--text-color);
        background: var(--surface-color);
        display: flex;
        flex-direction: column;
        gap: 4px;
        transition: all 0.2s ease;
    }

    .hour-chip small {
        color: var(--muted-color);
        font-size: 0.8rem;
    }

    .hour-chip.active {
        border-color: var(--accent-color);
        background: var(--accent-light);
        box-shadow: 0 6px 16px rgba(140, 92, 44, 0.15);
    }

    .wp-site-blocks,
    main,
    article,
    .entry-content,
    .content,
    .inner-content,
    #content {
        width: min(900px, calc(100% - 32px)) !important;
        margin: 24px auto !important;
        padding: 32px !important;
        background: var(--surface-color) !important;
        border-radius: 18px !important;
        box-shadow: 0 20px 45px rgba(44, 31, 19, 0.05) !important;
        border: 1px solid rgba(228, 216, 198, 0.7) !important;
    }

    :is(.wp-site-blocks, main, article, .entry-content, .content, .inner-content, #content)
        :is(.wp-site-blocks, main, article, .entry-content, .content, .inner-content, #content) {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
    }

    h1, h2, h3 {
        color: var(--accent-color) !important;
        margin: 1.8rem 0 0.8rem !important;
        font-weight: 600 !important;
        letter-spacing: -0.01em;
    }

    p, li, span, div {
        font-size: 1.02rem !important;
        line-height: 1.7 !important;
        color: var(--text-color) !important;
    }

    p {
        margin: 0 0 1rem !important;
    }

    p + p {
        margin-top: 0;
    }

    ul, ol {
        padding-left: 1.3rem !important;
        margin-bottom: 1.2rem !important;
    }

    blockquote {
        border-left: 3px solid var(--accent-color);
        padding-left: 1rem;
        margin: 1.5rem 0;
        color: var(--muted-color);
        background: rgba(244, 225, 193, 0.4);
    }

    img {
        width: 100% !important;
        height: auto !important;
        border-radius: 12px;
    }

    @media (max-width: 640px) {
        .nav-container {
            flex-direction: column;
            align-items: flex-start;
        }

        .nav-menu {
            width: 100%;
            justify-content: space-between;
        }

        .selector-container {
            flex-direction: column;
        }

        .hour-chip {
            width: 100%;
        }

        .wp-site-blocks,
        main,
        article,
        .entry-content,
        .content,
        .inner-content,
        #content {
            padding: 20px 18px !important;
            width: 100% !important;
            margin: 12px 0 !important;
            border-radius: 12px !important;
            border: none !important;
            box-shadow: none !important;
        }
    }
`;

function buildMainNav(activeSection = 'liturgia') {
    const links = NAV_SECTIONS.map(section => `
        <a href="${section.href}" class="nav-item ${section.id === activeSection ? 'active' : ''}">
            ${section.label}
        </a>
    `).join('');

    return `
        <nav class="main-nav">
            <div class="nav-container">
                <a class="nav-brand" href="/">Liturgia Catolica</a>
                <div class="nav-menu">
                    ${links}
                </div>
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
    $('br + br').remove();

    ['p', 'div'].forEach((selector) => {
        $(selector).each(function() {
            const text = $(this).text().replace(/\u00a0/g, '').trim();
            if (!text && $(this).children().length === 0) {
                $(this).remove();
            }
        });
    });
}

// Servir arquivos estáticos
app.use('/public', express.static('public'));

// Funções para calendário litúrgico
function obterDiaDaSemana(data = new Date()) {
    const dias = ['domingo', 'segunda-feira', 'terca-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado'];
    return dias[data.getDay()];
}

function obterTempoLiturgico(data = new Date()) {
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

function obterSemanaDoTempo(data = new Date()) {
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

function gerarUrlLiturgia(tipoOracao, data = new Date()) {
    const diaSemana = obterDiaDaSemana(data);
    const tempo = obterTempoLiturgico(data);
    const semana = obterSemanaDoTempo(data);

    if (tipoOracao === 'completas') {
        return `completas-de-${diaSemana}/`;
    }
    
    // Formato: {tipo}-de-{dia}-da-{semana}-do-{tempo}
    let url = `${tipoOracao}-de-${diaSemana}-da-${semana}`;
    
    if (tempo !== 'tempo-comum') {
        url += `-do-${tempo}`;
    } else {
        url += `-do-tempo-comum`;
    }
    
    return url;
}

// Rota principal - sempre liturgiadashoras.online

app.get('*', async (req, res) => {
    try {
        // Determinar tipo de oração
        const tipoOracao = req.query.tipo || 'laudes';
        const dataCustom = req.query.data ? new Date(req.query.data) : new Date();
        const horaAtiva = HORA_OPTIONS.some(option => option.tipo === tipoOracao) ? tipoOracao : 'laudes';
        
        // Gerar URL baseada no calendário litúrgico
        const urlGerada = gerarUrlLiturgia(tipoOracao, dataCustom);
        const targetUrl = `https://liturgiadashoras.online/${urlGerada}/`;
        
        console.log(`Acessando: ${targetUrl}`);
        
        // Fazer request para liturgiadashoras.online
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        let html = await response.text();
        const $ = cheerio.load(html);
        
        // Limpar elementos desnecessários
        $('script[src*="google"], script[src*="ads"], script[src*="analytics"]').remove();
        $('.ads, .advertisement, [class*="ad-"], .banner, .popup').remove();
        $('#sidebar, .sidebar, nav:not(.liturgia-nav)').remove();
        
        // Remover divs de navegação do WordPress (botões de Laudes, Vésperas, etc.)
        $('.wp-block-button').remove();
        $('[class*="wp-block-buttons"]').remove();
        
        // Remover divs com classes específicas do WordPress
        $('[class*="wp-block-group alignwide is-vertical"]').remove();
        $('.wp-block-template-part').remove();
        
        // Remover classes CSS específicas indesejadas
        $('*').each(function() {
            const classes = $(this).attr('class');
            if (classes) {
                // Remove as classes específicas
                let newClasses = classes
                    .replace(/wp-block-group alignwide is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-[a-f0-9]+ wp-block-group-is-layout-flex/g, '')
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

        normalizeSpacing($);
        
        // Adicionar menu e seletor de horas
        $('body').prepend(buildHoursSelector(horaAtiva));
        $('body').prepend(buildMainNav('liturgia'));
        
        $('head').prepend(`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Liturgia das Horas</title>
        `);
        $('head').append(`<style>${BASE_STYLES}</style>`);

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

app.listen(PORT, () => {
    console.log(`\n🙏 Liturgia Católica rodando em: http://localhost:${PORT}`);
    console.log(`\n📖 Liturgia das Horas:`);
    console.log(`   Laudes: http://localhost:${PORT}/?tipo=laudes`);
    console.log(`   Vésperas: http://localhost:${PORT}/?tipo=vesperas`);
    console.log(`   Completas: http://localhost:${PORT}/?tipo=completas`);
    console.log(`\n📚 Outras seções:`);
    console.log(`   Leituras: http://localhost:${PORT}/leituras`);
    console.log(`   Missa: http://localhost:${PORT}/missa\n`);
});
