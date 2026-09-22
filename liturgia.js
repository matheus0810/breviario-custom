const express = require('express');
const fetch = global.fetch || require('node-fetch');

const { BASE_STYLES } = require('./constants');

const router = express.Router();

const HORA_ORDER = ['invitatorio', 'laudes', 'vesperas', 'completas'];

const HORA_MAP = {
    invitatorio: 'invitatorio',
    laudes: 'laudes',
    vesperas: 'vesperas',
    completas: 'completas',
    compl: 'completas',
    compls: 'completas',
    laudes_amanhecer: 'laudes',
    vesperas_entardecer: 'vesperas',
    terca: 'laudes',
    sexta: 'laudes',
    nona: 'laudes'
};

const HORA_LABELS = {
    invitatorio: 'Invitatório',
    laudes: 'Laudes',
    vesperas: 'Vésperas',
    completas: 'Completas'
};

const INVITATORIO_DATA = '2026-09-22';

function getDataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function normalizeHoraParam(horaParam) {
    const hora = String(horaParam || 'laudes').trim().toLowerCase();
    const mapped = HORA_MAP[hora] || 'laudes';
    return HORA_ORDER.includes(mapped) ? mapped : 'laudes';
}

function buildLirioUrl(dataParam, horaParam) {
    const data = /^\d{4}-\d{2}-\d{2}$/.test(String(dataParam || '')) ? dataParam : getDataHoje();
    const hora = normalizeHoraParam(horaParam);
    return `https://www.liriocatolico.com.br/liturgia_horas/?data=${data}&hora=${hora}`;
}

function buildLirioJsonUrl(dataParam, horaParam) {
    const data = /^\d{4}-\d{2}-\d{2}$/.test(String(dataParam || '')) ? dataParam : getDataHoje();
    const dataFonte = horaParam === 'invitatorio' ? INVITATORIO_DATA : data;
    const [ano] = dataFonte.split('-');
    return `https://www.liriocatolico.com.br/liturgia_horas/dados/${ano}/${dataFonte}.json`;
}

function renderHourTabs(dataParam, horaAtiva) {
    return HORA_ORDER.map((hora) => `
        <a class="liturgia-tab ${hora === horaAtiva ? 'active' : ''}" href="/liturgia?data=${dataParam}&hora=${hora}">${HORA_LABELS[hora]}</a>
    `).join('');
}

const NAV_SECTIONS = [
    { id: 'liturgia', label: 'Liturgia das Horas', href: '/liturgia' },
    { id: 'leituras', label: 'Leituras', href: '/' },
    { id: 'missa', label: 'Missa', href: '/missa' },
    { id: 'oracoes', label: 'Oracoes e Formacao', href: '/oracoes' }
];

function buildMainNav(activeSection = 'liturgia') {
    const links = NAV_SECTIONS.map((section) => `
        <li><a href="${section.href}" class="nav-link ${section.id === activeSection ? 'active' : ''}">${section.label}</a></li>
    `).join('');

    return `
        <nav class="main-nav">
            <div class="nav-container">
                <a class="nav-brand" href="/">&#128591; Breviario</a>
                <div class="collapse-area">
                    <button class="collapse-toggle" aria-expanded="false" aria-label="Abrir menu"></button>
                    <div class="collapse-menu" aria-hidden="true">
                        <ul>
                            ${links}
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

router.get('/', async (req, res) => {
    const nav = buildMainNav('liturgia');
    const dataParam = req.query.data || getDataHoje();
    const horaParam = normalizeHoraParam(req.query.hora || req.query.tipo || 'laudes');
    const lirioUrl = buildLirioUrl(dataParam, horaParam);
    const lirioJsonUrl = buildLirioJsonUrl(dataParam, horaParam);

    let dadosLiturgia = null;
    try {
        const resp = await fetch(lirioJsonUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
            }
        });
        if (resp.ok) {
            dadosLiturgia = await resp.json();
        }
    } catch (e) {
        dadosLiturgia = null;
    }

    let bannerHTML = '';
    if (dadosLiturgia) {
        const dados = dadosLiturgia;
        try {
            bannerHTML = `
                <div class="liturgia-info-banner">
                    <div class="liturgia-info-container">
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Data:</span>
                            <span class="liturgia-info-value">${dados.data || dataParam}</span>
                        </div>
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Dia Liturgico:</span>
                            <span class="liturgia-info-value">${dados.titulo || dados.dia_liturgico || 'Liturgia do dia'}</span>
                        </div>
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Cor:</span>
                            <span class="liturgia-info-value">${dados.cor || 'Padrão'}</span>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            bannerHTML = '';
        }
    }

    let conteudoExterno = '';
    if (dadosLiturgia) {
        const horas = Array.isArray(dadosLiturgia.horas) ? dadosLiturgia.horas : [];
        const horaSelecionada = horas.find((hora) => hora.slug === horaParam) || horas.find((hora) => hora.slug === 'laudes') || horas[0];

        if (horaSelecionada && horaSelecionada.html) {
            conteudoExterno = `
                <div class="liturgia-externa">
                    <div class="liturgia-subheader">
                        <div class="liturgia-cabecalho-hora">
                            <strong>${HORA_LABELS[horaParam] || 'Laudes'}</strong>
                            <span> · ${dadosLiturgia.data || dataParam}</span>
                        </div>
                        <div class="liturgia-tabs">${renderHourTabs(dataParam, horaParam)}</div>
                    </div>
                    ${horaSelecionada.html}
                </div>
            `;
        }
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>Liturgia das Horas</title>
            <style>
                ${BASE_STYLES}
                body {
                    font-family: "Times New Roman", serif !important;
                    background: var(--bg-color) !important;
                    min-height: 100vh;
                    padding: 0 0 60px;
                }
                .liturgia-cabecalho-hora {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--primary-color);
                    font-weight: 700;
                }
                .liturgia-subheader {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }
                .liturgia-tabs {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .liturgia-tab {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 14px;
                    border-radius: 999px;
                    border: 1px solid rgba(131, 80, 38, 0.25);
                    background: rgba(255, 255, 255, 0.45);
                    color: var(--primary-color);
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.82rem;
                }
                .liturgia-tab.active {
                    background: linear-gradient(180deg, #835026 0%, #6a3d1c 100%);
                    color: #fff;
                    border-color: transparent;
                }
                .liturgia-container {
                    max-width: 1100px;
                    margin: 24px auto 0;
                    padding: 0 18px;
                }
                .liturgia-externa {
                    background: rgba(255,255,255,0.35);
                    border: 1px solid rgba(228, 216, 198, 0.8);
                    border-radius: 18px;
                    box-shadow: 0 8px 18px rgba(44, 31, 19, 0.04);
                    padding: 28px 30px;
                    color: var(--text-color);
                }
                .liturgia-externa h1,
                .liturgia-externa h2,
                .liturgia-externa h3,
                .liturgia-externa h4 {
                    color: var(--primary-color);
                    font-family: Georgia, 'Times New Roman', serif;
                    margin-top: 1.2em;
                    margin-bottom: 0.5em;
                }
                .liturgia-externa .rubrica,
                .liturgia-externa .rubrica titulo,
                .liturgia-externa .rubrica versiculo {
                    color: #8d3d1b;
                    font-weight: 700;
                }
                .liturgia-externa .estrofe {
                    margin: 1.2em 0;
                }
                .liturgia-externa .estrofe > div {
                    margin-bottom: 0.75em;
                }
                .liturgia-externa sup,
                .liturgia-externa sub {
                    font-size: 0.78em;
                }
                .liturgia-externa p,
                .liturgia-externa li,
                .liturgia-externa span,
                .liturgia-externa div,
                .liturgia-externa button {
                    font-family: Georgia, 'Times New Roman', serif;
                    line-height: 1.7;
                }
                .liturgia-externa a {
                    color: var(--primary-color);
                }
                .liturgia-externa button,
                .liturgia-externa .wp-block-button,
                .liturgia-externa .wp-block-buttons {
                    display: none !important;
                }
                .liturgia-action {
                    margin: 16px 0 0;
                    display: flex;
                    justify-content: flex-start;
                }
                .liturgia-action a {
                    display: inline-block;
                    padding: 14px 26px;
                    border-radius: 14px;
                    text-decoration: none;
                    font-weight: 700;
                    color: #fff;
                    background: linear-gradient(180deg, #835026 0%, #6a3d1c 100%);
                    box-shadow: 0 8px 18px rgba(86, 52, 27, 0.2);
                }
                @media (max-width: 640px) {
                    .liturgia-externa {
                        padding: 20px 18px;
                    }
                    .liturgia-subheader {
                        align-items: flex-start;
                    }
                }
            </style>
            <link rel="stylesheet" href="/nav.css">
            <script src="/nav.js" defer></script>
        </head>
        <body>
            ${nav}
            ${bannerHTML}
            <main class="liturgia-container">
                ${conteudoExterno || `
                    <section class="liturgia-externa">
                        <div class="liturgia-subheader">
                            <div class="liturgia-cabecalho-hora">
                                <strong>${HORA_LABELS[horaParam] || 'Laudes'}</strong>
                                <span> · ${dataParam}</span>
                            </div>
                            <div class="liturgia-tabs">${renderHourTabs(dataParam, horaParam)}</div>
                        </div>
                        <h1>Liturgia das Horas</h1>
                        <p>Não foi possível carregar o conteúdo completo desta hora no momento.</p>
                        <div class="liturgia-action">
                            <a href="${lirioUrl}" target="_blank" rel="noopener noreferrer">Abrir no site do Lírio Católico</a>
                        </div>
                    </section>
                `}
            </main>
        </body>
        </html>
    `);
});

module.exports = router;
