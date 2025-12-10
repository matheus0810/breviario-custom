const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const SAO_PAULO_TZ = 'America/Sao_Paulo';
const CALENDARIO_URL = 'https://liturgiadashoras.online/calendario/';
const BASE_SITE_URL = 'https://liturgiadashoras.online/';
const FIXED_DATE_LINKS = {};

const NAV_SECTIONS = [
    { id: 'liturgia', label: 'Liturgia das Horas', href: '/?tipo=laudes' },
    { id: 'leituras', label: 'Leituras', href: '/leituras' },
    { id: 'missa', label: 'Missa', href: '/missa' }
];

const HORA_OPTIONS = [
    { tipo: 'invitatorio', label: 'Invitatório', periodo: 'Início' },
    { tipo: 'laudes', label: 'Laudes', periodo: 'Manhã' },
    { tipo: 'vesperas', label: 'Vésperas', periodo: 'Tarde' },
    { tipo: 'completas', label: 'Completas', periodo: 'Noite' }
];

const INVITATORIO_CONTENT = `
<h2>Invitatório</h2>

<p>O Invitatório tem seu lugar no início da oração cotidiana, ou seja, antepõe-se ao Ofício das Leituras, ou às Laudes, conforme se comece o dia por uma ou por outra ação litúrgica.</p>

<p>V. Abri os meus lábios, ó Senhor.<br>
R. E minha boca anunciará vosso louvor.</p>

<p>Em seguida diz-se o Salmo 94(95) com sua antífona, em forma responsorial. Anuncia-se a antífona e imediatamente repete-se a mesma. Depois de cada estrofe, repete-se de novo.</p>

<p>Na recitação individual não é necessário repetir a antífona; basta dizê-la no começo e no fim do salmo.</p>

<h3>Salmo 94(95)</h3>

<p><strong>Convite ao louvor de Deus</strong></p>

<p><em>Animai-vos uns aos outros, dia após dia, enquanto ainda se disser 'hoje' (Hb 3,13).</em></p>

<p>Um solista canta ou reza a antífona, e a assembléia a repete.</p>

<p>–1 Vinde, exultemos de alegria no Senhor, *<br>
aclamemos o Rochedo que nos salva!<br>
–2 Ao seu encontro caminhemos com louvores, *<br>
e com cantos de alegria o celebremos!</p>

<p><em>Repete-se a antífona.</em></p>

<p>–3 Na verdade, o Senhor é o grande Deus, *<br>
o grande Rei, muito maior que os deuses todos.<br>
–4 Tem nas mãos as profundezas dos abismos, *<br>
e as alturas das montanhas lhe pertencem;<br>
–5 o mar é dele, pois foi ele quem o fez, *<br>
e a terra firme suas mãos a modelaram.</p>

<p><em>Repete-se a antífona.</em></p>

<p>–6 Vinde adoremos e prostremo-nos por terra, *<br>
e ajoelhemos ante o Deus que nos criou!<br>
=7 Porque ele é o nosso Deus, nosso Pastor, †<br>
e nós somos o seu povo e seu rebanho, *<br>
as ovelhas que conduz com sua mão.</p>

<p><em>Repete-se a antífona.</em></p>

<p>=8 Oxalá ouvísseis hoje a sua voz: †<br>
"Não fecheis os corações como em Meriba, *<br>
9 como em Massa, no deserto, aquele dia,<br>
– em que outrora vossos pais me provocaram, *<br>
apesar de terem visto as minhas obras".</p>

<p><em>Repete-se a antífona.</em></p>

<p>=10 Quarenta anos desgostou-me aquela raça †<br>
e eu disse: "Eis um povo transviado, *<br>
11 seu coração não conheceu os meus caminhos!"<br>
– E por isso lhes jurei na minha ira: *<br>
"Não entrarão no meu repouso prometido!"</p>

<p><em>Repete-se a antífona.</em></p>

<p><strong>(Cantado)</strong></p>

<p>Demos glória a Deus Pai onipotente<br>
e a seu Filho, Jesus Cristo, Senhor nosso, †<br>
e ao Espírito que habita em nosso peito *<br>
pelos séculos dos séculos. Amém.</p>

<p><strong>(Rezado):</strong></p>

<p>– Glória ao Pai e ao Filho e ao Espírito Santo. *<br>
Como era no princípio, agora e sempre. Amém.</p>

<p><em>Repete-se a antífona.</em></p>

<p>O salmo 94(95) pode ser substituído pelo salmo (99)100, salmo 66(67), ou salmo 23(24), abaixo. Se um destes salmos ocorre no Ofício, em seu lugar diz-se o salmo 94(95).</p>

<p>Quando o Invitatório é recitado antes das Laudes, pode ser omitido o salmo com sua antífona, conforme as circunstâncias.</p>

<h3>Salmo 23(24)</h3>

<p><strong>Entrada do Senhor no templo</strong></p>

<p><em>Na ascensão, as portas do céu se abriram para o Cristo (Sto. Irineu).</em></p>

<p>–1 Ao Senhor pertence a terra e o que ela encerra, *<br>
o mundo inteiro com os seres que o povoam;<br>
–2 porque ele a tornou firme sobre os mares, *<br>
e sobre as águas a mantém inabalável.</p>

<p>R.</p>

<p>–3 "Quem subirá até o monte do Senhor, *<br>
quem ficará em sua santa habitação?"<br>
=4 "Quem tem mãos puras e inocente coração, †<br>
quem não dirige sua mente para o crime, *<br>
nem jura falso para o dano de seu próximo.</p>

<p>R.</p>

<p>–5 Sobre este desce a bênção do Senhor *<br>
e a recompensa de seu Deus e Salvador".<br>
–6 "É assim a geração dos que o procuram, *<br>
e do Deus de Israel buscam a face".</p>

<p>R.</p>

<p>=7 "Ó portas, levantai vossos frontões! †<br>
Elevai-vos bem mais alto, antigas portas, *<br>
a fim de que o Rei da glória possa entrar!"</p>

<p>R.</p>

<p>=8 Dizei-nos: "Quem é este Rei da glória?" †<br>
"É o Senhor, o valoroso, o onipotente, *<br>
o Senhor, o poderoso nas batalhas!"</p>

<p>R.</p>

<p>=9 "Ó portas, levantai vossos frontões! †<br>
Elevai-vos bem mais alto, antigas portas, *<br>
a fim de que o Rei da glória possa entrar!"</p>

<p>R.</p>

<p>=10 Dizei-nos: "Quem é este Rei da glória?" †<br>
"O Rei da glória é o Senhor onipotente, *<br>
o Rei da glória é o Senhor Deus do universo!"</p>

<p>R.</p>

<p>– Glória ao Pai e ao Filho e ao Espírito Santo. *<br>
Como era no princípio, agora e sempre. Amém.</p>

<p>R.</p>

<h3>Salmo 66(67)</h3>

<p><strong>Todos os povos celebrem o Senhor</strong></p>

<p><em>Sabei, pois, que esta salvação de Deus já foi comunicada aos pagãos! (At 28,28).</em></p>

<p>–2 Que Deus nos dê a sua graça e sua bênção, *<br>
e sua face resplandeça sobre nós!<br>
–3 Que na terra se conheça o seu caminho *<br>
e a sua salvação por entre os povos.</p>

<p>R.</p>

<p>–4 Que as nações vos glorifiquem, ó Senhor, *<br>
que todas as nações vos glorifiquem!</p>

<p>R.</p>

<p>–5 Exulte de alegria a terra inteira, *<br>
pois julgais o universo com justiça;<br>
– os povos governais com retidão, *<br>
e guiais, em toda a terra, as nações.</p>

<p>R.</p>

<p>–6 Que as nações vos glorifiquem, ó Senhor, *<br>
que todas as nações vos glorifiquem!</p>

<p>R.</p>

<p>–7 A terra produziu sua colheita: *<br>
o Senhor e nosso Deus nos abençoa.<br>
–8 Que o Senhor e nosso Deus nos abençoe, *<br>
e o respeitem os confins de toda terra!</p>

<p>R.</p>

<p>– Glória ao Pai e ao Filho e ao Espírito Santo. *<br>
Como era no princípio, agora e sempre. Amém.</p>

<p>R.</p>

<h3>Salmo 99(100)</h3>

<p><strong>Alegria dos que entram no templo</strong></p>

<p><em>O Senhor ordena aos que foram salvos que cantem o hino de vitória (Sto. Atanásio).</em></p>

<p>=2 Aclamai o Senhor, ó terra inteira, †<br>
servi ao Senhor com alegria, *<br>
ide a ele cantando jubilosos!</p>

<p>R.</p>

<p>=3 Sabei que o Senhor, só ele, é Deus †<br>
Ele mesmo nos fez, e somos seus, *<br>
nós somos seu povo e seu rebanho.</p>

<p>R.</p>

<p>=4 Entrai por suas portas dando graças, †<br>
e em seus átrios com hinos de louvor, *<br>
dai-lhe graças, seu nome bendizei!</p>

<p>R.</p>

<p>=5 Sim, é bom o Senhor e nosso Deus, †<br>
sua bondade perdura para sempre, *<br>
seu amor é fiel eternamente!</p>

<p>R.</p>

<p>– Glória ao Pai e ao Filho, e ao Espírito Santo. *<br>
Como era no princípio, agora e sempre. Amém.</p>

<p>R.</p>
`;

// Array de Orações Eucarísticas (vazio para reiniciar)
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
        ],
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
            'Ite, missa est. Laus Deo.',
            '<strong>℟. Deo grátias.</strong>'
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

    .liturgia-info-banner {
        background: linear-gradient(135deg, #f4e1c1 0%, #e4d8c6 100%);
        border-bottom: 2px solid var(--accent-color);
        padding: 16px 20px;
    }

    .liturgia-info-container {
        max-width: 960px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        align-items: center;
    }

    .liturgia-info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .liturgia-info-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--muted-color);
        font-weight: 600;
    }

    .liturgia-info-value {
        font-size: 0.95rem;
        color: var(--text-color);
        font-weight: 500;
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

    /* Garantir que <br> funcione corretamente */
    br {
        display: block !important;
        content: "" !important;
        margin: 0 !important;
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
            <link rel="icon" href="data:,">
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
    // Não remover <br> duplicados para preservar formatação de hinos
    // $('br + br').remove();

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

function getTodayInSaoPaulo() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: SAO_PAULO_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [year, month, day] = formatter.format(new Date()).split('-').map(Number);
    return new Date(year, month - 1, day, 12);
}

function parseSaoPauloDate(param) {
    if (!param) {
        return getTodayInSaoPaulo();
    }

    const parts = param.split('-').map(Number);
    if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) {
        return getTodayInSaoPaulo();
    }

    const [year, month, day] = parts;
    return new Date(year, month - 1, day, 12);
}

function normalizarLiturgiaParaUrl(textoLiturgia) {
    // Ex: "Imaculada Conceição da Bem-aventurada Virgem Maria, Solenidade"
    // → "solenidade-da-imaculada-conceicao-da-bem-aventurada-virgem-maria"
    
    let texto = textoLiturgia.toLowerCase();
    
    // Remover pontuação (vírgulas, etc)
    texto = texto.replace(/[,;.!?]/g, '');
    
    // Normalizar acentos
    texto = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Se contém "solenidade", mover para o início
    if (texto.includes('solenidade')) {
        texto = texto.replace(/\s*solenidade\s*/gi, '');
        texto = 'solenidade da ' + texto.trim();
    }
    
    // Se contém "festa", mover para o início
    if (texto.includes('festa')) {
        texto = texto.replace(/\s*festa\s*/gi, '');
        texto = 'festa de ' + texto.trim();
    }
    
    // Substituir espaços por hífens
    texto = texto.replace(/\s+/g, '-');
    
    // Remover hífens duplicados
    texto = texto.replace(/-+/g, '-');
    
    return texto;
}

async function obterDadosLiturgiaAPI(data = getTodayInSaoPaulo()) {
    try {
        // Formatar data para API: DD/MM/YYYY
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;
        
        console.log(`📡 Consultando API de liturgia para ${dataFormatada}...`);
        
        const response = await fetch(`https://liturgia.up.railway.app/?data=${encodeURIComponent(dataFormatada)}`);
        if (!response.ok) {
            console.log(`✗ API retornou ${response.status}`);
            return null;
        }
        
        const apiData = await response.json();
        
        if (!apiData.liturgia) {
            console.log('✗ API não retornou campo "liturgia"');
            return null;
        }
        
        console.log(`✓ Liturgia do dia: "${apiData.liturgia}"`);
        
        return {
            data: apiData.data,
            liturgia: apiData.liturgia,
            cor: apiData.cor
        };
    } catch (err) {
        console.error('Falha ao consultar API de liturgia:', err.message);
        return null;
    }
}

async function obterLiturgiaDoApiEGerarUrl(data = getTodayInSaoPaulo(), tipoOracao = 'laudes') {
    try {
        const dadosAPI = await obterDadosLiturgiaAPI(data);
        
        if (!dadosAPI) {
            return null;
        }
        
        const liturgia = dadosAPI.liturgia;
        
        // Se não é solenidade, festa ou memória especial, não gerar URL
        const textoLower = liturgia.toLowerCase();
        if (!textoLower.includes('solenidade') && 
            !textoLower.includes('festa') && 
            !textoLower.includes('memória') &&
            !textoLower.includes('memoria')) {
            console.log('→ Dia litúrgico comum (não é solenidade/festa), usando geração padrão');
            return null;
        }
        
        // Normalizar para URL
        const slugLiturgia = normalizarLiturgiaParaUrl(liturgia);
        const urlCandidata = `${BASE_SITE_URL}${tipoOracao}-${slugLiturgia}/`;
        
        console.log(`→ URL candidata: ${urlCandidata}`);
        
        // Testar se a URL existe
        const testeResp = await fetch(urlCandidata, { method: 'HEAD', redirect: 'follow' });
        if (testeResp.ok) {
            console.log(`✓ URL válida! (${testeResp.status})`);
            return urlCandidata;
        } else {
            console.log(`✗ URL não encontrada (${testeResp.status})`);
            return null;
        }
    } catch (err) {
        console.error('Falha ao consultar API de liturgia:', err.message);
        return null;
    }
}

async function obterLinkDoCalendario(data = getTodayInSaoPaulo()) {
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const dia = data.getDate();
    const mes = data.getMonth();
    const mesNome = meses[mes];
    
    // Mapa de solenidades conhecidas por data
    const solenidadesPorData = {
        '12-08': ['imaculada', 'imaculada conceição', 'imaculada conceicao'],
        '12-25': ['natal', 'nascimento do senhor'],
        '01-01': ['maria mãe de deus', 'maria mae de deus'],
        '08-15': ['assunção', 'assuncao'],
        // Adicionar mais conforme necessário
    };
    
    const dataKey = `${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const palavrasChave = solenidadesPorData[dataKey] || [];
    
    console.log(`Buscando no calendário: dia ${dia} de ${mesNome} (chave: ${dataKey})`);
    if (palavrasChave.length > 0) {
        console.log(`Palavras-chave de solenidade: ${palavrasChave.join(', ')}`);
    }

    try {
        const response = await fetch(CALENDARIO_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const j = cheerio.load(html);
        let linkEncontrado = null;

        // Primeiro: procurar por solenidades conhecidas
        if (palavrasChave.length > 0) {
            j('a').each((_, el) => {
                if (linkEncontrado) return false;
                const href = j(el).attr('href');
                const texto = j(el).text().trim().toLowerCase();
                
                if (!href) return;
                
                const textoNorm = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const hrefNorm = href.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                
                // Verificar se o texto ou href contém alguma palavra-chave da solenidade
                const encontrouSolenidade = palavrasChave.some(palavra => {
                    const palavraNorm = palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    return textoNorm.includes(palavraNorm) || hrefNorm.includes(palavraNorm);
                });
                
                if (encontrouSolenidade) {
                    linkEncontrado = href.startsWith('http') ? href : new URL(href, CALENDARIO_URL).href;
                    console.log(`✓ Solenidade encontrada: "${j(el).text().trim().substring(0, 60)}" -> ${linkEncontrado}`);
                    return false;
                }
            });
        }

        // Segundo: se não encontrou solenidade, procurar por data explícita
        if (!linkEncontrado) {
            j('a').each((_, el) => {
                const href = j(el).attr('href');
                const texto = j(el).text().trim();
                const textoLower = texto.toLowerCase();
                
                if (!href) return;
                
                const textoNorm = textoLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const mesNomeNorm = mesNome.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                
                const diaComZero = String(dia).padStart(2, '0');
                const padroesDia = [
                    new RegExp(`\\b${dia}\\s+de\\s+${mesNomeNorm}`, 'i'),
                    new RegExp(`\\b${diaComZero}\\s+de\\s+${mesNomeNorm}`, 'i'),
                    new RegExp(`\\b${dia}/${mes + 1}\\b`, 'i'),
                    new RegExp(`\\b${diaComZero}/${String(mes + 1).padStart(2, '0')}\\b`, 'i'),
                ];
                
                const mencionaDia = padroesDia.some(padrao => padrao.test(textoNorm));
                
                if (mencionaDia) {
                    linkEncontrado = href.startsWith('http') ? href : new URL(href, CALENDARIO_URL).href;
                    console.log(`✓ Data encontrada: "${texto.substring(0, 60)}" -> ${linkEncontrado}`);
                    return false;
                }
            });
        }

        if (!linkEncontrado) {
            console.log(`✗ Nenhum link encontrado no calendário para ${dia} de ${mesNome}`);
        }

        return linkEncontrado;
    } catch (err) {
        console.error('Falha ao consultar calendário:', err.message);
        return null;
    }
}

function obterLinkFixoPorDataETipo(data = getTodayInSaoPaulo(), tipo = 'laudes') {
    const key = `${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    const mapa = FIXED_DATE_LINKS[key];
    if (!mapa) return null;
    return mapa[tipo] || mapa.laudes || null;
}

async function encontrarLinkNaPaginaDoDia(baseUrl, tipoOracao) {
    if (!baseUrl) return null;

    try {
        const resp = await fetch(baseUrl);
        if (!resp.ok) return null;

        const html = await resp.text();
        const j = cheerio.load(html);
        const tipo = (tipoOracao || '').toLowerCase();

        let encontrado = null;
        let melhorMatch = null;
        
        j('a').each((_, el) => {
            const href = j(el).attr('href');
            const texto = j(el).text().toLowerCase().trim();
            if (!href) return;

            const hrefAbs = href.startsWith('http') ? href : new URL(href, baseUrl).href;
            
            // Verificar se é exatamente o tipo que queremos
            const palavraChaveTipo = tipo === 'vesperas' ? 'vésperas' : tipo;
            const contemTipo = hrefAbs.includes(`/${tipo}-`) || hrefAbs.includes(`-${tipo}-`) || 
                              texto.includes(palavraChaveTipo) || texto.includes(tipo);
            
            if (contemTipo) {
                // Preferir links que contenham "solenidade" no href (mais específicos)
                if (hrefAbs.includes('solenidade')) {
                    encontrado = hrefAbs;
                    console.log(`Link específico encontrado: ${texto.substring(0, 60)} -> ${hrefAbs}`);
                    return false; // break
                } else if (!melhorMatch) {
                    melhorMatch = hrefAbs;
                }
            }
        });

        return encontrado || melhorMatch;
    } catch (err) {
        console.error('Falha ao procurar link específico na página do dia:', err.message);
        return null;
    }
}

async function tentarUrlEspecificaPorHora(baseUrl, tipoOracao) {
    if (!baseUrl) return null;

    try {
        const urlObj = new URL(baseUrl);
        const slug = urlObj.pathname.replace(/^\//, '').replace(/\/$/, '');
        if (!slug) return null;

        const slugComTipo = `${tipoOracao}-${slug}`;
        const candidato = new URL(slugComTipo + '/', BASE_SITE_URL).href;

        const resp = await fetch(candidato, {
            method: 'HEAD',
            redirect: 'follow'
        });

        if (resp.ok) return candidato;
    } catch (err) {
        console.error('Falha ao validar URL específica por hora:', err.message);
    }

    return null;
}

// Funções para calendário litúrgico
function obterDiaDaSemana(data = getTodayInSaoPaulo()) {
    const dias = ['domingo', 'segunda-feira', 'terca-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado'];
    return dias[data.getDay()];
}

function obterTempoLiturgico(data = getTodayInSaoPaulo()) {
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

function obterSemanaDoTempo(data = getTodayInSaoPaulo()) {
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

function gerarUrlLiturgia(tipoOracao, data = getTodayInSaoPaulo()) {
    const diaSemana = obterDiaDaSemana(data);
    
    // Completas: sempre usa apenas o dia da semana
    if (tipoOracao === 'completas') {
        return `completas-de-${diaSemana}/`;
    }
    
    // Para Laudes e Vésperas: incluir tempo litúrgico
    const tempo = obterTempoLiturgico(data);
    const semana = obterSemanaDoTempo(data);
    
    // Formato: {tipo}-de-{dia}-da-{semana}-do-{tempo}
    let url = `${tipoOracao}-de-${diaSemana}-da-${semana}`;
    
    if (tempo !== 'tempo-comum') {
        url += `-do-${tempo}`;
    } else {
        url += `-do-tempo-comum`;
    }
    
    return url + '/';
}

// Rota principal - sempre liturgiadashoras.online

app.get('*', async (req, res) => {
    try {
        // Determinar tipo de oração
        const tipoOracao = req.query.tipo || 'laudes';
        const dataCustom = parseSaoPauloDate(req.query.data);
        const horaAtiva = HORA_OPTIONS.some(option => option.tipo === tipoOracao) ? tipoOracao : 'laudes';
        
        console.log(`Tipo de oração recebido: ${tipoOracao}`);
        
        // Se for Invitatório, retornar conteúdo fixo
        if (tipoOracao === 'invitatorio') {
            const $ = cheerio.load(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="icon" href="data:,">
                    <title>Invitatório - Liturgia das Horas</title>
                </head>
                <body>
                    <div class="wp-site-blocks">
                        ${INVITATORIO_CONTENT}
                    </div>
                </body>
                </html>
            `);
            
            // Remover todas as tags de favicon/ícones
            $('link[rel="icon"]').remove();
            $('link[rel="shortcut icon"]').remove();
            $('link[rel="apple-touch-icon"]').remove();
            $('link[rel="apple-touch-icon-precomposed"]').remove();
            
            $('body').prepend(buildHoursSelector(horaAtiva));
            $('body').prepend(buildMainNav('liturgia'));
            $('head').prepend(`
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="icon" href="data:,">
                <title>Invitatório - Liturgia das Horas</title>
            `);
            $('head').append(`<style>${BASE_STYLES}</style>`);
            
            return res.send($.html());
        }
        
        let targetUrl = null;
        let response = null;

        // 1) Primeiro: tentar API de liturgia (detecta solenidades automaticamente)
        targetUrl = await obterLiturgiaDoApiEGerarUrl(dataCustom, tipoOracao);
        
        if (targetUrl) {
            console.log(`Tentando URL da API de liturgia: ${targetUrl}`);
            try {
                response = await fetch(targetUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                if (!response.ok) {
                    console.log(`URL da API falhou (${response.status}), tentando calendário...`);
                    response = null;
                    targetUrl = null;
                }
            } catch (err) {
                console.log(`Erro ao acessar URL da API: ${err.message}`);
                response = null;
                targetUrl = null;
            }
        }

        // 2) Segundo: tentar obter link direto do calendário oficial para a data
        if (!response) {
            targetUrl = await obterLinkDoCalendario(dataCustom);

            // 2.a) Se houver link do dia, tentar achar dentro da página o link específico da hora
            if (targetUrl) {
                const encontradoNaPagina = await encontrarLinkNaPaginaDoDia(targetUrl, tipoOracao);
                if (encontradoNaPagina) {
                    targetUrl = encontradoNaPagina;
                }
            }

            // 2.b) Se ainda não achou, tentar formar a URL específica da hora (laudes/vesperas/completas)
            if (targetUrl) {
                const urlComHora = await tentarUrlEspecificaPorHora(targetUrl, tipoOracao);
                if (urlComHora) {
                    targetUrl = urlComHora;
                }
            }

            // 2.c) Se encontrou URL do calendário, tentar acessar
            if (targetUrl) {
                console.log(`Tentando URL do calendário: ${targetUrl}`);
                try {
                    response = await fetch(targetUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    });
                    if (!response.ok) {
                        console.log(`URL do calendário falhou (${response.status}), tentando URL gerada...`);
                        response = null;
                    }
                } catch (err) {
                    console.log(`Erro ao acessar URL do calendário: ${err.message}`);
                    response = null;
                }
            }
        }

        // 3) Terceiro: se não encontrou no calendário ou falhou, gerar URL automática e tentar
        if (!response) {
            const urlGerada = gerarUrlLiturgia(tipoOracao, dataCustom);
            targetUrl = `${BASE_SITE_URL}${urlGerada}`;
            console.log(`Tentando URL gerada: ${targetUrl}`);
            
            response = await fetch(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log(`✓ Sucesso: ${targetUrl}`);
        
        let html = await response.text();
        const $ = cheerio.load(html);
        
        // Limpar elementos desnecessários
        $('script[src*="google"], script[src*="ads"], script[src*="analytics"]').remove();
        $('.ads, .advertisement, [class*="ad-"], .banner, .popup').remove();
        $('#sidebar, .sidebar, nav:not(.liturgia-nav)').remove();
        
        // Remover embeds do SoundCloud e outros embeds
        $('[class*="soundcloud"]').remove();
        $('[class*="wp-block-embed"]').remove();
        $('[class*="wp-block-audio"]').remove();
        $('iframe[src*="soundcloud"]').remove();
        
        // Remover divs de navegação do WordPress (botões de Laudes, Vésperas, etc.)
        $('.wp-block-button').remove();
        $('[class*="wp-block-buttons"]').remove();
        $('[class*="wp-block-comments"]').remove();
        
        // Remover divs com classes específicas do WordPress
        $('[class*="wp-block-group alignwide is-vertical"]').remove();
        $('.wp-block-template-part').remove();
        $('.wp-block-post-featured-image').remove();
        $('.wp-block-image.size-large').remove();
        
        // Remover classes CSS específicas indesejadas
        $('*').each(function() {
            const classes = $(this).attr('class');
            if (classes) {
                // Remove as classes específicas
                let newClasses = classes
                    .replace(/wp-block-group alignwide is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-[a-f0-9]+ wp-block-group-is-layout-flex/g, '')
                    .replace(/wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained/g, '')
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
        
        // Remover todas as tags de favicon/ícones do site original
        $('link[rel="icon"]').remove();
        $('link[rel="shortcut icon"]').remove();
        $('link[rel="apple-touch-icon"]').remove();
        $('link[rel="apple-touch-icon-precomposed"]').remove();
        
        // Buscar dados da API de liturgia
        const dadosLiturgia = await obterDadosLiturgiaAPI(dataCustom);
        
        // Adicionar banner com informações litúrgicas
        if (dadosLiturgia) {
            const bannerHTML = `
                <div class="liturgia-info-banner">
                    <div class="liturgia-info-container">
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Data:</span>
                            <span class="liturgia-info-value">${dadosLiturgia.data}</span>
                        </div>
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Dia Litúrgico:</span>
                            <span class="liturgia-info-value">${dadosLiturgia.liturgia}</span>
                        </div>
                        <div class="liturgia-info-item">
                            <span class="liturgia-info-label">Cor:</span>
                            <span class="liturgia-info-value">${dadosLiturgia.cor}</span>
                        </div>
                    </div>
                </div>
            `;
            $('body').prepend(bannerHTML);
        }
        
        // Adicionar menu e seletor de horas
        $('body').prepend(buildHoursSelector(horaAtiva));
        $('body').prepend(buildMainNav('liturgia'));
        
        $('head').prepend(`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>Breviário</title>
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



