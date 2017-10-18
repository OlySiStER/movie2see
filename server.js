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
    req.session.homepage = true;
    res.render('index.hbs', {
        ss_homepage: req.session.homepage,
        login: req.session.alertLogin,
        uname: req.session.uname
    });
    req.session.homepage = false;
});

app.get('/login', (req, res) => {
    res.render('login.hbs', {
        regisComplete: req.session.regisComplete
    });
    req.session.regisComplete = null;
});

app.post('/checklogin', (req, res) => {
    req.session.uname = req.body.uname;
    req.session.alertLogin = true;
    res.redirect('/');
});

app.post('/checkloginfacebook', (req, res) => {
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
    req.session.thaimovie = true;
    req.session.othermovie = false;
    req.session.cartoon = false;
    res.render('thaimovie.hbs', {
        ss_thaimovie: req.session.thaimovie,
        ss_othermovie: req.session.othermovie,
        ss_cartoon: req.session.cartoon,
        login: req.session.alertLogin,
        uname: req.session.uname
    });
});

app.get('/othermovie', (req, res) => {
    req.session.thaimovie = false;
    req.session.othermovie = true;
    req.session.cartoon = false;
    res.render('othermovie.hbs', {
        ss_thaimovie: req.session.thaimovie,
        ss_othermovie: req.session.othermovie,
        ss_cartoon: req.session.cartoon,
        login: req.session.alertLogin,
        uname: req.session.uname
    });
});

app.get('/cartoon', (req, res) => {
    req.session.thaimovie = false;
    req.session.othermovie = false;
    req.session.cartoon = true;
    res.render('cartoon.hbs', {
        ss_thaimovie: req.session.thaimovie,
        ss_othermovie: req.session.othermovie,
        ss_cartoon: req.session.cartoon,
        login: req.session.alertLogin,
        uname: req.session.uname
    });
});

app.get('/bladerunner', (req, res) => {
    res.render('bladerunner.hbs', {
        login: req.session.alertLogin,
        uname: req.session.uname
    });
});

app.listen(3001, () => {
    console.log('Server is up on port 3001');
});