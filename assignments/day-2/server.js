const path = './sandwich';
let TicTacToeGame = require('./tic-tac-toe-game');
let fs = require('fs');
let BBPromise = require('bluebird');
let readdir = BBPromise.promisify(fs.readdir);
let readFile = BBPromise.promisify(fs.readFile);

readdir(path)
	.map(file => readFile(`${path}/${file}`, "utf-8"))
	.map(gameJson => TicTacToeGame.fromJson(gameJson))
	.then(game => console.log(game))
	.catch(err => console.log(err));