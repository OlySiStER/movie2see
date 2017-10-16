const express = require('express');
const hbs = require('hbs');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/assets'));
hbs.registerPartials(__dirname + '/views/partials');
var expressSession = require('express-session');
app.use(expressSession({ secret: 'max', saveUninitialized: false, resave: false }));

app.get('/', (req, res) => {
    req.session.alertLogin = false;
    res.render('index.hbs', {
        login : req.session.alertLogin
    });
});

app.get('/thaimovie', (req, res) => {
    res.render('thaimovie.hbs');
});

app.get('/othermovie', (req, res) => {
    res.render('othermovie.hbs');
});

app.get('/cartoon', (req, res) => {
    res.render('cartoon.hbs');
});

app.listen(3001, () => {
    console.log('Server is up on port 3001');
});