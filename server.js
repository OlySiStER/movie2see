const express = require('express');
const hbs = require('hbs');
const request = require('request');
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

//--------------------------- Admin -----------------------------------------------------------------
app.get('/addmovie', (req, res) => {
    console.log(req.session.addmoviecomplete);
    res.render('addmovie.hbs', {
        addmoviecomplete: req.session.addmoviecomplete
    });
    req.session.addmoviecomplete = false;
});

app.post('/addmovietodb', (req, res) => {
    request.post(
        'http://localhost:3000/movie',
        { json: { 
            id: null,
            title: req.body.title,
            img: req.body.image,
            year: req.body.year,
            type: req.body.type,
            createAt: Date()
        } },
        function (error, response, body) {
            console.log(response.statusCode);
            if (response.statusCode == "201") {
                req.session.addmoviecomplete = true;
                res.redirect('/addmovie');
            }
        }
    );

    // res.redirect('/addmovie');
    
});

app.get('/showlistmovie', (req, res) => {
    request({
        url: 'http://localhost:3000/movie',
        json: true
    }, (error, response, body) => {
        res.render('showlistmovie.hbs', {
            datas: body
        });

    });
});


app.listen(3001, () => {
    console.log('Server is up on port 3001');
});