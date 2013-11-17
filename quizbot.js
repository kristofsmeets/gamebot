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
		API.sendChat('QuizBot version ' + this.version + ' online')
		API.sendChat('First question after this song')
		console.log('QuizBot ' + this.version + ' online')

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
		console.log('Quizbot version ' + this.version + ' shutting down')

		//save player stats
		localStorage.setItem('playerNames', JSON.stringify(this.playerNames))
		localStorage.setItem('playerCoins', JSON.stringify(this.playerCoins))
		localStorage.setItem('playerTheme', JSON.stringify(this.playerTheme))
		localStorage.setItem('playerPoints', JSON.stringify(this.playerPoints))
	},

	//variables & arrays
	version: '0.0.5',
	playerNames: [],
	playerCoins: [],
	playerTheme: [],
	playerPoints: [],
	answerMode: [],
	questionPicker: [],
	songTimer: ['1','1'],
	questions: [
					//[Music]
					"QUIZ: [Music] What is the name of the producer that got his album into the iTunes top 5 for dance music?",
					"Quiz: [Music] Dj Coones has his own recordlabel, what is the name of this recordlabel?",
					"QUIZ: [Music] Name a hardstyle-dj starting with the letter 'Z'",
					"QUIZ: [Music] What is the name of the biggest Belgian festival?",
                   	//No Category
                    "QUIZ: I have a random number between 1 and 20, guess it ;)",
                    "QUIZ: Who created me?",
                    "QUIZ: Who is the creator of Spiderman, The Incredible HUlk, and the rest of Marvel Comics?",
                    "QUIZ: What is the new word invented for a smartphone that is too big to be called a phone, but too small to be a tablet? (phones between 5 and 7 inch screensize)",
                    //[Gaming]
                    "QUIZ: [Gaming][Pokemon] What is the name of the first Pokemongame ever made?",
					"QUIZ: [Gaming] What does 'LoL' stand for? (game)",
					"QUIZ: [Gaming] What is the name of the newest Call of Duty game?",
					"QUIZ: [Gaming] What is the name of the company that created games as 'Dota 2', 'Half-life', 'Counterstrike', 'portal',...?", 
                    //[plug.dj]
                    "[plug.dj] What is the maximum of songs you can have in a playlist?",
                    "[plug.dj] How many different avatars are there at the moment to choose from?",
                    "[plug.dj] How many people can there maximum be on the Dj Wait List?",
	],
	answers: [
					//[Music]	
					["Radical Redemption"],
					["Dirty Workz"],
					["Zany", "Zatox"]		
					["Tomorrowland"],		
					//No Category	 
					["11"],	
					["kristof", "Kristof with a K"],
					["Stan Lee"],
					["phablet"],
					//[Gaming]
					["Pokemon Red", "Red", "pokemon red"],
					["league of Legends"],
					["Ghosts", "Call of Duty Ghosts"],
					["Valve", "Valvesoftware"],
					
					//[plug.dj]			
                  	["200", "200 songs", "200 tracks"],
                  	["37", "37 avatars"],
                  	["50", "50 people"],
	],
	themes: [
		" Correct answer! you have been awarded with 1 point, for a total of:  ",
		["Correct answer test", "test", "end of test"]
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
		if (message.indexOf('!!') === 0 && API.hasPermission(data.fromID, API.ROLE.BOUNCER)) {
			switch (message) {
			case '!!help':
				API.sendChat('Give the correct answer to my questions and i will award you with points, maybe you will eventually find yourself on the top of the leaderboard ;)')
				break;
			case '!!leaderboard':
				var link = ''
				API.sendChat('not yet implemented')
				break;
			case '!!shop':
				var link = ''
				API.sendChat('not yet implemented')
				break;
			case '!!save':
				localStorage.setItem('playerNames', JSON.stringify(this.playerNames))
				localStorage.setItem('playerCoins', JSON.stringify(this.playerCoins))
				localStorage.setItem('playerTheme', JSON.stringify(this.playerTheme))
				localStorage.setItem('playerPoints', JSON.stringify(this.playerPoints))
				API.sendChat('QuizBot stats saved.')
				break;
			case '!!facebook':
				API.sendChat('Do you want to submit questions for our QuizBot? Go like our facebookpage and send your question in a private message. http://goo.gl/OnCHez make sure you add the answer too!')
				break;
			case '!!!!reset':
				API.sendChat('Resetting Quizbot, deleting all points earned.')
				window.localStorage.clear()
				break;
			case '!!kill':
				if (API.hasPermission(data.fromID,API.ROLE.BOUNCER) === true || data.fromID === '5105e7a23e083e5100cc1d96' || data.fromID === API.getUser().id) {
					API.sendChat('QuizBot going offline')
					this.close()
				}
				break;
			case '!!reload':
				if (API.hasPermission(data.fromID,API.ROLE.BOUNCER) === true || data.fromID === '5105e7a23e083e5100cc1d96' || data.fromID === API.getUser().id) {
					API.sendChat('Reloading QuizBot...')
					setTimeout(function(){$.getScript('https://raw.github.com/TNBUP/blah/master/automoderator.js')},2000)
					API.sendChat('Gamebot version ' + this.version + ' online')
				}
				break;
			}
			if (message.indexOf('!!points @') === 0) {
				var user = this.getUserID(data.message.substr(8))
				if (user === null) { API.sendChat('User does not exist') }
				else {
					if (this.playerNames.indexOf(user.id) === -1) { API.sendChat('This user did not answer to a question yet') }
					else {
						var nameIndex = this.playerNames.indexOf(user.id)
						API.sendChat(user.username + ' has ' + this.playerPoints[nameIndex] + ' points')
					}
				}
			}
			if (message.indexOf('!!coins @') === 0) {
				var user = this.getUserID(data.message.substr(7))
				if (user === null) { API.sendChat('User does not exist') }
				else {
					if (this.playerNames.indexOf(user.id) === -1) { API.sendChat('This user did not answer to a question yet') }
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
					this.playerPoints.push('1')
					this.playerCoins.push('1')
					API.sendChat('@' + data.from + ' you gave the correct answer! you gained 1 points, for a total of : 1 point')
				} else {
					//existing user
					var user = this.playerNames.indexOf(data.fromID)
					var coins = parseInt(this.playerCoins[user]) + 1
					var points = parseInt(this.playerPoints[user]) + 1
					var theme = this.themes[parseInt(this.playerTheme[user])]
					this.playerCoins[user] = coins.toString()
					this.playerPoints[user] = points.toString()
					var str = '@' + data.from + theme + points + ' points'
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
				setTimeout(function(){API.sendChat('NEXT QUESTION AFTER THIS SONG')},7000)
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
				if (typeof a[w] === 'string') { API.sendChat('I am sad now, nobody answered my question correct :( the correct answer was : ' + a[w] + '. Next question after this song (Better luck this time ;) )') }
				else { API.sendChat('Nobody guessed correctly. The answer was: ' + a[w][0] + '. The next question is after this song.') }
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
				setTimeout(function(){API.sendChat('I think we are out of questions :( cya when i have new questions, bye!')},7000)
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

});
var quizBot = new quizBotModel();
