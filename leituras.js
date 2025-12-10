const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

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

    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }

        .nav-container {
            padding: 0 15px;
        }
    }
`;

function buildMainNav(activeSection = 'leituras') {
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

// Rota principal de leituras
router.get('/', async (req, res) => {
    const nav = buildMainNav('leituras');
    // Buscar dados da API para montar o banner litúrgico (data, dia litúrgico, cor)
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
                            <span class="liturgia-info-label">Dia Litúrgico:</span>
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
        // ignora falha de banner
        bannerHTML = '';
    }
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>Liturgia Diária</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
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
                .daily-liturgia-wrapper {
                    display: flex;
                    justify-content: center;
                    padding: 30px 15px 60px;
                }
                .daily-liturgia {
                    width: min(900px, calc(100% - 32px));
                    background: rgba(255, 255, 255, 0.96);
                    padding: 32px;
                    border-radius: 18px;
                    box-shadow: 0 20px 45px rgba(44, 31, 19, 0.08);
                    border: 1px solid rgba(228, 216, 198, 0.7);
                }
                .title {
                    font-size: 24px;
                    font-weight: bold;
                    text-transform: uppercase;
                    text-align: center;
                    letter-spacing: 0.08em;
                }
                .reading {
                    font-style: italic;
                    font-size: 18px;
                    color: var(--text-color);
                }
                .reading-text {
                    margin-top: 10px;
                    font-size: 16px;
                    text-align: justify;
                    color: var(--text-color);
                }
                .liturgia-section-separator {
                    border-top: 1px solid rgba(163, 0, 0, 0.15);
                    margin: 24px 0;
                }
                #copy-btn {
                    border-radius: 999px;
                    padding: 10px 24px;
                    font-weight: 600;
                    border: none;
                }
                @media (max-width: 640px) {
                    .daily-liturgia {
                        padding: 24px;
                        width: calc(100% - 24px);
                        border-radius: 14px;
                    }
                }
            </style>
            <link rel="stylesheet" href="/nav.css">
            <script src="/nav.js" defer></script>
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
        </head>
        <body>
            ${nav}
            ${bannerHTML}
            <div class="daily-liturgia-wrapper">
                <div class="daily-liturgia">
                    <div class="title text-danger">Liturgia</div>
                    <div id="liturgia-content">
                        <p class="text-center mt-3">Carregando...</p>
                    </div>
                    <div id="error-message" class="alert alert-danger mt-4 d-none">
                        Não foi possível carregar a liturgia. Tente novamente mais tarde.
                    </div>
                    <div class="text-center mt-4">
                        <button id="copy-btn" class="btn btn-danger">Copiar Liturgia</button>
                    </div>
                </div>
            </div>

            <script>
                const API_URL = 'https://liturgia.up.railway.app/';
                async function fetchLiturgia() {
                    const liturgiaContent = document.getElementById('liturgia-content');
                    const errorMessage = document.getElementById('error-message');
                    try {
                        const response = await fetch(API_URL);
                        if (!response.ok) {
                            throw new Error('Erro ao buscar a liturgia');
                        }
                        const liturgia = await response.json();

                        let segundaLeituraHtml = '';
                        if (liturgia.segundaLeitura && liturgia.segundaLeitura.texto && liturgia.segundaLeitura.texto !== 'Não há segunda leitura hoje!' && liturgia.segundaLeitura.texto !== 'undefined') {
                            segundaLeituraHtml = \`
                                <div class="title text-danger">Segunda Leitura</div>
                                <p class="reading">\${liturgia.segundaLeitura.referencia}</p>
                                <p class="reading-text">\${liturgia.segundaLeitura.texto}</p>
                                <div class="liturgia-section-separator"></div>
                            \`;
                        }

                        liturgiaContent.innerHTML = \`
                            <div class="text-center mt-3">
                                <h2 class="text-danger title">\${liturgia.liturgia}</h2>
                                <p><strong>Data:</strong> \${liturgia.data}</p>
                                <p>
                                    <span class="text-uppercase text-danger fw-bold">
                                        Cor: \${liturgia.cor}
                                    </span>
                                </p>
                            </div>
                            <div class="liturgia-section-separator"></div>

                            <div class="fw-light text-danger">Antífona de Entrada</div>
                            <p class="reading">\${liturgia.antifonas.entrada}</p>
                            <div class="liturgia-section-separator"></div>

                            <h4 class="fw-semibold fst-italic text-danger">Oração do Dia</h4>
                            <p class="reading">\${liturgia.dia}</p>
                            <div class="liturgia-section-separator"></div>

                            <div class="title text-danger">Primeira Leitura</div>
                            <p class="reading">\${liturgia.primeiraLeitura.referencia}</p>
                            <p class="reading-text">\${liturgia.primeiraLeitura.texto}</p>
                            <div class="liturgia-section-separator"></div>

                            <div class="title text-danger">Salmo Responsorial</div>
                            <p class="reading">\${liturgia.salmo.referencia}</p>
                            \${formatarSalmo(liturgia.salmo.texto, liturgia.salmo.refrao)}
                            <div class="liturgia-section-separator"></div>

                            \${segundaLeituraHtml}

                            <div class="title text-danger">Evangelho</div>
                            <p class="reading">\${liturgia.evangelho.referencia}</p>
                            <p class="reading-text">\${liturgia.evangelho.texto}</p>
                            <div class="liturgia-section-separator"></div>

                            <h4 class="fw-semibold fst-italic text-danger">Oração das Oferendas</h4>
                            <p class="reading">\${liturgia.oferendas}</p>
                            <div class="liturgia-section-separator"></div>

                            <div class="fw-light text-danger">Antífona de Comunhão</div>
                            <p class="reading">\${liturgia.antifonas.comunhao}</p>
                            <div class="liturgia-section-separator"></div>

                            <h4 class="fw-semibold fst-italic text-danger">Oração Pós-Comunhão</h4>
                            <p class="reading">\${liturgia.comunhao}</p>
                        \`;
                        errorMessage.classList.add('d-none');
                    } catch (error) {
                        console.error(error);
                        errorMessage.classList.remove('d-none');
                    }
                }

                function formatarSalmo(texto, refrao) {
                    if (!texto) return '';
                    const versos = texto.split('—').map(verso => verso.trim()).filter(Boolean);
                    return versos.map(verso => \`
                        <p class="reading-text">— \${verso}</p>
                        <p class="fw-bold text-bold">† \${refrao}</p>
                    \`).join('');
                }

                document.getElementById('copy-btn').addEventListener('click', () => {
                    const liturgiaContent = document.getElementById('liturgia-content');
                    const range = document.createRange();
                    range.selectNode(liturgiaContent);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    try {
                        document.execCommand('copy');
                        alert('Liturgia copiada com sucesso!');
                    } catch (err) {
                        alert('Não foi possível copiar.');
                    }
                    selection.removeAllRanges();
                });

                fetchLiturgia();
            </script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);
});

module.exports = router;
