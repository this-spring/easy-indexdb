// var Parser = require('sqlparser');
import Parser from 'sqlparser';
var result = Parser.parse('SELECT * FROM table');
console.log(result);