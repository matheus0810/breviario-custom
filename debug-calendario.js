const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function analisarCalendario() {
    try {
        const response = await fetch('https://liturgiadashoras.online/calendario/');
        const html = await response.text();
        const $ = cheerio.load(html);
        
        console.log('=== ANALISANDO CALENDARIO ===\n');
        
        // Procurar por scripts com dados
        $('script').each((i, elem) => {
            const scriptContent = $(elem).html();
            if (scriptContent && (scriptContent.includes('dados') || scriptContent.includes('liturgia'))) {
                console.log(`\n--- SCRIPT ${i} ---`);
                console.log(scriptContent.substring(0, 800));
                console.log('...\n');
            }
        });
        
        // Procurar estrutura do calendário
        console.log('\n=== LINKS DO CALENDARIO (hoje e próximos) ===\n');
        let count = 0;
        $('a').each((i, elem) => {
            const href = $(elem).attr('href');
            const text = $(elem).text().trim();
            
            if (href && (text.includes('15') || text.includes('quinta') || text.includes('Janeiro'))) {
                console.log(`Link: ${text.substring(0, 80)}`);
                console.log(`  -> ${href}\n`);
                count++;
            }
            
            if (count > 10) return false;
        });
        
    } catch (err) {
        console.error('Erro:', err.message);
    }
}

analisarCalendario();
