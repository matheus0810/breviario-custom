const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = require('path');
const { URL } = require('url');

const app = express();
const PORT = 3000;

// Servir arquivos estáticos (CSS customizado)
app.use('/custom', express.static('public'));

// Proxy para TODAS as rotas do iBreviary
app.get('*', async (req, res) => {
    try {
        // Ignora rotas de arquivos estáticos customizados
        if (req.path.startsWith('/custom/')) {
            return;
        }

        // Constrói a URL completa do iBreviary
        const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
        let targetUrl = `https://www.ibreviary.com${req.path}`;
        
        if (queryString) {
            targetUrl += `?${queryString}`;
        }
        
        // Se não tem path específico, usa a página principal
        if (req.path === '/') {
            const lang = req.query.lang || 'pt';
            targetUrl = `https://www.ibreviary.com/m2/breviario.php?lang=${lang}`;
        }
        
        // Faz request para o iBreviary
        const response = await fetch(targetUrl);
        let html = await response.text();
        
        // Usa cheerio para manipular o HTML
        const $ = cheerio.load(html);
        
        // Extrai o idioma da URL ou query
        let lang = req.query.lang || 'pt';
        if (targetUrl.includes('lang=')) {
            const match = targetUrl.match(/lang=([a-z]{2})/);
            if (match) lang = match[1];
        }
        
        // Adiciona meta viewport se não existir
        if (!$('meta[name="viewport"]').length) {
            $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">');
        }
        
        // Injeta o CSS customizado no HEAD
        $('head').append(`
            <link rel="stylesheet" href="/custom/style.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
            <style>
            /* 
   BREVIÁRIO - DESIGN MODERNO E LIMPO
*/

/* Reset e base */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    background-attachment: fixed !important;
    line-height: 1.6 !important;
    color: #2d2d2d !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: 100vh !important;
}

/* Container principal - Moderno e elegante */
body > div:not(:first-child), 
body > center:not(:first-child):not(:last-child), 
#main, 
.main-content {
    max-width: 800px !important;
    margin: 0 auto !important;
    padding: 30px 40px !important;
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    border-radius: 15px !important;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
    margin-top: 15px !important;
    margin-bottom: 30px !important;
    min-height: 1vh !important;
    box-sizing: border-box !important;
}

/* Título principal */
body h1:first-of-type,
h1 {
    font-size: 1.8rem !important;
    background: linear-gradient(45deg, #667eea, #dc2626) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    font-weight: 700 !important;
    margin: 0 0 20px 0 !important;
    text-align: center !important;
    border-bottom: 3px solid rgba(220, 38, 38, 0.3) !important;
    padding-bottom: 12px !important;
}

/* Cabeçalho com data - Elegante */
body > div:first-of-type,
body > center:first-of-type {
    background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)) !important;
    color: #2d2d2d !important;
    padding: 15px 20px !important;
    margin-bottom: 20px !important;
    text-align: center !important;
    border-radius: 10px !important;
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
}

/* Textos da data */
body font,
body > center font {
    color: #2d2d2d !important;
    font-size: 0.85rem !important;
}

/* Links dos Ofícios - Estilo moderno e elegante - Apenas para links internos */
body > div a:not(.menu-link),
body > center a:not(.menu-link),
.main-content a:not(.menu-link) {
    display: block !important;
    color: #2d2d2d !important;
    text-decoration: none !important;
    font-size: 0.95rem !important;
    font-weight: 500 !important;
    padding: 12px 16px !important;
    margin: 6px 0 !important;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.9)) !important;
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    border-radius: 8px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    width: 100% !important;
    text-align: left !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

body > div a:not(.menu-link):hover,
body > center a:not(.menu-link):hover,
.main-content a:not(.menu-link):hover {
    background: #ffffff !important;
    color: #dc2626 !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3) !important;
    border: 2px solid #dc2626 !important;
}

/* Subtítulos */
h2, h3 {
    font-size: 1.2rem !important;
    background: linear-gradient(45deg, #667eea, #dc2626) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    font-weight: 600 !important;
    margin: 20px 0 12px !important;
    border-bottom: 2px solid rgba(220, 38, 38, 0.3) !important;
    padding-bottom: 6px !important;
}

/* Parágrafos */
p, font {
    font-size: 0.95rem !important;
    line-height: 1.7 !important;
    color: #2d2d2d !important;
    margin-bottom: 1em !important;
}

/* Textos em negrito */
b, strong {
    color: #667eea !important;
    font-weight: 600 !important;
}

/* Textos em itálico */
i, em {
    color: #dc2626 !important;
    font-style: italic !important;
}

/* CORPO COM ESPAÇO PARA MENU FIXO MODERNO */
body {
    padding-top: 65px !important;
    margin: 0 !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
}

/* Garantir que não há overflow */
html, body {
    max-width: 100vw !important;
    overflow-x: hidden !important;
}

/* ESCONDER TODOS OS MENUS ORIGINAIS */
table,
body > table,
body table,
#menu,
#menu_bar,
nav:not(.modern-menu) {
    display: none !important;
}



/* Remover TODOS os espaços e heights fixos */
#menu, #menu_bar, #menu *, #menu_bar * {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    min-height: 0 !important;
}

#menu table, #menu_bar table {
    margin: 0 !important;
    padding: 0 !important;
    border-spacing: 0 !important;
}

/* Remover espaços de todas as divs e centers */
body > div, body > center {
    margin: 0 !important;
}

body > div:empty, body > center:empty {
    display: none !important;
    height: 0 !important;
}

/* Forçar altura mínima zero em tudo */
* {
    min-height: 0 !important;
}

/* Remover line-height excessivo */
body {
    line-height: 1.4 !important;
}

/* Esconder imagens */
img {
    display: none !important;
}

/* ÍCONES DO MENU */
body > table:first-child td:nth-child(1) a::before,
table:first-child td:nth-child(1) a::before {
    content: "📖 ";
    font-size: 0.9rem;
    margin-right: 4px;
}

body > table:first-child td:nth-child(2) a::before,
table:first-child td:nth-child(2) a::before {
    content: "📚 ";
    font-size: 0.9rem;
    margin-right: 4px;
}

body > table:first-child td:nth-child(3) a::before,
table:first-child td:nth-child(3) a::before {
    content: "🙏 ";
    font-size: 0.9rem;
    margin-right: 4px;
}

body > table:first-child td:nth-child(4) a::before,
table:first-child td:nth-child(4) a::before {
    content: "⛪ ";
    font-size: 0.9rem;
    margin-right: 4px;
}

body > table:first-child td:nth-child(5) a::before,
table:first-child td:nth-child(5) a::before {
    content: "⚙️ ";
    font-size: 0.9rem;
    margin-right: 4px;
}

/* Ocultar santos */
#santiebeati_tabella1,
.santiebeati_tabella1,
[id*="santiebeati"],
[class*="santiebeati"],
a[href*="santiebeati"] {
    display: none !important;
}

/* Footer */
footer {
    background: #2d2d2d !important;
    color: #ffffff !important;
    padding: 20px !important;
    margin-top: 40px !important;
    text-align: center !important;
    font-size: 0.85rem !important;
}

/* Espaçamento */
br {
    display: block !important;
    margin: 4px 0 !important;
}

/* RESPONSIVO MOBILE MELHORADO */
@media (max-width: 768px) {
    body {
        padding-top: 70px !important;
    }
    
    /* Container mobile - ocupando mais espaço */
    body > div:not(:first-child), 
    body > center:not(:first-child):not(:last-child), 
    #main, 
    .main-content {
        max-width: calc(100% - 10px) !important;
        width: calc(100% - 10px) !important;
        margin: 3px auto !important;
        padding: 20px 15px !important;
        margin-top: 3px !important;
        border-radius: 8px !important;
    }
    
    /* Links mobile - otimizados */
    body > div a:not(.menu-link),
    body > center a:not(.menu-link),
    .main-content a:not(.menu-link) {
        padding: 15px 10px !important;
        font-size: 1rem !important;
        margin: 5px 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* Títulos mobile */
    h1 {
        font-size: 1.4rem !important;
        padding: 0 5px !important;
    }
    
    /* Cabeçalho mobile */
    body > div:first-of-type,
    body > center:first-of-type {
        padding: 15px !important;
        margin: 3px auto !important;
        width: calc(100% - 10px) !important;
        box-sizing: border-box !important;
    }
}

/* Mobile muito pequeno - tela completa */
@media (max-width: 480px) {
    body {
        padding-top: 75px !important;
    }
    
    body > div:not(:first-child), 
    body > center:not(:first-child):not(:last-child), 
    #main, 
    .main-content {
        max-width: calc(100% - 6px) !important;
        width: calc(100% - 6px) !important;
        margin: 2px auto !important;
        padding: 15px 12px !important;
        border-radius: 6px !important;
    }
    
    body > div:first-of-type,
    body > center:first-of-type {
        width: calc(100% - 6px) !important;
        margin: 2px auto !important;
        padding: 12px !important;
    }
    
    body > div a:not(.menu-link),
    body > center a:not(.menu-link),
    .main-content a:not(.menu-link) {
        padding: 15px 12px !important;
        font-size: 1rem !important;
        margin: 4px 0 !important;
    }
}
            </style>
            <style>
                /* Força a aplicação do CSS */
                body { 
                    background: #f5f7fa !important; 
                    width: 100% !important;
                    overflow-x: hidden !important;
                }
                html {
                    width: 100% !important;
                    overflow-x: hidden !important;
                }
            </style>
            <script>
                // Interceptar cliques em links para manter o idioma
                document.addEventListener('click', function(e) {
                    const link = e.target.closest('a');
                    if (link && link.href) {
                        const url = new URL(link.href, window.location.href);
                        const currentLang = new URLSearchParams(window.location.search).get('lang') || 'pt';
                        
                        // Se é link interno e não tem lang ou tem lang diferente
                        if (!url.hostname || url.hostname === window.location.hostname) {
                            e.preventDefault();
                            url.searchParams.set('lang', currentLang);
                            window.location.href = url.toString();
                        }
                    }
                }, true);
            </script>
        `);
        
        // Remove elementos dos santos
        $('#santiebeati_tabella1').remove();
        $('[id*="santiebeati"]').remove();
        $('a[href*="santiebeati"]').parent().remove();
        $('*').filter(function() {
            return $(this).text().includes('I Santi di oggi');
        }).remove();
        
        // Remove divs e centers vazios
        $('div:empty, center:empty').remove();
        
        // Remove heights e margins fixos do HTML
        $('div, center, table').removeAttr('height').removeAttr('vspace').removeAttr('hspace');
        
        // Remove espaços em branco excessivos
        $('br + br').remove();
        
        // Corrige TODOS os links para manter o idioma e passar pelo proxy
        $('a[href]').each((i, elem) => {
            let href = $(elem).attr('href');
            
            if (!href) return;
            
            // Se é link relativo do iBreviary
            if (href.startsWith('/')) {
                // Remove idioma existente e adiciona o correto
                href = href.replace(/[?&]lang=[a-z]{2}/, '');
                href += (href.includes('?') ? '&' : '?') + 'lang=' + lang;
                $(elem).attr('href', href);
            }
            // Se é link absoluto do ibreviary, converte para relativo
            else if (href.includes('ibreviary.com')) {
                try {
                    const url = new URL(href);
                    let newHref = url.pathname + url.search;
                    newHref = newHref.replace(/[?&]lang=[a-z]{2}/, '');
                    newHref += (newHref.includes('?') ? '&' : '?') + 'lang=' + lang;
                    $(elem).attr('href', newHref);
                } catch (e) {
                    // Se der erro, mantém o link original
                }
            }
            // Se é link relativo sem barra (ex: "breviario.php")
            else if (!href.startsWith('http') && !href.startsWith('#')) {
                href = href.replace(/[?&]lang=[a-z]{2}/, '');
                href += (href.includes('?') ? '&' : '?') + 'lang=' + lang;
                $(elem).attr('href', href);
            }
        });
        
        // Corrige URLs relativas para absoluta (recursos estáticos)
        $('link[href^="/"]').each((i, elem) => {
            const href = $(elem).attr('href');
            if (!href.includes('.css')) { // Não mexe em CSS
                $(elem).attr('href', 'https://www.ibreviary.com' + href);
            }
        });
        
        $('script[src^="/"]').each((i, elem) => {
            const src = $(elem).attr('src');
            $(elem).attr('src', 'https://www.ibreviary.com' + src);
        });
        
        // Criar menu fixo moderno e elegante
        $('head').append(`
            <style>
                @media (max-width: 768px) {
                    .mobile-menu {
                        height: 65px !important;
                        padding: 0 2px !important;
                    }
                    .mobile-menu .menu-link {
                        padding: 12px 6px !important;
                        font-size: 12px !important;
                        gap: 2px !important;
                    }
                    .mobile-menu .menu-link span:first-child {
                        font-size: 18px !important;
                    }
                }
                @media (max-width: 480px) {
                    .mobile-menu {
                        height: 70px !important;
                        padding: 0 1px !important;
                    }
                    .mobile-menu .menu-link {
                        padding: 10px 4px !important;
                        font-size: 11px !important;
                        gap: 1px !important;
                    }
                    .mobile-menu .menu-link span:first-child {
                        font-size: 16px !important;
                    }
                    .mobile-menu .menu-link span:last-child {
                        font-size: 10px !important;
                    }
                }
            </style>
        `);
        $('body').prepend(`
            <div class="mobile-menu" style="
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
                backdrop-filter: blur(15px);
                height: 55px;
                width: 100%;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                box-sizing: border-box;
            ">
                <a href="/m2/breviario.php?lang=${lang}" class="menu-link" style="
                    flex: 1;
                    color: black !important;
                    text-decoration: none !important;
                    text-align: center;
                    padding: 15px 12px;
                    font-size: 14px;
                    font-weight: 600;
                    border-right: 1px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex !important;
                    flex-direction: column;
                    align-items: center;
                    width: auto !important;
                    margin: 0 !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-radius: 0 !important;
                    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
                    transform: none !important;
                    gap: 3px;
">
                    <span style="font-size: 20px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">📖</span>
                    <span>Breviário</span>
                </a>
                <a href="/m2/letture.php?lang=${lang}" class="menu-link" style="
                    flex: 1;
                    color: black !important;
                    text-decoration: none !important;
                    text-align: center;
                    padding: 15px 12px;
                    font-size: 14px;
                    font-weight: 600;
                    border-right: 1px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                    width: auto !important;
                    margin: 0 !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-radius: 0 !important;
                    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
                    transform: none !important;
">
                    <span style="font-size: 20px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">📚</span>
                    <span>Leitura</span>
                </a>
                <a href="/m2/preghiere.php?lang=${lang}" class="menu-link" style="
                    flex: 1;
                    color: black !important;
                    text-decoration: none !important;
                    text-align: center;
                    padding: 15px 12px;
                    font-size: 14px;
                    font-weight: 600;
                    border-right: 1px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                    width: auto !important;
                    margin: 0 !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-radius: 0 !important;
                    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
                    transform: none !important;
">
                    <span style="font-size: 20px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">🙏</span>
                    <span>Orações</span>
                </a>
                <a href="/m2/messale.php?lang=${lang}" class="menu-link" style="
                    flex: 1;
                    color: black !important;
                    text-decoration: none !important;
                    text-align: center;
                    padding: 15px 12px;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                    width: auto !important;
                    margin: 0 !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-radius: 0 !important;
                    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
                    transform: none !important;
">
                    <span style="font-size: 20px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">⛪</span>
                    <span>Missal</span>
                </a>
            </div>
        `);
        
        // Remover TODOS os menus originais
        $('table').remove();
        $('#menu').remove();
        $('#menu_bar').remove();
        $('.text-center').remove();
        
        // Corrige URLs das outras imagens
        $('img[src^="/"]').each((i, elem) => {
            const src = $(elem).attr('src');
            $(elem).attr('src', 'https://www.ibreviary.com' + src);
        });
        
        res.send($.html());
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao carregar o breviário');
    }
});

app.listen(PORT, () => {
    console.log(`\n🙏 Breviário customizado rodando em: http://localhost:${PORT}`);
    console.log(`   Português: http://localhost:${PORT}?lang=pt`);
    console.log(`   Inglês: http://localhost:${PORT}?lang=en`);
    console.log(`   Espanhol: http://localhost:${PORT}?lang=es\n`);
});

