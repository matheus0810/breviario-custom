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
const INVITATORIO_INDEX_URL = 'https://www.liriocatolico.com.br/liturgia_horas/dados/invitatorio.json';
const LIRIO_PROXY_PREFIX = 'https://r.jina.ai/http://';

function buildLirioProxyUrl(url) {
    return `${LIRIO_PROXY_PREFIX}${url.replace(/^https?:\/\//, '')}`;
}

async function fetchLirioJson(url) {
    const response = await fetch(buildLirioProxyUrl(url));
    if (!response.ok) throw new Error(`Falha ao carregar ${url}`);
    const text = await response.text();
    const marker = 'Markdown Content:';
    const json = text.slice(text.indexOf(marker) + marker.length).trim();
    return JSON.parse(json);
}

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

function renderInvitatorioControls(salmos = []) {
    const opcoes = salmos
        .filter((salmo) => !salmo.estrofe)
        .map((salmo) => `<option value="${salmo.texto_id}"${salmo.id === '94s' ? ' selected' : ''}>${salmo.rotulo}</option>`)
        .join('');

    return `
        <div class="invitatório-controles">
            <label for="salmo-invitatorio">Salmo do Invitatório</label>
            <select id="salmo-invitatorio">${opcoes}</select>
        </div>
    `;
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
        dadosLiturgia = await fetchLirioJson(lirioJsonUrl);
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
            let htmlHora = horaSelecionada.html;
            if (horaParam === 'invitatorio') {
                try {
                    const indice = await fetchLirioJson(INVITATORIO_INDEX_URL);
                    const salmoSemEstrofe = horaSelecionada.salmos.find((salmo) => salmo.id === '94s');
                    htmlHora = indice[salmoSemEstrofe.texto_id] || htmlHora;
                } catch (e) {
                    htmlHora = horaSelecionada.html;
                }
            }

            conteudoExterno = `
                <div class="liturgia-externa">
                    <div class="liturgia-subheader">
                        <div class="liturgia-cabecalho-hora">
                            <strong>${HORA_LABELS[horaParam] || 'Laudes'}</strong>
                            <span> · ${dadosLiturgia.data || dataParam}</span>
                        </div>
                        <div class="liturgia-tabs">${renderHourTabs(dataParam, horaParam)}</div>
                    </div>
                    ${horaParam === 'invitatorio' ? renderInvitatorioControls(horaSelecionada.salmos) : ''}
                    <div id="conteudo-hora">${htmlHora}</div>
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
                .invitatório-controles {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 4px 0 22px;
                    color: var(--primary-color);
                    font-weight: 700;
                }
                .invitatório-controles select {
                    min-width: 170px;
                    padding: 8px 10px;
                    border: 1px solid rgba(131, 80, 38, 0.35);
                    border-radius: 8px;
                    background: #fff;
                    color: var(--text-color);
                    font: inherit;
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
                    <section class="liturgia-externa" id="liturgia-fallback">
                        <div class="liturgia-subheader">
                            <div class="liturgia-cabecalho-hora">
                                <strong>${HORA_LABELS[horaParam] || 'Laudes'}</strong>
                                <span> · ${dataParam}</span>
                            </div>
                            <div class="liturgia-tabs">${renderHourTabs(dataParam, horaParam)}</div>
                        </div>
                        ${horaParam === 'invitatorio' ? '<div class="invitatório-controles"><label for="salmo-invitatorio">Salmo do Invitatório</label><select id="salmo-invitatorio"></select></div>' : ''}
                        <h1>Liturgia das Horas</h1>
                        <p>Não foi possível carregar o conteúdo completo desta hora no momento.</p>
                        <div class="liturgia-action">
                            <a href="${lirioUrl}" target="_blank" rel="noopener noreferrer">Abrir no site do Lírio Católico</a>
                        </div>
                    </section>
                    <script>
                        (async function () {
                            const endpoint = ${JSON.stringify(buildLirioProxyUrl(lirioJsonUrl))};
                            const hora = ${JSON.stringify(horaParam)};
                            const fallback = document.getElementById('liturgia-fallback');
                            try {
                                const response = await fetch(endpoint);
                                if (!response.ok) throw new Error('Não foi possível obter a liturgia.');
                                const bruto = await response.text();
                                const dados = JSON.parse(bruto.slice(bruto.indexOf('Markdown Content:') + 'Markdown Content:'.length).trim());
                                const horaSelecionada = (dados.horas || []).find(item => item.slug === hora);
                                if (!horaSelecionada || !horaSelecionada.html) throw new Error('Hora não encontrada.');
                                const tabs = fallback.querySelector('.liturgia-tabs');
                                let htmlHora = horaSelecionada.html;
                                let controles = '';
                                if (hora === 'invitatorio') {
                                    const indiceResponse = await fetch(${JSON.stringify(buildLirioProxyUrl(INVITATORIO_INDEX_URL))});
                                    const indiceBruto = await indiceResponse.text();
                                    const indice = JSON.parse(indiceBruto.slice(indiceBruto.indexOf('Markdown Content:') + 'Markdown Content:'.length).trim());
                                    const salmos = (horaSelecionada.salmos || []).filter(item => !item.estrofe);
                                    const padrao = salmos.find(item => item.id === '94s');
                                    htmlHora = indice[padrao && padrao.texto_id] || htmlHora;
                                    controles = '<div class="invitatório-controles"><label for="salmo-invitatorio">Salmo do Invitatório</label><select id="salmo-invitatorio">' +
                                        salmos.map(item => '<option value="' + item.texto_id + '"' + (item.id === '94s' ? ' selected' : '') + '>' + item.rotulo + '</option>').join('') +
                                        '</select></div>';
                                }
                                fallback.innerHTML = '<div class="liturgia-subheader">' +
                                    '<div class="liturgia-cabecalho-hora"><strong>' +
                                    ${JSON.stringify(HORA_LABELS[horaParam] || 'Laudes')} +
                                    '</strong><span> · ' + (dados.data || ${JSON.stringify(dataParam)}) + '</span></div>' +
                                    '<div class="liturgia-tabs">' + (tabs ? tabs.innerHTML : '') + '</div></div>' +
                                    controles + '<div id="conteudo-hora">' + htmlHora + '</div>';
                                const select = document.getElementById('salmo-invitatorio');
                                const content = document.getElementById('conteudo-hora');
                                if (select && content) {
                                    select.addEventListener('change', () => { content.innerHTML = indice[select.value] || content.innerHTML; });
                                }
                            } catch (error) {
                                console.error('Falha ao carregar a liturgia no navegador:', error);
                            }
                        }());
                    </script>
                `}
            </main>
            <script>
                (async function () {
                    const select = document.getElementById('salmo-invitatorio');
                    const content = document.getElementById('conteudo-hora');
                    if (!select || !content) return;
                    try {
                        const [diaResponse, indiceResponse] = await Promise.all([
                            fetch(${JSON.stringify(buildLirioProxyUrl(lirioJsonUrl))}),
                            fetch(${JSON.stringify(buildLirioProxyUrl(INVITATORIO_INDEX_URL))})
                        ]);
                        const diaBruto = await diaResponse.text();
                        const indiceBruto = await indiceResponse.text();
                        const dados = JSON.parse(diaBruto.slice(diaBruto.indexOf('Markdown Content:') + 'Markdown Content:'.length).trim());
                        const indice = JSON.parse(indiceBruto.slice(indiceBruto.indexOf('Markdown Content:') + 'Markdown Content:'.length).trim());
                        const hora = (dados.horas || []).find(item => item.slug === 'invitatorio');
                        const salmos = (hora && hora.salmos || []).filter(item => !item.estrofe);
                        select.innerHTML = salmos.map(item => '<option value="' + item.texto_id + '"' + (item.id === '94s' ? ' selected' : '') + '>' + item.rotulo + '</option>').join('');
                        const pintar = () => { content.innerHTML = indice[select.value] || content.innerHTML; };
                        select.addEventListener('change', pintar);
                        pintar();
                    } catch (error) {
                        console.error('Falha ao carregar as opções do Invitatório:', error);
                    }
                }());
            </script>
        </body>
        </html>
    `);
});

module.exports = router;
