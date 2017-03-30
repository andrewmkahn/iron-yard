const path = './saves';
let TicTacToeGame = require('./src/tic-tac-toe-game');
let fs = require('fs');
let BBPromise = require('bluebird');
let readdir = BBPromise.promisify(fs.readdir);
let readFile = BBPromise.promisify(fs.readFile);
let rmFile = BBPromise.promisify(fs.unlink);
let expressFactoryFunction = require('express');
let nunjucks = require('nunjucks');
let bodyParser = require('body-parser');
let running = false;

let app = expressFactoryFunction();
nunjucks.configure('templates', {
	autoescape: true,
	watch: true,
	express: app
});

app.use(function (req, res, next) {
	console.log('a request went by', req.path);
	next(); // go to the next middleware
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (err, req, res, next) {
	console.error('something bad happened', req.path, err);
	next(err);
});

app.post('/games/:gameIndex', (req, res) => {
	let { row, col } = req.body;
	let gameIndex = req.params.gameIndex;
	tempGames[gameIndex]
		.play(Number.parseInt(row), Number.parseInt(col));
	res.redirect(`/games/${gameIndex}`);
});

app.post('/games/:gameIndex/delete', (req, res) => {
	let gameIndex = req.params.gameIndex;
	let gameJson = JSON.parse(globalGames[gameIndex].toJson());
	rmFile(`${path}/${gameJson.created}.json`)
		.then(populateGlobalGameList)
		.then(() => res.redirect('/home'))
		.catch(console.log);
});

app.get('/games/:gameIndex', function (req, res) {
	let gameIndex = req.params.gameIndex;
	if (Number.isNaN(gameIndex) || !tempGames[gameIndex]) {
		return res.redirect('/home');
	}
	res.render('game.html', {
		gameIndex: gameIndex,
		game_data: JSON.parse(tempGames[gameIndex].toJson())
	});
});

app.get('/returnToSavedGames', function (req, res) {
	populateTempGameList();
	return res.redirect('/home');	
});

app.get('/makeNewGame', function (req, res) {
	let humanFirst = Math.random() > 0.5;
	let game = new TicTacToeGame({ humanFirst: humanFirst });
	tempGames.push(game);
	return res.redirect(`games/${tempGames.length - 1}`);
});

app.get('/games/:gameIndex/saveGame', function (req, res) {
	let gameIndex = req.params.gameIndex;
	let game = gameIndex >= globalGames.length ? tempGames[gameIndex] : globalGames[gameIndex];
	game.save()
		.then(populateGlobalGameList)
		.then(() => res.redirect(`/games/${gameIndex}`))
		.catch(console.log);
});

app.get('/home', function (req, res) {
	res.render('index.html', {
		message: 'Example',
		games: globalGames
	});
});

let globalGames = [];
let tempGames = [];

init(true);

function init(startServer) {
	populateGlobalGameList()
		.then(populateTempGameList)
		.then(()=>{
			if (startServer) {
				let port = process.env.PORT || 8080; // look for port, default to 8080
				app.listen(port, () => console.log('Listening to port 8080'));
			}
		});
}

function populateGlobalGameList() {
	return getFiles()
		.map(gameJson => TicTacToeGame.fromJson(gameJson))
		.then(gameList => {
			globalGames = gameList;
		})
		.catch(err => console.log(err));
}

function populateTempGameList() {
	return getFiles()
		.map(gameJson => TicTacToeGame.fromJson(gameJson))
		.then(gameList => {
			tempGames = gameList;
		})
		.catch(err => console.log(err));
}

function getFiles() {
	return readdir(path)
		.then(fileList => fileList.filter(x => x!='.DS_Store'))
		.map(file => readFile(`${path}/${file}`, "utf-8"));
}