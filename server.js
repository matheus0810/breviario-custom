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
