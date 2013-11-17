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
		API.sendChat('Bugged out GameBot version ' + this.version + ' online');
		Api.sendChat('FIRST QUESTION AFTER THIS SONG');
		console.log('GameBot ' + this.version + ' online');

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
		// "[Music] ",
                    // "[Gaming] [LoL] ",
                    // "[Gaming] [Minecraft] ",
                    // "[Gaming] [Skyrim] ",
                    // "[Gaming] [Pokemon] ",
                    //"/me [Gaming] [Pokemon] What is the name of the first Pokemon game ever released?",
					"I have a random number between 1 and 10, guess it ;)"                   
                    "Who created me?",
                    
                    "[Gaming] [Pokemon] What is the name of the first Pokemongame ever made?",

                    // "[plug.dj] When did plug.dj go public?",
                    "[plug.dj] What is the maximum of songs you can have in a playlist?",
                    
	],
	answers: [`
					"7",
					["kristof", "Kristof with a K"],
				 // "[Gaming] [Pokemon] ",
				    ["Pokemon Red", "red", "pokemon red"],
				 //[plug.dj]			
                  	["200", "200 songs", "200 tracks"],
                  	
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
					this.playerCoins.push('5')
					API.sendChat('@' + data.from + ' you gave the correct answer! you gained 1 points, for a total of : 1 point')
				} else {
					//existing user
					var user = this.playerNames.indexOf(data.fromID)
					var coins = parseInt(this.playerCoins[user]) + 5
					var points = parseInt(this.playerPoints[user]) + 5
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
