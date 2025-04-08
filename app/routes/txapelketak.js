var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;

 var path = require('path'),
  fs = require('fs'),
  formidable = require('formidable');
  var bcrypt = require('bcrypt-nodejs');

  var md = require('marked');
  
  var credentials = require('../credentials.js');
  var Twitter = require('twit');
  var twitter = new Twitter(credentials.twitter);

/*           
              twitter.get('followers/list', { screen_name: 'txaparrotan' }, function (err, data, response) {
                  if (err) {
                        console.log(err);
                  } else {
                      data.users.forEach(function(user){
                        console.log(user.screen_name);
                      });
                  }
              }); 
*/
// make sure data directory exists
//var dataDir = path.normalize(path.join(__dirname, '..', 'data'));
var dataDir = path.normalize(path.join(__dirname, '../public', 'data'));
//console.log(dataDir);
var argazkiakDir = path.join(dataDir, 'argazkiak');
fs.existsSync(dataDir) || fs.mkdirSync(dataDir); 
fs.existsSync(argazkiakDir) || fs.mkdirSync(argazkiakDir);

exports.aukeratzeko = function(req, res){

//postgres  req.getConnection(function(err,connection){
//postgresConnect  req.connection.connect(function(err,connection){                //postgres
//postgresConnect      if (err)
//postgresConnect              console.log("Error connection : %s ",err );
      //Txapelketa bat pruebetako ixkutatuta idtxapelketa != 42
      //connection.query('SELECT idtxapelketa, txapelketaizena FROM txapelketa where idtxapelketa != 42',function(err,rows)  {
//postgres      connection.query('SELECT idtxapelketa, txapelketaizena FROM txapelketa where txapelketaprest != 9',function(err,rows)  {
      req.connection.query('SELECT idtxapelketa, txapelketaizena FROM txapelketa where txapelketaprest != \'9\'',function(err,wrows)  {
        if (err)
                console.log("Error query : %s ",err );
        rows = wrows.rows;     //postgres         
//        console.log("txapelketak : " + JSON.stringify(rows)); 

//postgres        connection.query('SELECT *, DATE_FORMAT(dataBerria,"%Y/%m/%d") AS dataBerria FROM berriak,txapelketa WHERE zenbakiBerria = 9 and idtxapelketa = idtxapelBerria and txapelketaprest != 9 order by zenbakiBerria asc, dataBerria desc',function(err,rowsb)            
        req.connection.query('SELECT *, to_char("dataBerria", \'YYYY-MM-DD\') AS "dataBerriaF" FROM berriak,txapelketa WHERE "zenbakiBerria" = \'9\' and idtxapelketa = "idtxapelBerria" and txapelketaprest != \'9\' order by "zenbakiBerria" asc, "dataBerriaF" desc',function(err,wrows)            
        {
          if(err)
            console.log("Error Selecting : %s ",err );
          rowsb = wrows.rows;     //postgres
          for (var i in rowsb) {
            var testuahtml = md(rowsb[i].testuaBerria);
            rowsb[i].htmlBerria = testuahtml;
          }
          res.render('txapelketakaukeratzeko.handlebars', {title : 'Txaparrotan-Txapelketa aukeratzeko', txapelketak : rows, berriak : rowsb});
        });
      });   
  
};

exports.aukeratu = function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));

  req.session.idtxapelketa = req.body.sTxapelketak;

return res.redirect('/');
  
};

exports.sortzeko = function(req, res){

//postgres  req.getConnection(function (err, connection) {
//postgres      if (err)
//postgres              console.log("Error connection : %s ",err );
      //Txapelketa bat pruebetako ixkutatuta idtxapelketa != 42
//postgres      connection.query('SELECT idtxapelketa, txapelketaizena FROM txapelketa where idtxapelketa != 42',function(err,rows)  {
      req.connection.query('SELECT idtxapelketa, txapelketaizena FROM txapelketa where idtxapelketa != \'42\'',function(err,wrows)  {

        if (err)
                console.log("Error query : %s ",err );
        rows = wrows.rows;     //postgres                 
//        console.log("txapelketak : " + JSON.stringify(rows)); 
        res.render('txapelketaksortu.handlebars', {title : 'Txaparrotan-Txapelketak sortu', txapelketak : rows});
      });   
  
};

exports.sortu = function(req,res){
    var idtxapelketa;
    var input = JSON.parse(JSON.stringify(req.body));
    var now= new Date();
/*
    if (process.env.NODE_ENV == 'production'){
      now.setUTCHours(now.getHours());
      now.setUTCMinutes(now.getMinutes()); 
    }
*/
    res.locals.flash = null;
 
  if(!req.body.emailard.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
   // return res.redirect(303, '/izenematea');
  }
  
  if(res.locals.flash != null){

//      console.log(req.body.taldeizena); 
         return res.render('txapelketaksortu.handlebars', {
            txapelketaizena: req.body.txapelketaizena,
            taldeizena: req.body.taldeizena,
            emailard   : req.body.emailard,
            pasahitza: req.body.pasahitza

          } );
  };

//postgres    req.getConnection(function (err, connection) {
      //2015-03-24
//postgres      if (err)
//postgres              console.log("Error connection : %s ",err ); 
            //
//postgres      connection.query('SELECT * FROM taldeak where taldeizena = ?',[req.body.taldeizena],function(err,rows)  {
      req.connection.query('SELECT * FROM taldeak where taldeizena = $1',[req.body.taldeizena],function(err,wrows)  {
       rows = wrows.rows;     //postgres         
       if(err || rows.length != 0){
        //  res.redirect('/izenematea');

          res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste administratzaile izen bat sartu!',
          };
          return res.render('txapelketaksortu.handlebars', {
            txapelketaizena: req.body.txapelketaizena,
            taldeizena: req.body.taldeizena,
            emailard   : req.body.emailard,
            pasahitza: req.body.pasahitza

          } );
       }
//postgres       connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[req.body.sTxapelketak],function(err,rows)  {
       req.connection.query('SELECT * FROM txapelketa where idtxapelketa = $1',[req.body.sTxapelketak],function(err,wrows)  {
        if (err)
                console.log("Error query : %s ",err );
        rows = wrows.rows;     //postgres 
//        console.log("txapelketatik : " + JSON.stringify(rows));
        if (rows.length != 0) 
         var data = {
            txapelketaizena    : input.txapelketaizena,
              zelaikop   : rows[0].zelaikop,
              taldekopmax   : rows[0].taldekopmax,
              partidukopmin   : rows[0].partidukopmin,
              hasierakoeguna    : rows[0].hasierakoeguna,
              hasierakoordua    : rows[0].hasierakoordua,
              bukaerakoeguna   : rows[0].bukaerakoeguna,
              bukaerakoordua   : rows[0].bukaerakoordua,
              hastekosexua   : rows[0].hastekosexua,
              partidudenbora   : rows[0].partidudenbora,
              inskripziohasierae   : rows[0].inskripziohasierae,
              inskripziohasierao   : rows[0].inskripziohasierao,
              inskripziobukaerae   : rows[0].inskripziobukaerae,
              inskripziobukaerao    : rows[0].inskripziobukaerao,
              prezioa : rows[0].prezioa,
              kontukorrontea : rows[0].kontukorrontea,
              txapelketaprest : 0,
              atsedenordua : rows[0].atsedenordua,
              atsedendenbora : rows[0].atsedendenbora,
              finalakordua : rows[0].finalakordua,
              buelta : rows[0].buelta           
        };
        else
         var data = {
            txapelketaizena    : input.txapelketaizena
        };
//postgres        var query = connection.query("INSERT INTO txapelketa set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO txapelketa (txapelketaizena, zelaikop, taldekopmax, partidukopmin, hasierakoeguna, hasierakoordua, bukaerakoeguna, bukaerakoordua, hastekosexua, partidudenbora, inskripziohasierae, inskripziohasierao, inskripziobukaerae, inskripziobukaerao, prezioa, kontukorrontea, txapelketaprest, atsedenordua, atsedendenbora, finalakordua, buelta) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) RETURNING idtxapelketa',[input.txapelketaizena, rows[0].zelaikop, rows[0].taldekopmax, rows[0].partidukopmin, rows[0].hasierakoeguna, rows[0].hasierakoordua, rows[0].bukaerakoeguna, rows[0].bukaerakoordua, rows[0].hastekosexua, rows[0].partidudenbora, rows[0].inskripziohasierae, rows[0].inskripziohasierao, rows[0].inskripziobukaerae, rows[0].inskripziobukaerao, rows[0].prezioa, rows[0].kontukorrontea, 0, rows[0].atsedenordua, rows[0].atsedendenbora, rows[0].finalakordua, rows[0].buelta], function(err, rows)
        {
          if (err)
              console.log("Error inserting : %s ",err ); 

//postgres          idtxapelketa = rows.insertId;
         rows = rows.rows;     //postgres
         idtxapelketa =  rows[0].idtxapelketa;           
//ADI
//postgres          connection.query('SELECT * FROM zelaia where idtxapelz= ?',[req.body.sTxapelketak],function(err,rowsz)   {
          req.connection.query('SELECT * FROM zelaia where idtxapelz= $1',[req.body.sTxapelketak],function(err,wrows)   {
           if(err)
            console.log("Error Selecting : %s ",err );
           rowsz = wrows.rows;     //postgres
           for (var i in rowsz) { 
             var dataz = {
            
               zelaiizena : rowsz[i].zelaiizena,
               zelaizki   : rowsz[i].zelaizki,
               idtxapelz    : idtxapelketa
             };
        
//             console.log(dataz);
//postgres             var query = connection.query("INSERT INTO zelaia set ? ",dataz, function(err, rows)
             var query = req.connection.query('INSERT INTO zelaia (zelaiizena, zelaizki, idtxapelz) VALUES ($1,$2,$3)',[rowsz[i].zelaiizena, rowsz[i].zelaizki, idtxapelketa], function(err, rows)
             {
              if (err)
               console.log("Error inserting : %s ",err );
             });
           }    
          });
//postgres          connection.query('SELECT * FROM maila where idtxapelm= ?',[req.body.sTxapelketak],function(err,rowsm)   {
          req.connection.query('SELECT * FROM maila where idtxapelm= $1',[req.body.sTxapelketak],function(err,wrows)   {
           if(err)
            console.log("Error Selecting : %s ",err );
           rowsm = wrows.rows;     //postgres
           for (var j in rowsm) { 
             var datam = {
            
               mailaizena : rowsm[j].mailaizena,
               mailazki   : rowsm[j].mailazki,
               akronimoa  : rowsm[j].akronimoa,
               idtxapelm  :  idtxapelketa
             };
        
//             console.log(datam);
//postgres            var query = connection.query("INSERT INTO maila set ? ",datam, function(err, rows)
             var query = req.connection.query('INSERT INTO maila (mailaizena, mailazki, akronimoa, idtxapelm) VALUES ($1,$2,$3,$4)',[rowsm[j].mailaizena, rowsm[j].mailazki, rowsm[j].akronimoa, idtxapelketa], function(err, rows)
               {
              if (err)
               console.log("Error inserting : %s ",err );
             });
           }    
          });
//postgres        connection.query('SELECT * FROM berriak where idtxapelBerria= ?',[req.body.sTxapelketak],function(err,rowsb)   {
         req.connection.query('SELECT * FROM berriak where "idtxapelBerria"= $1',[req.body.sTxapelketak],function(err,wrows)   {
 
           if(err)
            console.log("Error Selecting : %s ",err );
           rowsb = wrows.rows;     //postgres
           for (var j in rowsb) { 
             var datab = {
               izenburuaBerria    : rowsb[j].izenburuaBerria,
               testuaBerria   : rowsb[j].testuaBerria,
               dataBerria: now,
               zenbakiBerria : 0,
               idtxapelBerria : idtxapelketa,
               motaEdukia : rowsb[j].motaEdukia
             };
        
//             console.log(datab);
//postgres             var query = connection.query("INSERT INTO berriak set ? ",datab, function(err, rows)
             var query = req.connection.query('INSERT INTO berriak ("izenburuaBerria","testuaBerria","dataBerria","zenbakiBerria","idtxapelBerria","motaEdukia") VALUES ($1,$2,$3,$4,$5,$6)',[rowsb[j].izenburuaBerria, rowsb[j].testuaBerria, now, 0, idtxapelketa, rowsb[j].motaEdukia], function(err, rows)
             {
              if (err)
               console.log("Error inserting : %s ",err );
             });
           }    
          });
//ADI
          // Generate password hash
          var salt = bcrypt.genSaltSync();
          var password_hash = bcrypt.hashSync(input.pasahitza, salt);

          var data = {
            idtxapeltalde : idtxapelketa,
            taldeizena    : input.taldeizena,
            emailard   : input.emailard,
            pasahitza:   password_hash,                     //input.pasahitza,
            balidatuta : "admin"
        };
        
//        console.log(data);
//postgres        var query = connection.query("INSERT INTO taldeak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO taldeak (idtxapeltalde, taldeizena, emailard, pasahitza, balidatuta) VALUES ($1,$2,$3,$4,$5)',[idtxapelketa, input.taldeizena, input.emailard, password_hash, "admin"], function(err, rows)
        {
         if (err)
              console.log("Error inserting : %s ",err );
         else{
         var to = input.emailard;
         var subj = "Kaixo administratzaile " + input.txapelketaizena;
         var body = "Talde izena: " +input.taldeizena+ "\n Emaila: " + input.emailard + "\n Pasahitza: " + input.pasahitza;
          emailService.send(to, subj, body);
        }
          //res.redirect('/taldeak');
          res.redirect(303, '/admin/txapelketak');
        }); 
         
        });
       });
      });
    
};

exports.editatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id= req.session.idtxapelketa;
//postgres    req.getConnection(function (err, connection) {
//postgres        var query = connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[id],function(err,rows)
        var query = req.connection.query('SELECT * FROM txapelketa where idtxapelketa = $1',[id],function(err,wrows)
        {
          if (err)
              console.log("Error inserting : %s ",err );
          rows = wrows.rows;     //postgres          
          req.session.idtxapelketa = rows[0].idtxapelketa;
          res.render('txapelketakeditatu.handlebars', {title: "Txaparrotan-Txapelketa editatu",

              txapelketaizena    : rows[0].txapelketaizena,
              zelaikop   : rows[0].zelaikop,
              taldekopmax   : rows[0].taldekopmax,
              partidukopmin   : rows[0].partidukopmin,
              hasierakoeguna    : rows[0].hasierakoeguna,
              hasierakoordua    : rows[0].hasierakoordua,
              bukaerakoeguna   : rows[0].bukaerakoeguna,
              bukaerakoordua   : rows[0].bukaerakoordua,
              hastekosexua   : rows[0].hastekosexua,
              partidudenbora   : rows[0].partidudenbora,
              inskripziohasierae   : rows[0].inskripziohasierae,
              inskripziohasierao   : rows[0].inskripziohasierao,
              inskripziobukaerae   : rows[0].inskripziobukaerae,
              inskripziobukaerao    : rows[0].inskripziobukaerao,
              prezioa : rows[0].prezioa,
              kontukorrontea : rows[0].kontukorrontea,
              txapelketaprest : rows[0].txapelketaprest,
              atsedenordua : rows[0].atsedenordua,
              atsedendenbora : rows[0].atsedendenbora,
              finalakordua : rows[0].finalakordua,
              buelta : rows[0].buelta,
              taldeizena: req.session.txapelketaizena

            });
          
        });
        
       // console.log(query.sql); 
    
};

exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id= req.session.idtxapelketa;
//postgres    req.getConnection(function (err, connection) {
        
        var data = {
            
            txapelketaizena    : input.txapelketaizena,
            zelaikop   : input.zelaikop,
            taldekopmax   : input.taldekopmax,
            partidukopmin   : input.partidukopmin,
            hasierakoeguna    : input.hasierakoeguna,
            hasierakoordua    : input.hasierakoordua,
            bukaerakoeguna   : input.bukaerakoeguna,
            bukaerakoordua   : input.bukaerakoordua,
            hastekosexua   : input.hastekosexua,
            partidudenbora   : input.partidudenbora,
            inskripziohasierae   : input.inskripziohasierae,
            inskripziohasierao   : input.inskripziohasierao,
            inskripziobukaerae   : input.inskripziobukaerae,
            inskripziobukaerao    : input.inskripziobukaerao,
            prezioa : input.prezioa,
            kontukorrontea: input.kontukorrontea,
            buelta : input.buelta,
            txapelketaprest : input.txapelketaprest,
            atsedenordua : input.atsedenordua,
            atsedendenbora : input.atsedendenbora,
            finalakordua : input.finalakordua
        };
        
//        console.log(data);
//postgres        var query = connection.query("UPDATE txapelketa set ? WHERE idtxapelketa = ? ",[data,id], function(err, rows)
        var query = req.connection.query("UPDATE txapelketa set txapelketaizena=$1, zelaikop=$2, taldekopmax=$3, partidukopmin=$4, hasierakoeguna=$5, hasierakoordua=$6, bukaerakoeguna=$7, bukaerakoordua=$8, hastekosexua=$9, partidudenbora=$10, inskripziohasierae=$11, inskripziohasierao=$12, inskripziobukaerae=$13, inskripziobukaerao=$14, prezioa=$15, kontukorrontea=$16, buelta=$17, txapelketaprest=$18, atsedenordua=$19, atsedendenbora=$20, finalakordua=$21 WHERE idtxapelketa = $22 ",[input.txapelketaizena, input.zelaikop, input.taldekopmax, input.partidukopmin, input.hasierakoeguna, input.hasierakoordua, input.bukaerakoeguna, input.bukaerakoordua, input.hastekosexua, input.partidudenbora, input.inskripziohasierae, input.inskripziohasierao, input.inskripziobukaerae, input.inskripziobukaerao, input.prezioa, input.kontukorrontea, input.buelta, input.txapelketaprest,input.atsedenordua, input.atsedendenbora, input.finalakordua,id], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/txapelketakeditatu');
          
        });
        
       // console.log(query.sql); 
    
};

exports.ikusgai = function(req,res){
    var id = req.body.iTxapelketak;
    console.log("Ikusgai:" + id);
//postgres    req.getConnection(function (err, connection) {
        
        var data = {
            
            txapelketaprest : 0

        };
        
        console.log(data);
//postgres        var query = connection.query("UPDATE txapelketa set ? WHERE idtxapelketa = ? ",[data,id], function(err, rows)
        var query = req.connection.query("UPDATE txapelketa set txapelketaprest=$1 WHERE idtxapelketa = $2 ",[0, id], function(err, rows)
        {
  
          if (err)
              console.log("Error updating : %s ",err );
         
          res.redirect('/txapelketak');
          
        });
        
       // console.log(query.sql); 
    
};

exports.berriakbilatu = function(req, res){
  var id = req.session.idtxapelketa;
  var edukiak = []; //partiduak
  var j,t;
  var k = 0;
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT *, DATE_FORMAT(dataBerria,"%Y/%m/%d") AS dataBerria FROM berriak WHERE idtxapelBerria = ? order by motaEdukia asc, zenbakiBerria asc, dataBerria desc',[id],function(err,rowsb)            
     req.connection.query('SELECT *, to_char("dataBerria", \'YYYY-MM-DD\') AS "dataBerriaF" FROM berriak WHERE "idtxapelBerria" = $1 order by "motaEdukia" asc, "zenbakiBerria" asc, "dataBerriaF" desc',[id],function(err,wrows)            
     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsb = wrows.rows;     //postgres     
       //console.log("Edukiak:" +JSON.stringify(rows));
        // debugger;
        for (var i in rowsb) {
            var testuahtml = md(rowsb[i].testuaBerria);
            rowsb[i].htmlBerria = testuahtml;
        }
        res.render('berriaksortu.handlebars',{title: "Txaparrotan-Berriak sortu", berriak:rowsb, taldeizena: req.session.txapelketaizena});
      });   

};

exports.berriakeditatu = function(req, res){
  //var id = req.params.id;
  var id = req.session.idtxapelketa;
  var idBerriak = req.params.idBerriak;
    
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM berriak WHERE idtxapelBerria = ? and idBerriak = ?',[id,idBerriak],function(err,rows)
     req.connection.query('SELECT * FROM berriak WHERE "idtxapelBerria" = $1 and "idBerriak" = $2',[id,idBerriak],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            res.render('berriakeditatu.handlebars', {title:"Berriak aldatu",data:rows, jardunaldia: req.session.jardunaldia, idDenboraldia: req.session.idDenboraldia, partaidea: req.session.partaidea});
                           
         });
                 
};

exports.berriakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idtxapelketa;
    var idBerriak = req.params.idBerriak;
    var now= new Date();
    console.log("now1 : %s ",now );  // now : UTC +2ordu heroku config:add TZ="Europe/Madrid"
/*
    if (process.env.NODE_ENV == 'production'){
      now.setUTCHours(now.getHours());
      now.setUTCMinutes(now.getMinutes()); 
    }
    console.log("now2 : %s ",now );  
*/
 //postgres   req.getConnection(function (err, connection) {
        
        var data = {
            
            izenburuaBerria    : input.izenburuaBerria,
            testuaBerria   : input.testuaBerria,
            zenbakiBerria : input.zenbakiBerria,
            dataBerria : now,
            //idElkarteakEdukia : id

            motaEdukia : input.motaEdukia //argazkiaK-A  berriak-B 
        };
//postgres        connection.query("UPDATE berriak set ? WHERE idtxapelBerria = ? and idBerriak = ? ",[data,id,idBerriak], function(err, rows)
        req.connection.query('UPDATE berriak set "izenburuaBerria"=$1, "testuaBerria"=$2,"zenbakiBerria"=$3, "dataBerria"=$4, "motaEdukia"=$5  WHERE "idtxapelBerria" = $6 and "idBerriak" = $7 ',[input.izenburuaBerria, input.testuaBerria, input.zenbakiBerria, now, input.motaEdukia,id,idBerriak], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );
          if (input.bidali){
            
                  var status = input.izenburuaBerria + " - http://txaparrotan.herokuapp.com/ \n #txaparrotan16 \n #123Zarautz";

                  twitter.post('statuses/update', { status: status }, function (err, data, response) {
                   if (err) {
                        console.log(err);
                   } else {
                        console.log(data.text + ' txiotu da');
                   }
                  });
          }
          res.redirect('/admin/berriak');
        });
    
};

exports.berriakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtxapelketa;
     var idBerriak = req.params.idBerriak;
    
//postgres     req.getConnection(function (err, connection) {
//postgres        connection.query("DELETE FROM berriak  WHERE idtxapelBerria = ? and idBerriak = ?",[id,idBerriak], function(err, rows)
        req.connection.query('DELETE FROM berriak  WHERE "idtxapelBerria" = $1 and "idBerriak" = $2',[id,idBerriak], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/berriak');
             
        });
        
};

exports.berriaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("Bidali:" + input.bidali);
    var id = req.session.idtxapelketa;
    var now= new Date();
/*    
    if (process.env.NODE_ENV == 'production'){
      now.setUTCHours(now.getHours());
      now.setUTCMinutes(now.getMinutes()); 
    }
*/    
    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

//postgres    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenburuaBerria    : input.izenburuaBerria,
            testuaBerria   : input.testuaBerria,
            dataBerria: now,
            zenbakiBerria : input.zenbakiBerria,
            idtxapelBerria : id,
            motaEdukia : input.motaEdukia
        };
//postgres        var query = connection.query("INSERT INTO berriak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO berriak ("izenburuaBerria","testuaBerria","dataBerria","zenbakiBerria","idtxapelBerria","motaEdukia") VALUES ($1,$2,$3,$4,$5,$6)',[input.izenburuaBerria, input.testuaBerria, now, input.zenbakiBerria, id, input.motaEdukia], function(err, rows)
        {
          if (err)
              console.log("Error inserting : %s ",err );
/*         
          if(input.bidali){
              var query = connection.query('SELECT * FROM taldeak where idtxapeltalde = ? order by emailard',[id],function(err,rows)
              {
                var to = " ";
                for (var i in rows){
                 if (to != rows[i].emailard) { 
                  to = rows[i].emailard;
                  var subj = req.session.txapelketaizena+ "-n berria: "+input.izenburua;
                  var body = "<h2>"+input.izenburua+"</h2>\n" + 
                              "<p>"+ input.testua+ "</p> \n"+
                              "<h3> Gehiago jakin nahi baduzu, sartu: http://"+hosta+"</h3>" ;
                  console.log(i + ". mezua1: " + to);
                  emailService.send(to, subj, body);
                  //setTimeout(function(){console.log(i + ". mezua1: " + to);},5000);
                  //console.log(i + ". mezua1: " + to);
                  doDelay(1000);
                  console.log(i + ". mezua2: " + to);
                 }; 
                }
              });
          }
*/
          if (input.bidali){
            
                  var status = input.izenburuaBerria + " - http://txaparrotan.herokuapp.com/ \n #txaparrotan16 \n #123Zarautz";

                  twitter.post('statuses/update', { status: status }, function (err, data, response) {
                   if (err) {
                        console.log(err);
                   } else {
                        console.log(data.text + ' txiotu da');
                   }
                  });
          }
          res.redirect('/admin/berriak');
        });
        
       // console.log(query.sql); 
    
};

function doDelay(wait) {
    var date = new Date();
    var startDate = date.getTime();
    var a = 1;
    var b = 0;
    while (a !== 0) {
        date = new Date();
        if ((date.getTime() - startDate) >= wait) {
            a = 0;
        }
        b++;
    }
    //alert("Salida del bucle.");
}


exports.berriakikusi = function(req, res){
  var id = req.session.idtxapelketa;
  var kolore, aukeraketa, aukeratuta;
  var now= new Date(), izenemanikusi = 0;
  var vHasiera,aHasiera,aHasieraOrdua,hasiera,vBukaera,aBukaera,bukaera,zozketaeguna;

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT * FROM berriak where motaEdukia = "B" and zenbakiBerria <> 0 and idtxapelBerria = ? order by zenbakiBerria asc, dataBerria desc',[id],function(err,rowsb)     {
    req.connection.query('SELECT * FROM berriak where "motaEdukia" = \'B\' and "zenbakiBerria" <> \'0\' and "idtxapelBerria" = $1 order by "zenbakiBerria" asc, "dataBerria" desc',[id],function(err,wrows)     {

      if(err) 
           console.log("Error Selecting : %s ",err );
      rowsb = wrows.rows;     //postgres   
      for (var i in rowsb) {
            var testuahtml = md(rowsb[i].testuaBerria);
            rowsb[i].htmlBerria = testuahtml;
      }     
//postgres      connection.query('SELECT * FROM txapelketa where idtxapelketa = ? ',[id],function(err,rows)     {
      req.connection.query('SELECT * FROM txapelketa where idtxapelketa = $1 ',[id],function(err,wrows)     {

        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        if(rows.length != 0) {
          vHasiera = new Date();
          hasiera = rows[0].inskripziohasierae;

          aHasiera = hasiera.split("-");
          vHasiera.setDate(aHasiera[2]);
          vHasiera.setMonth(aHasiera[1] - 1);
          vHasiera.setYear(aHasiera[0]);
          aHasieraOrdua = rows[0].inskripziohasierao.split(":");
          vHasiera.setHours(aHasieraOrdua[0],aHasieraOrdua[1],0);

          vHasiera.set
          vBukaera = new Date();
          bukaera = rows[0].inskripziobukaerae;
          aBukaera = bukaera.split("-");
          vBukaera.setDate(aBukaera[2]);
          vBukaera.setMonth(aBukaera[1] - 1);
          vBukaera.setYear(aBukaera[0]);  

          if(vHasiera < now && vBukaera > now) {
              izenemanikusi = 1;
          }
          rows[0].zozketaeguna = aBukaera[0] + "-" + aBukaera[1] + "-" + (aBukaera[2] + 2);
        }  
//postgres        connection.query('SELECT * FROM taldeak,maila where kategoria=idmaila and idtxapeltalde = ? order by taldeizena asc',[id],function(err,rowst)     {
//ADI kategoria        req.connection.query('SELECT * FROM taldeak,maila where kategoria=idmaila and idtxapeltalde = $1 order by taldeizena asc',[id],function(err,wrows)     {
        req.connection.query('SELECT * FROM taldeak,maila where kategoria=idmaila and idtxapeltalde = $1 order by taldeizena asc',[id],function(err,wrows)     {

          if(err)
             console.log("Error Selecting : %s ",err );
          rowst = wrows.rows;     //postgres 
          aukeraketa = 0; 
          for (var i in rowst) { 
            kolore = "#000000";
            aukeratuta = 0;
            if (rowst[i].balidatuta == 0)                     // Balidatugabe 
                 kolore = "#FF0000";
            else if (rowst[i].balidatuta == 1)                // Balidatuta
                      kolore = "#0000FF";
                 else if (rowst[i].balidatuta == 2)           // Jokalariakfaltan 
                           kolore = "#00FF00";
                      else if (rowst[i].balidatuta == 4)      // Aukeratuta
                           {
                             kolore = "#008000";
                             aukeraketa = 1;
                             aukeratuta = 1;
                           }
            rowst[i].kolore =  kolore; 
            rowst[i].aukeratuta =  aukeratuta; 
          }  
          res.render('index.handlebars',{title: "Txaparrotan", taldeizena: req.session.taldeizena, data:rowsb, data2: rows, taldeak: rowst, izenemanikusi: izenemanikusi, aukeraketa: aukeraketa});
        });                        
      });
    });   

};

exports.egitekoakikusi = function(req, res){
  var id = req.session.idtxapelketa;

//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM berriak where motaEdukia = "E" and zenbakiBerria <> 0 and idtxapelBerria = ? order by zenbakiBerria asc, dataBerria desc',[id],function(err,rowsb)     {
     req.connection.query('SELECT * FROM berriak where "motaEdukia" = \'E\' and "zenbakiBerria" <> \'0\' and "idtxapelBerria" = $1 order by "zenbakiBerria" asc, "dataBerria" desc',[id],function(err,wrows)     {
        
        if(err) 
           console.log("Error Selecting : %s ",err );
        rowsb = wrows.rows;     //postgres     
        for (var i in rowsb) {
            var testuahtml = md(rowsb[i].testuaBerria);
            rowsb[i].htmlBerria = testuahtml;
        }         
        res.render('egitekoak.handlebars', {title: "Txaparrotan - Egitekoak", egitekoak:rowsb, taldeizena: req.session.taldeizena});
      });   

};

exports.argazkiakikusi = function(req, res){
  var id = req.session.idtxapelketa;

//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM berriak where motaEdukia = "A" and zenbakiBerria <> 0 and idtxapelBerria = ? order by zenbakiBerria asc, dataBerria desc',[id],function(err,rowsb)     {
     req.connection.query('SELECT * FROM berriak where "motaEdukia" = \'A\' and "zenbakiBerria" <> \'0\' and "idtxapelBerria" = $1 order by "zenbakiBerria" asc, "dataBerria" desc',[id],function(err,wrows)     {
            
        if(err) 
           console.log("Error Selecting : %s ",err );
        rowsb = wrows.rows;     //postgres     
        for (var i in rowsb) {
            var testuahtml = md(rowsb[i].testuaBerria);
            rowsb[i].htmlBerria = testuahtml;
        }         
        res.render('argazkiak.handlebars', {title: "Txaparrotan - Argazkiak", irudiak:rowsb, taldeizena: req.session.taldeizena});
      });   

};

exports.argazkiakigo = function(req, res){
  var idtxapelketa = req.session.idtxapelketa;
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = argazkiakDir + '/' + idtxapelketa;
    form.parse(req, function(err, fields, files){
        //if(err) return res.redirect(303, '/error');
        if(err) {
            res.session.flash = {
                type: 'danger',
                intro: 'Oops!',
                message: 'Berriz saiatu',
            };
            return res.redirect(303, '/admin/argazkiak');
        }
        //var argazkia = files.argazkia;
        //var dir = argazkiakDir + '/' + idtxapelketa;
        //var path = dir + '/' + fields.izena;
        //fs.mkdirSync(dir);
        //fs.renameSync(argazkia.path, dir + '/' + fields.izena);
        //saveContestEntry('vacation-photo', fields.email,
         //   req.params.year, req.params.month, path);
        req.session.flash = {
            type: 'success',
            intro: 'Oso ondo!',
            message: 'Argazkia igo da.',
        };
        return res.redirect(303, '/admin/argazkiak');
    });
};

exports.argazkiakikusi2 = function(req, res){
  var argazkiak = [];
  var argazkia = {};
  debugger;
  var idtxapelketa = req.session.idtxapelketa;
  var txapelketadir = argazkiakDir + '/' + idtxapelketa;
  //var txapelketadir = path.join(argazkiakDir, idtxapelketa);
  fs.existsSync(txapelketadir) || fs.mkdirSync(txapelketadir);
  fs.readdir(txapelketadir, function (err, files) {
  if (err) throw err;
//  console.log("/usr files: " + files);
  for (var i in files){
    //argazkiak[i] = files[i];
    console.log(files[i]);
    argazkia = {
                  files    : files[i],
                  idtxapelketa  : req.session.idtxapelketa
               };
    
    argazkiak[i] = argazkia;
  }
//  console.log(JSON.stringify(argazkiak));
  res.render('argazkiak.handlebars', {title: "Txaparrotan - Argazkiak", irudiak:argazkiak, taldeizena: req.session.taldeizena});
  });
};

exports.kontaktuabidali = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(req.body);
    res.locals.flash = null;

  if(!req.body.email.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
  }

  if(res.locals.flash != null){
         return res.render('kontaktua.handlebars', {
            izenabizen: req.body.izenabizen,
            telef   : req.body.telef,
            email   : req.body.email,
            herri   : req.body.herri,
            azalpena    : input.azalpena,
            

          } );
       }
  
  else {

//postgres    req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde=idtxapelketa and idtxapeltalde = ? and balidatuta="admin" order by sortzedata',[req.session.idtxapelketa],function(err,rows)     {
     req.connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde=idtxapelketa and idtxapeltalde = $1 and balidatuta=\'admin\' order by sortzedata',[req.session.idtxapelketa],function(err,wrows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres         
        if(rows.length != 0){     
         var to = rows[0].emailard;
         var subj = "Web orriko zalantza " +rows[0].txapelketaizena+":" + input.izenabizen;
         var body = "Izen abizenak: " + input.izenabizen + "\n Emaila: " + input.email + "\n Telefonoa" + input.telef + "\n Herria: " + input.herri+ "\n Azalpena:" + input.azalpena;
          console.log("input:" + input.izenabizen);
          emailService.send(to, subj, body);
        }
          res.locals.flash = {
              type: 'success',
              intro: 'Bidalita!',
              message: 'Egun gutxiren buruan erantzuna jasoko duzu!',
          };
              res.redirect(303,'/');

       });

    }
};

exports.taldeakikusi = function(req,res){
var taldeak = []; 
var taldea = {};
var jokalariak = []; 
var j;
var t = 0;
var vTalde;
var date = new Date();
//postgres  req.getConnection(function(err,connection){
//postgres      connection.query('SELECT * FROM maila,taldeak LEFT JOIN jokalariak ON idtaldeak=idtaldej WHERE kategoria = idmaila and idtxapeltalde = ? and balidatuta != "admin" order by idtaldeak, idjokalari',[req.session.idtxapelketa],function(err,rows)     {
      req.connection.query('SELECT * FROM maila,taldeak LEFT JOIN jokalariak ON idtaldeak=idtaldej WHERE kategoria = idmaila and idtxapeltalde = $1 and balidatuta != \'admin\' order by idtaldeak, idjokalari',[req.session.idtxapelketa],function(err,wrows)     {

        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        for (var i in rows) { 
          if(vTalde != rows[i].idtaldeak){
            if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;
            }
            vTalde = rows[i].idtaldeak;
            jokalariak = []; 
            j=0;
            if(rows[i].sortzedata != null){
            data = rows[i].sortzedata;
            rows[i].sortzedata= data.getFullYear() + "-"+ (data.getMonth() +1) +"-"+ data.getDate()+" "+data.getHours()+":"+data.getMinutes();
          }
          
            taldea = {

                  idtaldeak  : rows[i].idtaldeak,
                  taldeizena    : rows[i].taldeizena,
                  sexua    : rows[i].sexua,
                  herria    : rows[i].herria,
                  DNIard    : rows[i].DNIard,
                  izenaard    : rows[i].izenaard,
                  emailard   : rows[i].emailard,
                  telefonoard    : rows[i].telefonoard,
                  sortzedata: rows[i].sortzedata,
                  balidatuta : rows[i].balidatuta,
                  akronimoa : rows[i].akronimoa

               };
               
          }
          jokalariak[j] = {
                  idtaldeak  : rows[i].idtaldeak,
                  idjokalari : rows[i].idjokalari,
                  jokalariizena    : rows[i].jokalariizena,
                  emailaj   : rows[i].emailaj,
                  telefonoaj: rows[i].telefonoaj,
                  kamisetaneurria : rows[i].kamisetaneurria
               };
          j++;
          
        }
        if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;
            }
        res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-TaldeakAdmin', data2:taldeak, taldeizena: req.session.txapelketaizena} );
    });

}

exports.jokalariakikusi = function(req,res){

//postgres  req.getConnection(function(err,connection){
//postgres      connection.query('SELECT * FROM taldeak, jokalariak WHERE idtaldeak = idtaldej and idtxapeltalde = ? order by jokalariizena, idtaldeak',[req.session.idtxapelketa],function(err,rows)     {
      req.connection.query('SELECT *, to_char(sortzedata, \'YYYY-MM-DD\') AS sortzedata  FROM taldeak, jokalariak WHERE idtaldeak = idtaldej and idtxapeltalde = $1 order by jokalariizena, idtaldeak',[req.session.idtxapelketa],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        res.render('jokalariakadmin.handlebars', {title : 'Txaparrotan-JokalariakAdmin', data2:rows, taldeizena: req.session.txapelketaizena} );
    });

}

exports.mantenimentu = function(req, res){
  var now= new Date();

//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM taldeak WHERE idtaldeak > 172',function(err,rows)
     req.connection.query('SELECT * FROM taldeak WHERE idtaldeak > \'172\'',function(err,wrows)
        {
          if(err)
                console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres
          for(var i in rows){
            // Generate password hash
            var salt = bcrypt.genSaltSync();
            var password_hash = bcrypt.hashSync(rows[i].pasahitza, salt);

            var data = {
            
            balidatuta : 1,
            idtxapeltalde   : 20,
            sortzedata   : now,
            pasahitza   : password_hash
        
            };
//postgres            connection.query("UPDATE taldeak set ? WHERE idtaldeak = ?  ",[data,rows[i].idtaldeak], function(err, rows)
            req.connection.query('UPDATE taldeak set balidatuta=$1,idtxapeltalde=$2, sortzedata=$3,pasahitza=$4 WHERE idtaldeak = $5  ',[1, 20, now, password_hash,rows[i].idtaldeak], function(err, rows)
            {
                if(err)

                  console.log("Error Updating : %s ",err );
             
              
            });
          }
                           
         });
                 
};

exports.zelaiakbilatu = function(req, res){
  
  var id = req.session.idtxapelketa;

//postgres  req.getConnection(function(err,connection){     
//postgres        connection.query('SELECT * FROM zelaia where idtxapelz= ?',[id],function(err,rows)     {
        req.connection.query('SELECT * FROM zelaia where idtxapelz= $1 order by zelaizki',[id],function(err,wrows)     {
            
          if(err)
              console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres         
          res.render('zelaiak.handlebars', {title : 'Txaparrotan-Zelaiak', data:rows, taldeizena: req.session.taldeizena} );

       });
  
};

exports.zelaiakeditatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idtxapelketa;
  var idzelai = req.params.idzelaia;
    
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM zelaia WHERE idtxapelz = ? and idzelaia = ?',[id,idzelai],function(err,rows)
     req.connection.query('SELECT * FROM zelaia WHERE idtxapelz = $1 and idzelaia = $2',[id,idzelai],function(err,wrows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres     
            res.render('zelaiakeditatu.handlebars', {page_title:"Zelaia aldatu",data:rows, taldeizena: req.session.taldeizena});
        });
                 
};

exports.zelaiaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idtxapelketa;

//postgres    req.getConnection(function (err, connection) {
        var data = {
            
            zelaiizena : input.zelaiizena,
            zelaizki   : input.zelaizki,
            idtxapelz    : id
        };
//        console.log(data);
//postgres        var query = connection.query("INSERT INTO zelaia set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO zelaia (zelaiizena, zelaizki, idtxapelz) VALUES ($1,$2,$3)',[input.zelaiizena, input.zelaizki, id], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/zelaiak');
          
        });
    
};
exports.zelaiakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idtxapelketa;
    var idzelai = req.params.idzelaia;
    
//postgres    req.getConnection(function (err, connection) {
        
        var data = {
            
            zelaiizena : input.zelaiizena,
            zelaizki   : input.zelaizki

        };
//postgres        connection.query("UPDATE zelaia set ? WHERE idtxapelz = ? and idzelaia = ? ",[data,id,idzelai], function(err, rows)
        req.connection.query('UPDATE zelaia set zelaiizena=$1,zelaizki=$2 WHERE idtxapelz = $3 and idzelaia = $4 ',[input.zelaiizena, input.zelaizki,id,idzelai], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/zelaiak');
          
        });
    
};

exports.zelaiakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtxapelketa;
     var idzelai = req.params.idzelaia;
    
//postgres     req.getConnection(function (err, connection) {
//postgres        connection.query("DELETE FROM zelaia  WHERE idtxapelz = ? and idzelaia = ?",[id,idzelai], function(err, rows)
        req.connection.query('DELETE FROM zelaia  WHERE idtxapelz = $1 and idzelaia = $2',[id,idzelai], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/zelaiak');
             
        });
        
};

exports.mailakbilatu = function(req, res){
  
  var id = req.session.idtxapelketa;

//postgres  req.getConnection(function(err,connection){     
//postgres        connection.query('SELECT * FROM maila where idtxapelm= ?',[id],function(err,rows)     {
        req.connection.query('SELECT * FROM maila where idtxapelm= $1',[id],function(err,wrows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
          rows = wrows.rows;     //postgres         
          res.render('mailak.handlebars', {title : 'Txaparrotan-Mailak', data:rows, taldeizena: req.session.taldeizena} );

       });
  
};

exports.mailakeditatu = function(req, res){
  var azkenak = [{balioa:"16", textoa : "Hamaseirenak"}, {balioa:"8", textoa : "Zortzirenakk"}, {balioa:"4", textoa : "Laurdenak"}, {balioa:"2", textoa : "Erdiak"}, {balioa:"1", textoa : "Finalak"}];
  //var id = req.params.id;
  var id = req.session.idtxapelketa;
  var idmaila = req.params.idmaila;
    
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM maila WHERE idtxapelm = ? and idmaila = ?',[id,idmaila],function(err,rows)
     req.connection.query('SELECT * FROM maila WHERE idtxapelm = $1 and idmaila = $2',[id,idmaila],function(err,wrows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres  
            for(var i in azkenak ){
               if(rows[0].finalak == azkenak[i].balioa){
                  azkenak[i].aukeratua = true;
               }
               else
                  azkenak[i].aukeratua = false;
            }
            rows[0].azkenak = azkenak;     

            res.render('mailakeditatu.handlebars', {page_title:"Maila aldatu",data:rows, taldeizena: req.session.taldeizena});
                           
         });
                 
};

exports.mailaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idtxapelketa;

//postgres    req.getConnection(function (err, connection) {
        
        var data = {
            
            mailaizena : input.mailaizena,
            mailazki   : input.mailazki,
            akronimoa   : input.akronimoa,
            multzokop   : 0,
            idtxapelm    : id
        };
        
//        console.log(data);
//postgres        var query = connection.query("INSERT INTO maila set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO maila (mailaizena, mailazki, akronimoa, multzokop, idtxapelm) VALUES ($1,$2,$3,$4,$5)',[input.mailaizena, input.mailazki, input.akronimoa, 0, id], function(err, rows)
        {
          if (err)
              console.log("Error inserting : %s ",err );
          
          res.redirect('/admin/mailak');
        });
    
};
exports.mailakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idtxapelketa;
    var idmaila = req.params.idmaila;
    
//postgres    req.getConnection(function (err, connection) {
        var data = {
            mailaizena : input.mailaizena,
            mailazki   : input.mailazki,
            multzokop  : input.multzokop,
            akronimoa : input.akronimoa,
            finalak     : input.finalak
        };
//postgres        connection.query("UPDATE maila set ? WHERE idtxapelm = ? and idmaila = ? ",[data,id,idmaila], function(err, rows)
        req.connection.query('UPDATE maila set mailaizena=$1,mailazki=$2,multzokop=$3,akronimoa=$4,finalak =$5  WHERE idtxapelm = $6 and idmaila = $7 ',[input.mailaizena, input.mailazki, input.multzokop, input.akronimoa, input.finalak,id,idmaila], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/mailak');
        });
    
};

exports.mailakezabatu = function(req,res){
     //var id = req.params.id;
     var id = req.session.idtxapelketa;
     var idmaila = req.params.idmaila;
//postgres     req.getConnection(function (err, connection) {
//postgres        connection.query("DELETE FROM maila  WHERE idtxapelm = ? and idmaila = ?",[id,idmaila], function(err, rows)
        req.connection.query('DELETE FROM maila  WHERE idtxapelm = $1 and idmaila = $2',[id,idmaila], function(err, rows)
        {
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/mailak');
        });

};

exports.ezabatu = function(req, res){
  var id = req.body.eTxapelketak;
  var vGrupo;
  console.log("Txapelketa ezabatu: " +id);
//postgres  req.getConnection(function(err,connection){
//postgres      connection.query('SELECT * FROM maila where idtxapelm = ?',[id],function(err,rows)  {
      req.connection.query('SELECT * FROM maila where idtxapelm = $1',[id],function(err,wrows)  {
        if (err)
                console.log("Error query : %s ",err );           
        rows = wrows.rows;     //postgres
        if (rows.length != 0){
        //  res.redirect('/izenematea');

          res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Partiduak, Multzoak, Zelaiak eta Mailak EZABATU!',
          };
          return res.render('txapelketaksortu.handlebars', {
            txapelketaizena: req.body.txapelketaizena,
            taldeizena: req.body.taldeizena,
            emailard   : req.body.emailard,
            pasahitza: req.body.pasahitza

          } );
        }

        //ADI - Partiduak, Multzoak, Zelaiak eta Mailak EZABATU AURRETIK

        //ADI - Txapelketa Ezabatu 2 aldiz prozesatu : 1. jokalariak kentzen ditu eta 2. gainontzeko taulak
 //postgres       connection.query('SELECT * FROM jokalariak,taldeak where idtxapeltalde= ? and idtaldej=idtaldeak',[id],function(err,rows)       
        req.connection.query('SELECT * FROM jokalariak,taldeak where idtxapeltalde= $1 and idtaldej=idtaldeak',[id],function(err,wrows)       
        {
          if (err)
                console.log("Error Updating : %s ",err );
          rows = wrows.rows;     //postgres
          if (rows.length != 0){
              console.log("Jokalariak ezabatu - 1: " +id);
              for(var i in rows){
//postgres                connection.query("DELETE FROM jokalariak WHERE idjokalari = ?  ",[rows[i].idjokalari], function(err, rowsd)
                req.connection.query("DELETE FROM jokalariak WHERE idjokalari = $1  ",[rows[i].idjokalari], function(err, rowsd)
                {
            
                  if (err)
                   console.log("Error Updating : %s ",err );   

                });
              }

              res.redirect(303, '/admin/txapelketak');
            } 
          else {
           console.log("Txapelketa ezabatu - 2: " +id);
//postgres           connection.query("DELETE FROM berriak WHERE idtxapelBerria = ?  ",[id], function(err, rowst)
           req.connection.query('DELETE FROM berriak WHERE "idtxapelBerria" = $1  ',[id], function(err, rowst)
           {
            if (err)
              console.log("Error Deleting : %s ",err );
//postgres            connection.query("DELETE FROM berriak WHERE idtxapelBerria = ?  ",[id], function(err, rowst)
            req.connection.query('DELETE FROM taldeak WHERE idtxapeltalde = $1  ',[id], function(err, rowsd)
            {
                if (err)
                   console.log("Error Updating : %s ",err );   
//postgres                connection.query("DELETE FROM txapelketa WHERE idtxapelketa = ?  ",[id], function(err, rowsd)
                req.connection.query('DELETE FROM txapelketa WHERE idtxapelketa = $1  ',[id], function(err, rowsd)
                {
                  if (err)
                   console.log("Error Updating : %s ",err );   

                  res.redirect(303, '/admin/txapelketak');
                });

            });
           });

          }    
        });
     });
 
};

exports.mezuakbidali = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("Bidali:" + input.bidali);
    var id = req.session.idtxapelketa;
    var taldeak2;
    var rowsif = [];
    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

    var to, subj, body;
    var nondik = 0, nora = 0;
    var zenbat = 10;

    if (!req.session.nondik){ 
          req.session.nondik = 0;
    }
    nondik = req.session.nondik;

    if (!req.session.mezumota || req.session.mezumota != input.mezumota){ 
          req.session.mezumota = input.mezumota;
    }

debugger;      
 
//postgres    req.getConnection(function (err, connection) {
//postgres      connection.query('SELECT * FROM txapelketa where idtxapelketa = ? ',[id],function(err,rowst)
      req.connection.query('SELECT * FROM txapelketa where idtxapelketa = $1 ',[id],function(err,wrows)
      {
        if(err)
            console.log("Error Selecting : %s ",err );       
        rowst = wrows.rows;     //postgres
        if(input.mezumota == "prest" || input.mezumota == "onartuak"){

//postgres            connection.query('SELECT * FROM taldeak where idtxapeltalde = ? and balidatuta > 3 order by emailard',[req.session.idtxapelketa],function(err,rows)     {  
            req.connection.query('SELECT * FROM taldeak where idtxapeltalde = $1 and balidatuta > \'3\' order by emailard',[req.session.idtxapelketa],function(err,wrows)     {  
              if(err)
                console.log("Error Selecting : %s ",err );
              rows = wrows.rows;     //postgres
//              if (input.bidali){
                console.log(rows.length + "- nondik: "+ nondik + "-nora " + nora + "-zenbat " + zenbat);
                for (var i in rows){
                  if(i >= nondik && nora < zenbat){
                    nora++;

                    if(input.mezumota == "prest"){
                      subj = req.session.txapelketaizena+ " txapelketa prest, ordutegia ikusgai";
                      body = "<h2>"+ req.session.txapelketaizena+ " txapelketa prest </h2>\n" + 
                              "<h3> <b>"+rows[i].taldeizena+"</b>-ren partiduen ordutegia ikusi ahal izateko sartu: http://"+hosta+"</h3>\n \n \n"+
                              "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;
                    }
                    else if(input.mezumota == "onartuak"){
                        subj = req.session.txapelketaizena+ " txapelketan zure taldea  "+rows[i].taldeizena+"  aukeratua";
                        body = "<h2>" + req.session.txapelketaizena+" txapelketan zure taldea <b>"+rows[i].taldeizena+"</b> aukeratua </h2>\n" +

//                              "<p>2 egun dituzu <b>" +rowst[0].kontukorrontea+ "</b> kontu korrontean  <b>"+rowst[0].prezioa+ "</b> euro sartzeko. Kontzeptu bezala arduradunaren eta taldearen izena jarri : <b>"+rows[i].taldeizena+"-"+rows[i].izenaard+"</b> </p>" +
                              "<p>2 egun dituzu <b>" +rowst[0].kontukorrontea+ "</b> kontu korrontean  dirua sartzeko. Kontzeptu bezala arduradunaren eta taldearen izena jarri : <b>"+rows[i].taldeizena+"-"+rows[i].izenaard+"</b> </p>" +

                              "<p style='color:#FF0000'>Ordainketa egindakoan eta guk berrikusitakoan webguneko zerrendan zuen taldea azalduko da. Ordainketa egin ezean, zure taldeak txapelketan jolasteko aukera galduko du. </p> \n \n \n" +

                  //            "<h3> Sartu: http://" +hosta+" eta ikusi zure taldea onarturik Taldeak atalean</h3>\n \n \n"+

                              "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;
                    }
                    to = rows[i].emailard;
                    if (input.bidali){  
                      emailService.send(to, subj, body);
                      console.log("emaila: "+ i + "-" + nora + "-" + to );
                    }
                    req.session.nondik = parseInt(i) + 1;
                  }
                }    
                if(nondik >= (rows.length - zenbat)){
                  to = "txaparrotan@gmail.com";                     // ADI txapelketako emaila
                  emailService.send(to, subj, body);
                  res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:rows, taldeizena: req.session.txapelketaizena} );
                } 
                else
                  if (req.session.nondik != 0) 
                      res.redirect('/admin/mezuakmenua');
                  else
                      res.redirect('/admin/kalkuluak');  
//              }
//              else
//              {
//                res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:rows, taldeizena: req.session.txapelketaizena} );
//              }       
          });
        }
        else if(input.mezumota == "ordgabe" || input.mezumota == "erdiord" || input.mezumota == "onargabe"){
//            connection.query('SELECT * FROM taldeak where idtxapeltalde = ? and (balidatuta <= 4) order by emailard',[req.session.idtxapelketa],function(err,rows)     {  
            req.connection.query('SELECT * FROM taldeak where idtxapeltalde = $1 and (balidatuta <= \'5\') order by emailard',[req.session.idtxapelketa],function(err,wrows)     {  
              if(err)
                console.log("Error Selecting : %s ",err );
              rows = wrows.rows;     //postgres            
              for (var i in rows){
//               if((input.mezumota == "ordgabe" && (rows[i].balidatuta == 2 || rows[i].balidatuta == 1)) || (input.mezumota == "erdiord" && rows[i].balidatuta == 4) || (input.mezumota == "onargabe" && rows[i].balidatuta < 4)){
               if((input.mezumota == "ordgabe" && (rows[i].balidatuta == 4)) || (input.mezumota == "erdiord" && rows[i].balidatuta == 5) || (input.mezumota == "onargabe" && rows[i].balidatuta < 4)){

                rowsif.push(rows[i]);

                if (input.bidali){
                  console.log(rows.length + "- nondik: "+ nondik + "-nora " + nora + "-zenbat " + zenbat);
                  if(i >= nondik && nora < zenbat){ 
                    nora++;

                    if(input.mezumota == "onargabe"){
                      subj = rows[i].taldeizena+"  taldea "+req.session.txapelketaizena+ " txapelketan kanpoan geratu zarete";
                      body = "<h2>"+ req.session.txapelketaizena+ " txapelketan kanpoan geratu zarete : <b>"+rows[i].taldeizena+"</b> </h2>\n" + 

              //                "<h3> Ordaindu duen taldeari dirua itzuliko zaio. </h3>"+
                              "<h3> Ia hurrengo urtean ikusten garen. Milaesker!</h3>\n \n \n"+
                              "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;
                    }
                    else if(input.mezumota == "ordgabe" || input.mezumota == "erdiord"){
                      subj = req.session.txapelketaizena+ " txapelketako zuen taldea : "+rows[i].taldeizena+"  osatu!";
                      body = "<h2> <b>"+rows[i].taldeizena+"</b> Izen-emateko urrats guztiak bete gabe dituzue </h2>\n" + 

                  //            "<h3> Sartu: http://" +hosta+" eta ondoren has ezazu saioa zure datuekin jokalariak gehitu ahal izateko.  </h3> \n" +
                  
                              "<h3> Ordaindu ez baduzue, sartu " +rowst[0].prezioa+" € kontu zenbaki honetan: "+rowst[0].kontukorrontea+ " Gogoratu, 8 pertsonatik gorako taldea bada, jokalariko gehigarriko "+rowst[0].partidukopmin+ "€ gehiago sartu behar dituzuela. Mila esker!</h3>\n \n \n"+
                              "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;
                    }
                    to = rows[i].emailard;
                    emailService.send(to, subj, body);
                    console.log("emaila: "+ i + "-" + nora + "-" + to );
                    req.session.nondik = parseInt(i) + 1;
                  }
                }
               }
              }
              if (input.bidali){    
                if(nondik >= (rows.length - zenbat)){
                  to = "txaparrotan@gmail.com";                     // ADI txapelketako emaila
                  emailService.send(to, subj, body);
                  res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:rowsif, taldeizena: req.session.txapelketaizena} );
                } 
                else
                  if (req.session.nondik != 0) 
                      res.redirect('/admin/mezuakmenua');
                  else
                      res.redirect('/admin/kalkuluak');   
              }
              else
              {
                res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:rowsif, taldeizena: req.session.txapelketaizena} );
              }
             });
          }          

           else if(input.mezumota == "jokgabe"){
//postgres              connection.query('SELECT * FROM taldeak where idtxapeltalde = ? and balidatuta != "admin" and balidatuta >= 0 and NOT EXISTS (SELECT * FROM jokalariak where idtaldeak=idtaldej) order by emailard',[req.session.idtxapelketa],function(err,rows)     {
             req.connection.query('SELECT * FROM taldeak where idtxapeltalde = $1 and balidatuta != \'admin\' and balidatuta > \'0\' and NOT EXISTS (SELECT * FROM jokalariak where idtaldeak=idtaldej) order by emailard',[req.session.idtxapelketa],function(err,wrows)     {
              if(err)
                console.log("Error Selecting : %s ",err );
              rows = wrows.rows;     //postgres
              if(rows.length != 0){
                subj = req.session.txapelketaizena+ " txapelketako zuen taldea osatu!";
                body = "<h2> Jokalariak sartzeko dituzue! </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Sartu: http://" +hosta+" eta ondoren has ezazu saioa zure datuekin jokalariak gehitu ahal izateko.  </h3> \n \n \n"+
                              "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;
                              
              //taldeak2 = mezuaknori(input.bidali,subj,body,rows);
              taldeak2 = mezuaktaldeari(req, input.bidali,subj,body,rows);
              //console.log("Taldeak2: "+JSON.stringify(taldeak2));
              }
              res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, taldeizena: req.session.txapelketaizena} );
       
             });
            }
      });  
   
};

function emailakbidali(i, nondik, nora, zenbat, lenght, to, subj, body){

 if(i >= nondik && nora < zenbat){
   nora++;
//   emailService.send(to, subj, body);

   console.log("emaila: "+ i + "-" + to );
   if(i == length - 1){
        nora = zenbat;
   }
 }
 if(nora == zenbat || (i == length - 1 && (nondik >= length - zenbat))){
    nora++;
    req.session.nondik = parseInt(i) + 1;
    console.log("nondik: "+ rows.length + "-" + req.session.nondik);
 }
}

function mezuaktaldeari(req, bidali,subj,body,rows){
var to;
var nondik = 0, nora = 0;
var zenbat = 10;
var nori =[];

    if (!req.session.nondik){ 
          req.session.nondik = 0;
    }
    nondik = req.session.nondik;
debugger;      
console.log("nondik: "+ nondik + "-nora " + nora + "-zenbat " + zenbat);
        for (var i in rows) { 
          if(i >= nondik && nora < zenbat){
            if (to != rows[i].emailard){
              to = rows[i].emailard;
              nora++;
              if (bidali){
                  emailService.send(to, subj, body);
                  console.log("emaila: "+ i + "-" + to + " - taldea: "+ i + "-" + rows[i].taldeizena);
              }
//              console.log("emaila: "+ i + "-" + to + " - taldea: "+ i + "-" + rows[i].taldeizena);
              if(i == rows.length - 1){
                  nora = zenbat;
              }
            }
          }
          if(nora == zenbat || (i == rows.length - 1 && (nondik >= rows.length - zenbat))){
              nora++;
              req.session.nondik = parseInt(i) + 1;
              console.log("nondik: "+ rows.length + "-" + req.session.nondik);
          }
        }
        return rows;
}

function mezuaknori(bidali,subj,body,rows){
 console.log("Funtzioan sartuta:" +subj);
var taldeak = []; 
var taldea = {};
var jokalariak = []; 
var j;
var t = 0;
var vTalde;
var date = new Date();
var hamarnaka = 0;
      
        for (var i in rows) { 
          if(vTalde != rows[i].idtaldeak){
            if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;
              if(bidali){
                  var to = taldea.emailard;
                  //var cc 
                  emailService.send(to, subj, body);
                  hamarnaka++;
                  if((hamarnaka%10) == 0) {
                      setTimeout(function(){console.log(hamarnaka + ". mezua bidalita " );},60000);
                  }  
              }
            }
            vTalde = rows[i].idtaldeak;
            jokalariak = []; 
            j=0;
            if(rows[i].sortzedata != null){
            data = rows[i].sortzedata;
            rows[i].sortzedata= data.getFullYear() + "-"+ (data.getMonth() +1) +"-"+ data.getDate()+" "+data.getHours()+":"+data.getMinutes();
          }
          
            taldea = {

                  idtaldeak  : rows[i].idtaldeak,
                  taldeizena    : rows[i].taldeizena,
                  herria    : rows[i].herria,
                  DNIard    : rows[i].DNIard,
                  izenaard    : rows[i].izenaard,
                  emailard   : rows[i].emailard,
                  telefonoard    : rows[i].telefonoard,
                  sortzedata: rows[i].sortzedata,
                  balidatuta : rows[i].balidatuta
               };
               
          }
          if (i==0)
            console.log("Jokizena: "+rows[i].jokalariizena);
          if(rows[i].jokalariizena == null){
            
            jokalariak[j] = {
                  jokalariizena    : rows[i].jokalariizena,
                  emailaj   : rows[i].emailaj,
                  telefonoaj: rows[i].telefonoaj,
                  kamisetaneurria : rows[i].kamisetaneurria
               };
          j++;
          }
          
        }
        if(vTalde !=null){
              taldea.jokalariak = jokalariak;
              taldeak[t] = taldea;
              t++;

              if(bidali){
                  var to = taldea.emailard;
                  //var cc 
                  emailService.send(to, subj, body);
              }
        }
        console.log("Taldeak: "+JSON.stringify(taldeak));
        return taldeak;
  
}

function mezuabidali(){
              
}