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
    request({
        url: 'http://localhost:3000/movie',
        json: true
    }, (error, response, body) => {
        res.render('index.hbs', {
            datas: body,
            ss_homepage: req.session.homepage,
            login: req.session.alertLogin,
            uname: req.session.uname
        });

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

// app.get('/bladerunner', (req, res) => {
//     res.render('bladerunner.hbs', {
//         login: req.session.alertLogin,
//         uname: req.session.uname
//     });
// });

app.get('/seemovie/:id', (req, res) => {
    request({
        url: 'http://localhost:3000/movie/'+req.params.id,
        json: true
    }, (error, response, body) => {
        res.render('seemovie.hbs',{
            informationmovie: body
        });
        // res.render('showinformationmovie.hbs', {
        //     datas: body
        // });
    });
});

//--------------------------- Admin -----------------------------------------------------------------
app.get('/addmovie', (req, res) => {
    // console.log(req.session.addmoviecomplete);
    res.render('addmovie.hbs', {
        addmoviecomplete: req.session.addmoviecomplete
    });
    req.session.addmoviecomplete = false;
});

app.post('/addmovietodb', (req, res) => {
    var d = new Date();
    var m = d.getMinutes();
    if(m<10) m = "0"+m;
    var s = d.getSeconds();
    if(s<10) s = "0"+s;
    var dateTime = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + m + ":" + s;
    // console.log(dateTime);
    request.post(
        'http://localhost:3000/movie',
        { json: { 
            id: null,
            title: req.body.title,
            img: req.body.image,
            year: req.body.year,
            type: req.body.type,
            trailer: req.body.trailer,
            movieLink: req.body.movieLink,
            createMovieDate: dateTime,
            lastEdit: dateTime
        } },
        function (error, response, body) {
            // console.log(response.statusCode);
            if (response.statusCode == "201") {
                req.session.addmoviecomplete = true;
                res.redirect('/addmovie');
            }
        }
    );
    // res.redirect('/addmovie');
});

app.get('/getinformation/:id', (req, res) => {
    request({
        url: 'http://localhost:3000/movie/'+req.params.id,
        json: true
    }, (error, response, body) => {
        res.render('showinformationmovie.hbs',{
            informationmovie: body
        });
        // res.render('showinformationmovie.hbs', {
        //     datas: body
        // });
    });
});

app.get('/editmovieform/:id', (req, res) => {
    req.session.thaimovie = false;
    req.session.othermovie = false;
    req.session.cartoon = false;
    request({
        url: 'http://localhost:3000/movie/'+req.params.id,
        json: true
    }, (error, response, body) => {
        // console.log(body.type);
        if (body.type == "thaimovie"){
            req.session.thaimovie = true
        }else if (body.type == "othermovie"){
            req.session.othermovie = true
        }else if (body.type == "cartoon"){
            req.session.cartoon = true
        }
        res.render('editmovieform.hbs',{
            informationmovie: body,
            ss_type_thaimovie: req.session.thaimovie,
            ss_type_othermovie: req.session.othermovie,
            ss_type_cartoon: req.session.cartoon
        });
    });
});

app.post('/editmovie/:id', (req, res) => {
    // console.log(req.body.createMovieDate);
    var d = new Date();
    var m = d.getMinutes();
    if(m<10) m = "0"+m;
    var s = d.getSeconds();
    if(s<10) s = "0"+s;
    var dateTime = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + m + ":" + s;
    // console.log(dateTime);
    request.put(
        'http://localhost:3000/movie/'+req.params.id,
        { json: { 
            
            title: req.body.title,
            img: req.body.image,
            year: req.body.year,
            type: req.body.type,
            trailer: req.body.trailer,
            movieLink: req.body.movieLink,
            createMovieDate: req.body.createMovieDate,
            lastEdit: dateTime,
            id: req.body.id
        } },
        function (error, response, body) {
            // console.log(response.statusCode);
            if (response.statusCode == "200") {
                // req.session.addmoviecomplete = true;
                res.redirect('/showlistmovie');
            }
        }
    );
});

app.get('/delete/:id', (req, res) => {
    // console.log("ok");
    request.delete(
        'http://localhost:3000/movie/'+req.params.id,
        
        function (error, response, body) {
            // console.log(response.statusCode);
            res.redirect('/showlistmovie');
        }
    );
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

app.get('/getDateTime', (req, res) => {
    var d = new Date();
    var m = d.getMinutes();
    if(m<10) m = "0"+m;
    var s = d.getSeconds();
    if(s<10) s = "0"+s;
    var dateTime = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + m + ":" + s;
    console.log(dateTime);
});

app.listen(3001, () => {
    console.log('Server is up on port 3001');
});