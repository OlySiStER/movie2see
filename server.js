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
    res.render('index.hbs', {
        login : req.session.alertLogin,
        uname :  req.session.uname
    });
});

app.get('/login', (req, res) => {
    res.render('login.hbs', {
        regisComplete : req.session.regisComplete
    });
    req.session.regisComplete = null;
});

app.post('/checklogin', (req, res) => {
    req.session.uname = req.body.uname;
    req.session.alertLogin = true;
    res.redirect('/');
});

app.get('/signup', (req, res) => {
    res.render('signup.hbs');
});

app.post('/registoDB', (req, res) => {
    req.session.regisComplete = true;
    res.redirect('login');
});

app.get('/logout', (req, res) => {
    req.session.alertLogin = false;
    res.render('index.hbs');
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