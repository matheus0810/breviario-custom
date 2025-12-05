const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

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
        
        // Adicionar nossos estilos e funcionalidades
        $('head').append(`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Liturgia das Horas</title>
            <style>
                /* Reset */
                * { box-sizing: border-box; }
                
                /* Body */
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    background-attachment: fixed !important;
                    margin: 0 !important;
                    padding: 30px 15px 30px 15px !important;
                    line-height: 1.6 !important;
                    color: #2d2d2d !important;
                }
                
                /* Container principal */
                .wp-site-blocks,
                main,
                article,
                .entry-content,
                .content {
                    max-width: 800px !important;
                    margin: 0 auto !important;
                    padding: 30px 40px !important;
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(10px) !important;
                    border-radius: 15px !important;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
                    overflow-y: auto !important;
                    height: auto !important;
                }
                
                /* Títulos */
                h1, h2, h3 {
                    background: linear-gradient(45deg, #667eea, #dc2626) !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                    background-clip: text !important;
                    font-weight: 700 !important;
                    margin: 20px 0 15px 0 !important;
                    border-bottom: 2px solid rgba(220, 38, 38, 0.3) !important;
                    padding-bottom: 8px !important;
                }
                
                /* Texto */
                p, div, span, font {
                    color: #2d2d2d !important;
                    line-height: 1.7 !important;
                    margin-bottom: 1em !important;
                    word-spacing: 0.05em !important;
                }
                
                /* Mobile */
                @media (max-width: 768px) {
                    body { padding: 20px 10px 20px 10px !important; }
                    .wp-site-blocks, main, article, .entry-content, .content {
                        padding: 20px 15px !important;
                        border-radius: 8px !important;
                    }
                }
            </style>
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

app.listen(PORT, () => {
    console.log(`\n🙏 Liturgia das Horas rodando em: http://localhost:${PORT}`);
    console.log(`   Laudes: http://localhost:${PORT}/?tipo=laudes`);
    console.log(`   Vésperas: http://localhost:${PORT}/?tipo=vesperas`);
    console.log(`   Completas: http://localhost:${PORT}/?tipo=completas\n`);
});
