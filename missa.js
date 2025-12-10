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

const RITOS_INICIAIS = [
    {
        title: 'Antífona de Entrada',
        pt: [
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>'
        ],
        la: [
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>'
        ]
    },
    {
        title: 'Saudação',
        pt: [
            '<span class="rubrica">Reunido o povo, o sacerdote encaminha-se para o altar enquanto se executa o Cântico de Entrada ou se lê a Antífona. O sacerdote faz reverência ao altar, beija-o e, se convier, incensa-o e vai para o lugar onde presidirá a Liturgia da Palavra.</span>',
            '<span class="rubrica">Terminado o Cântico de Entrada, todos, de pé, se benzem juntamente com o sacerdote, que diz:</span>',
            'Em nome do Pai e do Filho e do Espírito Santo.<br><strong>℟. Amém.</strong>',
            'A Graça do nosso Senhor Jesus Cristo, o Amor do Pai e a Comunhão do Espírito Santo estejam convosco.<br><strong>℟. Bendito seja Deus que nos reuniu no amor de Cristo.</strong>',
            'Ou então: O Senhor esteja convosco.<br><strong>℟. Ele está no meio de nós.</strong>'
        ],
        la: [
            '<span class="rubrica">Reunido o povo, o sacerdote encaminha-se para o altar enquanto se executa o Cântico de Entrada ou se lê a Antífona. O sacerdote faz reverência ao altar, beija-o e, se convier, incensa-o e vai para o lugar onde presidirá a Liturgia da Palavra.</span>',
            '<span class="rubrica">Terminado o Cântico de Entrada, todos, de pé, se benzem juntamente com o sacerdote, que diz:</span>',
            'In nómine Patris, et Fílii, et Spíritus Sancti.<br><strong>℟. Amen.</strong>',
            'Grátia Dómini nostri Iesu Christi et cáritas Dei et communicátio Sancti Spíritus sit cum ómnibus vobis.<br><strong>℟. Et cum spíritu tuo.</strong>',
            'Vel: Dóminus vobíscum.<br><strong>℟. Et cum spíritu tuo.</strong>'
        ]
    },
    {
        title: 'Ato Penitencial',
        pt: [
            '<span class="rubrica">O sacerdote exorta os fiéis ao recolhimento, convidando-os ao arrependimento, dizendo:</span>',
            '<span class="rubrica">Irmãos e irmãs, reconheçamos as nossas culpas para celebrarmos dignamente os Santos Mistérios.</span>',
            '<span class="rubrica">Faz-se uma pausa de silêncio. Depois, o sacerdote e o povo prosseguem:</span>'
        ],
        la: [
            '<span class="rubrica">O sacerdote exorta os fiéis ao recolhimento, convidando-os ao arrependimento, dizendo:</span>',
            '<span class="rubrica">Irmãos e irmãs, reconheçamos as nossas culpas para celebrarmos dignamente os Santos Mistérios.</span>',
            '<span class="rubrica">Faz-se uma pausa de silêncio. Depois, o sacerdote e o povo prosseguem:</span>'
        ]
    },
    {
        title: 'Confiteor',
        pt: [
            'Confesso a Deus todo-poderoso e a vós, irmãos e irmãs, que pequei muitas vezes por pensamentos e palavras, atos e omissões.',
            'Batendo no peito: Minha culpa, minha tão grande culpa.',
            'E suplico à Virgem Maria, aos anjos, aos santos e a vós, irmãos e irmãs, que rogueis por mim a Deus, nosso Senhor.'
        ],
        la: [
            'Confíteor Deo omnipoténti et vobis, fratres, quia peccávi nimis cogitatione, verbo, ópere et omissione.',
            'Percutiens sibi pectus dicit: Mea culpa, mea culpa, mea máxima culpa.',
            'Ideo precor beatam Mariam semper Vírginem, omnes Angelos et Sanctos, et vos, fratres, oráre pro me ad Dóminum Deum nostrum.'
        ]
    },
    {
        title: 'Absolvição',
        pt: [
            '<span class="rubrica">Depois, o sacerdote invoca o perdão de Deus:</span>',
            'Deus todo-poderoso tenha compaixão de nós, perdoe os nossos pecados e nos conduza à vida eterna.<br><strong>℟. Amém.</strong>'
        ],
        la: [
            '<span class="rubrica">Depois, o sacerdote invoca o perdão de Deus:</span>',
            'Misereátur nostri omnipotens Deus et, dimíssis peccátis nostris, perdúcat nos ad vitam ætérnam.<br><strong>℟. Amen.</strong>'
        ]
    },
    {
        title: 'Kýrie',
        pt: [
            '℣. Kýrie, eléisón.<br><strong>℟. Kýrie, eléisón.</strong>',
            '℣. Chríste, eléisón.<br><strong>℟. Chríste, eléisón.</strong>',
            '℣. Kýrie, eléisón.<br><strong>℟. Kýrie, eléisón.</strong>'
        ],
        la: [
            '℣. Kýrie, eléisón.<br><strong>℟. Kýrie, eléisón.</strong>',
            '℣. Chríste, eléisón.<br><strong>℟. Chríste, eléisón.</strong>',
            '℣. Kýrie, eléisón.<br><strong>℟. Kýrie, eléisón.</strong>'
        ]
    },
    {
        title: 'Glória',
        pt: [
            '<span class="rubrica">Quando prescrito, canta-se ou recita-se o hino Glória.</span>',
            '<strong>Glória a Deus nas alturas</strong> e paz na terra aos homens por Ele amados. Senhor Deus, Rei dos céus, Deus Pai todo-poderoso nós Vos louvamos, nós Vos bendizemos, nós Vos adoramos, nós Vos glorificamos, nós Vos damos graças por vossa imensa glória. Senhor Jesus Cristo, Filho Unigênito, Senhor Deus, Cordeiro de Deus, Filho de Deus Pai, Vós que tirais o pecado do mundo, tende piedade de nós; Vós que tirais o pecado do mundo, acolhei a nossa súplica. Vós que estais à direita do Pai, tende piedade de nós. Só Vós sois o Santo, só Vós o Senhor, só Vós o Altíssimo Jesus Cristo, com o Espírito Santo, na glória de Deus Pai. Amém.'
        ],
        la: [
            '<span class="rubrica">Quando prescrito, canta-se ou recita-se o hino Glória.</span>',
            '<strong>Glória in excelsis Deo</strong> et in terra pax homínibus bonae voluntátis. Laudámus te, benedícimus te, adorámus te, glorificámus te, grátias ágimus tibi propter magnam glóriam tuam, Dómine Deus, Rex cæléstis, Deus Pater omnipotens. Dómine Fili Unigénite, Iesu Christe, Dómine Deus, Agnus Dei, Filius Patris, qui tollis peccáta mundi, miserére nobis; qui tollis peccáta mundi, súscipe deprecationem nostram. Qui sedes ad déxteram Patris, miserére nobis. Quóniam tu solus Sanctus, tu solus Dóminus, tu solus Altíssimus, Iesu Christe, cum Sancto Spíritu: in glória Dei Patris. Amen.'
        ]
    },
    {
        title: 'Oração Coleta',
        pt: [
            '<strong>Oremos.</strong>',
            '<span class="rubrica">Todos se recolhem durante alguns momentos em oração silenciosa. Depois, o sacerdote recita a Oração Coleta do dia. Consultar folha de antífonas e orações diárias.</span>'
        ],
        la: [
            '<strong>Orémus.</strong>',
            '<span class="rubrica">Todos se recolhem durante alguns momentos em oração silenciosa. Depois, o sacerdote recita a Oração Coleta do dia. Consultar folha de antífonas e orações diárias.</span>'
        ]
    },
    {
        title: 'Primeira Leitura',
        pt: [
            '<span class="rubrica">Um leitor sobe ao ambão para proclamar a Primeira Leitura. O povo senta-se para escutar a leitura. O leitor conclui dizendo:</span>',
            'Palavra do Senhor.<br><strong>℟. Graças a Deus.</strong>'
        ],
        la: [
            '<span class="rubrica">Um leitor sobe ao ambão para proclamar a Primeira Leitura. O povo senta-se para escutar a leitura. O leitor conclui dizendo:</span>',
            'Verbum Dómini.<br><strong>℟. Deo grátias.</strong>'
        ]
    },
    {
        title: 'Segunda Leitura',
        pt: [
            '<span class="rubrica">À semelhança da anterior, um leitor sobe ao ambão para proclamar a Segunda Leitura, que conclui dizendo:</span>',
            'Palavra do Senhor.<br><strong>℟. Graças a Deus.</strong>'
        ],
        la: [
            '<span class="rubrica">À semelhança da anterior, um leitor sobe ao ambão para proclamar a Segunda Leitura, que conclui dizendo:</span>',
            'Verbum Dómini.<br><strong>℟. Deo grátias.</strong>'
        ]
    },
    {
        title: 'Leitura do Evangelho',
        pt: [
            '<span class="rubrica">A proclamação do Evangelho constitui o ponto culminante da Liturgia da Palavra. Por isso, os fiéis põem-se de pé para aclamar o Senhor que está para falar. Esta aclamação consiste no Aleluia e no versículo que o caracteriza: porém pelas rubricas e adequado ao tempo litúrgico, segundo um texto do missal ou outro texto aprovado. Se não se pode dizer o Aleluia ou outro canto antes do Evangelho, o sacerdote, ou o diácono, se inclina diante do altar e diz em voz baixa:</span>',
            'Deus todo-poderoso, purifica o meu coração e os meus lábios, para que eu anuncie dignamente o vosso santo Evangelho.',
            '<span class="rubrica">De seguida, o sacerdote dirige-se ao ambão e diz ao povo:</span>',
            'O Senhor esteja convosco.<br><strong>℟. Ele está no meio de nós.</strong>',
            'Evangelho do nosso Senhor Jesus Cristo segundo N. N.<br><strong>℟. Glória a Vós, Senhor.</strong>',
            '<span class="rubrica">Depois de proclamado o Evangelho:</span>',
            'Palavra da Salvação.<br><strong>℟. Glória a Vós, Senhor.</strong>',
            '<span class="rubrica">O povo senta-se para ouvir a Homilia, que é obrigatória em todos os domingos e festas de preceito. Depois da Homilia é oportuno declarar algum tempo para a reflexão pessoal dos fiéis.</span>'
        ],
        la: [
            '<span class="rubrica">A proclamação do Evangelho constitui o ponto culminante da Liturgia da Palavra. Por isso, os fiéis põem-se de pé para aclamar o Senhor que está para falar. Esta aclamação consiste no Aleluia e no versículo que o caracteriza: porém pelas rubricas e adequado ao tempo litúrgico, segundo um texto do missal ou outro texto aprovado. Se não se pode dizer o Aleluia ou outro canto antes do Evangelho, o sacerdote, ou o diácono, se inclina diante do altar e diz em voz baixa:</span>',
            'Munda cor meum ac lábia mea, omnípotens Deus, qui lábia Isaíæ prophétæ cálculo mundasti igne: ita me tua grata miseratione dignare purificáre, ut sanctum Evangelium tuum digne váleam nuntiáre.',
            '<span class="rubrica">De seguida, o sacerdote dirige-se ao ambão e diz ao povo:</span>',
            'Dóminus vobíscum.<br><strong>℟. Et cum spíritu tuo.</strong>',
            '✠ Léctio sancti Evangélii secúndum N. N.<br><strong>℟. Glória tibi, Domine.</strong>',
            '<span class="rubrica">Depois de proclamado o Evangelho:</span>',
            'Verbum Dómini.<br><strong>℟. Laus tibi, Christe.</strong>',
            '<span class="rubrica">O povo senta-se para ouvir a Homilia, que é obrigatória em todos os domingos e festas de preceito. Depois da Homilia é oportuno declarar algum tempo para a reflexão pessoal dos fiéis.</span>'
        ]
    },
    {
        title: 'Credo',
        pt: [
            '<span class="rubrica">Nos Domingos e Solenidades o povo põe-se de pé para fazer a Profissão de Fé.</span>',
            'Creio em um só Deus, Pai todo-poderoso, Criador do céu e da terra, de todas as coisas visíveis e invisíveis. Creio em um só Senhor, Jesus Cristo, Filho Unigênito de Deus, nascido do Pai antes de todos os séculos: Deus de Deus, Luz da Luz, Deus verdadeiro de Deus verdadeiro; gerado, não criado, consubstancial ao Pai. Por Ele todas as coisas foram feitas. E por nós, homens, e para nossa salvação desceu dos céus.',
            '<span class="rubrica">As palavras que se seguem, até se fez homem, todos se inclinam; nas festas da Anunciação e do Natal do Senhor, ajoelham:</span>',
            'E encarnou pelo Espírito Santo, no seio da Virgem Maria, e se fez homem. Também por nós foi crucificado sob Pôncio Pilatos; padeceu e foi sepultado. Ressuscitou ao terceiro dia, conforme as Escrituras, e subiu aos céus, onde está sentado à direita do Pai. De novo há de vir em sua glória, para julgar os vivos e os mortos; e o seu reino não terá fim. Creio no Espírito Santo, Senhor que dá a vida, e procede do Pai e do Filho; e com o Pai e o Filho é adorado e glorificado; Ele que falou pelos Profetas. Creio na Igreja una, santa, católica e apostólica. Professo um só batismo para a remissão dos pecados. E espero a ressurreição dos mortos, e a vida do mundo que há de vir. Amém.',
            '<span class="rubrica">Em seguida, faz-se a Oração Universal ou Oração dos Fiéis, na qual o povo, geralmente a seu função sacerdotal, ora por todas as necessidades da Igreja e do mundo, pela salvação de todos os homens, por necessidades particulares e pelas intenções da igreja local.</span>'
        ],
        la: [
            '<span class="rubrica">Nos Domingos e Solenidades o povo põe-se de pé para fazer a Profissão de Fé.</span>',
            'Credo in unum Deum, Patrem omnipoténtem, factórem caeli et terrae, visibílium ómnium et invisibílium. Et in unum Dóminum Jesum Christum, Fílium Dei Unigénitum, et ex Patre natum ante omnia sæcula. Deum de Deo, lumen de lúmine, Deum verum de Deo vero, génitum, non factum, consubstantiálem Patri: per quem omnia facta sunt. Qui propter nos hómines et propter nostram salútem descéndit de cælis.',
            '<span class="rubrica">As palavras que se seguem, até se fez homem, todos se inclinam; nas festas da Anunciação e do Natal do Senhor, ajoelham:</span>',
            'Et incarnátus est de Spíritu Sancto ex María Vírgine, et homo factus est. Crucifíxus étiam pro nobis sub Póntio Piláto; passus et sepúltus est, et resurréxit tértia die, secúndum Scriptúras, et ascéndit in caelum, sedet ad déxteram Patris. Et íterum ventúrus est cum glória, iudicáre vivos et mortuos; cuius regni non erit finis. Et in Spíritum Sanctum, Dóminum et vivificántem: qui ex Patre Filióque procédit. Qui cum Patre et Fílio simul adorátur et conglorificátur: qui locútus est per prophétas. Et unam, sanctam, cathólicam et apostólicam Ecclésiam. Confíteor unum baptísma in remissiónem peccatórum. Et exspécto resurrectiónem mortuórum, et vitam ventúri sæculi. Amen.',
            '<span class="rubrica">Em seguida, faz-se a Oração Universal ou Oração dos Fiéis, na qual o povo, geralmente a seu função sacerdotal, ora por todas as necessidades da Igreja e do mundo, pela salvação de todos os homens, por necessidades particulares e pelas intenções da igreja local.</span>'
        ]
    },
    {
        title: 'Preparação dos Dons',
        pt: [
            '<span class="rubrica">O povo senta-se e nesta altura tem início o Cântico do Ofertório, se for oportuno. O ajudante coloca os vasos sagrados e as espécies sacramentais sobre o altar. Os fiéis manifestam a sua oblata, porventura oferecendo o Pão e o Vinho para a celebração eucarística ou outras ofertas para o culto e as necessidades da comunidade local. O sacerdote, junto ao altar, toma a patena com o pão e o sustenta um pouco elevado sobre o altar, diz em voz baixa (se não houver Cântico, pode dizer-se em voz alta):</span>',
            'Bendito sejais, Senhor, Deus do universo, pelo pão que recebemos da vossa bondade, fruto da terra e do trabalho humano: que hoje Vos apresentamos e que para nós se vai tornar Pão da vida.<br><strong>℟. Bendito seja Deus para sempre.</strong>',
            '<span class="rubrica">O sacerdote verte um pouco de água no cálice, dizendo em voz baixa:</span>',
            'Do mistério desta água e deste vinho, possamos participar da divindade do vosso Filho, que se dignou assumir a nossa humanidade.',
            '<span class="rubrica">Depois, o sacerdote toma o cálice e, mantendo-o um pouco elevado sobre o altar (em voz alta, se não houver Cântico):</span>',
            'Bendito sejais, Senhor, Deus do universo, pelo vinho que recebemos da vossa bondade, fruto da videira e do trabalho humano, que hoje Vos apresentamos e que para nós se vai tornar Vinho da salvação.<br><strong>℟. Bendito seja Deus para sempre.</strong>',
            '<span class="rubrica">Depois, o sacerdote, profundamente inclinado diante do altar, diz em silêncio:</span>',
            'De coração contrito e humilde, sejamos, Senhor, acolhidos por Vós; e seja o nosso sacrifício hoje celebrado de modo que Vos agrade, Senhor, nosso Deus.',
            '<span class="rubrica">O sacerdote, em pé ao lado do altar, lava as mãos, dizendo em silêncio:</span>',
            'Lavai-me, Senhor, de minhas faltas e purificai-me de meus pecados.',
            '<span class="rubrica">Levantado-se o povo, o sacerdote diz:</span>',
            'Orai, irmãos e irmãs, para que o nosso sacrifício seja aceito por Deus, Pai todo-poderoso.',
            '<strong>℟. Receba o Senhor por tuas mãos este sacrifício, para glória do seu nome, para nosso bem e de toda a santa Igreja.</strong>',
            '',
            '<h4>ORAÇÃO SOBRE AS OFERENDAS</h4>',
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>',
            '',
            '<h4>PREFÁCIO</h4>',
            '<span class="rubrica">O Prefácio constitui a primeira parte da Oração Eucarística e inicia-se com um diálogo solene: o sacerdote convida o povo a levantar o coração para o Senhor em louvor e acção de graças, e associa-o a si na oração que ele, em nome de toda a comunidade, dirige ao Pai por meio de Jesus Cristo:</span>'
        ],
        la: [
            'Benedíctus es, Dómine, Deus univérsi, quia de tua largitáte accépimus panem, quem tibi offérimus, fructum terræ et óperis mánuum hóminum: ex quo nobis fiet panis vitæ.<br><strong>℟. Benedíctus Deus in sǽcula.</strong>',
            '<span class="rubrica">O sacerdote verte um pouco de água no cálice, dizendo em voz baixa:</span>',
            'Per huius aquæ et vini mystérium eius efficiámur divinitátis consórtes, qui humanitátis nostræ fíeri dignátus est particeps.',
            '<span class="rubrica">Depois, o sacerdote toma o cálice e, mantendo-o um pouco elevado sobre o altar:</span>',
            'Benedíctus es, Dómine, Deus univérsi, quia de tua largitáte accépimus vinum, quod tibi offérimus, fructum vitis et óperis mánuum hóminum, ex quo nobis fiet potus spiritális.<br><strong>℟. Benedíctus Deus in sǽcula.</strong>',
            '<span class="rubrica">Depois, o sacerdote, profundamente inclinado diante do altar, diz em silêncio:</span>',
            'In spíritu humilitátis et in ánimo contríto suscipiámur a te, Dómine; et sic fiat sacrifícium nostrum in conspéctu tuo hódie, ut pláceat tibi, Dómine Deus.',
            '<span class="rubrica">O sacerdote, em pé ao lado do altar, lava as mãos, dizendo em silêncio:</span>',
            'Lava me, Dómine, ab iniquitáte mea, et a peccáto meo munda me.',
            '<span class="rubrica">Levantado-se o povo, o sacerdote diz:</span>',
            'Oráte, fratres: ut meum ac vestrum sacrifícium acceptábile fiat apud Deum Patrem omnipoténtem.',
            '<strong>℟. Suscípiat Dóminus sacrifícium de mánibus tuis ad laudem et glóriam nóminis sui, ad utilitátem quoque nostram totiúsque Ecclésiæ suæ sanctæ.</strong>',
            '',
            '<h4>ORAÇÃO SOBRE AS OFERENDAS</h4>',
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>',
            '',
            '<h4>PREFÁCIO</h4>',
            '<span class="rubrica">O Prefácio constitui a primeira parte da Oração Eucarística e inicia-se com um diálogo solene: o sacerdote convida o povo a levantar o coração para o Senhor em louvor e acção de graças, e associa-o a si na oração que ele, em nome de toda a comunidade, dirige ao Pai por meio de Jesus Cristo:</span>'
        ]
    }
];

const ORDINARIO_COMUNHAO = [
    {
        title: 'Doxologia',
        pt: [
            '<span class="rubrica">O sacerdote toma o cálice e a pátena com a hóstia, elevando-os, diz:</span>',
            'Por Cristo, com Cristo, em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, agora e para sempre.',
            '<strong>℟. Amém.</strong>'
        ],
        la: [
            '<span class="rubrica">O sacerdote toma o cálice e a pátena com a hóstia, elevando-os, diz:</span>',
            'Per ipsum, et cum ipso, et in ipso, est tibi Deo Patri omnipoténti, in unitáte Spíritus Sancti, omnis honor et glória per ómnia sæcula sæculórum.',
            '<strong>℟. Amen.</strong>'
        ]
    },
    {   
        title: 'Rito da Comunhão',
        pt: [
            '<span class="rubrica">O sacerdote diz:</span>',
            'Dóminus vobíscum.',
            '<strong>℟. O Senhor esteja convosco.</strong>',
            '<span class="rubrica">Em seguida:</span>',
            'Dai-nos a paz do Senhor e a unidade, que é fruto do Espírito Santo. Concordemos na mesma fé e paz.',
            '<strong>℟. E com o teu espírito.</strong>'
        ],
        la: [
            '<span class="rubrica">O sacerdote diz:</span>',
            'Pax Dómini sit semper vobíscum.',
            '<strong>℟. Et cum spíritu tuo.</strong>'
        ]
    },
    {
        title: 'Pai Nosso',
        pt: [
            '<span class="rubrica">O sacerdote apresenta um sinal de paz e todos repetem o gesto. Em seguida, convida a rezar o Pai Nosso:</span>',
            'Aprendei a rezar com as palavras que Jesus nos ensinou:',
            '<span class="rubrica">Todos rezam:</span>',
            'Pai Nosso, que estais nos céus, santificado seja o vosso nome, venha a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do mal.',
            '<span class="rubrica">O sacerdote conclui:</span>',
            'Senhor Jesus Cristo, que dissestes aos vossos Apóstolos: Eu vos deixo a paz, eu vos dou a minha paz, não olheis nossos pecados, mas, olhai para a fé da vossa Igreja, a fim de que sejamos sempre reunidos na paz. Vós que viveis e reinais por todos os séculos dos séculos. ℟. Amém.'
        ],
        la: [
            '<span class="rubrica">O sacerdote apresenta um sinal de paz e todos repetem o gesto. Em seguida, convida a rezar o Pai Nosso:</span>',
            'Preces ut nobis docuit Dominus noster Iesus Christus, oremus:',
            '<span class="rubrica">Todos rezam:</span>',
            'Pater noster, qui es in caelis, sanctificetur nomen tuum; adveniat regnum tuum; fiat voluntas tua, sicut in caelo, et in terra. Panem nostrum quotidianum da nobis hodie; et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris; et ne nos inducas in tentationem, sed libera nos a malo.',
            '<span class="rubrica">O sacerdote conclui:</span>',
            'Libera nos, quaesumus, Domine, ab omnibus malis, da propitius pacem in diebus nostris, ut, ope misericordiae tuae adiuti, et a peccato simus semper liberi et ab omni perturbatione securi: expectantes beatam spem et adventum Salvatoris nostri Iesu Christi.'
        ]
    },
    {
        title: 'Comunhão',
        pt: [
            '<span class="rubrica">O sacerdote apresenta o Corpo de Cristo:</span>',
            'Felizes os convidados para a Ceia do Senhor. Eis o Cordeiro de Deus, que tira o pecado do mundo.',
            '<strong>℟. Senhor, não sou digno de que entreis em minha morada, mas dizei uma palavra e serei salvo.</strong>',
            '<span class="rubrica">O sacerdote e povo comungam. Em seguida, distribui-se a Comunhão do Corpo de Cristo aos fiéis:</span>',
            'O Corpo de Cristo. ℟. Amém.',
            '<span class="rubrica">Depois, da Comunhão no Cálice:</span>',
            'O Sangue de Cristo. ℟. Amém.',
            '<span class="rubrica">Após a comunhão, quando as pessoas se colocam em silêncio:</span>'
        ],
        la: [
            '<span class="rubrica">O sacerdote apresenta o Corpo de Cristo:</span>',
            'Ecce Agnus Dei, ecce qui tollit peccata mundi. Beati qui ad cenam Agni vocati sunt.',
            '<strong>℟. Domine, non sum dignus, ut intres sub tectum meum, sed tantum dic verbo et sanabitur anima mea.</strong>',
            '<span class="rubrica">O sacerdote e povo comungam. Em seguida, distribui-se a Comunhão do Corpo de Cristo aos fiéis:</span>',
            'Corpus Christi. ℟. Amen.',
            '<span class="rubrica">Depois, da Comunhão no Cálice:</span>',
            'Sanguis Christi. ℟. Amen.'
        ]
    },
    {
        title: 'Ritos de Conclusão',
        pt: [
            '<span class="rubrica">O sacerdote beija o altar, como no princípio, em sinal de veneração e feita a devida reverência, retira-se com os ministros.</span>',
            'Dóminus vobíscum.',
            '<strong>℟. O Senhor esteja convosco.</strong>',
            'Abençoe-vos Deus todo-poderoso, Pai e Filho, e Espírito Santo.',
            '<strong>℟. Amém.</strong>',
            '<span class="rubrica">Em seguida, o sacerdote beija o altar, como no princípio, em sinal de veneração e feita a devida reverência, retira-se com os ministros.</span>',
            'Ide em paz o Senhor vos acompanhe.',
            '<strong>℟. Graças a Deus.</strong>'
        ],
        la: [
            '<span class="rubrica">O sacerdote beija o altar, como no princípio, em sinal de veneração e feita a devida reverência, retira-se com os ministros.</span>',
            'Dóminus vobíscum.',
            '<strong>℟. Et cum spíritu tuo.</strong>',
            'Benedícat vos omnípotens Deus, Pater, et Fílius, et Spíritus Sanctus.',
            '<strong>℟. Amen.</strong>',
            '<span class="rubrica">Em seguida, o sacerdote beija o altar, como no princípio, em sinal de veneração e feita a devida reverência, retira-se com os ministros.</span>',
            'Ite, missa est.',
            '<strong>℟. Deo grátias.</strong>'
        ]
    }
];

const ORACOES_EUCARISTICAS = [
    {
        id: 'oe1',
        short: 'OE I',
        title: 'Oração Eucarística I',
        pt: [
            '<span class="rubrica">CP</span> Pai de misericórdia, a quem sobem nossos louvores, suplicantes, vos rogamos e pedimos por Jesus Cristo, vosso Filho e Senhor nosso, que aceiteis e abençoeis ✠ estes dons, estas oferendas, este sacrifício puro e santo, que oferecemos, antes de tudo, pela vossa Igreja santa e católica: concedei-lhe paz e proteção, unindo-a num só corpo e governando-a por toda a terra, em comunhão com o vosso servo o Papa N., o nosso Bispo N., e todos os que guardam a fé católica que receberam dos Apóstolos.',
            '',
            '<strong>R: Abençoai nossa oferenda, ó Senhor!</strong>',
            '',
            '<span class="rubrica">1C</span> Lembrai-vos, ó Pai, dos vossos filhos e filhas N. N. e de todos os que circundam este altar, dos quais conheceis a fé e a dedicação ao vosso serviço. Por eles nós vos oferecemos e também eles vos oferecem este sacrifício de louvor por si e por todos os seus, e elevam a vós as suas preces, Deus eterno, vivo e verdadeiro, para alcançar o perdão de suas faltas, a segurança em suas vidas e a salvação que esperam.',
            '',
            '<strong>R: Lembrai-vos, ó Pai, de vossos filhos!</strong>',
            '',
            '<span class="rubrica">2C</span> Em comunhão com toda a Igreja, celebramos em primeiro lugar a memória da Mãe de nosso Deus e Senhor Jesus Cristo, a gloriosa sempre Virgem Maria, a de seu esposo São José, e também a dos Santos Apóstolos e Mártires: Pedro e Paulo, André, (Tiago e João, Tomé, Tiago e Filipe, Bartolomeu e Mateus, Simão e Tadeu, Lino, Cleto, Clemente, Sisto, Cornélio e Cipriano, Lourenço e Crisógono, João e Paulo, Cosme e Damião), e todos os vossos Santos. Por seus méritos e preces concedei-nos sem cessar a vossa proteção. (Por Cristo, nosso Senhor. Amém).',
            '',
            '<strong>R: Em comunhão com os vossos Santos vos louvamos!</strong>',
            '',
            '<span class="rubrica">CP</span> Aceitai, ó Pai, com bondade, a oblação dos vossos servos e de toda a vossa família; dai-nos sempre a vossa paz, livrai-nos da condenação eterna e acolhei-nos entre os vossos eleitos. (Por Cristo, Senhor nosso. Amém)',
            '',
            '<span class="rubrica">CC</span> Dignai-vos, ó Pai, aceitar, abençoar e santificar estas oferendas, recebei-as como sacrifício espiritual perfeito, a fim de que se tornem para nós o Corpo e ✠ o Sangue de vosso amado Filho, nosso Senhor Jesus Cristo.',
            '',
            '<strong>R: Enviai o vosso Espírito Santo!</strong>',
            '',
            'Na véspera de sua paixão, ele tomou o pão em suas santas e veneráveis mãos, elevou os olhos ao céu, a vós, ó Pai, todo-poderoso, pronunciou a bênção de ação de graças, partiu o pão e o deu a seus discípulos, dizendo:',
            '',
            '<strong>TOMAI, TODOS, E COMEI: ISTO É O MEU CORPO, QUE SERÁ ENTREGUE POR VÓS.</strong>',
            '',
            'Do mesmo modo, ao fim da Ceia, ele tomou este precioso cálice em suas santas e veneráveis mãos, pronunciou novamente a bênção de ação de graças e o deu a seus discípulos, dizendo:',
            '',
            '<strong>TOMAI, TODOS, E BEBEI: ESTE É O CÁLICE DO MEU SANGUE, O SANGUE DA NOVA E ETERNA ALIANÇA, QUE SERÁ DERRAMADO POR VÓS E POR TODOS, PRA REMISSÃO DOS PECADOS. FAZEI ISTO EM MEMÓRIA DE MIM.</strong>',
            '',
            'Mistério da fé!',
            '',
            '<strong>R: Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!</strong>',
            '',
            'Ou:',
            'Mistério da fé e do amor!',
            '<strong>R: Todas as vezes que comemos deste pão e bebemos deste cálice, anunciamos, Senhor, a vossa morte, enquanto esperamos a vossa vinda!</strong>',
            '',
            'Ou:',
            'Mistério da fé para a salvação do mundo!',
            '<strong>R: Salvador do mundo, salvai-nos, vós que nos libertastes pela cruz e ressurreição.</strong>',
            '',
            '<span class="rubrica">CC</span> Celebrando, pois, a memória da bem-aventurada paixão do vosso Filho, da sua ressurreição dentre os mortos e gloriosa ascensão aos céus, nós, vossos servos, e também vosso povo santo, vos oferecemos, ó Pai, dentre os bens que nos destes, o sacrifício puro, santo e imaculado, Pão santo da vida eterna e Cálice da perpétua salvação. Recebei, ó Pai, com olhar benigno, esta oferta, como recebestes os dons do justo Abel, o sacrifício de nosso patriarca Abraão e a oblação pura e santa do sumo sacerdote Melquisedeque.',
            '',
            '<strong>R: Aceitai, ó Senhor, a nossa oferta!</strong>',
            '',
            'Suplicantes, vos pedimos, ó Deus onipotente, que esta nossa oferenda seja levada à vossa presença, no altar do céu, pelas mãos do vosso santo Anjo, para que todos nós, participando deste altar, pela comunhão do santíssimo Corpo e Sangue do vosso Filho, sejamos repletos de todas as graças e bênçãos do céu. (Por Cristo, nosso Senhor. Amém)',
            '',
            '<strong>R: O Espírito nos una num só corpo!</strong>',
            '',
            '<span class="rubrica">3C</span> Lembrai-vos, ó Pai, dos vossos filhos e filhas N. N. que nos precederam com o sinal da fé e dormem o sono da paz. A eles, e a todos os que descansam no Cristo, concedei o repouso, a luz e a paz. (Por Cristo, nosso Senhor. Amém)',
            '',
            '<strong>R: Concedei-lhes, ó Senhor, a luz eterna!</strong>',
            '',
            '<span class="rubrica">4C</span> E a todos nós pecadores, que esperamos na vossa infinita misericórdia, concedei, não por nossos méritos, mas por vossa bondade, o convívio dos Apóstolos e Mártires: João Batista e Estêvão, Matias e Barnabé, (Inácio, Alexandre, Marcelino e Pedro, Felicidade e Perpétua, Águeda e Luzia, Inês, Cecília, Anastácia) e de todos os vossos Santos. Por Cristo, nosso Senhor.',
            '',
            '<span class="rubrica">CP</span> Por ele não cessais de criar e santificar, vivificar, abençoar estes bens e distribuí-los entre nós.',
            '',
            '<span class="rubrica">CP ou CC</span> Por Cristo, com Cristo, e em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, por todos os séculos dos séculos.',
            '',
            '<strong>R: Amém.</strong>'
        ],
        la: [
            'Te igitur, clementissime Pater, per Iesum Christum, Filium tuum, Dominum nostrum, supplices rogamus ac petimus, uti accepta habeas et benedicas + haec dona haec munera, haec sancta sacrificia illibata.',
            '',
            'In primis, quae tibi offerimus pro Ecclesia tua sancta catholica: quam pacificare, custodire, adunare et regere digneris toto orbe terrarum: una cum famulo tuo Papa nostro (N) et Antistite nostro (N) et omnibus orthodoxis atque catholicae et apostolicae fidei cultoribus.',
            '',
            'Memento, Domine famulorum famularumque tuarum, (N), et omnium circumstantium, quorum tibi fides cognita est et nota devotio, pro quibus tibi offerimus: vel qui tibi offerunt hoc sacrificium laudis, pro se suisque omnibus: pro redemtione animarum suarum, pro spe salutis et incolumitatis suae: tibique reddunt vota sua aeterno Deo, vivo et vero.',
            '',
            'Communicantes, et memoriam venerantes, in primis gloriosae semper Virginis Mariae, Genetricis Dei et Domini nostri Iesu Christi: sed et beati Ioseph, eiusdem Virginis Sponsi, et beatorum Apostolorum ac Martyrum tuorum, Petri et Pauli, Andreae, (Iacobi, Ioannis, Thomae, Iacobi, Philippi, Bartholomaei, Matthaei, Simonis et Thaddaei: Lini, Cleti, Clementis, Xysti, Cornelii, Cypriani, Laurentii, Chrysogoni, Ionnis et Pauli, Cosmae et Damiani) et omnium Sanctorum tuorum; quorum meritis precibusque concedas, ut in omnibus protectionis tuae muniamur auxilio. (Per Christum Dominum nostrum. Amen.)',
            '',
            'Hanc igitur oblationem servitutis nostrae, sed et cunctae familiae tuae, quaesumus, Domine, ut placatus accipias: diesque nostros in tua pace disponas, atque ab aeterna damnatione nos eripi et in electorum tuorum iubeas grege numerari. (Per Christum Dominum nostrum. Amen.)',
            '',
            'Quam oblationem tu, Deus, in omnibus, quaesumus, benedictam, adscriptam, ratam, rationabilem, acceptabilemque facere digneris: ut nobis Corpus et Sanguis fiat dilectissimi Filii tui, Domini nostri Iesu Christi.',
            '',
            'Qui, pridie quam pateretur, accepit panem in sanctas ac venerabiles manus suas, et elevatis oculis in caelum ad te Deum Patrem suum omnipotentem, tibi gratias agens benedixit, fregit, deditque discipulis suis, dicens:',
            '',
            '<strong>ACCIPITE ET MANDUCATE EX HOC OMNES: HOC EST ENIM CORPUS MEUM, QUOD PRO VOBIS TRADETUR.</strong>',
            '',
            'Simili modo, postquam cenatum est, accipiens et hunc praeclarum calicem in sanctas ac venerabiles manus suas, item tibi grtias agens benedixit, deditque discipulis suis, dicens:',
            '',
            '<strong>ACCIPITE ET BIBITE EX EO OMNES: HIC ENIM CALIX SANGUINIS MEI NOVI ET AETERNI TESTAMENTI, QUI PRO VOBIS ET PRO MULTIS EFFUNDETOR IN REMISSIONEM PECCATORUM. HOC FACITE IN MEAM COMMEMORATIONEM.</strong>',
            '',
            'Mysterium fidei.',
            '',
            '<strong>℟. Mortem tuam annuntiamus, Domine, et tuam resurrectionem confitemur, donec venias!</strong>',
            '',
            'Unde et memores, Domine, nos servi tui, sed et plebs tua sancta, eiusdem Christi, Filii Tui, Domini nostri, tam beatae passionis, necnon et ab inferis resurrectionis, sed et in caelos gloriosae ascensionis: offerimus praeclarae maiestati tuae de tuis donis ac datis hostiam puram, hostiam sanctam, hostiam immaculatam, Panem sanctam vitae aeternae et Calicem salutis perpetuae.',
            '',
            'Supra quae propitio ac sereno vultu respicere digneris: et accepta habere, siculti accepta habere dignatus es munera pueri tui iusti Abel, et sacrificium Patriarchae nostri Abrahae, et quod tibi obtulit summus sacerdos tuus Melchisedech, sanctum sacrificium, immaculatam hostiam. Supplices te rogamus, omnipotens Deus: iube haec perferri per manus sancti Angeli tui in sublime altare tuum, in conspectu divinae maiestatis tuae; ut quotquot ex hac altaris participatione sacrosanctum Filii tui Corpus et Sanguinem sumpserimus, omni benedictione caelesti et gratia repleamur. (Per Christum Dominum nostrum. Amen.)',
            '',
            'Memento etiam, Domine, famulorum famularumque tuarum (N) et (N), qui nos praecesserunt cum signo fidei, et dormiunt in somno pacis. Ipsis, Domine, et omnibus in Christo quiescentibus, locum refrigerii, lucis et pacis, ut indulgeas, deprecamur. (Per Christum Dominum nostrum. Amen.)',
            '',
            'Nobis quoque peccatoribus famulis tuis, de multitudine miserationum tuarum sperantibus, partem aliquam et societatem donare digneris cum tuis sanctis Apostolis et Martyribus et omnibus Sanctis tuis : cum Ioanne, Stephano, Matthia, Barnaba, (Ignatio, Alexandro, Marcellino, Petro, Felicitate, Perpetua, Agatha, Lucia, Agnete, Caecilia, Anastasia): intra quorum nos consortium, non aestimator meriti, sed veniae, quaesumus, largitor admitte. (Per Christum Dominum nostrum. Amen.)',
            '',
            'Per quem haec omnia, Domine, semper bona creas, sanctificas, vivificas, benedicis, et praestas nobis.',
            '',
            'Per ipsum, et cum ipso, et in ipso, est tibi Deo Patri omnipotenti, in unitate Spiritus Sancti, omnis honor et gloria per omnia saecula saeculorum.',
            '',
            '<strong>℟. Amen.</strong>'
        ]
    },
    {
        id: 'oe2',
        short: 'OE II',
        title: 'Oração Eucarística II',
        pt: [
            '<span class="rubrica">CP</span> Na verdade, ó Pai, vós sois Santo, fonte de toda santidade.',
            '',
            '<span class="rubrica">CC</span> Santificai, pois, estes dons, derramando sobre eles o vosso Espírito, a fim de que se tornem para nós o Corpo e ✠ o Sangue de nosso Senhor Jesus Cristo.',
            '',
            '<strong>R: Enviai o Vosso Espírito Santo!</strong>',
            '',
            'Estando para ser entregue e abraçando livremente a paixão, Jesus tomou o pão, pronunciou a bênção de ação de graças, partiu e o deu a seus discípulos, dizendo:',
            '',
            '<strong>TOMAI, TODOS, E COMEI: ISTO É O MEU CORPO, QUE SERÁ ENTREGUE POR VÓS.</strong>',
            '',
            'Do mesmo modo, no fim da Ceia, ele tomou o cálice em suas mãos e, dando graças novamente, o entregou a seus discípulos, dizendo:',
            '',
            '<strong>TOMAI, TODOS, E BEBEI: ESTE É O CÁLICE DO MEU SANGUE, O SANGUE DA NOVA E ETERNA ALIANÇA, QUE SERÁ DERRAMADO POR VÓS E POR TODOS, PARA A REMISSÃO DOS PECADOS. FAZEI ISTO EM MEMÓRIA DE MIM.</strong>',
            '',
            'Mistério da fé!',
            '',
            '<strong>R: Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!</strong>',
            '',
            'Ou:',
            'Mistério da fé e do amor!',
            '<strong>R: Todas as vezes que comemos deste pão e bebemos deste cálice, anunciamos, Senhor, a vossa morte, enquanto esperamos a vossa vinda!</strong>',
            '',
            'Ou:',
            'Mistério da fé para a salvação do mundo!',
            '<strong>R: Salvador do mundo, salvai-nos, vós que nos libertastes pela cruz e ressurreição.</strong>',
            '',
            '<span class="rubrica">CC</span> Celebrando, pois, o memorial da morte e ressurreição do vosso Filho, nós vos oferecemos, ó Pai, o Pão da vida e o Cálice da salvação; e vos agradecemos porque nos tornastes dignos de estar aqui na vossa presença e vos servir.',
            '',
            '<strong>R: Aceitai, ó Senhor, a nossa oferta!</strong>',
            '',
            'Suplicantes, vos pedimos que, participando do Corpo e Sangue de Cristo, sejamos reunidos pelo Espírito Santo num só corpo.',
            '',
            '<strong>R: O Espírito nos una num só corpo!</strong>',
            '',
            '<span class="rubrica">1C</span> Lembrai-vos, ó Pai, da vossa Igreja que se faz presente pelo mundo inteiro; que ela cresça na caridade, em comunhão com o papa N., com o nosso bispo N., os bispos do mundo inteiro, os presbíteros, os diáconos e todos os ministros do vosso povo.',
            '',
            '<strong>R: Lembrai-vos, ó Pai, da vossa Igreja!</strong>',
            '',
            '<span class="rubrica">2C</span> Lembrai-vos do vosso filho (da vossa filha) N., que (hoje) chamastes deste mundo à vossa presença. Tendo sido sepultado (a) com Cristo em sua morte, no Batismo, participe igualmente da sua ressurreição.',
            '',
            '<span class="rubrica">2C</span> Lembrai-vos também, na vossa misericórdia, dos (outros) nossos irmãos e irmãs que adormeceram na esperança da ressurreição e de todos os que partiram desta vida; acolhei-os junto a vós na luz da vossa face.',
            '',
            '<strong>R: Concedei-lhes, ó Senhor, a luz eterna!</strong>',
            '',
            '<span class="rubrica">3C</span> Enfim, nós vos pedimos, tende piedade de todos nós e dai-nos participar da vida eterna, com a Virgem Maria, Mãe de Deus, São José, seu esposo, Os Apóstolos, (São N. Santo do dia ou padroeiro) e todos os Santos que neste mundo viveram na vossa amizade, a fim de vos louvarmos e glorificarmos por Jesus Cristo, vosso Filho.',
            '',
            '<span class="rubrica">CP ou CC</span> Por Cristo, com Cristo, e em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, por todos os séculos dos séculos.',
            '',
            '<strong>R: Amém!</strong>'
        ],
        la: [
            'Vere Sanctus es, Domine, fons omnis sanctitatis.',
            '',
            'Haec ergo dona, quaesumus, Spiritus tui rore sanctifica, ut nobis Corpus et + Sanguis fiant Domini nostri Iesu Christi.',
            '',
            'Qui, pridie quam pateretur, accepit panem in sanctas ac venerabiles manus suas, et elevatis oculis in caelum ad te Deum Patrem suum omnipotentem, tibi gratias agens benedixit, fregit, deditque discipulis suis, dicens:',
            '',
            '<strong>ACCIPITE ET MANDUCATE EX HOC OMNES: HOC EST ENIM CORPUS MEUM, QUOD PRO VOBIS TRADETUR.</strong>',
            '',
            'Simili modo, postquam cenatum est, accipiens et hunc praeclarum calicem in sanctas ac venerabiles manus suas, item tibi grtias agens benedixit, deditque discipulis suis, dicens:',
            '',
            '<strong>ACCIPITE ET BIBITE EX EO OMNES: HIC ENIM CALIX SANGUINIS MEI NOVI ET AETERNI TESTAMENTI, QUI PRO VOBIS ET PRO MULTIS EFFUNDETOR IN REMISSIONEM PECCATORUM. HOC FACITE IN MEAM COMMEMORATIONEM.</strong>',
            '',
            'Mysterium fidei.',
            '',
            '<strong>Mortem tuam annuntiamus, Domine, et tuam resurrectionem confitemur, donec venias!</strong>',
            '',
            'Memores igitur mortis et resurrectionis eius, tibi, Domine, panem vitae et calicem salutis afferimus, gratias agentes quia nos dignos habuisti astare coram te et tibi ministrare. Et supplices deprecamur ut Corporis et Sanguinis Christi participes a Spiritu Sancto congregemur in unum.',
            '',
            'Recordare, Domine, Ecclesiae tuae toto orbe diffusae, ut eam in caritate perficias una cum Papa nostro (N) et Episcopo nostro (N) et universo clero.',
            '',
            'Memento etiam fratrum nostrorum, qui in spe resurrectionis dormierunt, omniumque in tua miseratione defunctorum, et eos in lumen vultus tui admitte. Omnium nostrum, quaesumus, miserere, ut cum beata Dei Genetrice Virgine Maria, beatis Apostolis et omnibus Sanctis, qui tibi a saeculo placuerunt, aeternae vitae mereamur esse consortes, et te laudemus et glorificemus per Filium tuum Iesum Christum.',
            '',
            'Per ipsum, et cum ipso, et in ipso, est tibi Deo Patri omnipotenti, in unitate Spiritus Sancti, omnis honor et gloria per omnia saecula saeculorum.',
            '',
            '<strong>Amen.</strong>'
        ]
    },
    {
        id: 'oe3',
        short: 'OE III',
        title: 'Oração Eucarística III',
        pt: [
            '<span class="rubrica">CP</span> Na verdade, vós sois Santo, ó Deus do universo, e tudo o que criastes proclama o vosso louvor, porque, por Jesus Cristo, vosso Filho e Senhor nosso, e pela força do Espírito Santo, dais vida e santidade a todas as coisas e não cessais de reunir para vós um povo que vos ofereça em toda parte, do nascer ao pôr do sol, um sacrifício perfeito.',
            '',
            '<span class="rubrica">CC</span> Por isso, ó Pai, nós vos suplicamos: santificai pelo Espírito Santo as oferendas que vos apresentamos para serem consagradas a fim de que se tornem o Corpo ✠ e o Sangue de vosso Filho, nosso Senhor Jesus Cristo, que nos mandou celebrar estes mistérios.',
            '',
            '<strong>R: Enviai o vosso Espírito Santo!</strong>',
            '',
            'Na noite em que ia ser entregue, Jesus tomou o pão, pronunciou a bênção de ação de graças, partiu e o deu a seus discípulos, dizendo:',
            '',
            '<strong>TOMAI, TODOS, E COMEI: ISTO É O MEU CORPO, QUE SERÁ ENTREGUE POR VÓS.</strong>',
            '',
            'Do mesmo modo, ao fim da Ceia, ele tomou o cálice em suas mãos, pronunciou a bênção de ação de graças, e o deu a seus discípulos, dizendo:',
            '',
            '<strong>TOMAI, TODOS, E BEBEI: ESTE É O CÁLICE DO MEU SANGUE, O SANGUE DA NOVA E ETERNA ALIANÇA, QUE SERÁ DERRAMADO POR VÓS E POR TODOS, PARA A REMISSÃO DOS PECADOS. FAZEI ISTO EM MEMÓRIA DE MIM.</strong>',
            '',
            'Mistério da fé!',
            '',
            '<strong>R: Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!</strong>',
            '',
            'Ou:',
            'Mistério da fé e do amor!',
            '<strong>R: Todas as vezes que comemos deste pão e bebemos deste cálice, anunciamos, Senhor, a vossa morte, enquanto esperamos a vossa vinda!</strong>',
            '',
            'Ou:',
            'Mistério da fé para a salvação do mundo!',
            '<strong>R: Salvador do mundo, salvai-nos, vós que nos libertastes pela cruz e ressurreição.</strong>',
            '',
            '<span class="rubrica">CC</span> Celebrando agora, ó Pai, o memorial da paixão redentora do vosso Filho, da sua gloriosa ressurreição e ascensão ao céu, e enquanto esperamos sua nova vinda, nós vos oferecemos em ação de graças este sacrifício vivo e santo.',
            '',
            '<strong>R: Aceitai, ó Senhor, a nossa oferta!</strong>',
            '',
            'Olhai com bondade a oblação da vossa Igreja e reconhecei nela o sacrifício que nos reconciliou convosco; concedei que, alimentando-nos com o Corpo e o Sangue do vosso Filho, repletos do Espírito Santo, nos tornemos em Cristo um só corpo e um só espírito.',
            '',
            '<strong>R: O Espírito nos una num só corpo!</strong>',
            '',
            '<span class="rubrica">1C</span> Que o mesmo Espírito faça de nós uma eterna oferenda para alcançarmos a herança com os vossos eleitos: a santíssima Virgem Maria, Mãe de Deus, São José, seu esposo, os vossos santos Apóstolos e gloriosos Mártires, N. (Santo do dia ou padroeiro) e todos os Santos, que não cessam de interceder por nós na vossa presença.',
            '',
            '<strong>R: Fazei de nós um perfeita oferenda!</strong>',
            '',
            '<span class="rubrica">2C</span> Nós vos suplicamos, Senhor, que este sacrifício da nossa reconciliação estenda a paz e a salvação ao mundo inteiro. Confirmai na fé e na caridade a vossa Igreja que caminha neste mundo com o vosso servo o Papa N., e o nosso Bispo N., com os bispos do mundo inteiro, os presbíteros e diáconos, os outros ministros e o povo por vós redimido. Atendei propício às preces desta família, que reunistes em vossa presença. Reconduzi a vós, Pai de misericórdia, todos os vossos filhos e filhas dispersos pelo mundo inteiro.',
            '',
            '<strong>R: Lembrai-vos, ó Pai, da vossa Igreja!</strong>',
            '',
            '<span class="rubrica">3C</span> Acolhei com bondade no vosso reino os nossos irmãos e irmãs que partiram desta vida e todos os que morreram na vossa amizade. Unidos a eles, esperamos também nós saciar-nos eternamente da vossa glória, por Cristo, Senhor nosso. Por ele dais ao mundo todo bem e toda graça',
            '',
            '<span class="rubrica">CP ou CC</span> Por Cristo, com Cristo, e em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda honra e toda glória, por todos os séculos dos séculos.',
            '',
            '<strong>R: Amém!</strong>'
        ],
        la: [
            'Vere Sanctus es, Domine, et merito te laudat omnis a te condita creatura, quia per Filium tuum, Dominum nostrum Iesum Christum, Spiritus Sancti operante virtute, vivificas et sanctificas universa, et populum tibi congregare non desinis, ut a solis ortu usque ad occasum oblatio munda offeratur nomini tuo.',
            '',
            'Supplices ergo te, Domine, deprecamur, ut haec munera, quae tibi sacranda detulimus, eodem Spiritu sanctificare digneris, ut Corpus et + Sanguis fiant Filii tui Domini nostri Iesu Christi, cuius mandato haec mysteria celebramus.',
            '',
            'Qui, pridie quam pateretur, accepit panem in sanctas ac venerabiles manus suas, et elevatis oculis in caelum ad te Deum Patrem suum omnipotentem, tibi gratias agens benedixit, fregit, deditque discipulis suis, dicens:',
            '',
            '<strong>ACCIPITE ET MANDUCATE EX HOC OMNES: HOC EST ENIM CORPUS MEUM, QUOD PRO VOBIS TRADETUR.</strong>',
            '',
            'Simili modo, postquam cenatum est, accipiens et hunc praeclarum calicem in sanctas ac venerabiles manus suas, item tibi grtias agens benedixit, deditque discipulis suis, dicens:',
            '',
            '<strong>ACCIPITE ET BIBITE EX EO OMNES: HIC ENIM CALIX SANGUINIS MEI NOVI ET AETERNI TESTAMENTI, QUI PRO VOBIS ET PRO MULTIS EFFUNDETOR IN REMISSIONEM PECCATORUM. HOC FACITE IN MEAM COMMEMORATIONEM.</strong>',
            '',
            'Mysterium fidei.',
            '',
            '<strong>Mortem tuam annuntiamus, Domine, et tuam resurrectionem confitemur, donec venias!</strong>',
            '',
            'Memores igitur, Domine, eiusdem Filii tui salutiferae passionis necnon mirabilis resurrectionis et ascensionis in caelum, sed et praestolantes alterum eius adventum, offerimus tibi, gratias referentes, hoc sacrificium vivum et sanctum.',
            '',
            'Respice, quaesumus, in oblationem Ecclesiae tuae et, agnoscens Hostiam, cuius voluisti immolatione placari, concede, ut qui Corpore et Sanguine Filii tui reficimur, Spiritu eius Sancto repleti, unum corpus et unus spiritus inveniamur in Christo.',
            '',
            'Ipse nos tibi perficiat munus aeternum, ut cum electis tuis hereditem consequi valeamus, in primis cum beatissima Virgine, Dei Genetrice, Maria, cum beatis Apostolis tuis et gloriosis Martyribus (cum Sancto N) et omnibus Sanctis, quorum intercessione perpetuo apud te confidumus adiuvari.',
            '',
            'Haec Hostia nostrae reconciliationis proficiant, quaesumus, Domine, ad totius mundi pacem atque salutem. Ecclesiam tuam, pergrinantem in terra, in fide et caritate firmare digneris cum famulo tuo Papa nostro (N) et Episcopo nostro (N), cum episcopali ordine et universo clero et omni populo acquisitionis tuae. Votis huius familiae, quam tibi astare voluisti, adesto propitius. Omnes filios tuos ubique dispersos tibi, clemens Pater, miseratus coniunge.',
            '',
            'Fratres nostros defunctos et omnes qui, tibi placentes, ex hoc saeculo transierunt, in regnum tuum benignus admitte, ubi fore speramus, ut simul gloria tua perenniter satiemur, per Christum dominum nostrum, per quem mundo bona cuncta largiris.',
            '',
            'Per ipsum, et cum ipso, et in ipso, est tibi Deo Patri omnipotenti, in unitate Spiritus Sancti, omnis honor et gloria per omnia saecula saeculorum.',
            '',
            '<strong>Amen.</strong>'
        ]
    },
    {
        id: 'oe4',
        short: 'OE IV',
        title: 'Oração Eucarística IV',
        pt: [
            '<span class="rubrica">CP</span> O Senhor esteja convosco.',
            '<strong>R: Ele está no meio de nós.</strong>',
            '<span class="rubrica">CP</span> Corações ao alto.',
            '<strong>R: O nosso coração está em Deus.</strong>',
            '<span class="rubrica">CP</span> Demos graças ao Senhor, nosso Deus.',
            '<strong>R: É nosso dever e nossa salvação.</strong>',
            '',
            '<span class="rubrica">CP</span> Na verdade, ó Pai, é nosso dever dar-vos graças, é nossa salvação dar-vos glória. Só vós sois o Deus vivo e verdadeiro que existis antes de todo o tempo e permaneceis para sempre, habitando em luz inacessível. Mas, porque sois o Deus de bondade e a fonte da vida, fizestes todas as coisas para cobrir de bênçãos as vossas criaturas e a muitos alegrar com a vossa luz. Eis, pois, diante de vós os inumeráveis coros dos Anjos que dia e noite vos servem e, contemplando a glória de vossa face, vos louvam sem cessar. Com eles também nós e, por nossa voz, tudo o que criastes celebramos o vosso Nome, e exultantes de alegria, cantamos (dizemos) a uma só voz:',
            '',
            '<strong>R: Santo, Santo, Santo, Senhor Deus do universo! O céu e a terra proclamam a vossa glória. Hosana nas alturas! Bendito o que vem em nome do Senhor! Hosana nas alturas!</strong>',
            '',
            '<span class="rubrica">CP</span> Nós proclamamos vossa grandeza, Pai santo, a sabedoria e o amor com que fizestes todas as coisas. Criastes o ser humano à vossa imagem e lhe confiastes todo o universo para que, servindo somente a vós, seu Criador, cuidasse de toda criatura. E quando pela desobediência perdeu a vossa amizade, não o abandonastes ao poder da morte. A todos, porém, socorrestes com misericórdia, para que, ao procurar-vos, vos encontrassem. Muitas vezes oferecestes aliança à família humana e a instruístes pelos profetas na esperança da salvação.',
            '',
            '<strong>R: A todos socorrestes com bondade!</strong>',
            '',
            '<span class="rubrica">PR</span> E de tal modo, Pai santo, amastes o mundo que, chegada a plenitude dos tempos, nos enviastes vosso próprio Filho para ser o nosso Salvador. Encarnado pelo poder do Espírito Santo e nascido da Virgem Maria, Jesus viveu em tudo a condição humana, menos o pecado; anunciou aos pobres a salvação, aos oprimidos, a liberdade, aos tristes, a alegria. Para cumprir o vosso plano de amor, entregou-se à morte e, ressuscitando, destruiu a morte e renovou a vida.',
            '',
            '<strong>R: Por amor nos enviastes vosso Filho!</strong>',
            '',
            'E, a fim de não mais vivermos para nós, mas para ele, que por nós morreu e ressuscitou, enviou de vós, ó Pai, como primeiro dom aos vossos fiéis, o Espírito Santo, que continua sua obra no mundo para levar à plenitude toda a santificação.',
            '',
            '<span class="rubrica">CC</span> Por isso, nós vos pedimos, ó Pai, que o mesmo Espírito Santo santifique estas oferendas, a fim de que se tornem o Corpo ✠ e o Sangue de Jesus Cristo, vosso Filho e Senhor nosso, para celebrarmos este grande mistério que ele nos deixou em sinal da eterna aliança.',
            '',
            '<strong>R: Enviai o vosso Espírito Santo!</strong>',
            '',
            'Quando, pois, chegou a hora em que por vós, ó Pai, ia ser glorificado, tendo amado os seus que estavam no mundo, amou-os até o fim. Enquanto ceavam, Jesus tomou o pão, pronunciou a bênção de ação de graças, partiu e o deu a seus discípulos, dizendo:',
            '',
            '<strong>TOMAI, TODOS, E COMEI: ISTO É O MEU CORPO, QUE SERÁ ENTREGUE POR VÓS.</strong>',
            '',
            'Do mesmo modo, ele tomou em suas mãos o cálice com o vinho , deu-vos graças novamente e o deu a seus discípulos, dizendo:',
            '',
            '<strong>TOMAI, TODOS, E BEBEI: ESTE É O CÁLICE DO MEU SANGUE, O SANGUE DA NOVA E ETERNA ALIANÇA, QUE SERÁ DERRAMADO POR VÓS E POR TODOS, PRA REMISSÃO DOS PECADOS. FAZEI ISTO EM MEMÓRIA DE MIM.</strong>',
            '',
            'Mistério da fé!',
            '',
            '<strong>R: Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde, Senhor Jesus!</strong>',
            '',
            'Ou:',
            'Mistério da fé e do amor!',
            '<strong>R: Todas as vezes que comemos deste pão e bebemos deste cálice, anunciamos, Senhor, a vossa morte, enquanto esperamos a vossa vinda!</strong>',
            '',
            'Ou:',
            'Mistério da fé para a salvação do mundo!',
            '<strong>R: Salvador do mundo, salvai-nos, vós que nos libertastes pela cruz e ressurreição.</strong>',
            '',
            '<span class="rubrica">CC</span> Celebrando, agora, ó Pai, o memorial da nossa redenção, anunciamos a morte de Cristo e sua descida entre os mortos, proclamamos a sua ressurreição e ascensão à vossa direita e, esperando a sua vinda gloriosa, nós vos oferecemos o seu Corpo e Sangue, sacrifício do vosso agrado e salvação do mundo inteiro.',
            '',
            '<strong>R: Aceitai, ó Senhor, a nossa oferta!</strong>',
            '',
            'Olhai, com bondade, a oblação que destes à vossa Igreja e concedei aos que vamos participar do mesmo pão e do mesmo cálice que, reunidos pelo Espírito Santo num só corpo, nos tornemos em Cristo uma oferenda viva para o louvor da vossa glória.',
            '',
            '<strong>R: O Espírito nos una num só corpo!</strong>',
            '',
            '<span class="rubrica">1C</span> E agora, ó Pai, lembrai-vos de todos pelos quais vos oferecemos este sacrifício: o vosso servo o Papa N., o nosso Bispo N., os bispos do mundo inteiro, os presbíteros, os diáconos, e todos os ministros da vossa Igreja, os fiéis que, ao redor deste altar, se unem à nossa oferta, o povo que vos pertence e todos aqueles que vos procuram de coração sincero.',
            '',
            '<strong>R: Lembrai-vos, ó Pai, da vossa Igreja!</strong>',
            '',
            '<span class="rubrica">2C</span> Lembrai-vos também dos que morreram na paz do vosso Cristo e de todos os defuntos dos quais só vós conhecestes a fé.',
            '',
            '<strong>R: Concedei-lhes, ó Senhor, a luz eterna!</strong>',
            '',
            '<span class="rubrica">3C</span> E a todos nós, vossos Filhos e Filhas, concedei, ó Pai de bondade, alcançar a herança eterna, com a Virgem Maria, Mãe de Deus, São José, seu esposo, os Apóstolos e todos os Santos, no vosso reino, onde, com todas as criaturas, libertas da corrupção do pecado e da morte, vos glorificaremos por Cristo, Senhor nosso, por quem dais ao mundo todo bem e toda graça.',
            '',
            '<span class="rubrica">CP ou CC</span> Por Cristo, com Cristo, e em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, por todos os séculos dos séculos.',
            '',
            '<strong>R: Amém!</strong>'
        ],
        la: [
            'Confitemur tibi, Pater sancte, quia magnus es et omnia opera tua in sapientia et caritate fecisti. Hominem ad tuam imaginem condidisti, eique commisisti mundi curam universi, ut, tibi soli Creatori serviens, creaturis omnibus imperaret. Et cum amicitiam tuam, non oboediens, amisisset, non eum dereliquisti in mortis imperio. Omnibus enim misericorditer subvenisti, ut te quaerentes invenirent. Sed et foedera pluries homnibus obtulisti eosque per prophetas erudisti in exspectatione salutis. Et sic, Pater sancte, mundum dilexisti, ut, completa plenitudine temporum, Unigenitum tuum nobis mitteres Salvatorem.',
            '',
            'Qui, incarnatus de Spiritu Sancto et natus ex Maria Virgine, in nostra condicionis forma est conversatus per omnia absque peccato: salutem evangelizavit pauperibus, redemptionem captivis, maestis corde laetitiam. Ut tuam vero dispensationem impleret, in mortem tradidit semetipsum ac, resurgens a mortuis, mortem destruxit vitamque renovavit. Et, ut non amplius nobismetipsis viveremus, sed sibi qui pro nobis mortuus est atque surrexit, a te, Pater, misit Spiritum Sanctum primitias credentibus, qui, opus suum in mundo perficiens, omnem sanctificationem compleret.',
            '',
            'Quaesumus igitur, Domine, ut idem Spiritus Sanctus haec munera sanctificare dignetur, ut Corpus et + Sanguis fiant Domini nostri Iesu Christi ad hoc magnum mysterium celebrandum, quod ipse nobis reliquit in foedus aeternum.',
            '',
            'Ipse enim, cum hora venisset ut glorificaretur a te, Pater sancte, ac dilexisset suos qui erant in mundo, in finem dilexit eos: et cenantibus illis accepit panem, benedixit ac fregit, deditque discipulis suis, dicens:',
            '',
            '<strong>ACCIPITE ET MANDUCATE EX HOC OMNES: HOC EST ENIM CORPUS MEUM, QUOD PRO VOBIS TRADETUR.</strong>',
            '',
            'Simili modo, accipiens calicem, ex genimine vitis repletum, gratias egit, deditque discipulis suis, dicens:',
            '',
            '<strong>ACCIPITE ET BIBITE EX EO OMNES: HIC ENIM CALIX SANGUINIS MEI NOVI ET AETERNI TESTAMENTI, QUI PRO VOBIS ET PRO MULTIS EFFUNDETOR IN REMISSIONEM PECCATORUM. HOC FACITE IN MEAM COMMEMORATIONEM.</strong>',
            '',
            'Mysterium fidei.',
            '',
            '<strong>Mortem tuam annuntiamus, Domine, et tuam resurrectionem confitemur, donec venias!</strong>',
            '',
            'Unde et nos, Domine, redemtionis nostrae memoriale nunc celebrantes, mortem Christi eiusque descensum ad inferos recolimus, eius resurrectionem et ascensionem ad tuam dexteram profitemur, et, exspectantes ipsius adventum in gloria, offerimus tibi eius Corpus et Sanguinem, sacrificium tibi acceptabile et toti mundo salutare.',
            '',
            'Respice, Domine, in Hostiam, quam Ecclesiae tuae ipse parasti, et concede benignus omnibus qui ex hoc uno pane participabunt et calice, ut, in unum corpus a Sancto Spiritu congregati, in Christo hostia viva perficiantur, ad laudem gloriae tuae.',
            '',
            'Nunc ergo, Domine, omnium recordare, pro quibus tibi hanc oblationem offerimus: in primis famuli tui, Papae nostri (N), Episcopi nostri (N), et Episcoporum ordinis universi, sed et totius cleri, et offerentium, et circumstantium, et cuncti populi tui, et omnium, qui te quaerunt corde sincero. Memento etiam illorum, qui obierunt in pace Christi tui, et omnium defenctorum, quorum fidem to solus cognovisti. Nobis omnibus, filiis tuis, clemens Pater, concede, ut caelestem hereditatem consequi valeamus cum beata Virgine, Dei Genetrice, Maria, cum Apostolis et Sanctis tuis in regno tuo, ubi cum universa creatura, a corruptione peccati mortis liberata, te glorificemus per Christum Dominum nostrum, per quem mundo bona cuncta largiris.',
            '',
            'Per ipsum, et cum ipso, et in ipso, est tibi Deo Patri omnipotenti, in unitate Spiritus Sancti, omnis honor et gloria per omnia saecula saeculorum.',
            '',
            '<strong>Amen.</strong>'
        ]
    }
];

function buildMainNav(activeSection = 'missa') {
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
        <!-- Toggle gerenciado por BASE_SCRIPTS -->
    `;
}

// Rota principal de missa
router.get('/', async (req, res) => {
    const nav = buildMainNav('missa');
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
        bannerHTML = '';
    }
    const allSections = RITOS_INICIAIS;
    const sectionsPayload = JSON.stringify(allSections).replace(/</g, '\\u003c');

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>Ritos Iniciais</title>
            <style>
                ${BASE_STYLES}
                body {
                    background: var(--bg-color);
                    min-height: 100vh;
                    padding-bottom: 60px;
                }
                .liturgia-info-banner { background: linear-gradient(135deg, rgba(139,69,19,0.08), rgba(205,133,63,0.06)); border-bottom:1px solid rgba(139,69,19,0.12); padding:12px 0; }
                .liturgia-info-container { max-width: 1200px; margin: 0 auto; display:flex; justify-content:center; gap:30px; padding:0 20px; }
                .liturgia-info-item { display:flex; flex-direction:column; align-items:center; text-align:center; }
                .liturgia-info-label { font-size:12px; color:var(--secondary-color); text-transform:uppercase; margin-bottom:4px; }
                .liturgia-info-value { font-size:16px; color:var(--primary-color); font-weight:600; }
                .missa-wrapper {
                    max-width: 900px;
                    margin: 30px auto 0;
                    padding: 0 16px 48px;
                }
                .missa-card {
                    background: rgba(255, 255, 255, 0.96);
                    border-radius: 18px;
                    padding: 32px;
                    border: 1px solid rgba(228, 216, 198, 0.9);
                    box-shadow: 0 20px 45px rgba(44, 31, 19, 0.08);
                }
                .missa-tabs {
                    display: inline-flex;
                    gap: 10px;
                    padding: 6px;
                    border-radius: 999px;
                    background: #f7efe0;
                    margin-bottom: 24px;
                }
                .missa-tab {
                    border: none;
                    background: transparent;
                    padding: 10px 22px;
                    border-radius: 999px;
                    font-weight: 600;
                    color: var(--muted-color);
                    cursor: pointer;
                    transition: 0.2s;
                }
                .missa-tab.active {
                    background: #fff;
                    color: var(--accent-color);
                    box-shadow: 0 6px 18px rgba(140, 92, 44, 0.15);
                }
                .missa-column {
                    background: rgba(255, 255, 255, 0.98);
                    border-radius: 16px;
                    padding: 0;
                }
                .missa-column .column-title {
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 16px;
                    color: var(--accent-color);
                }
                .oracao-eucaristica {
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(228, 216, 198, 0.7);
                }
                .oracao-buttons {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin: 16px 0 20px;
                }
                .oracao-buttons .oracao-btn {
                    border: 1px solid var(--border-color);
                    background: #fff;
                    border-radius: 999px;
                    padding: 8px 16px;
                    font-weight: 600;
                    color: var(--muted-color);
                    cursor: pointer;
                    transition: 0.2s;
                }
                .oracao-buttons .oracao-btn.active {
                    border-color: var(--accent-color);
                    background: var(--accent-light);
                    color: var(--accent-color);
                    box-shadow: 0 6px 12px rgba(140, 92, 44, 0.15);
                }
                .oracao-content p {
                    margin-bottom: 0.9em;
                }
                .missa-section {
                    margin-bottom: 26px;
                }
                .missa-section h4 {
                    font-size: 0.95rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--accent-color);
                    margin-bottom: 8px;
                }
                .missa-section p {
                    margin: 0 0 0.8em;
                    line-height: 1.6;
                }
                .rubrica {
                    color: #9f1d1d !important;
                    font-style: italic;
                    display: inline-block;
                }
                .missa-tabs + #missa-content {
                    margin-top: 8px;
                }
                @media (max-width: 640px) {
                    .missa-card {
                        padding: 24px;
                        border-radius: 14px;
                    }
                    .missa-tabs {
                        flex-direction: column;
                        width: 100%;
                        border-radius: 16px;
                    }
                    .missa-tab {
                        width: 100%;
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
            <div class="missa-wrapper">
                <div class="missa-card">
                    <div class="missa-tabs">
                        <button class="missa-tab active" data-lang="pt">Português</button>
                        <button class="missa-tab" data-lang="la">Latim</button>
                    </div>
                    <div id="missa-content">
                        <p>Carregando Ritos Iniciais...</p>
                    </div>
                </div>
            </div>
            <script>
                const RITOS_DATA = ${sectionsPayload};
                const EUCARISTIC_PRAYERS = ${JSON.stringify(ORACOES_EUCARISTICAS).replace(/</g, '\\u003c')};
                const ORDINARIO_COM = ${JSON.stringify(ORDINARIO_COMUNHAO).replace(/</g, '\\u003c')};
                const contentEl = document.getElementById('missa-content');
                const tabs = document.querySelectorAll('.missa-tab');
                let currentLanguage = 'pt';
                let currentPrayer = EUCARISTIC_PRAYERS[0] ? EUCARISTIC_PRAYERS[0].id : null;

                function renderSections(mode = 'pt') {
                    currentLanguage = mode;
                    const isLatim = mode === 'la';
                    const htmlSections = RITOS_DATA.map(section => {
                        const textos = isLatim && section.la && section.la.length
                            ? section.la
                            : section.pt || [];
                        const paragraphs = textos.map(p => '<p>' + p + '</p>').join('');
                        return '<section class="missa-section"><h4>' + section.title + '</h4>' + paragraphs + '</section>';
                    }).join('');
                    const titulo = isLatim ? 'Latim' : 'Português';
                    contentEl.innerHTML = \`
                        <div class="missa-column column-\${mode}">
                            <div class="column-title">\${titulo}</div>
                            \${htmlSections}
                            \${renderPrayerBlock(mode)}
                            \${renderOrdinariumBlock(mode)}
                        </div>
                    \`;
                    attachPrayerHandlers();
                }

                function renderPrayerBlock(lang) {
                    if (!EUCARISTIC_PRAYERS.length) return '';
                    const buttons = EUCARISTIC_PRAYERS.map(prayer => {
                        const activeClass = prayer.id === currentPrayer ? 'active' : '';
                        return '<button class="oracao-btn ' + activeClass + '" data-id="' + prayer.id + '">' + prayer.short + '</button>';
                    }).join('');
                    const content = renderPrayerContent(lang);
                    return '<div class="oracao-eucaristica">'
                        + '<div class="oracao-header">'
                        + '<h3>Orações Eucarísticas</h3>'
                        + '<p class="rubrica">Escolha uma das quatro Orações Eucarísticas para exibir o texto correspondente.</p>'
                        + '</div>'
                        + '<div class="oracao-buttons">' + buttons + '</div>'
                        + '<div class="oracao-content">' + content + '</div>'
                        + '</div>';
                }

                function renderPrayerContent(lang) {
                    const prayer = EUCARISTIC_PRAYERS.find(item => item.id === currentPrayer);
                    if (!prayer) return '<p>Conteúdo em breve.</p>';
                    const textos = lang === 'la' && prayer.la && prayer.la.length ? prayer.la : prayer.pt || [];
                    if (!textos.length) return '<p>Conteúdo em breve.</p>';
                    return textos.map(p => '<p>' + p + '</p>').join('');
                }

                function renderOrdinariumBlock(lang) {
                    if (!ORDINARIO_COM.length) return '';
                    const isLatim = lang === 'la';
                    const sections = ORDINARIO_COM.map(section => {
                        const textos = isLatim && section.la && section.la.length ? section.la : section.pt || [];
                        const paragraphs = textos.map(p => '<p>' + p + '</p>').join('');
                        return '<section class="missa-section"><h4>' + section.title + '</h4>' + paragraphs + '</section>';
                    }).join('');
                    return '<div class="oracao-eucaristica" style="margin-top: 40px;">'
                        + '<h3>Rito da Comunhão</h3>'
                        + sections
                        + '</div>';
                }

                function attachPrayerHandlers() {
                    const buttons = document.querySelectorAll('.oracao-btn');
                    buttons.forEach(btn => {
                        btn.addEventListener('click', () => {
                            currentPrayer = btn.dataset.id;
                            renderSections(currentLanguage);
                        });
                    });
                }

                tabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        tabs.forEach(btn => btn.classList.remove('active'));
                        tab.classList.add('active');
                        renderSections(tab.dataset.lang);
                    });
                });

                renderSections('pt');
            </script>
        </body>
        </html>
    `);
});

module.exports = router;
