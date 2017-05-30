/**
 * Module dependencies.
 */
var express = require('express');
/**var routes = require('./routes');**/
var http = require('http');
var path = require('path');
var formidable = require('formidable');

var credentials = require('./credentials.js');
global.emailService = require('./lib/email.js')(credentials);
//global.funtzioak = require('./lib/funtzioak.js');

//load customers route
var taldeak = require('./routes/taldeak'); 
var txapelketak = require('./routes/txapelketak');
var jokalariak = require('./routes/jokalariak');
var kudeaketa = require('./routes/kudeaketa');
var app = express();
var connection  = require('express-myconnection'); 
var mysql = require('mysql');

//var passport= require('./config/passport')(passport);

// all environments
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    layoutsDir: "app/views/layouts/",
    partialsDir: "app/views/partials/",
    //extname: '.hbs',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        static: function(name) {
            return require('./lib/static.js').map(name);
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(require('body-parser')); DEPRECATED
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(require('express-session')()); DEPRECATED
//app.use(require('cookie-parser')(credentials.cookieSecret)); DEPRECATED
var session = require('express-session');
app.use(session({
  secret: credentials.cookieSecret,
  resave: false,
  saveUninitialized: true
}));
// development only
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}*/
/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
console.log("environment " + process.env.NODE_ENV);
//if ('development' == app.get('env')) {
if (process.env.NODE_ENV != 'production'){
  app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : 'joanaagi',
        port : 3306, //port mysql
        //database:'txaparrotan'
        database:'heroku_4efa3ee4ff6c16c'
    },'request')
 );
              console.log("localhost1" );
}
else{
  app.use(
    
    connection(mysql,{
        
        host: 'us-cdbr-iron-east-02.cleardb.net',
        user: 'b52372483fde60',
        password : '4d96016a',
      //  port : 3306, //port mysql
        database:'heroku_4efa3ee4ff6c16c'
    },'request')
 );
              console.log("heroku1" );
}
  

// flash message middleware
app.use(function(req, res, next){
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

// set 'showTests' context property if the querystring contains test=1
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && 
        req.query.test === '1';
    next();
});

/*app.use(function(req, res, next){
    res.locals.idtalde = req.session.idtalde;
    //delete req.session.idtalde;
    next();
}); */

// middleware to handle logo image easter eggs
var static = require('./lib/static.js').map;
app.use(function(req, res, next){
    //var now = new Date();
   // res.locals.logoImage = now.getMonth()==11 && now.getDate()==19 ?
   // static('/img/txaparrotan.jpg') :
  //  static('/img/txaparrotan.png');
  res.locals.logoImage = static('/img/txaparrotanlogo.jpg');
   //  :
  //  static('/img/txaparrotan.png');
    next();
});

function authorize(req, res, next){
    if(req.session.idtalde) return next();
    res.redirect('/login');
}

function authorize2(req, res, next){
    if(req.session.idtxapelketa) return next();
    res.redirect('/txapelketak');
}

function adminonartua(req, res, next){
    if(req.session.erabiltzaile == "admin") return next();
    res.redirect('/login');
}
function admintxapelketaonartua(req, res, next){
    if(req.session.erabiltzaile == "admin@txapelketak.eus") return next();
    res.redirect('/login');
}


//Rutas
/*app.get('/', function(req, res){
    res.render('index.handlebars', {title : 'Txaparrotan'});
});*/
app.get('/', authorize2, txapelketak.berriakikusi);
app.get('/taldeak', taldeak.ikusi);
app.get('/izenematea', authorize2, taldeak.izenematea);
app.post('/taldeasortu', authorize2, taldeak.sortu); 
app.get('/taldeabalidatu/:id', taldeak.balidatu);
app.get('/taldeaeditatu', authorize2, authorize, taldeak.editatu);
app.post('/taldeaaldatu', taldeak.aldatu);
app.get('/taldemail/:emaila', taldeak.taldemail);
app.get('/jokalariak', authorize, taldeak.bilatu);
app.post('/jokalariasortu', jokalariak.sortu);
app.post('/jokalariagehitu', function(req, res){
    res.render('jokalariaksortu.handlebars', {title : 'Txaparrotan-Jokalaria gehitu', taldeizena: req.session.taldeizena});
});
app.get('/jokalariakezabatu/:idjokalari', authorize, jokalariak.ezabatu);
app.get('/jokalariakeditatu/:idjokalari', authorize, jokalariak.editatu);
app.post('/jokalariakaldatu/:idjokalari', authorize, jokalariak.aldatu);

app.get('/login', authorize2, function(req, res){
    res.render('login.handlebars', {title : 'Txaparrotan-Login',taldeizena: req.session.taldeizena});
});
//app.get('/login', authorize2, taldeak.saioahasteko);
app.post('/login', taldeak.login);
app.get('/logout', function(req, res){
  console.log('Serving request for url [GET] ' + req.session.idtalde);
  req.session.idtalde = undefined;
  req.session.taldeizena = undefined;
  req.session.erabiltzaile = undefined;
  req.session.idgrupo = undefined;
  res.redirect('/');
});
app.get('/forgot', function(req, res){
    res.render('forgot.handlebars', {title : 'Txaparrotan-Forgot'});
});
app.post('/forgot', taldeak.forgot);
app.get('/reset/:idtalde', function(req, res){
    res.render('reset.handlebars', {title : 'Txaparrotan-Reset', taldeizena: req.session.taldeizena, idtalde: req.params.idtalde});
});
app.post('/reset/:idtalde', taldeak.reset);
app.get('/partiduak', kudeaketa.partiduakikusi);
app.get('/arauak', function(req, res){
    res.render('arauak.handlebars', {title : 'Txaparrotan-Arauak', taldeizena: req.session.taldeizena});
});
app.get('/argazkiak', txapelketak.argazkiakikusi);

app.get('/kontaktua', authorize2, function(req, res){
    res.render('kontaktua.handlebars', {title : 'Txaparrotan-Kontaktua', taldeizena: req.session.taldeizena, aditestua: "Kontaktua"});
});
app.post('/kontaktuabidali',txapelketak.kontaktuabidali); 

app.get('/ordutegia', kudeaketa.ordutegiaikusi);
app.get('/sailkapenak', kudeaketa.sailkapenak);

app.get('/taldesailkapena', authorize, kudeaketa.sailkapenak);
app.get('/taldepartiduak', authorize, kudeaketa.partiduakikusi);
app.get('/taldeordutegia', authorize, kudeaketa.taldeordutegia);

/*app.get('/admin/txapelketak', admintxapelketaonartua, function(req, res){
    res.render('txapelketaksortu.handlebars', {title : 'Txaparrotan-Txapelketak sortu'});
});*/
app.get('/admin/txapelketak', admintxapelketaonartua, txapelketak.sortzeko);
app.post('/txapelketaksortu', admintxapelketaonartua, txapelketak.sortu);
app.post('/txapelketakikusgai', admintxapelketaonartua, txapelketak.ikusgai);
app.post('/txapelketakezabatu', admintxapelketaonartua, txapelketak.ezabatu);
app.get('/txapelketakeditatu', adminonartua,txapelketak.editatu);
app.post('/txapelketakaldatu', adminonartua,txapelketak.aldatu);
/*app.get('/txapelketak', function(req, res){
    res.render('txapelketakaukeratu.handlebars', {title : 'Txaparrotan-Txapelketak aukeratu'});
});*/
app.get('/txapelketak', txapelketak.aukeratzeko);
app.post('/txapelketakaukeratu', txapelketak.aukeratu);
app.get('/admin/argazkiak', adminonartua,function(req, res){
    res.render('argazkiakigo.handlebars', {title : 'Txaparrotan-Argazkiak igo', idtxapelketa: req.session.idtxapelketa, taldeizena: req.session.txapelketaizena});
});    
app.post('/argazkiakigo/:idtxapelketa', adminonartua,txapelketak.argazkiakigo);

app.get('/admin/berriak', adminonartua,function(req, res){
    res.render('berriaksortu.handlebars', {title : 'Txaparrotan-Berriak sortu', taldeizena: req.session.txapelketaizena});
});
app.post('/berriaksortu',adminonartua,txapelketak.berriaksortu); 

/*app.get('/admin/kalkuluak', adminonartua,function(req, res){
    res.render('kalkuluak.handlebars', {title : 'Txaparrotan-Kalkuluak egin', taldeizena: req.session.txapelketaizena, idtxapelketa: req.session.idtxapelketa});
});*/
app.get('/admin/kalkuluak', adminonartua, kudeaketa.kalkuluak);
app.post('/admin/multzoakegin', adminonartua, kudeaketa.multzoakegin);
app.post('/admin/multzoakbete', adminonartua, kudeaketa.multzoakbete);
app.post('/admin/multzoakreset', adminonartua, kudeaketa.multzoakreset);
app.post('/admin/finalakegin', adminonartua, kudeaketa.finalakegin);
app.post('/admin/finalpartiduak', adminonartua, kudeaketa.finalpartiduak);
app.post('/admin/finalordutegia', adminonartua, kudeaketa.finalordutegia);
app.post('/admin/finalakosatu', adminonartua, kudeaketa.finalakosatu);
app.post('/admin/finalakatzera', adminonartua, kudeaketa.finalakatzera);
app.get('/admin/sailkapenak', adminonartua, kudeaketa.sailkapenak);
app.post('/admin/partiduaksortu', adminonartua, kudeaketa.partiduaksortu);
app.get('/admin/partiduak', adminonartua, kudeaketa.partiduakikusi);
app.get('/admin/partiduguztiak', adminonartua, kudeaketa.partiduakikusi);
app.post('/admin/partiduakreset', adminonartua, kudeaketa.partiduakreset);
app.get('/admin/partidua/:partidu', adminonartua, kudeaketa.partiduordua);
app.post('/admin/partiduorduaaldatu/:partidu', adminonartua, kudeaketa.partiduorduaaldatu);
app.post('/admin/kamisetak', adminonartua, kudeaketa.kamisetak);
app.post('/admin/kamisetenorriak', adminonartua, kudeaketa.kamisetenorriak);
app.get('/admin/ordutegia', adminonartua, kudeaketa.ordutegiaikusi);
app.post('/admin/ordutegiasortu', adminonartua, kudeaketa.ordutegiaegin);
app.post('/admin/sariak', adminonartua, kudeaketa.sariak);
app.get('/admin/emaitzak', adminonartua, kudeaketa.emaitzakikusi);
app.get('/admin/emaitzaguztiak', adminonartua, kudeaketa.emaitzakikusi);
app.get('/admin/emaitza/:partidu', adminonartua, kudeaketa.emaitzapartidu);
app.post('/admin/emaitzasartu/:partidu', adminonartua, kudeaketa.emaitzasartu);
app.post('/admin/emaitzenorriak', adminonartua, kudeaketa.emaitzenorriak);
app.get('/admin/taldeakikusi', adminonartua, txapelketak.taldeakikusi);
app.get('/admin/taldea/:talde', adminonartua, kudeaketa.taldeaeditatu);
app.post('/admin/taldeaaldatu/:talde', adminonartua, kudeaketa.taldeaaldatu);
app.get('/admin/taldeaezabatu/:talde', adminonartua, kudeaketa.taldeaezabatu);
app.get('/admin/taldeabalekoa/:talde', adminonartua, kudeaketa.taldeabalekoa);
app.get('/admin/taldekopurua', adminonartua, kudeaketa.taldekopurua);
app.get('/admin/taldekopbalidatugabe', adminonartua, kudeaketa.taldekopbalidatugabe);
app.get('/admin/jokalarikopurua', adminonartua, kudeaketa.jokalarikopurua);
app.get('/admin/jokalariakikusi', adminonartua, txapelketak.jokalariakikusi);
app.get('/admin/mantenimentu', adminonartua, txapelketak.mantenimentu);
app.get('/admin/zelaiak', adminonartua, txapelketak.zelaiakbilatu);
app.post('/admin/zelaiaksortu', adminonartua, txapelketak.zelaiaksortu);
app.post('/admin/zelaiakgehitu', adminonartua, function(req, res){
    res.render('zelaiaksortu.handlebars', {title : 'Txaparrotan-Zelaia gehitu', taldeizena: req.session.taldeizena});
});
app.get('/admin/zelaiakezabatu/:idzelaia', adminonartua, txapelketak.zelaiakezabatu);
app.get('/admin/zelaiakeditatu/:idzelaia', adminonartua, txapelketak.zelaiakeditatu);
app.post('/admin/zelaiakaldatu/:idzelaia', adminonartua, txapelketak.zelaiakaldatu);
app.get('/admin/mailak', adminonartua, txapelketak.mailakbilatu);
app.post('/admin/mailaksortu', adminonartua, txapelketak.mailaksortu);
app.post('/admin/mailakgehitu', adminonartua, function(req, res){
    res.render('mailaksortu.handlebars', {title : 'Txaparrotan-Mailak gehitu', taldeizena: req.session.taldeizena});
});
app.get('/admin/mailakezabatu/:idmaila', adminonartua, txapelketak.mailakezabatu);
app.get('/admin/mailakeditatu/:idmaila', adminonartua, txapelketak.mailakeditatu);
app.post('/admin/mailakaldatu/:idmaila', adminonartua, txapelketak.mailakaldatu);

app.post('/admin/mezuakbidali', adminonartua, txapelketak.mezuakbidali);



var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//if ('development' == app.get('env')) {
if (process.env.NODE_ENV != 'production'){  
var cliente = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : 'joanaagi',
    port : 3306, //port mysql
    database:'txaparrotan'
});
            console.log("localhost2" );
}
else{
  var cliente = mysql.createConnection({
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'b52372483fde60',
    password : '4d96016a',
    //  port : 3306, //port mysql
    database:'heroku_4efa3ee4ff6c16c'
});
              console.log("heroku2" );
}
//2015-03-24
/*cliente.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + cliente.threadId);
});*/
//

//cliente.query("USE txaparrotan");
/*
var io = require('socket.io').listen(server);

io.sockets.on("connection", function(socket) {      
    
    socket.on('taldeak', function(data) {
     var id = data;
     cliente.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta = 1) and emailard = ? ',[id],function(err,rows)     {
        if (err) {cliente.end(); return;}   
                    console.log("taldeak :" + rows);     
        socket.emit("taldeak", rows);
    });
    });
   
});
/*
io.sockets.on("connection", function(socket) { 
        //var id = data.id;

        cliente.query("SELECT idtxapelketa, txapelketaizena FROM txapelketa ", function(err, rows, field) {
            if (err) {cliente.end(); return;}
            console.log("txapelketak :" + rows);
            socket.emit("txapelketak", rows);
        });
    });


io.sockets.on("connection", function(socket) {      
    
    socket.on('zelaiak', function(data) {
     var id = data;
     cliente.query('SELECT idzelaia, zelaiizena FROM zelaia where idtxapelz = ? ',[id],function(err,rows)     {
        if (err) {cliente.end(); return;}        
        socket.emit("zelaiak", rows);
    });
    });
   
});

io.sockets.on("connection", function(socket) {      
    
    socket.on('mailak', function(data) {
     var id = data;
     cliente.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[id],function(err,rows)     {
        if (err) {cliente.end(); return;}
        console.log("Socketmailak" +data+"-"+ rows );        
        socket.emit("mailak", rows);
    });
    });
   
});
*/
/*
io.sockets.on("connection", function(socket) { 
        //var id = data.id;
    
        cliente.query("SELECT idtxapelketa, txapelketaizena FROM txapelketa ", function(err, rows, field) {
            if (err) {cliente.end(); return;}
            console.log("txapelketak :" + rows);
            socket.emit("txapelketak", rows);
        });
        
    socket.on('taldeak', function(data) {
     var id = data;
     cliente.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta = 1) and emailard = ? ',[id],function(err,rows)     {
        if (err) {cliente.end(); return;}   
                    console.log("taldeak :" + rows);     
        socket.emit("taldeak", rows);
     });
    });
    socket.on('zelaiak', function(data) {
     var id = data;
     cliente.query('SELECT idzelaia, zelaiizena FROM zelaia where idtxapelz = ? ',[id],function(err,rows)     {
        if (err) {cliente.end(); return;}        
        socket.emit("zelaiak", rows);
     });
    });
    socket.on('mailak', function(data) {
     var id = data;
     cliente.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[id],function(err,rows)     {
        if (err) {cliente.end(); return;}
        console.log("Socketmailak" +data+"-"+ rows );        
        socket.emit("mailak", rows);
     });
    });
});
*/