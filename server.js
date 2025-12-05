const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const HORA_OPTIONS = [
    { tipo: 'laudes', label: 'Laudes', periodo: 'Manha' },
    { tipo: 'vesperas', label: 'Vesperas', periodo: 'Tarde' },
    { tipo: 'completas', label: 'Completas', periodo: 'Noite' }
];

const NAV_SECTIONS = [
    { id: 'liturgia', label: 'Liturgia das Horas', href: '/?tipo=laudes' },
    { id: 'leituras', label: 'Leituras', href: '/leituras' },
    { id: 'missa', label: 'Missa', href: '/missa' }
];

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
            'Munda cor meum ac lábia mea, omnípotens Deus, qui labia Isaíæ prophétæ cálculo mundasti igne: ita me tua grata miseratione dignare purificáre, ut sanctum Evangelium tuum digne váleam nuntiáre.',
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
            '<span class="rubrica">De seguida o sacerdote lava as mãos, diz em silêncio:</span>',
            'Lavai-me, Senhor, de minhas faltas e purificai-me de meus pecados.',
            '<span class="rubrica">Levantando-se de pé, o sacerdote diz:</span>',
            'Orai, irmãos e irmãs, para que o nosso sacrifício seja aceito por Deus, Pai todo-poderoso.'
        ],
        la: [
            '<span class="rubrica">O povo senta-se e nesta altura tem início o Cântico do Ofertório, se for oportuno...</span>',
            'Benedíctus es, Dómine, Deus universi, quia de tua largitáte accépimus panem...',
            '<span class="rubrica">O sacerdote verte um pouco de água no cálice, dizendo em voz baixa:</span>',
            'Per huius aquae et vini mystérium...',
            '<span class="rubrica">Depois, o sacerdote toma o cálice e, mantendo-o um pouco elevado sobre o altar:</span>',
            'Benedíctus es, Dómine, Deus universi, quia de tua largitáte accépimus vinum...',
            '<span class="rubrica">Depois, o sacerdote, profundamente inclinado diante do altar, diz em silêncio:</span>',
            'In spíritu humilitátis et in ánimo contríto...',
            '<span class="rubrica">De seguida o sacerdote lava as mãos, diz em silêncio:</span>',
            'Lava me, Dómine, ab iniquitáte mea...',
            '<span class="rubrica">Levantando-se de pé, o sacerdote diz:</span>',
            'Oráte, fratres, ut meum ac vestrum sacrifícium acceptábile fiat apud Deum Patrem omnipoténtem.'
        ]
    },
    {
        title: 'Oração sobre as Oferendas',
        pt: [
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>'
        ],
        la: [
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>'
        ]
    },
    {
        title: 'Prefácio',
        pt: [
            '<span class="rubrica">O Prefácio constitui a primeira parte da Oração Eucarística e inicia-se com um diálogo solene: o sacerdote convida o povo a levantar o coração para o Senhor em louvor e ação de graças, e associa-os à oração que ele, em nome de toda a comunidade, dirige ao Pai por meio de Jesus Cristo.</span>',
            'O Senhor esteja convosco.<br><strong>℟. Ele está no meio de nós.</strong>',
            'Corações ao alto.<br><strong>℟. O nosso coração está em Deus.</strong>',
            'Demos graças ao Senhor, nosso Deus.<br><strong>℟. É nosso dever e nossa salvação.</strong>',
            '<span class="rubrica">O sacerdote continua o Prefácio, pelo qual, em nome de todos os homens e de toda a Igreja, glorifica a Deus Pai e Lhe dá graças pela obra da salvação ou por algum aspecto particular desta, segundo a diversidade do dia, do tempo litúrgico ou da festa.</span>',
            '<span class="rubrica">Se não se utilizarem os Prefácios próprios das Orações Eucarísticas II e IV, consultar o Prefácio do dia na folha de antífonas e orações diárias.</span>'
        ],
        la: [
            '<span class="rubrica">O Prefácio constitui a primeira parte da Oração Eucarística e inicia-se com um diálogo solene...</span>',
            'Dóminus vobíscum.<br><strong>℟. Et cum spíritu tuo.</strong>',
            'Sursum corda.<br><strong>℟. Habémus ad Dóminum.</strong>',
            'Grátias agámus Dómino Deo nostro.<br><strong>℟. Dignum et iustum est.</strong>',
            '<span class="rubrica">O sacerdote continua o Prefácio conforme a liturgia do dia.</span>'
        ]
    },
    {
        title: 'Santo',
        pt: [
            '<span class="rubrica">No fim do Prefácio, juntamente com o povo, o sacerdote conclui, cantando ou dizendo em voz clara:</span>',
            'Santo, Santo, Santo, Senhor Deus do universo. O céu e a terra proclamam a vossa glória. Hosana nas alturas. Bendito o que vem em nome do Senhor. Hosana nas alturas.'
        ],
        la: [
            '<span class="rubrica">No fim do Prefácio, juntamente com o povo, o sacerdote conclui, cantando ou dizendo em voz clara:</span>',
            'Sanctus, Sanctus, Sanctus Dóminus Deus Sábaoth. Pleni sunt caeli et terra glória tua. Hosánna in excélsis. Bendíctus qui venit in nómine Dómini. Hosánna in excélsis.'
        ]
    }
];

const ORACOES_EUCARISTICAS = [
    {
        id: 'oe1',
        short: 'OE I',
        title: 'Oração Eucarística I (Cânon Romano)',
        pt: [
            '<span class="rubrica">Oração Eucarística I ou Cânon Romano</span>',
            'Pai de misericórdia, a quem sobem nossos louvores; nós vos pedimos, por Jesus Cristo, vosso Filho e Senhor nosso, que aceiteis e estas oferendas apresentadas ao vosso altar. Nós as oferecemos pela vossa Igreja, santa e católica: concedei-lhe paz e proteção, unindo-a num só corpo e governando-a por toda a terra.',
            'Nós as oferecemos também pelo vosso servo o Papa N., por nosso Bispo N., e por todos os que guardam a fé que receberam dos Apóstolos.',
            'Lembrai-Vos, ó Pai, dos vossos filhos e filhas N. e N. e de todos os que circundam este altar dos quais conheceis a fidelidade e a dedicação em vos servir. Eles vos oferecem conosco este sacrifício de louvor por si e por todos os seus, e elevam a vós as suas preces para alcançar o perdão de suas faltas, a segurança em suas vidas e a salvação que esperam.',
            '<span class="rubrica">Em comunhão com toda a Igreja, veneramos a memória da gloriosa sempre Virgem Maria e seu esposo São José †, e também São José, esposo de Maria, os santos Apóstolos e Mártires: Pedro e Paulo, André, Tiago e João, Tomé, Tiago e Filipe, Bartolomeu e Mateus, Simão e Tadeu, Lino, Cleto, Clemente, Sisto, Cornélio e Cipriano, Lourenço e Crisógono, João e Paulo, Cosme e Damião, e todos os vossos Santos. Por seus méritos e preces concedei-nos sem cessar a vossa proteção.</span>',
            '<span class="rubrica">* (Por Cristo, Senhor nosso. Amém.)</span>',
            'Recebei, ó Pai, com bondade a oferenda dos vossos servos e de toda a vossa família; dai-nos sempre a vossa paz, livrai-nos da condenação e acolhei-nos entre os vossos eleitos.',
            '<span class="rubrica">Nas fórmulas que se seguem, as palavras do Senhor devem pronunciar-se clara e distintamente, como o requer a sua natureza.</span>',
            'Dignai-vos, ó Pai, aceitar e santificar estas oferendas, a fim de que se tornem para nós o Corpo e o Sangue de Jesus Cristo, vosso Filho e Senhor nosso.',
            'Na noite em que ia ser entregue, Ele tomou o pão em suas mãos, elevou os olhos a Vós, ó Pai, deu graças e o partiu e deu a seus discípulos, dizendo:',
            'Tomai todos e comei; isto é o meu corpo, que será entregue por vós.',
            'Do mesmo modo, ao fim da Ceia, ele tomou o cálice em suas mãos, deu graças novamente e o entregou a seus discípulos, dizendo:',
            'Tomai todos e bebei: este é o cálice do meu sangue, o sangue da nova e eterna aliança, que será derramado por vós e por todos para remissão dos pecados. Fazei isto em memória de mim.',
            'Eis o Mistério da fé.<br><strong>℟. Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição. Vinde Senhor Jesus.</strong>',
            'Celebrando, pois, a memória da paixão do vosso Filho, da sua ressurreição dentre os mortos e gloriosa ascensão aos céus, nós, vossos servos e também vosso povo santo, vos oferecemos dos bens que nos destes, o sacrifício perfeito e santo, pão da vida eterna e cálice da salvação.',
            'Recebei, ó Pai, esta oferenda, como recebestes a oferta de Abel, o sacrifício de Abraão e os dons de Melquisedec.',
            'Nós vos suplicamos, ó Deus, que esta seja levada à vossa presença, para que ao participarmos deste altar, recebendo o Corpo e o Sangue de Cristo, sejamos repletos de toda graça e bênção do céu.'
            ,
            'Lembrai-Vos, ó Pai, dos vossos filhos e filhas N. e N. que nos precederam com o sinal da fé e dormem no sono da paz. A eles, e a todos os que adormeceram em Cristo, concedei a felicidade, a luz e a paz.<br><span class="rubrica">(Por Cristo, Senhor nosso. Amém.)</span>',
            'E a todos nós pecadores, que confiamos na vossa imensa misericórdia, concedei, não por nossos méritos, mas por vossa bondade, o convívio dos Apóstolos e Mártires: João Batista e Estevão, Matias e Barnabé, Inácio, Alexandre, Marcelino, Pedro, Felicidade e Perpétua, Águeda, Luzia, Inês, Cecília, Anastácia, e todos os vossos santos.',
            'Por Cristo, Senhor nosso. Por Ele não cessais de criar e santificar estes bens e distribuí-los entre nós.'
        ],
        la: [
            'Te ígitur, clementíssime Pater, per Jesum Christum, Fílium tuum, Dóminum nostrum, súpplices rogámus ac pétimus, uti accépta hábeas et benedícas hæc + dona, hæc + múnera, hæc sancta + sacrifícia illibáta, in primis, quæ tibi offérimus pro Ecclésia tua sancta cathólica: quam pacificáre, custodíre, adunáre et régere dignéris toto orbe terrárum: una cum fámulo tuo Papa nostro N. et Antístite nostro N. et ómnibus orthodóxis atque cathólicæ et apostólicæ fídei cultóribus.',
            'Meménto, Dómine, famulórum famularúmque tuárum N. et N.',
            'Communicántes, et memóriam venerántes, in primis gloriósæ semper Vírginis Maríæ, Genitrícis Dei et Dómini nostri Jesu Christi, sed et beáti Ioseph, eiusdem Virginis Sponsi, et beatórum Apostolórum ac Mártyrum tuórum: Petri et Pauli, Andréæ, Jacóbi, Ioánnis, Thomæ, Jacóbi, Philíppi, Bartholomǽi, Matthǽi, Simónis et Thaddǽi: Lini, Cleti, Cleméntis, Xysti, Cornélii, Cypriáni, Laurentii, Chrysógoni, Ioánnis et Pauli, Cosmæ et Damiáni, et ómnium Sanctórum tuórum; quorum méritis precibúsque concédas, ut in ómnibus protectiónis tuæ muniámur auxílio.',
            '<span class="rubrica">* (Per Christum Dóminum nostrum. Amen.)</span>',
            'Hanc ígitur oblationem servitútis nostræ, sed et cunctæ famíliæ tuæ, quæsumus, Dómine, ut placátus accípias; diesque nostros in tua pace dispónas, atque ab ætérna damnatióne nos éripias et in electórum tuórum júbeas grege numerári.',
            'Quam oblatiónem tu, Deus, in ómnibus, quæsumus, benedíctam, adscríptam, ratam, rationábilem, acceptabilémque fácere dignéris: ut nobis Corpus et Sanguis fiat dilectíssimi Fílii tui, Dómini nostri Jesu Christi.',
            'Qui, prídie quam paterétur, accépit panem in sanctas ac venerábiles manus suas, et elevátis óculis in caelum ad te Deum Patrem suum omnipoténtem, tibi grátias agens benedíxit, fregit, dedíque discípulis suis, dicens:',
            'ACCÍPITE ET MANDUCÁTE EX HOC OMNES: HOC EST ENIM CORPUS MEUM, QUOD PRO VOBIS TRADÉTUR.',
            'Simíli modo, postquam cenátum est, accípiens et hunc præclárum cálicem in sanctas ac venerábiles manus suas, item tibi grátias agens benedíxit, dedíque discípulis suis, dicens:',
            'ACCÍPITE ET BÍBITE EX EO OMNES: HIC EST ENIM CALIX SÁNGUINIS MEI NOVI ET ÆTÉRNI TESTAMÉNTI, QUI PRO VOBIS ET PRO MULTIS EFFUNDÉTUR IN REMISSIÓNEM PECCATÓRUM. HOC FÁCITE IN MEAM COMMEMORATIONEM.',
            '<span class="rubrica">Mysterium fidei.</span>',
            '℟. Mortem tuam annuntiámus, Dómine, et tuam resurrectiónem confitémur, donec vénias.',
            'Unde et mémores, Dómine, nos servi tui, sed et plebs tua sancta, eiusdem Christi Fílii tui, Dómini nostri, tam beátæ passiónis, necnon et ab ínferis resurrectiónis, sed et in caelos gloriósæ ascensiónis: offérimus præcláræ maiestáti tuæ de tuis donis ac datis, hóstiam + puram, hóstiam + sanctam, hóstiam + immaculátam, Panem + sanctum vitæ ætérnæ et Cálicem + salútis perpétuæ.',
            'Supra quæ propítio ac seréno vultu respícere dignéris: et accépta habére, sicúti accépta habére dignátus es múnera púeri tui iusti Abel, et sacrifícium Patriárchæ nostri Abrahæ, et quod tibi óbtulit summus sacérdos tuus Melchísedech, sanctum sacrifícium, immaculátam hóstiam.',
            'Súpplices te rogámus, omnipotens Deus: iube hæc perférri per manus sancti Angeli tui in sublíme altáre tuum, in conspéctu divínæ maiestátis tuæ; ut, quotquot ex hac altáris participatióne sacrosánctum Fílii tui Corpus et Sánguinem sumpsérimus, omni benedictióne caelésti et grátia repleámur.'
            ,
            'Meménto étiam, Dómine, famulórum famularúmque tuárum N. et N., qui nos præcessérunt cum signo fídei et dórmiunt in somno pacis.',
            'Ipsis, Dómine, et ómnibus in Christo quiescéntibus, locum refrigérii, lucis et pacis, ut indúlgeas, deprecámur.<br><span class="rubrica">(Per Christum Dóminum nostrum. Amen.)</span>',
            'Nobis quoque peccatóribus fámulis tuis, de multitúdine miseratiónum tuárum sperántibus, partem áliquam et societátem donári dignéris cum tuis sanctis Apóstolis et Mártyribus: cum Ioánne, Stéphano, Matthía, Bárnaba, Ignátio, Alexándro, Marcelíno, Petro, Felicitáte, Perpétua, Ágata, Lucía, Agnéte, Cæcíla, Anastásia, et ómnibus Sanctis tuis; intra quorum nos consórtium, non æstimátor mériti, sed véniæ, quæsumus, larg,ito admítte.',
            'Per Christum Dóminum nostrum. Per quem hæc ómnia, Dómine, semper bona creas, sanctíficas, vivíficas, benedícis, et præstas nobis.'
        ]
    },
    {
        id: 'oe2',
        short: 'OE II',
        title: 'Oração Eucarística II',
        pt: [
            '<span class="rubrica">Esta Oração Eucarística tem um Prefácio próprio, que faz parte da sua estrutura. Podem, contudo, usar-se também outros Prefácios.</span>',
            'O Senhor esteja convosco.<br><strong>℟. Ele está no meio de nós.</strong>',
            'Corações ao alto.<br><strong>℟. O nosso coração está em Deus.</strong>',
            'Demos graças ao Senhor, nosso Deus.<br><strong>℟. É nosso dever e nossa salvação.</strong>',
            'Na verdade, é justo e necessário, é nosso dever e salvação, dar-Vos graças sempre e em todo lugar, Pai santo, Senhor do céu e da terra, por Cristo, Senhor Nosso. Ele é a vossa Palavra viva, por meio da qual tudo criastes. Ele é o nosso Salvador e Redentor verdadeiro homem, concebido do Espírito Santo e nascido da Virgem Maria.',
            'Ele, para cumprir a vossa Vontade e reunir um povo santo em vosso louvor, estendeu os braços na hora da sua paixão, a fim de vencer a morte e manifestar a ressurreição.',
            'Por isso, os Anjos celebram a vossa grandeza e os santos proclamam vossa glória, concedei-nos também a nós, associar-nos a seus Louvores, cantando (dizendo) a uma só voz:',
            'Santo, Santo, Santo, Senhor Deus do universo. O céu e a terra proclamam a vossa glória. Hosana nas alturas. Bendito o que vem em nome do Senhor. Hosana nas alturas.',
            '<span class="rubrica">Quando o Prefácio utilizado é outro, a Oração Eucarística II tem início aqui:</span>',
            'Na verdade, ó Pai, Vós sois Santo e fonte de toda santidade. Santificai, pois, estas oferendas, derramando sobre elas o vosso Espírito, a fim de que se tornem para nós o Corpo e o Sangue de Jesus Cristo, vosso Filho e Senhor nosso.',
            'Na noite em que ia ser entregue, Ele tomou o pão, deu graças e o partiu e o deu aos seus discípulos, dizendo: Tomai todos e comei: isto é o meu corpo, que será entregue por vós.',
            'Do mesmo modo, ao fim da Ceia, ele tomou o cálice em suas mãos, deu graças novamente e o entregou a seus discípulos, dizendo: Tomai todos e bebei: este é o cálice do meu sangue, que será derramado por vós e por todos para remissão dos pecados. Fazei isto em memória de mim.',
            'Eis o Mistério da fé.',
            'Celebrando, pois, a memória da morte e ressurreição do vosso Filho, nós vos oferecemos, ó Pai, o pão da vida e o cálice da salvação e vos agradecemos porque nos tornastes dignos de estar aqui na vossa presença e vos servir.',
            'E nós vos suplicamos que, participando do Corpo e Sangue de Cristo, sejamos reunidos pelo Espírito Santo num só corpo.'
        ],
        la: [
            '<span class="rubrica">Eadem oratio propria cum præfatione includitur.</span>',
            'Dóminus vobíscum.<br><strong>℟. Et cum spíritu tuo.</strong>',
            'Sursum corda.<br><strong>℟. Habémus ad Dóminum.</strong>',
            'Grátias agámus Dómino Deo nostro.<br><strong>℟. Dignum et iustum est.</strong>',
            'Vere dignum et iustum est, æquum et salutáre, nos tibi, sancte Pater, semper et ubíque grátias ágere per Fílium dilectiónis tuæ Jesum Christum, Verbum tuum per quod cuncta fecísti, quem misísti nobis Salvatórem et Redemptórem incarnátum de Spíritu Sancto et ex Vírgine natum.',
            'Qui voluntátem tuam adímplens et tibi populum sanctum acquisítum exténdit manus cum paterétur, ut mortem solveret et resurrectiónem manifestáret.',
            'Et ídeo cum Angelis et ómnibus Sanctis glóriam tuam prædicámus, una voce dicéntes: Sanctus, Sanctus, Sanctus Dóminus Deus Sábaoth...',
            '<span class="rubrica">Vere Sanctus es, Dómine, et merito te laudat omnis creatura.</span>',
            'Vere Sanctus es, Dómine, fons omnis sanctitátis: hæc ergo dona, quæsumus, rore Spíritus tui sanctífica, ut nobis Corpus et Sanguis fiant Dómini nostri Jesu Christi.',
            'Ipse enim, qua nocte tradebátur, accépit panem...',
            'Simíli modo, postquam cenátum est, accípiens et cálicem...',
            'Mysterium fidei.',
            'Memores igitur mortis et resurrectiónis Christi, panem vitæ et cálicem salutis offerimus.',
            'Respice, quaesumus, in oblatiónem Ecclésiæ tuæ et præsta ut, Corporis et Sánguinis Christi participes, uno in corpore Spíritu Sancto congregémur.'
        ]
    },
    {
        id: 'oe3',
        short: 'OE III',
        title: 'Oração Eucarística III',
        pt: [
            'Ó Pai, reconhecemos a vossa grandeza e proclamamos as vossas maravilhas em Cristo, vosso Filho.',
            'Concedei-nos olhar com amor as necessidades do próximo e servir-vos em santidade de vida, enquanto caminhamos rumo ao vosso Reino.'
        ],
        la: [
            'Vere Sanctus es, Dómine, et merito te laudat omnis creatura, quia per Fílium tuum Dóminum nostrum Jesum Christum Spíritus Sancti operante virtute vivíficas et sanctíficas univérsa.',
            'Præsta, ut hoc Corpus et Sanguis fiat Fílii tui Dómini nostri Jesu Christi, cuius mandáto hæc celebrámus mystéria.'
        ]
    },
    {
        id: 'oe4',
        short: 'OE IV',
        title: 'Oração Eucarística IV',
        pt: [
            'Pai Santo, reconhecemos o vosso amor e Vos agradecemos por terdes criado o mundo e nos conduzido à plenitude da vida em Cristo.',
            'Concedei-nos a força do Espírito para que, em todos os lugares, anunciemos a vossa salvação.'
        ],
        la: [
            'Confitémur tibi, Pater sancte, quia magnus es et universa opera tua manifestant sapientiam et amorem.',
            'Súscipe oblatiónem servi tui et totíus famíliæ tuæ, eámque placátus pérfice, ut in Christo donum nobis fíat salutis ætérnæ.'
        ]
    }
];

const PORTUGUESE_KEYWORDS = [
    'senhor', 'vos', 'vosso', 'nos', 'nosso', 'deus', 'oracao', 'comunhao',
    'antifona', 'entrada', 'oferendas', 'coleta', 'colecta', 'primeira leitura',
    'segunda leitura', 'evangelho', 'salmo', 'prefacio', 'rito', 'paz', 'terra',
    'homens', 'misericordia', 'todo poderoso', 'todos', 'povo', 'gloria',
    'pai nosso', 'liturgia', 'alma', 'santo', 'comunhao', 'oracao do dia'
];

function normalizarTextoDeteccao(texto = '') {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s\-]/g, ' ');
}

function ehParagrafoPortugues(texto) {
    const normalizado = normalizarTextoDeteccao(texto);
    return PORTUGUESE_KEYWORDS.some(keyword => normalizado.includes(keyword));
}

function carregarTextoOrdinario() {
    try {
        const arquivo = path.join(__dirname, 'ordinario.txt');
        const bruto = fs.readFileSync(arquivo, 'utf8');
        const paragrafos = bruto
            .split(/\r?\n/)
            .map(l => l.trim())
            .filter(l => l && !/^-- \d+ of \d+ --$/i.test(l));

        const latim = [];
        const portugues = [];

        paragrafos.forEach(paragrafo => {
            if (ehParagrafoPortugues(paragrafo)) {
                portugues.push(paragrafo);
            } else {
                latim.push(paragrafo);
            }
        });

        return {
            latim: latim.length ? latim : paragrafos,
            portugues: portugues.length ? portugues : paragrafos
        };
    } catch (error) {
        console.warn('Não foi possível carregar o arquivo ordinario.txt:', error.message);
        return { latim: [], portugues: [] };
    }
}

const BASE_STYLES = `
    :root {
        --bg-color: #f6efe6;
        --surface-color: #ffffff;
        --border-color: #e4d8c6;
        --text-color: #2c1f13;
        --muted-color: #6b5a4a;
        --accent-color: #8c5c2c;
        --accent-light: #f4e1c1;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
        background: var(--bg-color) !important;
        color: var(--text-color) !important;
        margin: 0;
        padding: 0 0 48px;
        line-height: 1.65 !important;
    }

    .main-nav {
        background: var(--surface-color);
        border-bottom: 1px solid var(--border-color);
        padding: 16px 0;
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .nav-container {
        max-width: 960px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .nav-brand {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
        text-decoration: none;
    }

    .nav-menu {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .nav-item {
        padding: 8px 14px;
        border-radius: 999px;
        text-decoration: none;
        color: var(--muted-color);
        font-size: 0.95rem;
        font-weight: 500;
        border: 1px solid transparent;
        transition: all 0.2s ease;
    }

    .nav-item:hover {
        border-color: var(--border-color);
        color: var(--text-color);
    }

    .nav-item.active {
        background: var(--accent-light);
        border-color: var(--accent-color);
        color: var(--accent-color);
    }

    .hours-selector {
        background: #fffaf3;
        border-bottom: 1px solid var(--border-color);
    }

    .selector-container {
        max-width: 960px;
        margin: 0 auto;
        padding: 14px 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .hour-chip {
        flex: 1;
        min-width: 180px;
        text-decoration: none;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 12px 16px;
        color: var(--text-color);
        background: var(--surface-color);
        display: flex;
        flex-direction: column;
        gap: 4px;
        transition: all 0.2s ease;
    }

    .hour-chip small {
        color: var(--muted-color);
        font-size: 0.8rem;
    }

    .hour-chip.active {
        border-color: var(--accent-color);
        background: var(--accent-light);
        box-shadow: 0 6px 16px rgba(140, 92, 44, 0.15);
    }

    .wp-site-blocks,
    main,
    article,
    .entry-content,
    .content,
    .inner-content,
    #content {
        width: min(900px, calc(100% - 32px)) !important;
        margin: 24px auto !important;
        padding: 32px !important;
        background: var(--surface-color) !important;
        border-radius: 18px !important;
        box-shadow: 0 20px 45px rgba(44, 31, 19, 0.05) !important;
        border: 1px solid rgba(228, 216, 198, 0.7) !important;
    }

    :is(.wp-site-blocks, main, article, .entry-content, .content, .inner-content, #content)
        :is(.wp-site-blocks, main, article, .entry-content, .content, .inner-content, #content) {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
    }

    h1, h2, h3 {
        color: var(--accent-color) !important;
        margin: 1.8rem 0 0.8rem !important;
        font-weight: 600 !important;
        letter-spacing: -0.01em;
    }

    p, li, span, div {
        font-size: 1.02rem !important;
        line-height: 1.7 !important;
        color: var(--text-color) !important;
    }

    p {
        margin: 0 0 1rem !important;
    }

    p + p {
        margin-top: 0;
    }

    ul, ol {
        padding-left: 1.3rem !important;
        margin-bottom: 1.2rem !important;
    }

    blockquote {
        border-left: 3px solid var(--accent-color);
        padding-left: 1rem;
        margin: 1.5rem 0;
        color: var(--muted-color);
        background: rgba(244, 225, 193, 0.4);
    }

    img {
        width: 100% !important;
        height: auto !important;
        border-radius: 12px;
    }

    @media (max-width: 640px) {
        .nav-container {
            flex-direction: column;
            align-items: flex-start;
        }

        .nav-menu {
            width: 100%;
            justify-content: space-between;
        }

        .selector-container {
            flex-direction: column;
        }

        .hour-chip {
            width: 100%;
        }

        .wp-site-blocks,
        main,
        article,
        .entry-content,
        .content,
        .inner-content,
        #content {
            padding: 20px 18px !important;
            width: 100% !important;
            margin: 12px 0 !important;
            border-radius: 12px !important;
            border: none !important;
            box-shadow: none !important;
        }
    }
`;

app.get('/leituras', (req, res) => {
    const nav = buildMainNav('leituras');
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Liturgia Diária</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                ${BASE_STYLES}
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
        </head>
        <body>
            ${nav}
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

app.get('/missa', (req, res) => {
    const nav = buildMainNav('missa');
    const sectionsPayload = JSON.stringify(RITOS_INICIAIS).replace(/</g, '\\u003c');

    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ritos Iniciais</title>
            <style>
                ${BASE_STYLES}
                body {
                    background: var(--bg-color);
                    min-height: 100vh;
                    padding-bottom: 60px;
                }
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
        </head>
        <body>
            ${nav}
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

function buildMainNav(activeSection = 'liturgia') {
    const links = NAV_SECTIONS.map(section => `
        <a href="${section.href}" class="nav-item ${section.id === activeSection ? 'active' : ''}">
            ${section.label}
        </a>
    `).join('');

    return `
        <nav class="main-nav">
            <div class="nav-container">
                <a class="nav-brand" href="/">Liturgia Catolica</a>
                <div class="nav-menu">
                    ${links}
                </div>
            </div>
        </nav>
    `;
}

function buildHoursSelector(tipoAtivo = 'laudes') {
    return `
        <div class="hours-selector">
            <div class="selector-container">
                ${HORA_OPTIONS.map(option => `
                    <a href="/?tipo=${option.tipo}" class="hour-chip ${option.tipo === tipoAtivo ? 'active' : ''}">
                        <span>${option.label}</span>
                        <small>${option.periodo}</small>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

function normalizeSpacing($) {
    $('br + br').remove();

    ['p', 'div'].forEach((selector) => {
        $(selector).each(function() {
            const text = $(this).text().replace(/\u00a0/g, '').trim();
            if (!text && $(this).children().length === 0) {
                $(this).remove();
            }
        });
    });
}

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

    if (tipoOracao === 'completas') {
        return `completas-de-${diaSemana}/`;
    }
    
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
        const horaAtiva = HORA_OPTIONS.some(option => option.tipo === tipoOracao) ? tipoOracao : 'laudes';
        
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

        normalizeSpacing($);
        
        // Adicionar menu e seletor de horas
        $('body').prepend(buildHoursSelector(horaAtiva));
        $('body').prepend(buildMainNav('liturgia'));
        
        $('head').prepend(`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Liturgia das Horas</title>
        `);
        $('head').append(`<style>${BASE_STYLES}</style>`);

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
    console.log(`\n🙏 Liturgia Católica rodando em: http://localhost:${PORT}`);
    console.log(`\n📖 Liturgia das Horas:`);
    console.log(`   Laudes: http://localhost:${PORT}/?tipo=laudes`);
    console.log(`   Vésperas: http://localhost:${PORT}/?tipo=vesperas`);
    console.log(`   Completas: http://localhost:${PORT}/?tipo=completas`);
    console.log(`\n📚 Outras seções:`);
    console.log(`   Leituras: http://localhost:${PORT}/leituras`);
    console.log(`   Missa: http://localhost:${PORT}/missa\n`);
});


