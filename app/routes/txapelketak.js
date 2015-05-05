var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;

 var path = require('path'),
  fs = require('fs'),
  formidable = require('formidable');
  var bcrypt = require('bcrypt-nodejs');

// make sure data directory exists
//var dataDir = path.normalize(path.join(__dirname, '..', 'data'));
var dataDir = path.normalize(path.join(__dirname, '../public', 'data'));
console.log(dataDir);
var argazkiakDir = path.join(dataDir, 'argazkiak');
fs.existsSync(dataDir) || fs.mkdirSync(dataDir); 
fs.existsSync(argazkiakDir) || fs.mkdirSync(argazkiakDir);

exports.aukeratzeko = function(req, res){

  req.getConnection(function (err, connection) {
      if (err)
              console.log("Error connection : %s ",err ); 
      connection.query('SELECT idtxapelketa, txapelketaizena FROM txapelketa',function(err,rows)  {
        if (err)
                console.log("Error query : %s ",err ); 
        console.log("txapelketak : " + JSON.stringify(rows)); 
        res.render('txapelketakaukeratzeko.handlebars', {title : 'Txaparrotan-Txapelketa aukeratzeko', txapelketak : rows});
      });   
  });  
};

exports.aukeratu = function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));

  req.session.idtxapelketa = req.body.sTxapelketak;

return res.redirect('/');
  
};

exports.sortu = function(req,res){
    var idtxapelketa;
    var input = JSON.parse(JSON.stringify(req.body));
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

      console.log(req.body.taldeizena); 
         return res.render('txapelketaksortu.handlebars', {
            txapelketaizena: req.body.txapelketaizena,
            taldeizena: req.body.taldeizena,
            emailard   : req.body.emailard,
            pasahitza: req.body.pasahitza

          } );
  };

    req.getConnection(function (err, connection) {
      //2015-03-24
      if (err)
              console.log("Error connection : %s ",err ); 
            //

      connection.query('SELECT * FROM taldeak where taldeizena = ?',[req.body.taldeizena],function(err,rows)  {
          
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

        var data = {
            txapelketaizena    : input.txapelketaizena
        };
        
        var query = connection.query("INSERT INTO txapelketa set ? ",data, function(err, rows)
        {
          if (err)
              console.log("Error inserting : %s ",err ); 

          idtxapelketa = rows.insertId;

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
        
        console.log(data);
        var query = connection.query("INSERT INTO taldeak set ? ",data, function(err, rows)
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
    req.getConnection(function (err, connection) {
 
        var query = connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[id],function(err,rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
          
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
              prest : rows[0].prest,
              buelta : rows[0].buelta,
              taldeizena: req.session.txapelketaizena

            });
          
        });
        
       // console.log(query.sql); 
    
    });
};

exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id= req.session.idtxapelketa;
    req.getConnection(function (err, connection) {
        
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
            buelta : input.buelta
        };
        
        console.log(data);
        var query = connection.query("UPDATE txapelketa set ? WHERE idtxapelketa = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/admin/berriak');
          
        });
        
       // console.log(query.sql); 
    
    });
};


exports.berriaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("Bidali:" + input.bidali);
    var id = req.session.idtxapelketa;
    var now= new Date();

    var hosta = req.hostname;
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }

    req.getConnection(function (err, connection) {
        
        var data = {
            
            izenburua    : input.izenburua,
            testua   : input.testua,
            data: now,
            idtxapel : id
        };
        
  
        var query = connection.query("INSERT INTO berriak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          if(input.bidali){
              var query = connection.query('SELECT * FROM taldeak where idtxapeltalde = ?',[id],function(err,rows)
              {
                for (var i in rows){
                  var to = rows[i].emailard;
                  var subj = req.session.txapelketaizena+ "-n berria: "+input.izenburua;
                  var body = "<h2>"+input.izenburua+"</h2>\n" + 
                              "<p>"+ input.testua+ "</p> \n"+
                              "<h3> Gehiago jakin nahi baduzu, sartu: http://"+hosta+"</h3>" ;
                  emailService.send(to, subj, body);
                }
              });
          }
          res.redirect('/admin/berriak');
        });
        
       // console.log(query.sql); 
    
    });
};

exports.berriakikusi = function(req, res){
  var id = req.session.idtxapelketa;

  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM berriak where idtxapel = ? order by data desc',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
        connection.query('SELECT * FROM txapelketa where idtxapelketa = ? ',[id],function(err,rowst)     {
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('index.handlebars',{title: "Txaparrotan", taldeizena: req.session.taldeizena, data:rows, data2: rowst});
        });                        
      });   
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

exports.argazkiakikusi = function(req, res){
  var argazkiak = [];
  var argazkia = {};
  debugger;
  var idtxapelketa = req.session.idtxapelketa;
  var txapelketadir = argazkiakDir + '/' + idtxapelketa;
  //var txapelketadir = path.join(argazkiakDir, idtxapelketa);
  fs.existsSync(txapelketadir) || fs.mkdirSync(txapelketadir);
  fs.readdir(txapelketadir, function (err, files) {
  if (err) throw err;
  console.log("/usr files: " + files);
  for (var i in files){
    //argazkiak[i] = files[i];
    console.log(files[i]);
    argazkia = {
                  files    : files[i],
                  idtxapelketa  : req.session.idtxapelketa
               };
    
    argazkiak[i] = argazkia;
  }
  console.log(JSON.stringify(argazkiak));
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

    req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde=idtxapelketa and idtxapeltalde = ? and balidatuta="admin" order by sortzedata',[req.session.idtxapelketa],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
    
        var to = rows[0].emailard;
         var subj = "Web orriko zalantza " +rows[0].txapelketaizena+":" + input.izenabizen;
         var body = "Izen abizenak: " + input.izenabizen + "\n Emaila: " + input.email + "\n Telefonoa" + input.telef + "\n Herria: " + input.herri+ "\n Azalpena:" + input.azalpena;
          console.log("input:" + input.izenabizen);
          emailService.send(to, subj, body);

          res.locals.flash = {
              type: 'success',
              intro: 'Bidalita!',
              message: 'Egun gutxiren buruan erantzuna jasoko duzu!',
          };
              res.redirect(303,'/');

       });
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
  req.getConnection(function(err,connection){
      connection.query('SELECT * FROM taldeak LEFT JOIN jokalariak ON idtaldeak=idtaldej WHERE idtxapeltalde = ? and balidatuta != "admin" order by idtaldeak, idjokalari',[req.session.idtxapelketa],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
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
                  herria    : rows[i].herria,
                  DNIard    : rows[i].DNIard,
                  izenaard    : rows[i].izenaard,
                  emailard   : rows[i].emailard,
                  telefonoard    : rows[i].telefonoard,
                  sortzedata: rows[i].sortzedata,
                  balidatuta : rows[i].balidatuta
               };
               
          }
          jokalariak[j] = {
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
  });
}


exports.mantenimentu = function(req, res){
  var now= new Date();

  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak WHERE idtaldeak > 172',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
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
        
            connection.query("UPDATE taldeak set ? WHERE idtaldeak = ?  ",[data,rows[i].idtaldeak], function(err, rows)
            {
                if(err)

                  console.log("Error Updating : %s ",err );
             
              
            });
          }
                           
         });
                 
    }); 
};

exports.zelaiakbilatu = function(req, res){
  
  var id = req.session.idtxapelketa;

  req.getConnection(function(err,connection){     
   
        connection.query('SELECT * FROM zelaia where idtxapelz= ?',[id],function(err,rows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('zelaiak.handlebars', {title : 'Txaparrotan-Zelaiak', data:rows, taldeizena: req.session.taldeizena} );

       });
    });
  
};

exports.zelaiakeditatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idtxapelketa;
  var idzelai = req.params.idzelaia;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM zelaia WHERE idtxapelz = ? and idzelaia = ?',[id,idzelai],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('zelaiakeditatu.handlebars', {page_title:"Zelaia aldatu",data:rows, taldeizena: req.session.taldeizena});
                           
         });
                 
    }); 
};

exports.zelaiaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idtxapelketa;

    req.getConnection(function (err, connection) {
        
        var data = {
            
            zelaiizena : input.zelaiizena,
            zelaizki   : input.zelaizki,
            idtxapelz    : id
        };
        
        console.log(data);
        var query = connection.query("INSERT INTO zelaia set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/zelaiak');
          
        });
    
    });
};
exports.zelaiakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idtxapelketa;
    var idzelai = req.params.idzelaia;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            zelaiizena : input.zelaiizena,
            zelaizki   : input.zelaizki

        };
        
        connection.query("UPDATE zelaia set ? WHERE idtxapelz = ? and idzelaia = ? ",[data,id,idzelai], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/zelaiak');
          
        });
    
    });
};

exports.zelaiakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtxapelketa;
     var idzelai = req.params.idzelaia;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM zelaia  WHERE idtxapelz = ? and idzelaia = ?",[id,idzelai], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/zelaiak');
             
        });
        
     });
};

exports.mailakbilatu = function(req, res){
  
  var id = req.session.idtxapelketa;

  req.getConnection(function(err,connection){     
   
        connection.query('SELECT * FROM maila where idtxapelm= ?',[id],function(err,rows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('mailak.handlebars', {title : 'Txaparrotan-Mailak', data:rows, taldeizena: req.session.taldeizena} );

       });
    });
  
};

exports.mailakeditatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idtxapelketa;
  var idmaila = req.params.idmaila;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM maila WHERE idtxapelm = ? and idmaila = ?',[id,idmaila],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('mailakeditatu.handlebars', {page_title:"Maila aldatu",data:rows, taldeizena: req.session.taldeizena});
                           
         });
                 
    }); 
};

exports.mailaksortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.session.idtxapelketa;

    req.getConnection(function (err, connection) {
        
        var data = {
            
            mailaizena : input.mailaizena,
            mailazki   : input.mailazki,
            akronimoa   : input.akronimoa,
            idtxapelm    : id
        };
        
        console.log(data);
        var query = connection.query("INSERT INTO maila set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/admin/mailak');
          
        });
    
    });
};
exports.mailakaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idtxapelketa;
    var idmaila = req.params.idmaila;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            mailaizena : input.mailaizena,
            mailazki   : input.mailazki,
            multzokop  : input.multzokop,
            akronimoa : input.akronimoa,
            finalak     : input.finalak

        };
        
        connection.query("UPDATE maila set ? WHERE idtxapelm = ? and idmaila = ? ",[data,id,idmaila], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/mailak');
          
        });
    
    });
};

exports.mailakezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtxapelketa;
     var idmaila = req.params.idmaila;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM maila  WHERE idtxapelm = ? and idmaila = ?",[id,idmaila], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/mailak');
             
        });
        
     });
};


exports.mezuakbidali = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("Bidali:" + input.bidali);
    var id = req.session.idtxapelketa;
    var taldeak2;

    req.getConnection(function (err, connection) {
         
        if(input.mezumota == "prest"){

            connection.query('SELECT * FROM taldeak,jokalariak where idtaldeak=idtaldej and idtxapeltalde = ? and balidatuta > 0 order by idtaldeak, idjokalari',[req.session.idtxapelketa],function(err,rows)     {
              if(err)
                console.log("Error Selecting : %s ",err );
              var subj = req.session.txapelketaizena+ " txapelketa prest";
              var body = "<h2> Txapelketa prest </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Sartu: http://www.txaparrotan.eus</h3>" ;
              taldeak2 = mezuaknori(input.bidali,subj,body,rows);

              console.log("Taldeak2: "+JSON.stringify(taldeak2));

              res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, taldeizena: req.session.txapelketaizena} );
       
             });
        }

        else if(input.mezumota == "ordgabe"){

              var query = connection.query('SELECT * FROM taldeak where idtxapeltalde = ? and balidatuta < 5 and balidatuta > 0',[id],function(err,rows)
              {

                if(err)
                  console.log("Error Selecting : %s ",err );

                var subj = req.session.txapelketaizena+ " txapelketa ordainketa egin mesedez!";
                var body = "<h2> Ordainketa egin mesedez! </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Sartu dirua kontu zenbaki honetan: .......>" ;
               taldeak2 = mezuaknori(input.bidali,subj,body,rows);

               console.log("Taldeak2: "+JSON.stringify(taldeak2));

               res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, taldeizena: req.session.txapelketaizena} );
       
          });
        }

        else if(input.mezumota == "jokgabe"){

              connection.query('SELECT * FROM taldeak where idtxapeltalde = ? and balidatuta != "admin" and balidatuta > 0 and NOT EXISTS (SELECT * FROM jokalariak where idtaldeak=idtaldej) order by idtaldeak',[req.session.idtxapelketa],function(err,rows)     {
              if(err)
                console.log("Error Selecting : %s ",err );

              var subj = req.session.txapelketaizena+ " txapelketan jokalariak gehitu";
              var body = "<h2> Jokalariak sartzeko dituzue </h2>\n" + 
                              "<p>"+ req.session.txapelketaizena+ "</p> \n"+
                              "<h3> Sartu: http://www.txaparrotan.eus eta ondoren has ezazu saioa zure datuekin jokalariak gehitu ahal izateko</h3>" ;
              taldeak2 = mezuaknori(input.bidali,subj,body,rows);

              console.log("Taldeak2: "+JSON.stringify(taldeak2));

              res.render('taldeakadmin.handlebars', {title : 'Txaparrotan-Mezuak', data2:taldeak2, taldeizena: req.session.txapelketaizena} );
       
             });
        }
        
     });   
};

function mezuaknori(bidali,subj,body,rows){
 console.log("Funtzioan sartuta:" +subj);
var taldeak = []; 
var taldea = {};
var jokalariak = []; 
var j;
var t = 0;
var vTalde;
var date = new Date();
      
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