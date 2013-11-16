if (quizBot !== undefined) quizBot.close()

String.prototype.equalsIgnoreCase = function(other) { return typeof other !== 'string' ? false : this.toLowerCase() === other.toLowerCase(); };
var quizBotModel = require('app/base/Class').extend({
	init: function() {
		//startup stuff
		this.proxy = {
			chat:				$.proxy(this.onChat,			this),
			chatCommand:		$.proxy(this.onChatCommand,		this),
			djAdvance:			$.proxy(this.onDjAdvance,		this),
			userLeave:			$.proxy(this.onUserLeave,		this),
			userJoin:			$.proxy(this.onUserJoin,		this),
		}
		API.on(API.CHAT,				this.proxy.chat);
		API.on(API.CHAT_COMMAND,		this.proxy.chatCommand);
		API.on(API.DJ_ADVANCE,			this.proxy.djAdvance);
		API.on(API.USER_LEAVE,			this.proxy.userLeave);
		API.on(API.USER_JOIN,			this.proxy.userJoin);

		//starup messages
		API.sendChat('Quizbot versão ' + this.version + ' ligado, primeira pergunta na proxima música!')
		console.log('Quizbot ' + this.version + ' esta rodando cara cuidado XP')

		//load player stats
		if (JSON.parse(localStorage.getItem('playerNames')) !== null) {
			this.playerNames = JSON.parse(localStorage.getItem('playerNames'))
			this.playerCoins = JSON.parse(localStorage.getItem('playerCoins'))
			this.playerTheme = JSON.parse(localStorage.getItem('playerTheme'))
			this.playerPoints = JSON.parse(localStorage.getItem('playerPoints'))
		}
		//shuffle questions (and answers)
		var array1 = this.questions, array2 = this.answers
		var m = array1.length, t, i
		while (m) {
			i = Math.floor(Math.random() * m--)
			t = array1[m]
			array1[m] = array1[i]
			array1[i] = t
			t = array2[m]
			array2[m] = array2[i]
			array2[i] = t
		}
		this.questions = array1, this.answers = array2
	},

	close: function() {
		//shutdown stuff
		API.off(API.CHAT,				this.proxy.chat);
		API.off(API.CHAT_COMMAND,		this.proxy.chatCommand);
		API.off(API.DJ_ADVANCE,			this.proxy.djAdvance);
		API.off(API.USER_LEAVE,			this.proxy.userLeave);
		API.off(API.USER_JOIN,			this.proxy.userJoin);

		//shutdown message
		console.log('Quizbot versão ' + this.version + ' desligado')

		//save player stats
		localStorage.setItem('playerNames', JSON.stringify(this.playerNames))
		localStorage.setItem('playerCoins', JSON.stringify(this.playerCoins))
		localStorage.setItem('playerTheme', JSON.stringify(this.playerTheme))
		localStorage.setItem('playerPoints', JSON.stringify(this.playerPoints))
	},

	//variables & arrays
	version: '0.1.3',
	playerNames: [],
	playerCoins: [],
	playerTheme: [],
	playerPoints: [],
	answerMode: [],
	questionPicker: [],
	songTimer: ['1','1'],
	questions: [
		"[Musica] Qual o artista mais com mais views no youtube ?",
		"[Musica] Nome do artista de Glitch Hop que teve o seu primeiro som com o novo layout da network Monstercat.",
		"[Musica] O que significa EDM ?",
		"[Musica] \"Ain't No Party Like A _____ _____\"",
		"[Musica] Quem foi o DJ #1 em 2012 de acordo com DJMAG?",
		"[Musica] How many songs are on the Monstercat Launch Week Album?",
		"[Gaming] [LoL] Quem foi o campeão da 1 temporada de jogos.",
		"[Gaming] [LoL] Quem foi o campeão da 2 temporada de jogos.",
		"[Gaming] [LoL] Preço do The Brutalizer.",
		"[Gaming] [LoL] Preço do Infinity Edge.",
		"[Gaming] [LoL] Quantos minutos demora para o dragão respawnar ?",
		"[Gaming] [LoL] Who was the 100th released champion?",
		"[Gaming] [LoL] Champion with the ability called \"Heartseeker Strikes.\"",
		"[Gaming] [LoL] Who is the strongest Monster in the Twisted Treeline?",
		"[Gaming] [LoL] What weapon does Jax use?",
		"[Gaming] [LoL] How many minutes does \"Exalted with Baron Nashor\" last?",
		"[Gaming] [Minecraft] Diamonds start appearing at what y-level?",
		"[Gaming] [Minecraft] How many diferent trees are there?",
		"[Gaming] [Minecraft] How many items can you cook with one piece of coal?",
		"[Gaming] [Minecraft] How many items can you cook with one coal block?",
		"[Gaming] [Minecraft] What is the normal drop rate of a Wither Skull from a Wither Skeleton?",
		"[Gaming] [Minecraft] How many uses does a Golden Pickaxe have?",
		"[Gaming] [Minecraft] How many logs do you need to create 75 sticks?",
		"[Gaming] [Skyrim] The name of Markarth's hold.",
		"[Gaming] [Skyrim] What Smithing level is required for the Orchish Smithing perk?",
		"[Gaming] [Skyrim] The name of the housecarl appointed to you in Whiterun.",
		"[Gaming] [Skyrim] \"Aww, let me guess: someone stole your _______ ?\"",
		"[Gaming] [Skyrim] How many skills are present in Skyrim?",
		"[Gaming] [Skyrim] How many houses can you buy in total (excluding DLC)?",
		"[Gaming] [Skyrim] What material is the strongest for Heavy Armor?",
		"[Gaming] [PokÃ©mon] Name of the PokÃ©mon Professor in Ruby/Sapphire/Emerald.",
		"[Gaming] [PokÃ©mon] Seviper's mortal enemy.",
		"[Gaming] [PokÃ©mon] Number 150 on the PokÃ©dex.",
		"[Gaming] [PokÃ©mon] How many PokÃ©mon exist, up to generation 5?",
		"[Gaming] [PokÃ©mon] Trade a Spearow for this PokÃ©mon in Vermillion City.",
		"[Gaming] [PokÃ©mon] Unova's map is based on which real life city?",
		"[Gaming] [PokÃ©mon] What do you give to the gate guards that block the way to Saffron City? (gen 3)",
		"[plug.dj] What is Super's favorite genre?",
		"[plug.dj] Qual o nome do dono e criador do plug.dj.",
		"[plug.dj] Who created me?",
		"[plug.dj] Who is the head of the BA Program?",
		"[plug.dj] When did plug.dj go public?",
		"[plug.dj] How many Brand Ambassadors are there?",
		"[plug.dj] What is the best Plug.DJ Addon?",
		"[plug.dj] How many avatars are available in total, excluding Halloween and custom skins?",
		"[plug.dj] What is the maximum number of songs you can have in a playlist?",
	],
	answers: [
		//[Music]
		"pegboard nerds",
		"twothirds",
		"electronic dance music",
		"muzzy party",
		"armin van buuren",
		["7", "7 songs", "seven", "seven songs"],
		//[Gaming] [LoL]
		"fnatic",
		["tpa", "taipei assassins"],
		["1337", "1337 gold", "1337g", "1337 g"],
		["3800", "3800 gold", "1337g", "1337 g"],
		["6", "six"],
		"jayce",
		"pantheon",
		"vilemaw",
		["lamppost", "lamp post"],
		["4", "4 minutes"],
		//[Gaming] [Minecraft]
		"16",
		["4", "four"],
		["8", "eight", "8 items", "eight items"],
		["80", "80 items"],
		["2.5%", "1/40", "0.025", "2.5"],
		["33", "33 uses"],
		["10", "ten"],
		//[Gaming] [Skyrim]
		"the reach",
		["50", "fifty"],
		"lydia",
		"sweetroll",
		["18", "18 skills"],
		["5", "five"],
		["daedric", "daedric armor"],
		//[Gaming] [Pokemon]
		["birch", "professor birch", "prof birch", "prof. birch"],
		"zangoose",
		"mewtwo",
		["649", "649 pokemon"],
		'farfetch\'d',
		["new york", "new york city"],
		["tea", "hot tea"],
		//[plug.dj]
		"glitchhop",
		"steven",
		"fungus and super",
		"sachi",
		["february 29, 2012", "feb 29 2012", "02/29/12", "february 29 2012", "february 29th, 2012", "29/02/12", "february 29th 2012", "29.2.12", "29.02.12", "02.29.12", "2.29.12"],
		"21",
		["plugcubed"],
		["48", "48 avatars"],
		["200", "200 songs"],
	],
	themes: [
		" RESPOSTA CORRETA XD, Você ganhou 5 QuizCoins e pontos, total de: ",
		["resposta de teste correta", " esta quebrando o concerto! Bem-vindo novamente!", "teste acabou"]
	],

	//get user object function
	getUserID: function(data) {
    	data = data.trim();
		if (data.substr(0,1) === '@') { data = data.substr(1) }
		var users = API.getUsers();
		for (var i in users) {
			if (users[i].username.equalsIgnoreCase(data) || users[i].id.equalsIgnoreCase(data)) return users[i];
		}
		return null;
	},

	onChat: function(data) {
		var message = data.message.toLowerCase()

		//bouncer ~commands
		if (message.indexOf('~') === 0 && API.hasPermission(data.fromID, API.ROLE.BOUNCER)) {
			switch (message) {
			case '~quizhelp':
				API.sendChat('Quizbot é um bot que tem um sistema de perguntas, a cada pergunta a primeira pessoa que responder corretamente a pergunta ganha 5 pontos e 5 Quizcoins!')
				break;
			case '~leaderboard':
				var link = ''
				API.sendChat('Breve...')
				break;
			case '~shop':
				var link = ''
				API.sendChat('Breve...')
				break;
			case '@save':
				localStorage.setItem('playerNames', JSON.stringify(this.playerNames))
				localStorage.setItem('playerCoins', JSON.stringify(this.playerCoins))
				localStorage.setItem('playerTheme', JSON.stringify(this.playerTheme))
				localStorage.setItem('playerPoints', JSON.stringify(this.playerPoints))
				API.sendChat('Stats saved.')
				break;
			case '~quizkill':
				if (API.hasPermission(data.fromID,API.ROLE.MANAGER) === true || data.fromID === '5105e7a23e083e5100cc1d96' || data.fromID === API.getUser().id) {
					API.sendChat('Quizbot tem que sair, eu voltarei em breve ;)')
					this.close()
				}
				break;
			case '!quizreload':
				if (API.hasPermission(data.fromID,API.ROLE.MANAGER) === true || data.fromID === '5105e7a23e083e5100cc1d96' || data.fromID === API.getUser().id) {
					API.sendChat('Recarregando...')
					setTimeout(function(){$.getScript('https://raw.github.com/TNBUP/blah/master/automoderator.js')},2000)
				}
				break;
			}
			if (message.indexOf('!points @') === 0) {
				var user = this.getUserID(data.message.substr(8))
				if (user === null) { API.sendChat('Usuario não encontrado!') }
				else {
					if (this.playerNames.indexOf(user.id) === -1) { API.sendChat('Esse usuario não respondeu nenhuma pergunta, ainda.') }
					else {
						var nameIndex = this.playerNames.indexOf(user.id)
						API.sendChat(user.username + ' tem ' + this.playerPoints[nameIndex] + ' pontos')
					}
				}
			}
			if (message.indexOf('~coins @') === 0) {
				var user = this.getUserID(data.message.substr(7))
				if (user === null) { API.sendChat('Usuario não encontrado!') }
				else {
					if (this.playerNames.indexOf(user.id) === -1) { API.sendChat('Este usuário não respondeu nenhuma questão.') }
					else {
						var nameIndex = this.playerNames.indexOf(user.id)
						API.sendChat(user.username + ' has ' + this.playerCoins[nameIndex] + ' coins.')
					}
				}
			}
		}

		//answering questions stuff
		if (this.answerMode.length === 1 && data.fromID !== API.getUser().id) {
			var answerCorrect = false
			if (typeof this.answers[this.questionPicker.length] === 'string') {
				if (message === this.answers[this.questionPicker.length]) { var answerCorrect = true } 
			} else {
				var multiAnswerCheck = false
				for (i in this.answers[this.questionPicker.length]) {
					if (message === this.answers[this.questionPicker.length][i]) {
						multiAnswerCheck = true
						break;
					}
				}
				if (multiAnswerCheck === true) { var answerCorrect = true }
			}
			if (answerCorrect === true) {
				this.answerMode.length = 0
				this.questionPicker.push('1')
				//check if user is in the database
				if (this.playerNames.indexOf(data.fromID) === -1) {
					//new user stuff
					this.playerNames.push(data.fromID)
					this.playerTheme.push('0')
					this.playerPoints.push('5')
					this.playerCoins.push('5')
					API.sendChat('@' + data.from + ' resposta correta! Ganhou 5 QuizCoins, um total de: 5 QC, 5 pts')
				} else {
					//existing user
					var user = this.playerNames.indexOf(data.fromID)
					var coins = parseInt(this.playerCoins[user]) + 5
					var points = parseInt(this.playerPoints[user]) + 5
					var theme = this.themes[parseInt(this.playerTheme[user])]
					this.playerCoins[user] = coins.toString()
					this.playerPoints[user] = points.toString()
					var str = '@' + data.from + theme + coins + ' QC, ' + points + ' pts'
					API.sendChat(str)
				}
			}
		}
	},

	onDjAdvance: function(obj) {
		//timer
		this.songTimer.push('1')
		var timer = this.songTimer.length, w = this.questionPicker.length

		switch(timer) {
		case 1:
			if (this.answerMode.length === 0) { 
				setTimeout(function(){API.sendChat('Proxima pergunta após essa música.')},7000)
				this.songTimer.push('1')
				localStorage.setItem('playerNames', JSON.stringify(this.playerNames))
				localStorage.setItem('playerCoins', JSON.stringify(this.playerCoins))
				localStorage.setItem('playerTheme', JSON.stringify(this.playerTheme))
				localStorage.setItem('playerPoints', JSON.stringify(this.playerPoints))
			}
			break;
		case 2:
			//if nobody answered within 2 songs, give answer and turn off answer mode
			if (this.answerMode.length === 1) {
				var a = this.answers
				this.answerMode.length = 0
				this.questionPicker.push('1')
				if (typeof a[w] === 'string') { API.sendChat('Drat! Ninguém acertou corretamente. A resposta era: ' + a[w] + '. A proxima pergunta será após essa música.') }
				else { API.sendChat('Drat! Nobody guessed correctly. The answer was: ' + a[w][0] + '. The next question is after this song.') }
			} else { setTimeout(function(){API.sendChat('The next question is after this song.')},7000) }
			//save stuff
			localStorage.setItem('playerNames', JSON.stringify(this.playerNames))
			localStorage.setItem('playerCoins', JSON.stringify(this.playerCoins))
			localStorage.setItem('playerTheme', JSON.stringify(this.playerTheme))
			localStorage.setItem('playerPoints', JSON.stringify(this.playerPoints))
			break;
		case 3:
			//check if there are questions left
			if (w === this.questions.length) {
				setTimeout(function(){API.sendChat('Whoops! parece que eu pulei uma pergunta :P')},7000)
				this.close()
			} else {
				//send out a new question every 3rd song
				var q = this.questions
				this.songTimer.length = 0
				this.answerMode.push('1')
				setTimeout(function(){API.sendChat(q[w])},7000)
			}
			break;
		}
	},

	onUserJoin: function(user) {
		//send message on user join if has theme
		if (this.playerNames.indexOf(user.id) > -1 && this.playerTheme[this.playerNames.indexOf(user.id)] !== '0') {
			var user = this.playerNames.indexOf(user.id)
			var userTheme = parseInt(this.playerTheme[user])
			var userJoinTheme = this.themes[userTheme][1]
			API.sendChat('@' + user.username + userJoinTheme)
		}
	},

	onUserLeave: function(user) {
		//send message on user leave if has theme
		if (this.playerNames.indexOf(user.id) > -1 && this.playerTheme[this.playerNames.indexOf(user.id)] !== '0') {
			var user = this.playerNames.indexOf(user.id)
			var userTheme = parseInt(this.playerTheme[user])
			var userLeaveTheme = this.themes[userTheme][2]
			API.sendChat('@' + user.username + userLeaveTheme)
		}
	},
});
var quizBot = new quizBotModel();
