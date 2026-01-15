const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function testarBusca() {
    // 1. Buscar dados da API
    const apiResponse = await fetch('https://liturgia.up.railway.app/?data=15/01/2026');
    const apiData = await apiResponse.json();
    
    console.log('=== DADOS DA API ===');
    console.log('Liturgia:', apiData.liturgia);
    console.log('');
    
    // 2. Buscar no calendário
    const calResponse = await fetch('https://liturgiadashoras.online/calendario/');
    const html = await calResponse.text();
    const $ = cheerio.load(html);
    
    console.log('=== BUSCANDO NO CALENDARIO ===');
    
    const liturgiaAPI = apiData.liturgia.toLowerCase();
    const liturgiaNorm = liturgiaAPI.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    console.log('Texto da API (lower):', liturgiaAPI);
    console.log('Texto normalizado:', liturgiaNorm);
    console.log('');
    
    // Extrair componentes como no código real
    const componentes = [];
    
    // Extrair dia da semana (número da feira)
    const matchFeira = liturgiaNorm.match(/(\d+)[ªº]\s*feira/i);
    if (matchFeira) {
        const numFeira = matchFeira[1];
        const diasSemana = {
            '2': 'segunda',
            '3': 'terca',
            '4': 'quarta',
            '5': 'quinta',
            '6': 'sexta',
            '7': 'sabado'
        };
        if (diasSemana[numFeira]) {
            componentes.push(diasSemana[numFeira]);
        }
    } else {
        // Se não tem número de feira, buscar nome do dia por extenso
        if (liturgiaNorm.includes('domingo')) componentes.push('domingo');
        if (liturgiaNorm.includes('segunda-feira')) componentes.push('segunda');
        if (liturgiaNorm.includes('terca-feira')) componentes.push('terca');
        if (liturgiaNorm.includes('quarta-feira')) componentes.push('quarta');
        if (liturgiaNorm.includes('quinta-feira')) componentes.push('quinta');
        if (liturgiaNorm.includes('sexta-feira')) componentes.push('sexta');
        if (liturgiaNorm.includes('sabado')) componentes.push('sabado');
    }
    
    // Número da semana
    const matchSemana = liturgiaNorm.match(/(\d+)[ªº]\s*semana/i);
    if (matchSemana) {
        const num = matchSemana[1];
        componentes.push(`${num}a`);
        componentes.push('semana');
        const numerosPorExtenso = {
            '1': 'primeira',
            '2': 'segunda',
            '3': 'terceira',
            '4': 'quarta',
            '5': 'quinta',
            '6': 'sexta'
        };
        if (numerosPorExtenso[num]) {
            componentes.push(numerosPorExtenso[num]);
        }
    }
    
    // Tempo litúrgico
    if (liturgiaNorm.includes('tempo comum')) {
        componentes.push('tempo');
        componentes.push('comum');
    }
    
    console.log('Componentes extraídos:', componentes);
    console.log('');
    
    // Buscar link que contenha "quinta-feira" E "primeira-semana" E "tempo-comum"
    let encontrado = null;
    
    $('a').each((i, elem) => {
        const href = $(elem).attr('href');
        const texto = $(elem).text().trim().toLowerCase();
        
        if (!href) return;
        
        // Normalizar texto removendo acentos
        const textoNorm = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const hrefNorm = href.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        // Verificar quantos componentes estão presentes
        let matches = 0;
        const matchDetails = [];
        componentes.forEach(comp => {
            const compNorm = comp.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (textoNorm.includes(compNorm) || hrefNorm.includes(compNorm)) {
                matches++;
                matchDetails.push(comp);
            }
        });
        
        // Se encontrou a maioria dos componentes
        const threshold = Math.max(2, componentes.length - 1);
        if (matches >= threshold) {
            console.log('✓ ENCONTRADO!');
            console.log('  Texto:', $(elem).text().trim());
            console.log('  Href:', href);
            console.log(`  Matches: ${matches}/${componentes.length}:`, matchDetails);
            encontrado = href;
            return false; // break
        }
    });
    
    if (!encontrado) {
        console.log('✗ Não encontrado. Mostrando links relacionados:');
        console.log('');
        
        $('a').each((i, elem) => {
            const href = $(elem).attr('href');
            const texto = $(elem).text().trim().toLowerCase();
            
            if (!href) return;
            
            const textoNorm = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            
            if (textoNorm.includes('quinta') || textoNorm.includes('primeira')) {
                console.log('Link:', $(elem).text().trim());
                console.log('  ->', href);
                console.log('');
            }
        });
    }
}

testarBusca().catch(console.error);
