var bcrypt = require('bcrypt-nodejs');

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var VALID_TEL_REGEX = /^[0-9-()+]{3,20}/;
var VALID_DNI_REGEX = /^\d{8}[a-zA-Z]{1}$/;

exports.ikusi = function (req,res){ 
var mailak = [];
var maila = {};
var taldeak = [];
var j,t;
var k = 0;
var vKategoria, postua;

  req.getConnection(function(err,connection){
    connection.query('SELECT * FROM taldeak,maila where kategoria=idmaila and balidatuta = 1 and idtxapeltalde = ? order by mailazki',[req.session.idtxapelketa],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        for (var i in rows) { 
         
           if(vKategoria != rows[i].kategoria){
            if(vKategoria !=null){
              maila.taldeak = taldeak;
              mailak[k] = maila;
              k++;
            }
            vKategoria = rows[i].kategoria;
            taldeak = []; 
            j=0;
            maila = {
                  kategoria    : rows[i].kategoria,
                  mailaizena  : rows[i].mailaizena
               };
               
          }
          
          taldeak[j] = {
                  postua : j+1,
                  taldeizena    : rows[i].taldeizena,
                  herria    : rows[i].herria,
                  
               };
          j++;

        }
        if(vKategoria !=null){
              maila.taldeak = taldeak;
              mailak[k] = maila;
              k++;
            }
        
        res.render('taldeak.handlebars', {title : 'Txaparrotan-Taldeak', data2:mailak, taldeizena: req.session.taldeizena} );

    });
  });
}


exports.editatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idtalde;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak WHERE idtaldeak = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
          
            res.render('taldeaeditatu.handlebars', {page_title:"Taldea aldatu",data:rows,taldeizena: req.session.taldeizena});
                           
         });
                 
    }); 
};

exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
   var id = req.session.idtalde;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            taldeizena : input.taldeizena,
            kategoria   : input.kategoria,
            herria   : input.herria,
            izenaard   : input.izenaard,
            telefonoard   : input.telefonoard,
            emailard   : input.emailard,
        
        };
        
        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ?  ",[data,id], function(err, rows)
        {
            if(err || rows.length != 0){
        //  res.redirect('/izenematea');
              res.locals.flash = {
                 type: 'danger',
                 intro: 'Adi!',
                 message: 'Saiatu berriz',
              };
            }

              console.log("Error Updating : %s ",err );
         
          res.redirect('/jokalariak');
          
        });
    
    });
  //}
};

exports.saioahasteko = function(req, res){
  var id = req.session.idtxapelketa;
  req.getConnection(function (err, connection) {
      if (err)
              console.log("Error connection : %s ",err ); 
      //connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta = 1) and emailard = ? ',[id],function(err,rows)     {
      connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta = 1) and idtxapeltalde = ? order by taldeizena',[id],function(err,rows)  {
        if (err)
                console.log("Error query : %s ",err ); 
        console.log("taldeak : " + JSON.stringify(rows)); 
        res.render('login.handlebars', {title : 'Txaparrotan-Login',taldeizena: req.session.taldeizena, taldeak : rows});
      });   
  });  
};

exports.login = function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));

  if(!req.body.emailaard.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid name email address.' });
    req.session.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
    return res.redirect(303, '/login');
  }

  if(req.body.emailaard == "admin@txapelketak.eus") {
    req.session.erabiltzaile = "admin@txapelketak.eus";
    return res.redirect(303, '/admin/txapelketak');
  }

  var taldea; 
  req.getConnection(function(err,connection){
       //PASAHITZA ENKRIPTATU GABE
     //connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = idtxapelketa and emailard = ? and pasahitza = ? and (balidatuta = 1 or balidatuta = "admin") and idtaldeak = ? ',
     // [req.body.emailaard,req.body.pasahitza, req.body.sTaldeak],function(err,rows)     {
      //if(err || rows.length == 0){


      //PASAHITZA ENKRIPTATUTA    
      connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = idtxapelketa and emailard = ? and  (balidatuta = 1 or balidatuta = "admin") and idtaldeak = ? ',
      [req.body.emailaard,req.body.sTaldeak],function(err,rows)     {
        if(err || rows.length == 0 || !(bcrypt.compareSync(req.body.pasahitza, rows[0].pasahitza))){

          if(err)
            console.log("Error Selecting : %s ",err );
          if(req.xhr) return res.json({ error: 'Invalid name email address.' });
             req.session.flash = {
             type: 'danger',
             intro: 'Adi!',
             message: 'Emaila edo pasahitza ez da zuzena.',
          };
          return res.redirect(303, '/login');
  
        }
        else if(rows[0].balidatuta == "admin"){
            req.session.idtxapelketa = rows[0].idtxapeltalde;
            req.session.txapelketaizena = rows[0].txapelketaizena;
            req.session.idtalde = rows[0].idtaldeak; 
            req.session.taldeizena = rows[0].taldeizena;
            req.session.erabiltzaile = rows[0].balidatuta;
            req.session.idgrupo = rows[0].idgrupot;
            return res.redirect(303, '/txapelketakeditatu');
        }
        else {
         req.session.idtalde = rows[0].idtaldeak;  
         req.session.idtxapelketa = rows[0].idtxapeltalde;
         req.session.txapelketaizena = rows[0].txapelketaizena;
         req.session.taldeizena = rows[0].taldeizena;
         req.session.erabiltzaile = rows[0].balidatuta;
         req.session.idgrupo = rows[0].idgrupot;

       if(req.xhr) return res.json({ success: true });
           req.session.flash = {
           type: 'success',
           intro: 'Ongi-etorri!',
           message: 'Zure datuak ikusi ditzakezu',
        };

      /*if(req.path == "/taldeak"){
        return res.redirect('/jokalariak');
      }
      else if(req.path == "/sailkapenak"){
        return res.redirect('/jokalariak');
      }*/
       
        return res.redirect('/jokalariak');
       
        //res.render('jokalariak.handlebars', {title : 'Txaparrotan-Taldea', taldeak:taldea} );

        }
        

                           
         });
       
    });
  
};

exports.bilatu = function(req, res){
  var taldea;
  var id = req.session.idtalde;
  //var id = req.params.id;
  req.getConnection(function(err,connection){
    
    
     connection.query('SELECT * FROM taldeak where idtaldeak = ?',[id],function(err,rows)     {
            
        if(err)

           console.log("Error Selecting : %s ",err );
         
        taldea = rows;       
   
        connection.query('SELECT * FROM jokalariak where idtaldej= ?',[id],function(err,rows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
         
          res.render('jokalariak.handlebars', {title : 'Txaparrotan-Datuak', data2:taldea , data:rows, taldeizena: req.session.taldeizena} );

                           
         });
       });
    });
  
};
exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers-Node.js"});
};
exports.edit = function(req, res){
    
  var id = req.params.id;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:rows});
                           
         });
                 
    }); 
};

exports.izenematea = function(req,res){

    res.locals.flash = null;
    var now= new Date();
    var vHasiera,aHasiera,hasiera,vBukaera,aBukaera,bukaera;
           console.log("IdTxaelketa : %s ",req.session.idtxapelketa );
    req.getConnection(function(err,connection){
      connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[req.session.idtxapelketa],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        connection.query('SELECT count(*) as guztira FROM taldeak where idtxapeltalde= ? and balidatuta != "admin" ',[req.session.idtxapelketa],function(err,rowsg)     {
          if(err)
           console.log("Error Selecting : %s ",err );
        if(rows.length != 0) {
          vHasiera = new Date();
          hasiera = rows[0].inskripziohasierae;

          aHasiera = hasiera.split("-");
          vHasiera.setDate(aHasiera[2]);
          vHasiera.setMonth(aHasiera[1] - 1);
          vHasiera.setYear(aHasiera[0]);

          vBukaera = new Date();
          bukaera = rows[0].inskripziobukaerae;
          aBukaera = bukaera.split("-");
          vBukaera.setDate(aBukaera[2]);
          vBukaera.setMonth(aBukaera[1] - 1);
          vBukaera.setYear(aBukaera[0]);  

        if(vHasiera > now) {
          if(req.xhr) return res.json({ error: 'Invalid hasiera' });
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: rows[0].inskripziohasierae + ' irekitzen da izen-ematea.',
          };
        }

        else if(vBukaera < now) {
          if(req.xhr) return res.json({ error: 'Invalid bukaera' });
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: rows[0].inskripziobukaerae + ' bukatu zen izen-ematea.',
          };
        }

        else if(rowsg[0].guztira >= rows[0].taldekopmax) {
           if(req.xhr) return res.json({ error: 'Invalid beteta' });
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Talde kopurua beteta.',
          };
         }
        }        
        if(res.locals.flash != null){
         //res.redirect(303,'/');
          res.render('kontaktua.handlebars', {title : 'Txaparrotan-Kontaktua', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa});

        }
        else{
          res.render('taldeaksortu.handlebars', {title : 'Txaparrotan-Izen-ematea', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa});
        }
      });
     });
    });
}
exports.sortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    res.locals.flash = null;
    var now= new Date();

    if(!req.body.DNIard.match(VALID_DNI_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid DNI' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'NANa ez da zuzena',
    };
   // return res.render('taldeaksortu.handlebars', {DNIard: DNI});
    //return res.redirect(303, '/izenematea');
  }

    else if(!req.body.telefonoard.match(VALID_TEL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid telefono' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Telefonoa ez da zuzena',
    };
    //return res.redirect(303, '/izenematea');
  }

  else if(!req.body.emailard.match(VALID_EMAIL_REGEX)) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emaila ez da zuzena',
    };
   // return res.redirect(303, '/izenematea');
  }

  else if(req.body.pasahitza != req.body.pasahitza2) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Pasahitzak ez dira berdinak',
    };
   // return res.redirect(303, '/izenematea');
  }



  if(res.locals.flash != null){
         return res.render('taldeaksortu.handlebars', {
            taldeizena: req.body.taldeizena,
            kategoria   : req.body.kategoria,
            herria   : req.body.herria,
            DNIard    : req.body.DNIard,
            izenaard   : req.body.izenaard,
            telefonoard   : req.body.telefonoard,
            emailard   : req.body.emailard

          } );
   }
  
  req.getConnection(function (err, connection) {

      connection.query('SELECT * FROM taldeak where taldeizena = ?',[req.body.taldeizena],function(err,rows)  {
            
        if(err || rows.length != 0){
        //  res.redirect('/izenematea');
        res.locals.flash = {
          type: 'danger',
          intro: 'Adi!',
          message: 'Beste talde izen bat sartu!',
        };

        return res.render('taldeaksortu.handlebars', {
            taldeizena: req.body.taldeizena,
            kategoria   : req.body.kategoria,
            herria   : req.body.herria,
            DNIard    : req.body.DNIard,
            izenaard   : req.body.izenaard,
            telefonoard   : req.body.telefonoard,
            emailard   : req.body.emailard,
            pasahitza: req.body.pasahitza

          } );
        }
        // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(input.pasahitza, salt);

          

            var data = {
            
            taldeizena    : input.taldeizena,
            idtxapeltalde : req.session.idtxapelketa,
            kategoria   : input.kategoria,
            herria   : input.herria,
            DNIard    : input.DNIard,
            izenaard   : input.izenaard,
            telefonoard   : input.telefonoard,
            emailard   : input.emailard,
            pasahitza:   password_hash,     //input.pasahitza,
            sortzedata : now,
            lehentasuna : 99
        };

        var query = connection.query("INSERT INTO taldeak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

        //Enkriptatu talde zenbakia. Zenbaki hau aldatuz gero, taldea balidatu ere aldatu!
         var taldezenbakia= rows.insertId * 3456789;
            
         var to = input.emailard;
         var subj = "Ongi-etorri " + data.izenaard;
         var body = "Taldea balidatu ahal izateko klik egin: http://localhost:3000/taldeabalidatu/" + taldezenbakia + "\n Ondoren, saioa hasi eta zure jokalariak gehitu. Hori egin arte, zure taldea ez da apuntaturik egongo. Mila esker!";
          req.session.idtalde = rows.insertId;
          emailService.send(to, subj, body);
          //res.redirect('/taldeak');
          res.render('taldeaeskerrak.handlebars', {title: "Mila esker!", taldeizena:data.taldeizena, emailard:data.emailard});
          
        }); 
      });
    });
};


exports.balidatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idEnkript = req.params.id;

    //ADI! taldeasortu-n aldatu balio hau aldatuz gero
    var id = idEnkript / 3456789;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            balidatuta    : 1
        
        };
        
        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
          
        });
    
    });
};

exports.forgot = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
         var to = input.emailaard;
         var subj ="Pasahitza ahaztu al duzu?";
         var body = "Klik egin http://localhost:3000/reset/" +req.body.sTaldeak ;
        
          emailService.send(to, subj, body);

    res.redirect('/login');
    };

exports.reset = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.idtalde;
    //var id = 17;

    if(input.pasahitza != input.pasahitza2){
      res.redirect('/reset/' +id);
    }
    
    else{
    req.getConnection(function (err, connection) {

         // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(input.pasahitza, salt);

        var data = {
            
            pasahitza    :  password_hash     //input.pasahitza 
        
        };
        
        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
          
        });
    
    });
  }
};

exports.delete_customer = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/customers');
             
        });
        
     });
};

/*exports.partiduak = function(req, res){
  var taldea;
  var id = req.session.idtalde;
  //var id = req.params.id;
  req.getConnection(function(err,connection){
    
    
    connection.query('SELECT *,t1.taldeizena taldeizena1,t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1,taldeak t2,grupoak where idgrupop=idgrupo and t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and t1.idtxapeltalde = ? and t2.idtxapeltalde = ? and (p.idtalde1 = ? or p.idtalde2 = ? )order by pareguna, parordua,zelaia',[id, id, id,id],function(err,rows)     {
     
            
        if(err)

           console.log("Error Selecting : %s ",err );
        
        console.log(rows);
        res.render('emaitzak.handlebars', {title : 'Txaparrotan-Emaitzak', data2: rows, taldeizena: req.session.taldeizena});
                           

       });
    });
  
};*/
