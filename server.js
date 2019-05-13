const EXPRESS = require('express');
const HTTP = require('http');
const PATH = require('path');
const APP = EXPRESS();

let server = HTTP.createServer(APP);
let port = process.env.PORT | 8080;
APP.listen(port);

APP.set('views', __dirname + '/views');
APP.engine('html', require('ejs').__express);
APP.set('view engine', 'html');

APP.use(EXPRESS.static(PATH.join(__dirname, '/public')));

APP.get('/', function(req, res) {
    res.render('index');
});

console.log(`Server initialised on https://localhost:${port}`);