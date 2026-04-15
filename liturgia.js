const express = require('express');
const fetch = require('node-fetch');

const { BASE_STYLES } = require('./constants');

const router = express.Router();

const CALENDARIO_URL = 'https://liturgiadashoras.online/calendario/';

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

    let bannerHTML = '';
    try {
        const resp = await fetch('https://liturgia.up.railway.app/');
        if (resp.ok) {
            const dados = await resp.json();
            bannerHTML = `
                <div class="liturgia-info-banner">
                    <div class="liturgia-info-container">
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Data:</span>
                            <span class="liturgia-info-value">${dados.data}</span>
                        </div>
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Dia Liturgico:</span>
                            <span class="liturgia-info-value">${dados.liturgia}</span>
                        </div>
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Cor:</span>
                            <span class="liturgia-info-value">${dados.cor}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (e) {
        bannerHTML = '';
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
                .liturgia-info-banner { background: linear-gradient(135deg, rgba(139,69,19,0.08), rgba(205,133,63,0.06)); border-bottom:1px solid rgba(139,69,19,0.12); padding:12px 0; }
                .liturgia-info-container { max-width: 1200px; margin: 0 auto; display:flex; justify-content:center; gap:30px; padding:0 20px; }
                .liturgia-info-item { display:flex; flex-direction:column; align-items:center; text-align:center; }
                .liturgia-info-label { font-size:12px; color:var(--secondary-color); text-transform:uppercase; margin-bottom:4px; }
                .liturgia-info-value { font-size:16px; color:var(--primary-color); font-weight:600; }
                body {
                    font-family: "Times New Roman", serif !important;
                    background: var(--bg-color) !important;
                    min-height: 100vh;
                    padding: 0 0 60px;
                }
                .liturgia-link-wrapper {
                    display: flex;
                    justify-content: center;
                    padding: 30px 15px 60px;
                }
                .liturgia-link-card {
                    width: min(980px, calc(100% - 32px));
                    background: rgba(255, 255, 255, 0.96);
                    padding: 32px;
                    border-radius: 18px;
                    box-shadow: 0 20px 45px rgba(44, 31, 19, 0.08);
                    border: 1px solid rgba(228, 216, 198, 0.7);
                }
                .liturgia-link-card h1 {
                    margin: 0 0 12px;
                    color: var(--primary-color);
                    font-size: 38px;
                    line-height: 1.2;
                    text-align: left;
                }
                .liturgia-link-card p {
                    margin: 0 0 20px;
                    font-size: 20px;
                    color: var(--text-color);
                    text-align: left;
                }
                .liturgia-link-card .link-wrap {
                    display: flex;
                    justify-content: flex-start;
                }
                .liturgia-link-card a {
                    display: inline-block;
                    padding: 12px 24px;
                    border-radius: 999px;
                    text-decoration: none;
                    font-weight: 700;
                    color: #fff;
                    background: var(--primary-color);
                }
                .liturgia-link-card a:hover {
                    background: var(--secondary-color);
                }
                @media (max-width: 640px) {
                    .liturgia-link-card {
                        width: calc(100% - 24px);
                        padding: 24px;
                        border-radius: 14px;
                    }
                    .liturgia-link-card h1 {
                        font-size: 30px;
                    }
                    .liturgia-link-card p {
                        font-size: 18px;
                    }
                }
            </style>
            <link rel="stylesheet" href="/nav.css">
            <script src="/nav.js" defer></script>
        </head>
        <body>
            ${nav}
            ${bannerHTML}
            <main class="liturgia-link-wrapper">
                <section class="liturgia-link-card">
                    <h1>Liturgia das Horas</h1>
                    <p>Acesse o calendario oficial para o conteudo completo:</p>
                    <div class="link-wrap">
                        <a href="${CALENDARIO_URL}" target="_blank" rel="noopener noreferrer">Abrir calendario oficial</a>
                    </div>
                </section>
            </main>
        </body>
        </html>
    `);
});

module.exports = router;
