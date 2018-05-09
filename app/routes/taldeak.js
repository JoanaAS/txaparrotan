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
var admin = (req.path == "/admin/taldeak");

  req.getConnection(function(err,connection){
    connection.query('SELECT * FROM taldeak,maila where kategoria=idmaila and (balidatuta = "admin" or balidatuta >= 1) and idtxapeltalde = ? order by mailazki,sortzedata',[req.session.idtxapelketa],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
/*
        if(rows.length == 0){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Inskripzio epea zabalik bada, izena eman'
           };
           return res.redirect('/izenematea'); 
        };
*/
        for (var i in rows) { 
          if ((rows[i].balidatuta >= 1 && admin) || (rows[i].balidatuta >= 4 && !admin)) 
          {  
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
        }
        if(vKategoria !=null){
              maila.taldeak = taldeak;
              mailak[k] = maila;
              k++;
        }
        
        res.render('taldeak.handlebars', {title : 'Txaparrotan-Taldeak', data2:mailak, taldeizena: req.session.taldeizena, menuadmin: admin} );

    });
  });
}



exports.taldemail = function(req, res){

  var id = req.params.emaila;

  req.getConnection(function(err,connection){
       
     connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta >= 1) and emailard = ? and idtxapeltalde = ?',[id,req.session.idtxapelketa],function(err,rows)     
     
        {
            if(err)
                console.log("Error Selecting : %s ",err );

            //res.render('forgot.handlebars', {title : 'Txaparrotan-Forgot', emailaard : id, taldeak : rows });
            res.json(rows);
         });
                  
  }); 
};

exports.editatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idtalde;
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM taldeak WHERE idtaldeak = ?',[id],function(err,rows)
        {
          if(err)
              console.log("Error Selecting : %s ",err );          
          connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
            if(err)
              console.log("Error Selecting : %s ",err );

            for(var i in rowsm ){
               if(rows[0].kategoria == rowsm[i].idmaila){
                  mailaizena = rowsm[i].mailaizena;
                  rowsm[i].aukeratua = true;
               }
               else
                  rowsm[i].aukeratua = false;
            }

            rows[0].mailak = rowsm;
            console.log("Taldea:"+rows[0].taldeizena);
            res.render('taldeaeditatu.handlebars', {title:"Taldea aldatu",data:rows,taldeizena: req.session.taldeizena});
                           
          });
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
      connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta >= 1) and idtxapeltalde = ? order by taldeizena',[id],function(err,rows)  {
        if (err)
                console.log("Error query : %s ",err ); 
      //  console.log("taldeak : " + JSON.stringify(rows)); 
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
      connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = idtxapelketa and emailard = ? and  (balidatuta >= 1 or balidatuta = "admin") and idtaldeak = ? ',
      [req.body.emailaard,req.body.sTaldeak],function(err,rows)     {
        if(err || rows.length == 0 || !(bcrypt.compareSync(req.body.pasahitza, rows[0].pasahitza))){

          if(err)
            console.log("Error Selecting : %s ",err );
          if(req.xhr) return res.json({ error: 'Invalid name email address.' });
             req.session.flash = {
             type: 'danger',
             intro: 'Adi!',
             message: 'Emaila, taldea edo pasahitza ez da zuzena.',
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
  var now= new Date();
  //var id = req.params.id;
  var bukaera,aBukaera, vBukaera,aldaketabai;
  var aldaketa = {};
  var aldaketarray = [];
  req.getConnection(function(err,connection){
    
    
     connection.query('SELECT * FROM taldeak,maila,txapelketa where idmaila = kategoria and idtxapelketa=idtxapeltalde and idtaldeak = ?',[id],function(err,rows)     {
            
      if(err)

           console.log("Error Selecting : %s ",err );
      if (rows.length == 0) {
          res.redirect('/logout');
        }
      else{
        vBukaera = new Date();
        bukaera = rows[0].inskripziobukaerae;
        aBukaera = bukaera.split("-");
        vBukaera.setDate(aBukaera[2]);
        vBukaera.setMonth(aBukaera[1] - 1);
        vBukaera.setYear(aBukaera[0]);

        if(vBukaera > now){
          aldaketabai = true;
        }
        else{
          aldaketabai = false;
        }

        taldea = rows;
        rows[0].aldaketabai = aldaketabai;
        aldaketa.aldaketabai = aldaketabai;
        aldaketarray[0] = aldaketa;

        //console.log("aldaketabai : %s ",aldaketabai ); 
        //console.log("aldaketa : " + JSON.stringify(aldaketarray)); 
        //console.log("taldea : " + JSON.stringify(rows));
   
        connection.query('SELECT * FROM jokalariak where idtaldej= ?',[id],function(err,rowsj)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );

          for(var i in rowsj ){
               rowsj[i].aldaketabai = aldaketabai;
          }

         // console.log("jokalariak : " + JSON.stringify(rowsj));

          res.render('jokalariak.handlebars', {title : 'Txaparrotan-Datuak', data2:rows , data:rowsj, aldaketabai : aldaketabai, taldeizena: req.session.taldeizena} );
                         
         });
        }
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
    var tope = 0;
    var aditestua = "Izen-ematea";
    var vHasiera,aHasiera,aHasieraOrdua,hasiera,vBukaera,aBukaera,bukaera;
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
          aHasieraOrdua = rows[0].inskripziohasierao.split(":");
          vHasiera.setHours(aHasieraOrdua[0],aHasieraOrdua[1],0);

          vHasiera.set
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
          aditestua = "Oraindik apuntatzeko epea ireki gabe.";
        }

        else if(vBukaera < now) {
          if(req.xhr) return res.json({ error: 'Invalid bukaera' });
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: rows[0].inskripziobukaerae + ' bukatu zen izen-ematea.',
          };
          aditestua = "Apuntatzeko epea bukatuta!"
        }

        else if(rowsg[0].guztira >= rows[0].taldekopmax) {
           if(req.xhr) return res.json({ error: 'Invalid beteta' });
            tope = 1;
            res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Talde kopurua beteta. Itxaron zerrendan geratu nahi baduzu, ondorengo datuak bete mesedez.',
          };
          //aditestua = "Talde kopurua beteta! Txapelketa itxita dago! Hala ere, idatzi zuen taldearen izena eta zein mailetakoak zareten (sexua barne) eta posible izanez gero, zuekin kontaktuan jarriko gara!";
          aditestua = "Talde kopurua beteta! Itxaron zerrendan geratu nahi baduzu, ondorengo datuak bete mesedez.";
         }
         
        }        
        if((res.locals.flash != null) && (tope == 0)){
         //res.redirect(303,'/');
          res.render('kontaktua.handlebars', {title : 'Txaparrotan-Kontaktua', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, aditestua:aditestua});

        }
        else{
          //connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? and multzokop <> 9',[req.session.idtxapelketa],function(err,rowsm)     {
          connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
            if(err)
              console.log("Error Selecting : %s ",err );

          res.render('taldeaksortu.handlebars', {title : 'Txaparrotan-Izen-ematea', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, mailak:rowsm, aditestua:aditestua});
         });
        }
      });
     });
    });
}
exports.sortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    res.locals.flash = null;
    var now= new Date();
    var aditestua;
    var topetalde = 0;

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

  else if(req.body.emailard != req.body.emailard2) {
    if(req.xhr) return res.json({ error: 'Invalid mail' });
    res.locals.flash = {
      type: 'danger',
      intro: 'Adi!',
      message: 'Emailak ez dira berdinak',
    };
   // return res.redirect(303, '/izenematea');
  }

  req.getConnection(function (err, connection) {
   connection.query('SELECT * FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
      if(err)
        console.log("Error Selecting : %s ",err ); 

      for(var i in rowsm ){
          if(req.body.kategoria == rowsm[i].idmaila){
            mailaizena = rowsm[i].mailaizena;
            rowsm[i].aukeratua = true;
            if(rowsm[i].multzokop == 9)
              topetalde = 1;
          }
          else
            rowsm[i].aukeratua = false;
      }
 
      if(res.locals.flash != null){

         return res.render('taldeaksortu.handlebars', {
            title : 'Txaparrotan-Izen-ematea',
            // taldeizena : req.session.taldeizena,
            idtxapelketa : req.session.idtxapelketa,
            mailak : rowsm,
            taldeizena: req.body.taldeizena,
            kategoria   : req.body.kategoria,
            herria   : req.body.herria,
            DNIard    : req.body.DNIard,
            izenaard   : req.body.izenaard,
            telefonoard   : req.body.telefonoard,
            emailard   : req.body.emailard,
            emailard2 : req.body.emailard2

          } );
      }
  
//  req.getConnection(function (err, connection) {

      connection.query('SELECT * FROM taldeak where idtxapeltalde= ? and (taldeizena = ? or emailard = ?)',[req.session.idtxapelketa, req.body.taldeizena, req.body.emailard],function(err,rows)  {

 //      connection.query('SELECT * FROM taldeak where idtxapeltalde= ? and taldeizena = ?',[req.session.idtxapelketa, req.body.taldeizena],function(err,rows)  {
            
        if(err || rows.length != 0){
          if (rows[0].taldeizena == req.body.taldeizena)
          {
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste talde izen bat sartu!',
           };
          }
          else 
          {
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste email batekin izen-eman behar duzu! Dagoenekoz email horrekin talde bat sortuta duzu eta. Email batekin talde bat bakarrik sor daiteke!',
           };
          }
           return res.render('taldeaksortu.handlebars', {
            title : 'Txaparrotan-Izen-ematea',
            // taldeizena : req.session.taldeizena,
            idtxapelketa : req.session.idtxapelketa,
            mailak : rowsm,
            taldeizena: req.body.taldeizena,
            kategoria   : req.body.kategoria,
            herria   : req.body.herria,
            DNIard    : req.body.DNIard,
            izenaard   : req.body.izenaard,
            telefonoard   : req.body.telefonoard,
            emailard   : req.body.emailard,
            emailard2 : req.body.emailard2

           });
        }
        connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[req.session.idtxapelketa],function(err,rowst)  {          
            
            if(err)
                console.log("Error inserting : %s ",err );
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
            balidatuta : 0,
            lehentasuna : 99,
            sexua : " "
           };

           var query = connection.query("INSERT INTO taldeak set ? ",data, function(err, rows)
           {
  
            if (err)
              console.log("Error inserting : %s ",err );
            connection.query('SELECT count(*) as guztira FROM taldeak where idtxapeltalde= ? and balidatuta != "admin" ',[req.session.idtxapelketa],function(err,rowsg)     {
                if(err)
                  console.log("Error Selecting : %s ",err );

                if(rowsg[0].guztira >= rowst[0].taldekopmax) {
                  if(req.xhr) return res.json({ error: 'Invalid beteta' });
                  res.locals.flash = {
                      type: 'danger',
                      intro: 'Adi!',
                      message: 'Talde kopurua beteta. Itxaron zerrendan sartu dugu zure taldea',
                  };
                aditestua = "Talde kopurua beteta! Itxaron zerrendan sartu dugu zure taldea, jolasteko aukerarik izanez gero, mezu bat jasoko duzue. Adi egon!";
                }
                
                if(topetalde == 1) {
                  if(req.xhr) return res.json({ error: 'Invalid beteta' });
                  res.locals.flash = {
                      type: 'danger',
                      intro: 'Adi!',
                      message: 'Maila horretako talde kopurua beteta. Itxaron zerrendan sartu dugu zure taldea',
                  };
                aditestua = "Maila horretako talde kopurua beteta! Itxaron zerrendan sartu dugu zure taldea, jolasteko aukerarik izanez gero, mezu bat jasoko duzue. Adi egon!";
                }

                if(res.locals.flash != null){
                   res.render('kontaktua.handlebars', {title : 'Txaparrotan-Kontaktua', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, aditestua:aditestua});
                }
                else{
         
               //Enkriptatu talde zenbakia. Zenbaki hau aldatuz gero, taldea balidatu ere aldatu + taldeabalekoa!
         var taldezenbakia= rows.insertId * 3456789;
         var mailaizena;   
         var to = input.emailard;
         var subj = "Ongi-etorri " + data.izenaard;
         var hosta = req.hostname;
         if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
         }
         for(var i in rowsm ){
          if(data.kategoria == rowsm[i].idmaila){
            mailaizena = rowsm[i].mailaizena;
          }
         }
         var body = "<p>1."+data.taldeizena+" taldea "+mailaizena+" mailan balidatu ahal izateko, </p>";
         body += "<h3> klik egin: http://"+hosta+"/taldeabalidatu/" + taldezenbakia+ ". </h3>";
         body += "<p>2. Ondoren, saioa hasi eta zure jokalariak gehitu.</p> <p>3. Hori egindakoan, " +rowst[0].kontukorrontea+ " kontu korrontean  "+rowst[0].prezioa+ "euro sartu eta kontzeptu bezala "+data.taldeizena+"-"+data.izenaard+" jarri.</p>";
         body += '<p style="color:#FF0000">4. Hau egin ezean, zure taldea ez da txapelketan apuntatuta egongo. Behin ordainketa egindakoan eta guk hau berrikusitakoan (astebeteko mugarekin), beste email bat jasoko duzu ONARTUA izan zarela adierazten. Hau jaso arte, ez zaudela onartua garbi utzi nahi dugu</p>';
         body += "<p style='color:#0000FF'>5. Txapelketak dituen mugak gainditu ezinak ditugunez: asteburu batean eta 6 jokutoki, izena emandako taldeak topea gainditu ezkero, antolakuntzak, astebetera, zein talde izan diren onartuak adieraziko ditu. Ordaindu duen talderen bat kanpoan geldituko balitz, dirua bueltatuko litzaioke.</p>";
         body += "<p style='color:#FF0000'>6. Eguraldi txarra medioz, antolakuntzak ahalegin guztiak egingo ditu txapelketa bertan behera ez gelditzeko. Bertan behera gelditu ezkero, antolakuntza ez da kargo egiten gertatzen denarekin. Mila esker!</p> \n \n";
         body += "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;

          req.session.idtalde = rows.insertId;
          emailService.send(to, subj, body);
          //res.redirect('/taldeak');
          res.render('taldeaeskerrak.handlebars', {title: "Mila esker!", taldeizena:data.taldeizena, txapelketaizena:req.session.txapelketaizena, kk:rowst[0].kontukorrontea, prezio: rowst[0].prezioa, emailard:data.emailard, izenaard: data.izenaard,mailaizena: mailaizena});
                  }
               });   
          });
        }); 
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
        
        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? and balidatuta = 0" ,[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
          
        });
    
    });
};

exports.forgot = function(req,res){

    //ADI! reset-en aldatu balio hau aldatuz gero
    var idEnkript = req.body.sTaldeak * 2345678;

    var hosta = req.hostname; 
    if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
    }
    var input = JSON.parse(JSON.stringify(req.body));
    var to = input.emailaard;
    var subj ="Pasahitza ahaztu al duzu?";
    var body = "<h2>Klik egin http://"+hosta+"/reset/" + idEnkript +"</h2>";
    body += "<h2>eta pasahitza berria bi aldiz sartu</h2> \n \n";
    body += "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;

    
    emailService.send(to, subj, body);

    res.redirect('/login');
    };

exports.reset = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idEnkript = req.params.idtalde;

    //ADI! forgot-en aldatu balio hau aldatuz gero
    var id = idEnkript / 2345678;

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
