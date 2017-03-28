const path = './sandwich';
let TicTacToeGame = require('./tic-tac-toe-game');
let fs = require('fs');
let BBPromise = require('bluebird');
let readdir = BBPromise.promisify(fs.readdir);
let readFile = BBPromise.promisify(fs.readFile);

let promise = readdir(path)
	.map(file => readFile(`${path}/${file}`, "utf-8"))
	.then(list => console.log(list))
	.catch(err => console.log(err));