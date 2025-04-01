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
var vKategoria, postua, ezaukeratua;
var admintalde = (req.path == "/admin/taldeak");
var admingabe = (req.path == "/admin/taldeakbalidatugabe");
var admin = (admintalde || admingabe);

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT * FROM taldeak,maila where kategoria=idmaila and idtxapeltalde = ? order by mailazki,lehentasuna,sortzedata',[req.session.idtxapelketa],function(err,rows)     {
    req.connection.query('SELECT * FROM taldeak,maila where kategoria=idmaila and idtxapeltalde = $1 order by mailazki,lehentasuna,sortzedata',[req.session.idtxapelketa],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
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
          if ((rows[i].balidatuta >= 1 && admintalde) || (rows[i].balidatuta == 0 && admingabe) || (rows[i].balidatuta > 4 && !admin)) 
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
                  mailaizena  : rows[i].mailaizena,
                  admin : admin
               };
               
           }
           ezaukeratua = (rows[i].balidatuta > 0 && rows[i].balidatuta < 4);          
           taldeak[j] = {
                  postua : j+1,
                  taldeizena    : rows[i].taldeizena,
                  sexua    : rows[i].sexua,
                  herria    : rows[i].herria,
                  balidatuta : rows[i].balidatuta,
                  izenaard : rows[i].izenaard,
                  telefonoard : rows[i].telefonoard,
                  emailard : rows[i].emailard,
                  lehentasuna : rows[i].lehentasuna,
                  admin : admin,
                  ezaukeratua : ezaukeratua,
                  idtaldeak    : rows[i].idtaldeak
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

}

exports.taldeakaukeratu = function(req, res){
  var id = req.session.idtxapelketa;
  var input = JSON.parse(JSON.stringify(req.body));
  var taldekide = [], ordaintzeko = 0;
//postgres  req.getConnection(function(err,connection){
    
//      console.log("Body:" +JSON.stringify(req.body));
 
    for(var i in input.aukeratua ){
      var  idTaldeak = input.aukeratua[i];                                           //  ADI   .split("-");
// ADI- taldekideakkopiatu.handlebars : gehitu checkbox-en kopiatu nahi duguna        
//        console.log("input : " + i + "-" + input.aukeratuo[i] + "-" + idTaldekideak);
//postgres      connection.query('SELECT * FROM taldeak WHERE idtxapeltalde = ? and idtaldeak= ?',[id,idTaldeak],function(err,rows)
      req.connection.query('SELECT * FROM taldeak WHERE idtxapeltalde = $1 and idtaldeak= $2',[id,idTaldeak],function(err,wrows)
      {
        if(err)
          console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres                   
//        console.log("kide : " + i + "-" + rows[0].ordaintzekoKide + "-" + rows[0].idTaldekideak);
        var  idTaldeak = rows[0].idtaldeak; 
        var data = {
            
            balidatuta    : 4
        
        };
//postgres        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? and balidatuta > 0 and balidatuta < 4" ,[data,idTaldeak], function(err, rows)
        req.connection.query("UPDATE taldeak set balidatuta=$1 WHERE idtaldeak = $2 and balidatuta > 0 and balidatuta < 4" ,[4,idTaldeak], function(err, rows)
        {
          if (err)
              console.log("Error updating : %s ",err );
        });
      });
    }

    for (var j = 0; j < 1000; j++) {}  // atseden denbora ADI ADI

    res.redirect('/admin/taldeak');

};

exports.taldemail = function(req, res){

  var id = req.params.emaila;

//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta >= 1) and emailard = ? and idtxapeltalde = ?',[id,req.session.idtxapelketa],function(err,rows)     
     req.connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = \'admin\' or balidatuta >= \'1\') and emailard = $1 and idtxapeltalde = $2',[id,req.session.idtxapelketa],function(err,wrows)     
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres 
            //res.render('forgot.handlebars', {title : 'Txaparrotan-Forgot', emailaard : id, taldeak : rows });
            res.json(rows);
         });
                  
};

exports.editatu = function(req, res){

  //var id = req.params.id;
  var id = req.session.idtalde;
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM taldeak WHERE idtaldeak = ?',[id],function(err,rows)
     req.connection.query('SELECT * FROM taldeak WHERE idtaldeak = $1',[id],function(err,wrows)
        {
          if(err)
              console.log("Error Selecting : %s ",err );          
          rows = wrows.rows;     //postgres 
//postgres          connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
          req.connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = $1 ',[req.session.idtxapelketa],function(err,wrows)     {
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsm = wrows.rows;     //postgres 
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
 
};

exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
   var id = req.session.idtalde;
    
//postgres    req.getConnection(function (err, connection) {
        
        var data = {
            
            taldeizena : input.taldeizena,
            kategoria   : input.kategoria,
            sexua   : input.sexua,
            herria   : input.herria,
            izenaard   : input.izenaard,
            telefonoard   : input.telefonoard,
            emailard   : input.emailard,
        
        };
//postgres        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ?  ",[data,id], function(err, rows)
        req.connection.query("UPDATE taldeak set taldeizena=$1, kategoria=$2, sexua=$3, herria=$4, izenaard=$5, telefonoard=$6, emailard=$7 WHERE idtaldeak = $8  ",[input.taldeizena, input.kategoria, input.sexua, input.herria, input.izenaard, input.telefonoard, input.emailard ,id], function(err, rows)
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
    
  //}
};

exports.saioahasteko = function(req, res){
  var id = req.session.idtxapelketa;
//postgres  req.getConnection(function (err, connection) {
//postgres      if (err)
//postgres              console.log("Error connection : %s ",err ); 
//postgres      connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = "admin" or balidatuta >= 1) and idtxapeltalde = ? order by taldeizena',[id],function(err,rows)  {
      req.connection.query('SELECT idtaldeak, taldeizena FROM taldeak where (balidatuta = \'admin\' or balidatuta >= \'1\') and idtxapeltalde = $1 order by taldeizena',[id],function(err,wrows)  {
        if (err)
                console.log("Error query : %s ",err );
        rows = wrows.rows;     //postgres                 
      //  console.log("taldeak : " + JSON.stringify(rows)); 
        res.render('login.handlebars', {title : 'Txaparrotan-Login',taldeizena: req.session.taldeizena, taldeak : rows});
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
//postgres  req.getConnection(function(err,connection){
       //PASAHITZA ENKRIPTATU GABE
     //connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = idtxapelketa and emailard = ? and pasahitza = ? and (balidatuta = 1 or balidatuta = "admin") and idtaldeak = ? ',
     // [req.body.emailaard,req.body.pasahitza, req.body.sTaldeak],function(err,rows)     {
      //if(err || rows.length == 0){

      //PASAHITZA ENKRIPTATUTA
//postgres      connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = idtxapelketa and emailard = ? and  (balidatuta >= 1 or balidatuta = "admin") and idtaldeak = ? ',
//postgres      [req.body.emailaard,req.body.sTaldeak],function(err,rows)     {
      req.connection.query('SELECT * FROM taldeak,txapelketa where idtxapeltalde = idtxapelketa and emailard = $1 and  (balidatuta >= \'1\' or balidatuta = \'admin\') and idtaldeak = $2 ',
      [req.body.emailaard,req.body.sTaldeak],function(err,wrows)     {
        rows = wrows.rows;     //postgres 
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
       
};

exports.bilatu = function(req, res){
  var taldea;
  var id = req.session.idtalde;
  var now= new Date();
/*  
    if (process.env.NODE_ENV == 'production'){
      now.setUTCHours(now.getHours());
      now.setUTCMinutes(now.getMinutes()); 
    }
*/    
  //var id = req.params.id;
  var bukaera,aBukaera, vBukaera,aldaketabai;
  var aldaketa = {};
  var aldaketarray = [];
  var egoeratalde = "";
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM taldeak,maila,txapelketa where idmaila = kategoria and idtxapelketa=idtxapeltalde and idtaldeak = ?',[id],function(err,rows)     {
     req.connection.query('SELECT * FROM taldeak,maila,txapelketa where idmaila = kategoria and idtxapelketa=idtxapeltalde and idtaldeak = $1',[id],function(err,wrows)     {
      if(err)
          console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres 
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

        if(rows[0].balidatuta > 4){
          egoeratalde = "onartuta";
        }
        else if(rows[0].balidatuta >= 4){
            egoeratalde = "onartua izateko zai";
         }   
         else if(rows[0].balidatuta >= 1){
              egoeratalde = "prozesatzen";
         }
        rows[0].egoeratalde = egoeratalde;  
//postgres        connection.query('SELECT * FROM jokalariak where idtaldej= ?',[id],function(err,rowsj)     {
        req.connection.query('SELECT * FROM jokalariak where idtaldej= $1',[id],function(err,wrows)     {
            
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsj = wrows.rows;     //postgres 
          for(var i in rowsj ){
               rowsj[i].aldaketabai = aldaketabai;
          }

         // console.log("jokalariak : " + JSON.stringify(rowsj));

          res.render('jokalariak.handlebars', {title : 'Txaparrotan-Datuak', data2:rows , data:rowsj, aldaketabai : aldaketabai, taldeizena: req.session.taldeizena} );
                         
         });
        }
       });
  
};
exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers-Node.js"});
};
exports.edit = function(req, res){
    
  var id = req.params.id;
    
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
     req.connection.query('SELECT * FROM customer WHERE id = $1',[id],function(err,wrows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres      
            res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:rows});
        });

};

exports.izenematea = function(req,res){

    res.locals.flash = null;
    var now= new Date();   // now : UTC +2ordu heroku config:add TZ="Europe/Madrid" 
/*       
    if (process.env.NODE_ENV == 'production'){
      now.setUTCHours(now.getHours());
      now.setUTCMinutes(now.getMinutes()); 
    }
*/    
    var tope = 0;
    var aditestua = "Izen-ematea";
    var vHasiera,aHasiera,aHasieraOrdua,hasiera,vBukaera,aBukaera,bukaera;
           console.log("IdTxaelketa : %s ",req.session.idtxapelketa );
//postgres    req.getConnection(function(err,connection){
//postgres      connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[req.session.idtxapelketa],function(err,rows)     {
      req.connection.query('SELECT * FROM txapelketa where idtxapelketa = $1',[req.session.idtxapelketa],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
//postgres        connection.query('SELECT count(*) as guztira FROM taldeak where idtxapeltalde= ? and balidatuta != "admin" ',[req.session.idtxapelketa],function(err,rowsg)     {
        req.connection.query('SELECT count(*) as guztira FROM taldeak where idtxapeltalde= $1 and balidatuta != \'admin\' ',[req.session.idtxapelketa],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
        rowsg = wrows.rows;     //postgres 
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
//postgres          connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
          req.connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = $1 ',[req.session.idtxapelketa],function(err,wrows)     {
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsm = wrows.rows;     //postgres 
          res.render('taldeaksortu.handlebars', {title : 'Txaparrotan-Izen-ematea', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, mailak:rowsm, aditestua:aditestua});
         });
        }
      });
     });

}
exports.sortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    res.locals.flash = null;
    var now= new Date();
/*    
    if (process.env.NODE_ENV == 'production'){
      now.setUTCHours(now.getHours());
      now.setUTCMinutes(now.getMinutes()); 
    }
*/    
    var aditestua;
    var topetalde = 0, vMultzokop = 0;
    var mailaizena = "";

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

//postgres  req.getConnection(function(err,connection){
//postgres  connection.query('SELECT count(*) as mailaguztira FROM taldeak where balidatuta >= 0 and idtxapeltalde= ? and kategoria= ? ',[req.session.idtxapelketa,req.body.kategoria],function(err,rowsmg)     {
  req.connection.query('SELECT count(*) as mailaguztira FROM taldeak where balidatuta >= \'0\' and idtxapeltalde= $1 and kategoria= $2 ',[req.session.idtxapelketa,req.body.kategoria],function(err,wrows)     {
   if(err)
      console.log("Error Selecting : %s ",err );
   rowsmg = wrows.rows;     //postgres 
   console.log("talde kopurua: %s ", rowsmg[0].mailaguztira);   
    console.log("talde mixtoa: %s ", req.body.sexua);

//postgres   req.getConnection(function (err, connection) {
//postgres    connection.query('SELECT * FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
    req.connection.query('SELECT * FROM maila where idtxapelm = $1 ',[req.session.idtxapelketa],function(err,wrows)     {
      if(err)
        console.log("Error Selecting : %s ",err ); 
      rowsm = wrows.rows;     //postgres 
      for(var i in rowsm ){
          if(input.kategoria == rowsm[i].idmaila){
            mailaizena = rowsm[i].mailaizena;
            rowsm[i].aukeratua = true;
            if(rowsm[i].multzokop >= 500)                 //  > 500  Maila mixtoa
              vMultzokop = rowsm[i].multzokop - 500;
            else
              vMultzokop = rowsm[i].multzokop;
//            if(rowsm[i].multzokop == 9)
            if(vMultzokop <= rowsmg[0].mailaguztira)    
              topetalde = 1;

             else if(rowsm[i].multzokop < 500 && req.body.sexua != undefined) {
                    if(req.xhr) return res.json({ error: 'Invalid mail' });
                        res.locals.flash = {
                            type: 'danger',
                            intro: 'Adi!',
                            message: 'Maila honetan, talde MIXTOA ezin da apuntatu.',
                        };
             }

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
            sexua   : req.body.sexua,
            herria   : req.body.herria,
            DNIard    : req.body.DNIard,
            izenaard   : req.body.izenaard,
            telefonoard   : req.body.telefonoard,
            emailard   : req.body.emailard,
            emailard2 : req.body.emailard2

          } );
      }
  
//  req.getConnection(function (err, connection) {
debugger;
//postgres      connection.query('SELECT * FROM taldeak where idtxapeltalde= ? and (taldeizena = ? or emailard = ?)',[req.session.idtxapelketa, req.body.taldeizena, req.body.emailard],function(err,rows)  {
      req.connection.query('SELECT * FROM taldeak where idtxapeltalde= $1 and (taldeizena = $2 or emailard = $3)',[req.session.idtxapelketa, req.body.taldeizena, req.body.emailard],function(err,wrows)  {
        if(err)
          console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        if (rows.length != 0){
         var izenaberdin = 0, emailaberdin = 0; 
         for(var i in rows ){
          if(rows[i].taldeizena == req.body.taldeizena){
              izenaberdin++;
          }
          if(rows[i].emailard == req.body.emailard){
              emailaberdin++;
          }
         } 
         if (izenaberdin >= 1 || emailaberdin >= 2)
         { 
          if (izenaberdin >= 1)
          {
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste talde izen bat sartu behar duzu! Dagoenekoz, izen hori erabilita dago eta.',
           };
          }
          else 
          {
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Beste email batekin izen-eman behar duzu! Dagoenekoz email horrekin 2 talde sortuta dituzu eta. Email batekin 2 talde bakarrik sor daiteke!',
           };
          }
           return res.render('taldeaksortu.handlebars', {
            title : 'Txaparrotan-Izen-ematea',
            // taldeizena : req.session.taldeizena,
            idtxapelketa : req.session.idtxapelketa,
            mailak : rowsm,
            taldeizena: req.body.taldeizena,
            kategoria   : req.body.kategoria,
            sexua   : req.body.sexua,
            herria   : req.body.herria,
            DNIard    : req.body.DNIard,
            izenaard   : req.body.izenaard,
            telefonoard   : req.body.telefonoard,
            emailard   : req.body.emailard,
            emailard2 : req.body.emailard2

           });
         }
        }
//postgres        connection.query('SELECT * FROM txapelketa where idtxapelketa = ?',[req.session.idtxapelketa],function(err,rowst)  {          
        req.connection.query('SELECT * FROM txapelketa where idtxapelketa = $1',[req.session.idtxapelketa],function(err,wrows)  {          
            if(err)
                console.log("Error inserting : %s ",err );
            rowst = wrows.rows;     //postgres 
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
            sexua : input.sexua       // " "
           };
//postgres           var query = connection.query("INSERT INTO taldeak set ? ",data, function(err, rows)
           var query = req.connection.query('INSERT INTO taldeak (taldeizena, idtxapeltalde, kategoria, herria, DNIard, izenaard, telefonoard, emailard, pasahitza, sortzedata, balidatuta, lehentasuna, sexua) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING idtaldeak',[input.taldeizena, req.session.idtxapelketa, input.kategoria, input.herria, input.DNIard, input.izenaard, input.telefonoard, input.emailard, password_hash, now, 0, 99, input.sexua], function(err, rows)
           {
            if (err)
              console.log("Error inserting : %s ",err );
//postgres            connection.query('SELECT count(*) as guztira FROM taldeak where idtxapeltalde= ? and balidatuta != "admin" ',[req.session.idtxapelketa],function(err,rowsg)     {
            req.connection.query('SELECT count(*) as guztira FROM taldeak where idtxapeltalde= $1 and balidatuta != \'admin\' ',[req.session.idtxapelketa],function(err,wrows)     {
                if(err)
                  console.log("Error Selecting : %s ",err );
                rowsg = wrows.rows;     //postgres 
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
//                   var mailaizena;   
                   var to = input.emailard;
                   var subj = "Itxaron zerrendan " + data.taldeizena +" taldea "+ mailaizena+" mailan.";

                   var body = "<p style='color:#FF0000'><b>"+data.taldeizena+"</b> taldea <b>"+mailaizena+"</b> mailan itxaron zerrendan dago. </p>";
                       body += "<p style='color:#0000FF'> Txapelketak dituen mugak gainditu ezinak ditugunez: asteburu batean eta 6 jokutoki, Antolakuntzak ahalegin guztiak egingo ditu talde gehienei tokia egiten.</p>";
                       body += "<p style='color:#FF0000'> Aukerarik sortu ezkero, Antolakuntzak, emaila baten bidez, adieraziko dizue. Egoera honetan, bertako taldeek izango dute lehentasuna. Mila esker!</p> \n \n";
                       body += "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;

                   emailService.send(to, subj, body);

                   res.render('taldeaitxaron.handlebars', {title: "Txaparrotan-Itxaron zerrendan", taldeizena:data.taldeizena, txapelketaizena:req.session.txapelketaizena, idtxapelketa: req.session.idtxapelketa, aditestua:aditestua, emailard:data.emailard, izenaard: data.izenaard,mailaizena: mailaizena});

//                   res.render('kontaktua.handlebars', {title : 'Txaparrotan-Kontaktua', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, aditestua:aditestua});
                }
                else{
         
               //Enkriptatu talde zenbakia. Zenbaki hau aldatuz gero, taldea balidatu ere aldatu + taldeabalekoa!
//postgres         var taldezenbakia= rows.insertId * 3456789;
         rows = rows.rows;     //postgres
         var taldezenbakia= rows[0].idtaldeak * 3456789;         
//         var mailaizena;   
         var to = input.emailard;
         var subj = "Ongi-etorri " + data.izenaard;
         var hosta = req.hostname;
         if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
         }
/*         for(var i in rowsm ){
          if(data.kategoria == rowsm[i].idmaila){
            mailaizena = rowsm[i].mailaizena;
          }
         }
*/         
         var body = "<p>1.<b>"+data.taldeizena+"</b> taldea <b>"+mailaizena+"</b> mailan balidatu ahal izateko, </p>";
         body += "<h3> klik egin: http://"+hosta+"/taldeabalidatu/" + taldezenbakia+ ". </h3>";
         body += "<p>2. Ondoren, saioa hasi eta zure jokalariak gehitu.</p>";

      //   body += "<p>3. Hori egindakoan, <b>" +rowst[0].kontukorrontea+ "</b> kontu korrontean  <b>"+rowst[0].prezioa+ "</b>uro sartu eta kontzeptu bezala <b>"+data.taldeizena+"-"+data.izenaard+"</b> jarri.</p>";
      //   body += "<p style="color:#FF0000">4. Hau egin ezean, zure taldea ez da txapelketan apuntatuta egongo. Behin ordainketa egindakoan eta guk hau berrikusitakoan (astebeteko mugarekin), beste email bat jasoko duzu ONARTUA izan zarela adierazten. Hau jaso arte, ez zaudela onartua garbi utzi nahi dugu</p>";
      //   body += "<p style='color:#0000FF'>5. Txapelketak dituen mugak gainditu ezinak ditugunez: asteburu batean eta 6 jokutoki,  antolakuntzak, astebetera, zein talde izan diren onartuak adieraziko du. Egoera honetan, bertako taldeek izango dute lehentasuna. </p>";
    //   body += "<p style='color:#FF0000'>6. Ordainketa egindakoan eta guk berrikusitakoan Onartua izan zaren emaila jasoko duzu eta webguneko zerrendan zuen taldea azalduko da. </p>"; 
//         body += "<p style='color:#FF0000'>7. Gerta daitezken kalteez, Antolakuntza ez da arduradun egiten.</p>";
//         body += "<p style='color:#0000FF'>8. Antolakuntzak ahalegin guztiak egingo ditu txapelketa bertan behera ez gelditzeko. Bertan behera geldituz gero, antolakuntza ez da kargu egiten gertatzen denaz. Mila esker!</p> \n \n";

         body += "<p style='color:#FF0000'>3. Hau egin ezean, zure taldea ez da kontutan hartuko. </p>";
         body += "<p style='color:#0000FF'>4. Txapelketak dituen mugak gainditu ezinak ditugunez: asteburu batean eta 6 jokutoki,  antolakuntzak, astebetera, zein talde izan diren onartuak adieraziko du. Egoera honetan, bertako taldeek izango dute lehentasuna. </p>";
         body += "<p>5. Onartua izan zaren jakiteko, emaila jaso arte itxaron beharko duzu. Hau jaso arte, ez zaudela onartua garbi utzi nahi dugu.</p>";
         body += "<p>6. Onartua izandakoan, 2 egun dituzu <b>" +rowst[0].kontukorrontea+ "</b> kontu korrontean  <b>"+rowst[0].prezioa+ "</b> euro sartzeko. Kontzeptu bezala arduradunaren eta taldearen izena jarri : <b>"+data.taldeizena+"-"+data.izenaard+"</b> </p>";
         body += "<p style='color:#FF0000'>7. Ordainketa egindakoan eta guk berrikusitakoan webguneko zerrendan zuen taldea azalduko da. Ordainketa egin ezean, zure taldeak txapelketan jolasteko aukera galduko du. </p>"; 

         body += "<p style='color:#FF0000'>8. Gerta daitezken kalteez, Antolakuntza ez da arduradun egiten.</p>";
         body += "<p style='color:#0000FF'>9. Antolakuntzak ahalegin guztiak egingo ditu txapelketa bertan behera ez gelditzeko. Bertan behera geldituz gero, antolakuntza ez da kargu egiten gertatzen denaz. Mila esker!</p> \n \n";
         body += "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;

//          req.session.idtalde = rows.insertId;  ADI login egin gabe sartu egiten dira

          emailService.send(to, subj, body);
          //res.redirect('/taldeak');
          res.render('taldeaeskerrak.handlebars', {title: "Mila esker!", taldeizena:data.taldeizena, mixtoa:data.sexua,txapelketaizena:req.session.txapelketaizena, kk:rowst[0].kontukorrontea, prezio: rowst[0].prezioa,gehigarri: rowst[0].partidukopmin, emailard:data.emailard, izenaard: data.izenaard,mailaizena: mailaizena});
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
    
//postgres    req.getConnection(function (err, connection) {
        
        var data = {
            
            balidatuta    : 1
        
        };
//postgres        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? and balidatuta = 0" ,[data,id], function(err, rows)
        req.connection.query("UPDATE taldeak set balidatuta =$1 WHERE idtaldeak = $2 and balidatuta = 0" ,[1, id], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
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
//postgres    req.getConnection(function (err, connection) {

         // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(input.pasahitza, salt);

        var data = {
            
            pasahitza    :  password_hash     //input.pasahitza 
        
        };
//postgres        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,id], function(err, rows)
        req.connection.query("UPDATE taldeak set pasahitza=$1 WHERE idtaldeak = $2 ",[password_hash,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/login');
          
        });
    
  }
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
