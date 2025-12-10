// Constantes compartilhadas entre os módulos

const NAV_SECTIONS = [
    { id: 'liturgia', label: 'Liturgia das Horas', href: '/?tipo=laudes' },
    { id: 'leituras', label: 'Leituras', href: '/leituras' },
    { id: 'missa', label: 'Missa', href: '/missa' },
    { id: 'oracoes', label: 'Orações e Formação', href: '/oracoes' }
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
            'Supra quae propitio ac sereno vultu respicere digneris: et accepta habere, siculti accepta habere dignatus es munera pueri tui iusti Abel, et sacrificium Patriarchae nostri Abrahae, et quod tibi obtulit summus sacerdos tuus Melchisedech, sanctum sacrificium, immaculatam hostiam.',
            '',
            'Supplices te rogamus, omnipotens Deus: iube haec perferri per manus sancti Angeli tui in sublime altare tuum, in conspectu divinae maiestatis tuae; ut quotquot ex hac altaris participatione sacrosanctum Filii tui Corpus et Sanguinem sumpserimus, omni benedictione caelesti et gratia repleamur. (Per Christum Dominum nostrum. Amen.)',
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
            'Suplicantes, vos pedimos que, participando do Corpo e do Sangue de Cristo, sejamos reunidos pelo Espírito Santo num só corpo.',
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
            '<span class="rubrica">3C</span> Enfim, nós vos pedimos, ó Pai, tende piedade de todos nós e dai-nos participar da vida eterna, com a Virgem Maria, Mãe de Deus, São José, seu esposo, Os Apóstolos, (São N. Santo do dia ou padroeiro) e todos os Santos, que não cessam de interceder por nós na vossa presença.',
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
            'Memores igitur mortis et resurrectionis eius, tibi, Domine, panem vitae et calicem salutis afferimus, gratias agentes quia nos dignos habuisti astare coram te et tibi ministrare.',
            '',
            'Et supplices deprecamur ut Corporis et Sanguinis Christi participes a Spiritu Sancto congregemur in unum.',
            '',
            'Recordare, Domine, Ecclesiae tuae toto orbe diffusae, ut eam in caritate perficias una cum Papa nostro (N) et Episcopo nostro (N) et universo clero.',
            '',
            'Memento etiam fratrum nostrorum, qui in spe resurrectionis dormierunt, omniumque in tua miseratione defunctorum, et eos in lumen vultus tui admitte.',
            '',
            'Omnium nostrum, quaesumus, miserere, ut cum beata Dei Genetrice Virgine Maria, beatis Apostolis et omnibus Sanctis, qui tibi a saeculo placuerunt, aeternae vitae mereamur esse consortes, et te laudemus et glorificemus per Filium tuum Iesum Christum.',
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
            '<span class="rubrica">CC</span> Celebrando, agora, ó Pai, o memorial da paixão redentora do vosso Filho, da sua gloriosa ressurreição e ascensão ao céu, e enquanto esperamos sua nova vinda, nós vos oferecemos o seu Corpo e Sangue, sacrifício do vosso agrado e salvação do mundo inteiro.',
            '',
            '<strong>R: Aceitai, ó Senhor, a nossa oferta!</strong>',
            '',
            'Olhai com bondade a oblação da vossa Igreja e concedei aos que vamos participar do mesmo pão e do mesmo cálice que, reunidos pelo Espírito Santo num só corpo, nos tornemos em Cristo uma oferenda viva para o louvor da vossa glória.',
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
            '<span class="rubrica">3C</span> Acolhei com bondade no vosso reino os nossos irmãos e irmãs que partiram desta vida e todos os que morreram na vossa amizade; unidos a eles, esperamos também nós saciar-nos eternamente da vossa glória, por Cristo, Senhor nosso. Por ele dais ao mundo todo bem e toda graça',
            '',
            '<span class="rubrica">CP ou CC</span> Por Cristo, com Cristo, e em Cristo, a vós, Deus Pai todo-poderoso, na unidade do Espírito Santo, toda a honra e toda a glória, por todos os séculos dos séculos.',
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
            'Ipse nos tibi perficiat munus aeternum, ut cum electis tuis hereditem consequi valeamus, in primis cum beatissima Virgine, Dei Genetrice, Maria, cum beatis Apostolis tuis et gloriosis Martyribus (cum Sancto N) et omnibus Sanctis, quorum intercessione perpetuo apud te confidimus adiuvari.',
            '',
            'Haec Hostia nostrae reconciliationis proficiat, quaesumus, Domine, ad totius mundi pacem atque salutem. Ecclesiam tuam, pergrinantem in terra, in fide et caritate firmare digneris cum famulo tuo Papa nostro (N) et Episcopo nostro (N), cum episcopali ordine et universo clero et omni populo acquisitionis tuae. Votis huius familiae, quam tibi astare voluisti, adesto propitius. Omnes filios tuos ubique dispersos tibi, clemens Pater, miseratus coniunge.',
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
            '<span class="rubrica">CP</span> Nós proclamamos vossa grandeza, Pai santo, a sabedoria e o amor com que fizestes todas as coisas. Criastes o ser humano à vossa imagem e lhe confiastes todo o universo para que, servindo somente a vós, seu Criador, cuidasse de toda criatura. E quando pela desobediência perdeu a vossa amizade, não o abandonastes ao poder da morte. A todos, porém, socorrestes com misericórdia, para que, ao procurar-vos, vos encontrassem. Muitas vezes ofereestes aliança à família humana e a instruístes pelos profetas na esperança da salvação.',
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
            'Confitemur tibi, Pater sancte, quia magnus es et omnia opera tua in sapientia et caritate fecisti. Hominem ad tuam imaginem condidisti, eique commisisti mundi curam universi, ut, tibi soli Creatori serviens, creaturis omnibus imperaret. Et cum amicitiam tuam, non oboediens, amisisset, non eum dereliquisti in mortis imperio. Omnibus enim misericorditer subvenisti, ut te quaerentes invenirent. Sed et foedera pluries homnibus obtulisti eosque per prophetas erudisti in exspectatione salutis.',
            '',
            'Et sic, Pater sancte, mundum dilexisti, ut, completa plenitudine temporum, Unigenitum tuum nobis mitteres Salvatorem. Qui, incarnatus de Spiritu Sancto et natus ex Maria Virgine, in nostra condicionis forma est conversatus per omnia absque peccato: salutem evangelizavit pauperibus, redemptionem captivis, maestis corde laetitiam. Ut tuam vero dispensationem impleret, in mortem tradidit semetipsum ac, resurgens a mortuis, mortem destruxit vitamque renovavit.',
            '',
            'Et, ut non amplius nobismetipsis viveremus, sed sibi qui pro nobis mortuus est atque surrexit, a te, Pater, misit Spiritum Sanctum primitias credentibus, qui, opus suum in mundo perficiens, omnem sanctificationem compleret.',
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
            'Nunc ergo, Domine, omnium recordare, pro quibus tibi hanc oblationem offerimus: in primis famuli tui, Papae nostri (N), Episcopi nostri (N), et Episcoporum ordinis universi, sed et totius cleri, et offerentium, et circumstantium, et cuncti populi tui, et omnium, qui te quaerunt corde sincero.',
            '',
            'Memento etiam illorum, qui obierunt in pace Christi tui, et omnium defenctorum, quorum fidem to solus cognovisti.',
            '',
            'Nobis omnibus, filiis tuis, clemens Pater, concede, ut caelestem hereditatem consequi valeamus cum beata Virgine, Dei Genetrice, Maria, cum Apostolis et Sanctis tuis in regno tuo, ubi cum universa creatura, a corruptione peccati mortis liberata, te glorificemus per Christum Dominum nostrum, per quem mundo bona cuncta largiris.',
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
            '<span class="rubrica">Consultare folium antiphonarum et orationum quotidianarum.</span>'
        ]
    },
    {
        title: 'Saudação do Celebrante',
        pt: [
            '<span class="rubrica">CP</span> Em nome do Pai, e do Filho, e do Espírito Santo.',
            '<strong>R: Amém.</strong>',
            '<span class="rubrica">CP</span> A graça de nosso Senhor Jesus Cristo, o amor do Pai e a comunhão do Espírito Santo estejam convosco.',
            '<strong>R: Bendito seja Deus que nos reuniu na sua paz.</strong>',
            '<span class="rubrica">CP</span> Irmãos e irmãs, preparemo-nos para celebrar os santos mistérios.',
            '<strong>R: Senhor, tende piedade de nós.</strong>',
            '<span class="rubrica">CP</span> Reconheçamos os nossos pecados.',
            '<strong>R: Confesso a Deus todo-poderoso...</strong>'
        ],
        la: [
            '<span class="rubrica">CP</span> In nomine Patris, et Filii, et Spiritus Sancti.',
            '<strong>℟. Amen.</strong>',
            '<span class="rubrica">CP</span> Gratia Domini nostri Iesu Christi, et caritas Dei, et communicatio Sancti Spiritus sit cum omnibus vobis.',
            '<strong>℟. Et cum spiritu tuo.</strong>',
            '<span class="rubrica">CP</span> Fratres, agnoscamus peccata nostra, ut apti simus ad sacra mysteria celebranda.',
            '<strong>℟. Confiteor Deo omnipotenti...</strong>'
        ]
    },
    {
        title: 'Oração Colecta',
        pt: [
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>'
        ],
        la: [
            '<span class="rubrica">Consultare folium antiphonarum et orationum quotidianarum.</span>'
        ]
    }
];

const ORDINARIO_COMUNHAO = [
    {
        title: 'Rito da Comunhão',
        pt: [
            '<span class="rubrica">CP</span> Eis o Cordeiro de Deus, que tira o pecado do mundo. Felizes os convidados para o banquete das núpcias do Cordeiro!',
            '<strong>R: Senhor, eu não sou digno de que entreis em minha casa, mas dizei uma palavra e serei salvo.</strong>',
            '<span class="rubrica">CP</span> O Corpo de Cristo.',
            '<strong>R: Amém.</strong>',
            '<span class="rubrica">CP</span> O Sangue de Cristo.',
            '<strong>R: Amém.</strong>',
            '<span class="rubrica">CC</span> Que o Corpo e o Sangue de Cristo, que comemos e bebemos, nos mantenham em vida eterna.',
            '<strong>R: Amém.</strong>'
        ],
        la: [
            '<span class="rubrica">CP</span> Ecce Agnus Dei, ecce qui tollit peccata mundi. Beati qui ad cenam Agni vocati sunt!',
            '<strong>℟. Domine, non sum dignus, ut intres sub tectum meum, sed tantum dic verbo, et sanabitur anima mea.</strong>',
            '<span class="rubrica">CP</span> Corpus Christi.',
            '<strong>℟. Amen.</strong>',
            '<span class="rubrica">CP</span> Sanguis Christi.',
            '<strong>℟. Amen.</strong>',
            '<span class="rubrica">CC</span> Quod ore sumpsimus, Domine, pura mente capiamus, et de munere temporali fiat nobis remedium sempiternum.',
            '<strong>℟. Amen.</strong>'
        ]
    },
    {
        title: 'Antífona de Comunhão',
        pt: [
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>'
        ],
        la: [
            '<span class="rubrica">Consultare folium antiphonarum et orationum quotidianarum.</span>'
        ]
    },
    {
        title: 'Oração depois da Comunhão',
        pt: [
            '<span class="rubrica">Consultar folha de antífonas e orações diárias.</span>'
        ],
        la: [
            '<span class="rubrica">Consultare folium antiphonarum et orationum quotidianarum.</span>'
        ]
    }
];

const PORTUGUESE_KEYWORDS = [
    'oração', 'oração eucarística', 'oração eucaristica', 'oração eucarística i', 'oração eucarística ii', 'oração eucarística iii', 'oração eucarística iv',
    'ritos iniciais', 'rito inicial', 'antífona de entrada', 'antifona de entrada', 'saudação', 'oração colecta', 'oração coleta',
    'ordinário da missa', 'ordinario da missa', 'rito da comunhão', 'rito da comunhao', 'antífona de comunhão', 'antifona de comunhao', 'oração depois da comunhão', 'oração depois da comunhao'
];

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
        position: relative;
    }

    .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
        text-decoration: none;
    }

    .nav-menu {
        display: flex;
        list-style: none;
        gap: 30px;
    }

    .nav-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        padding: 15px 0;
        transition: color 0.3s ease;
        position: relative;
    }

    .nav-link:hover {
        color: var(--secondary-color);
    }

    .nav-link.active {
        color: var(--secondary-color);
    }

    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
    }

    .hamburger-btn {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 1002;
    }

    /* Estilo mais robusto para o ícone hamburguer (usa barras CSS em vez de glifo) */
    .hamburger-btn {
        width: 36px;
        height: 24px;
        position: relative;
        text-indent: -9999px; /* esconder texto fallback */
        overflow: hidden;
        display: inline-block;
    }
    .hamburger-btn::before,
    .hamburger-btn::after {
        content: '';
        display: block;
        height: 3px;
        background: var(--primary-color);
        border-radius: 2px;
        position: absolute;
        left: 6px;
        right: 6px;
        transition: all 0.2s ease;
    }
    /* criar a barra do meio via box-shadow na pseudo-elemento superior */
    .hamburger-btn::before { top: 5px; box-shadow: 0 8px 0 0 var(--primary-color); }
    .hamburger-btn::after { bottom: 5px; }

    .content {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .section-title {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 30px;
        text-align: center;
        border-bottom: 2px solid var(--accent-color);
        padding-bottom: 15px;
    }

    .prayer-card {
        background: white;
        border-radius: 15px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 8px 25px rgba(139, 69, 19, 0.1);
        border: 1px solid rgba(139, 69, 19, 0.05);
    }

    .prayer-title {
        font-size: 1.5rem;
        color: var(--primary-color);
        margin-bottom: 20px;
        text-align: center;
        font-weight: bold;
    }

    .prayer-content {
        line-height: 1.8;
        color: var(--text-color);
    }

    .prayer-content p {
        margin-bottom: 15px;
    }

    .prayer-content strong {
        color: var(--primary-color);
        font-weight: bold;
    }

    .rubrica {
        color: #8B0000;
        font-style: italic;
        font-weight: bold;
    }

    .language-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
    }

    .lang-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.3s ease;
    }

    .lang-btn:hover {
        background: var(--secondary-color);
    }

    .lang-btn.active {
        background: var(--secondary-color);
    }

    .hours-selector {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 30px;
        box-shadow: 0 4px 15px rgba(139, 69, 19, 0.1);
        border: 1px solid rgba(139, 69, 19, 0.05);
    }

    .hours-title {
        font-size: 1.3rem;
        color: var(--primary-color);
        margin-bottom: 15px;
        text-align: center;
        font-weight: bold;
    }

    .hours-buttons {
        display: flex;
        justify-content: center;
        gap: 15px;
        flex-wrap: wrap;
    }

    .hour-btn {
        background: var(--light-bg);
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
    }

    .hour-btn:hover {
        background: var(--primary-color);
        color: white;
    }

    .hour-btn.active {
        background: var(--primary-color);
        color: white;
    }

    .liturgia-info-banner {
        background: linear-gradient(135deg, #8B4513, #A0522D);
        color: white;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
    }

    .liturgia-info-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }

    .liturgia-info-item {
        text-align: center;
    }

    .liturgia-info-label {
        font-size: 0.9rem;
        opacity: 0.9;
        margin-bottom: 5px;
    }

    .liturgia-info-value {
        font-size: 1.1rem;
        font-weight: bold;
    }

    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }

        .content {
            padding: 20px 15px;
        }

        .prayer-card {
            padding: 20px;
        }

        .liturgia-info-container {
            flex-direction: column;
            gap: 10px;
        }
    }

    @media (max-width: 768px) {
        .nav-container {
            flex-direction: row;
            align-items: center;
            padding: 10px 16px;
        }
        /* esconder o menu principal no mobile e usar o collapse */
        .nav-menu {
            display: none !important;
        }
        .collapse-toggle {
            display: inline-block;
            width: 36px;
            height: 28px;
            position: relative;
            background: none;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 6px;
            cursor: pointer;
            margin-left: auto;
            padding: 4px;
        }
        .collapse-toggle::before,
        .collapse-toggle::after {
            content: '';
            display: block;
            height: 3px;
            background: var(--primary-color);
            border-radius: 2px;
            position: absolute;
            left: 8px;
            right: 8px;
        }
        .collapse-toggle::before { top: 8px; box-shadow: 0 8px 0 0 var(--primary-color); }
        .collapse-toggle::after { bottom: 8px; }

        .collapse-menu {
            display: none;
            position: absolute;
            top: 58px;
            right: 16px;
            background: rgba(255,255,255,0.98);
            border: 1px solid rgba(0,0,0,0.06);
            border-radius: 10px;
            padding: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            min-width: 180px;
            z-index: 2000;
        }
        .collapse-menu.open {
            display: block;
        }
        .collapse-menu ul { list-style: none; margin: 0; padding: 0; }
        .collapse-menu li { padding: 6px 0; }
        .collapse-menu a { color: var(--primary-color); text-decoration: none; }
    }
`;

const BASE_SCRIPTS = `
    (function(){
        try { console.log('BASE_SCRIPTS loaded'); } catch(e){}
        function doToggle(menu){ if(!menu) return; menu.classList.toggle('open'); }
            document.addEventListener('DOMContentLoaded', function(){
                document.querySelectorAll('.hamburger-btn').forEach(function(btn){
                    btn.addEventListener('click', function(e){ e.preventDefault(); var container = btn.closest('.nav-container'); var menu = container ? (container.querySelector('#nav-menu') || container.querySelector('.nav-menu')) : document.getElementById('nav-menu'); doToggle(menu); });
                    btn.addEventListener('touchstart', function(e){ e.preventDefault(); btn.click(); }, { passive: false });
                });

                // collapse-toggle (menu no canto superior direito)
                document.querySelectorAll('.collapse-toggle').forEach(function(btn){
                    btn.addEventListener('click', function(e){
                        e.preventDefault();
                        var container = btn.closest('.nav-container');
                        var menu = container ? container.querySelector('.collapse-menu') : document.querySelector('.collapse-menu');
                        if(!menu) return;
                        menu.classList.toggle('open');
                        var expanded = menu.classList.contains('open');
                        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                        menu.setAttribute('aria-hidden', expanded ? 'false' : 'true');
                    });
                });

                // clique fora fecha o collapse
                document.addEventListener('click', function(e){
                    if (!e.target.closest('.nav-container')){
                        document.querySelectorAll('.collapse-menu.open').forEach(function(m){ m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); });
                        document.querySelectorAll('.collapse-toggle[aria-expanded="true"]').forEach(function(b){ b.setAttribute('aria-expanded','false'); });
                    }
                });
            });
    })();
`;

module.exports = {
    NAV_SECTIONS,
    ORACOES_EUCARISTICAS,
    RITOS_INICIAIS,
    ORDINARIO_COMUNHAO,
    PORTUGUESE_KEYWORDS,
    BASE_STYLES,
    BASE_SCRIPTS
};
