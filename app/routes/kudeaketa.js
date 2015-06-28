exports.taldekopurua = function(req, res){
  var id = req.session.idtxapelketa;
  var totala=0;

  req.getConnection(function(err,connection){
    connection.query('SELECT mailaizena,balidatuta,count(*) as guztira FROM taldeak,maila where idtxapeltalde= ? and kategoria=idmaila group by kategoria ORDER BY mailazki',[id],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );

         for(var i in rowsg){
          totala += rowsg[i].guztira;
         }

        res.render('taldekopurua.handlebars', {title : 'Txaparrotan-Taldeak', data2:rowsg, taldetot: totala,taldeizena: req.session.txapelketaizena} );
     });
  });       
};

exports.taldekopurua2 = function(req, res){
  var id = req.session.idtxapelketa;
  var vKategoria, vSexua;
  var benjaminN = []; 
  var benjaminM = [];
  var alebinN = [];
  var alebinM = [];
  var infantilN = [];
  var infantilM = [];


  req.getConnection(function(err,connection){
      
     connection.query('SELECT * FROM taldeak where balidatuta = 1 and idtxapeltalde = ? order by kategoria,sexua',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        var ibn = 0;
        var ibm = 0;
        var ian = 0;
        var iam = 0;
        var iin = 0;
        var iim = 0;
        var totala = 0;

        for (var i in rows) {
            if(rows[i].kategoria == 'Benjaminak' && rows[i].sexua == 'Neska'){
              benjaminN[ibn] = rows[i]; 
              ibn ++;             
            }
            if(rows[i].kategoria == 'Benjaminak' && rows[i].sexua == 'Mutila'){;
              benjaminM[ibm] = rows[i]; 
              ibm ++;             
            }
            if(rows[i].kategoria == 'Alebinak' && rows[i].sexua == 'Neska'){
              alebinN[ian] = rows[i]; 
              ian ++;             
            }
            if(rows[i].kategoria == 'Alebinak' && rows[i].sexua == 'Mutila'){
              alebinM[iam] = rows[i]; 
              iam ++;             
            }
            if(rows[i].kategoria == 'Infantilak' && rows[i].sexua == 'Neska'){
              infantilN[iin] = rows[i]; 
              iin ++;             
            }
            if(rows[i].kategoria == 'Infantilak' && rows[i].sexua == 'Mutila'){
              infantilM[iim] = rows[i]; 
              iim ++;             
            }
            
         }
        
        totala = ibn + ibm + ian + iam + iin + iim;
        res.render('taldekopurua2.handlebars', {title : 'Txaparrotan-Taldeak', data2:ibn, data3:ibm, data4:ian, 
          data5:iam, data6:iin, data7:iim, data10: totala, taldeizena: req.session.txapelketaizena} );
         });
       
    });
  
};

exports.jokalarikopurua = function(req, res){
  var id = req.session.idtxapelketa;
  var totala=0;

  req.getConnection(function(err,connection){
    connection.query('SELECT taldeizena,izenaard,herria,idtaldeak,idgrupot,berezitasunak,balidatuta,lehentasuna,count(*) as guztira FROM taldeak,jokalariak where idtxapeltalde= ? and idtaldeak = idtaldej group by taldeizena ORDER BY taldeizena',[id],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );

         for(var i in rowsg){
          totala += rowsg[i].guztira;
         }

        res.render('jokalarikopurua.handlebars', {title : 'Txaparrotan-Jokalariak', data2:rowsg, jokalaritot: totala,taldeizena: req.session.txapelketaizena} );
     });
  });       
};

exports.kalkuluak = function(req, res){
  var id = req.session.idtxapelketa;
  req.getConnection(function (err, connection) {
      if (err)
              console.log("Error connection : %s ",err ); 
      connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[id],function(err,rows)  {
        if (err)
                console.log("Error query : %s ",err ); 
        console.log("mailak : " + JSON.stringify(rows)); 
        res.render('kalkuluak.handlebars', {title : 'Txaparrotan-Kalkuluak egin', taldeizena: req.session.txapelketaizena, idtxapelketa: req.session.idtxapelketa, mailak : rows});
      });   
  });  
};

exports.multzoakegin = function(req, res){
  var id = req.session.idtxapelketa;
  var vKategoria = req.body.kategoria;
  //var vMultzokopurua = req.body.multzokop;
  var imultzo = [];

  req.getConnection(function(err,connection){       
    connection.query('SELECT * FROM maila where idtxapelm = ? and idmaila = ? ',[id,vKategoria],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );
         console.log("Rowsg:"+rowsg);
        if(rowsg[0].multzokop == null){
          console.log("Maila honetako multzo kopurua ipini!");
          res.redirect(303, '/admin/mailakeditatu/'+rowsg[0].idmaila);
        }
        else{
        var vMultzokopurua = rowsg[0].multzokop;

        for (var i=1; i<=vMultzokopurua;i++) {
            var data = {
            
            multzo    : i,
            idtxapelketam : id,
            kategoriam : vKategoria
        };
        var query = connection.query("INSERT INTO grupoak set ? ",data, function(err, rowsg)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
          imultzo[i] = rowsg.insertId;
      	});
        }
        res.redirect(303, '/admin/kalkuluak');
        }
     });
    });     
};

exports.multzoakbete = function(req, res){
  var id = req.session.idtxapelketa;
  vKategoria = req.body.kategoria2;
  //var vMultzokopurua = req.body.multzokop2;
  var imultzo = [];

  req.getConnection(function(err,connection){
    connection.query('SELECT * FROM grupoak,maila where idmaila = kategoriam and idtxapelketam = ? and kategoriam = ? ',[id,vKategoria],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        var vMultzokopurua = rowsg[0].multzokop;

        if(rowsg[0].multzokop == null){
          console.log("Maila honetako multzo kopurua ipini!");
          res.redirect(303, '/admin/mailakeditatu/'+rowsg[0].idmaila);
        }
        else{
        for (var j in rowsg){
          imultzo[rowsg[j].multzo] = rowsg[j].idgrupo;
        }

     connection.query('SELECT * FROM taldeak where balidatuta >= 1 and idtxapeltalde = ? and kategoria = ? order by lehentasuna,idtaldeak',[id,vKategoria],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
       
         //J/4 hondarra
         var multzozenbaki = 0;
         var idgrupo;
         for (var i in rows){
          multzozenbaki = (i % vMultzokopurua) + 1;
          idgrupo = imultzo [multzozenbaki];
          id = rows[i].idtaldeak;
          var data = {
            
            idgrupot    : idgrupo
        
        };
        
        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,id], function(err, rowst)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
        });
        }

        res.redirect(303, '/admin/kalkuluak');

      }); 
   }
   });
  });
};

exports.sailkapenak = function (req,res){ 
var mailak = [];
var maila = {};
var multzoak = []; 
var multzoa = {};
var taldeak = [];
var j,t;
var k = 0;
var alfabeto = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
var multzoizena;
var vKategoria, vMultzo,postua;
var admin = (req.path == "/admin/sailkapenak");
var zuretaldekoa = (req.path == "/taldesailkapena");
//var txapelketaprest = 0;
var grupo;

  req.getConnection(function(err,connection){
      connection.query('SELECT * FROM taldeak,grupoak,maila,txapelketa where idgrupot=idgrupo and idtxapelketa = idtxapeltalde and kategoria=idmaila and idtxapeltalde = ? order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc',[req.session.idtxapelketa],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        if(rows.length == 0 || (rows[0].txapelketaprest == 0 && !admin)){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Txapelketa hastearekin batera egongo da ikusgai!',
           };
           //return res.redirect('/'); 
           return res.render('sailkapenak.handlebars', {title : 'Txaparrotan-Sailkapenak', data2:mailak, taldeizena: req.session.taldeizena, menuadmin: admin, taldekoa:zuretaldekoa} );

        };
        for (var i in rows) { 
         if(((rows[i].idgrupo == req.session.idgrupo) && zuretaldekoa) || !zuretaldekoa)
         {
           if(vKategoria != rows[i].kategoriam){
            if(vKategoria !=null){
              console.log("vKategoria:" +vKategoria);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              mailak[k] = maila;
              console.log("Mailak:" +t + JSON.stringify(mailak[k]));
              k++;
            }
            vKategoria = rows[i].kategoriam;
            vMultzo = null;
            multzoak = []; 
            t=0;
            maila = {
                  kategoria    : rows[i].kategoriam,
                  mailaizena  : rows[i].mailaizena
               };
               
          }
          if(vMultzo != rows[i].idgrupo){
            if(vMultzo !=null){
              console.log("vMultzo:" +vMultzo);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              console.log("Multzoak:" +t + JSON.stringify(multzoak[t]));
              t++;
            }
            vMultzo = rows[i].idgrupo;
            taldeak = []; 
            j=0;

            if(rows[i].multzo < 900){
              multzoizena = alfabeto[rows[i].multzo -1] + " multzoa";
            }
            else{
              if(1000- rows[i].multzo == 16)
                multzoizena = "Final hamaseirenak";
              else if(1000- rows[i].multzo == 8)
                multzoizena = "Final zortzirenak";
              else if(1000- rows[i].multzo == 4)
                multzoizena = "Final laurdenak";
              else if(1000- rows[i].multzo == 2)
                multzoizena = "Final erdiak";
              else if(1000- rows[i].multzo == 1)
                multzoizena = "Finala";

            }
            if(admin){
              grupo = rows[i].idgrupo;
            }
            else{
              grupo = "";  
            }  
            multzoa = {
                  multzo    : multzoizena,
                  idgrupo   : grupo
               };
               
          }
          taldeak[j] = {
                  postua : j+1,
                  taldeizena    : rows[i].taldeizena,
                  jokatutakopartiduak    : rows[i].jokatutakopartiduak,
                  irabazitakopartiduak    : rows[i].irabazitakopartiduak,
                  puntuak    : rows[i].puntuak
               };
          j++;
          console.log("Taldeak:" + taldeak[j]);
          
          //console.log(  );
         // console.log("Jokalari" + jokalariak);
         }
        }
        if(vKategoria !=null){
              console.log("vKategoria:" +vKategoria);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              mailak[k] = maila;
              console.log("Mailak:" +t + JSON.stringify(mailak));
              k++;
            }
        if(admin){
          res.render('sailkapenak.handlebars', {title : 'Txaparrotan-Sailkapenak admin', data2:mailak, taldeizena: req.session.txapelketaizena, menuadmin: admin} );
        }
        else{
          res.render('sailkapenak.handlebars', {title : 'Txaparrotan-Sailkapenak', data2:mailak, taldeizena: req.session.taldeizena, menuadmin: admin, taldekoa:zuretaldekoa} );

        }
    });
  });
}

function taulasortu(jardunkop,partikop){             
  var taulaS = [];
  var aux;
  var tt = 1;
  
var taulaS = new Array(jardunkop -1); 
for (var i = 0; i < jardunkop -1; i++) {
   taulaS[i] = new Array(partikop); 
   for (var j = 0; j < partikop; j++) {
      taulaS[i][j] = [0,0];
   }
}

  for(var jt=0; jt< jardunkop -1; jt++){
    for (var pt=0; pt < partikop; pt++){
        taulaS[jt][pt][0] = tt;
        tt++;
        if(tt > jardunkop -1){
          tt=1;
        }
    }
  }

  tt=jardunkop -1;

  for(var jt=0; jt< jardunkop -1; jt++){
    for (var pt=0; pt < partikop; pt++){
        if(pt == 0){
          if (jt%2 == 1){
            aux = taulaS[jt][pt][0];
            taulaS[jt][pt][0] = jardunkop;
            taulaS[jt][pt][1] = aux;
          }
          else{
            taulaS[jt][pt][1] = jardunkop;
          }
        }
        else{
          taulaS[jt][pt][1] = tt;
          tt--;
          if(tt == 0){
            tt= jardunkop -1;
          }
        }
    }
  }
  console.log("KAixo" +JSON.stringify(taulaS));
  return taulaS;
}

exports.partiduaksortu = function(req, res){
  var id = req.session.idtxapelketa;
  var mailak = [];
  var maila = {};
  var multzoak = []; 
  var multzoizenak = [];
  var multzoa = {};
  var partiduak = [];
  var t;
  var j=0;
  var k = 0;
  var vKategoria, vMultzo;
  var taula;
  var jardunaldiak,partiduak;

  req.getConnection(function(err,connection){
    connection.query('SELECT * FROM taldeak,grupoak,maila,txapelketa where idtxapelketa = idtxapelketam and idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = ? order by mailazki,multzo',[req.session.idtxapelketa],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
         console.log(rows);
        for (var i in rows) { 
          if(vKategoria != rows[i].kategoriam || vMultzo != rows[i].idgrupo){
            if(vKategoria !=null){
              console.log("multzoak:" +JSON.stringify(multzoak));
              jardunaldiak = multzoak.length + (multzoak.length % 2);

              partiduak = jardunaldiak/2;
              debugger;
              taula = taulasortu(jardunaldiak,partiduak);
              console.log("j-p" + jardunaldiak + partiduak + taula);
              
              for (var r=0; r < jardunaldiak -1; r++){
                for (var p=0; p < partiduak; p++){
                  debugger;
                  var x = 0;
                  console.log("Partiduak: r" +r+ "p" + p + " "+ multzoak[taula[r][p][0]-1]+ "-" + multzoak[taula[r][p][1]-1]);
                  var i1= taula[r][p][x];
                  var i11 = i1 -1;
                  x = 1;
                  var i2 = taula[r][p][x];
                  var i21 = i2 -1;
                  if(multzoak[i11] != null && multzoak[i21] != null){
                    var data ={
                      idgrupop    : vMultzo,
                      idtalde1   : multzoak[i11],
                      idtalde2   : multzoak[i21],
                      izenafinala1 : multzoizenak[i11],
                      izenafinala2 : multzoizenak[i21],
                      jardunaldia : r+1
                     };
                    var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                      {
                       if (err)
                         console.log("Error inserting : %s ",err );
                      });
                  }
                }
              }
              if(rows[0].buelta == 2){
                for (var r=0; r < jardunaldiak -1; r++){
                 for (var p=0; p < partiduak; p++){
                  debugger;
                  var x = 0;
                  console.log("Partiduak: r" +r+ "p" + p + " "+ multzoak[taula[r][p][0]-1]+ "-" + multzoak[taula[r][p][1]-1]);
                  var i1= taula[r][p][x];
                  var i11 = i1 -1;
                  x = 1;
                  var i2 = taula[r][p][x];
                  var i21 = i2 -1;
                  if(multzoak[i11] != null && multzoak[i21] != null){
                    var data ={
                      idgrupop    : vMultzo,
                      idtalde1   : multzoak[i21],
                      idtalde2   : multzoak[i11],
                      izenafinala1 : multzoizenak[i21],
                      izenafinala2 : multzoizenak[i11],
                      jardunaldia : r + jardunaldiak
                     };
                    var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                      {
                       if (err)
                         console.log("Error inserting : %s ",err );
                      });
                  }
                }
              }
              }
              multzoak = [];
              multzoizenak = [];
              j=0;
            }
            vKategoria = rows[i].kategoriam;
            vMultzo = rows[i].idgrupo;               
          }
          
          multzoak[j] = rows[i].idtaldeak; 
          multzoizenak[j] = rows[i].taldeizena;
          j++;
        }
        if(vKategoria !=null){
           console.log("multzoak:" +JSON.stringify(multzoak));
              jardunaldiak = multzoak.length + (multzoak.length % 2);

              partiduak = jardunaldiak/2;
              taula = taulasortu(jardunaldiak,partiduak);
              console.log("j-p" + jardunaldiak + partiduak + taula);
              
              for (var r=0; r < jardunaldiak -1; r++){
                for (var p=0; p < partiduak; p++){
                  debugger;
                  var x = 0;
                  console.log("Partiduak: r" +r+ "p" + p + " "+ multzoak[taula[r][p][0]-1]+ "-" + multzoak[taula[r][p][1]-1]);
                  var i1= taula[r][p][x];
                  var i11 = i1 -1;
                  x = 1;
                  var i2 = taula[r][p][x];
                  var i21 = i2 -1;
                  if(multzoak[i11] != null && multzoak[i21] != null){
                    var data ={
                      idgrupop    : vMultzo,
                      idtalde1   : multzoak[i11],
                      idtalde2   : multzoak[i21],
                      izenafinala1 : multzoizenak[i11],
                      izenafinala2 : multzoizenak[i21],
                      jardunaldia : r+1
                     };
                    var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                      {
                       if (err)
                         console.log("Error inserting : %s ",err );
                      });
                  }
                }
              }
              if(rows[0].buelta == 2){
                for (var r=0; r < jardunaldiak -1; r++){
                 for (var p=0; p < partiduak; p++){
                  debugger;
                  var x = 0;
                  console.log("Partiduak: r" +r+ "p" + p + " "+ multzoak[taula[r][p][0]-1]+ "-" + multzoak[taula[r][p][1]-1]);
                  var i1= taula[r][p][x];
                  var i11 = i1 -1;
                  x = 1;
                  var i2 = taula[r][p][x];
                  var i21 = i2 -1;
                  if(multzoak[i11] != null && multzoak[i21] != null){
                    var data ={
                      idgrupop    : vMultzo,
                      idtalde1   : multzoak[i21],
                      idtalde2   : multzoak[i11],
                      izenafinala1 : multzoizenak[i21],
                      izenafinala2 : multzoizenak[i11],
                      jardunaldia : r + jardunaldiak
                     };
                    var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                      {
                       if (err)
                         console.log("Error inserting : %s ",err );
                      });
                  }
                }
               }
              }
            }
        res.redirect(303, '/admin/kalkuluak');
    });
  });
};

exports.partiduakikusi = function (req,res){ 
var id = req.session.idtxapelketa;
var mailak = [];
var maila = {};
var multzoak = []; 
var multzoa = {};
var partiduak = [];
var j,t;
var k = 0;
var vKategoria, vMultzo;
var alfabeto = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
var admin = (req.path == "/admin/partiduak");
var zuretaldekoa = (req.path == "/taldepartiduak");
var multzoizena;
//var txapelketaprest = 0;

  req.getConnection(function(err,connection){

      //connection.query('SELECT *,t1.taldeizena taldeizena1,t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1,taldeak t2,grupoak,maila,zelaia where idgrupop=idgrupo and t1.kategoria=idmaila and t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and p.zelaia=zelaizki and idtxapelz=t1.idtxapeltalde and t1.idtxapeltalde = ? and t2.idtxapeltalde = ? order by mailazki,multzo,jardunaldia',[id, id],function(err,rows)     {
      connection.query('SELECT * FROM partiduak,grupoak,maila,zelaia,txapelketa where idgrupop=idgrupo and idtxapelketa = idtxapelketam and kategoriam=idmaila and zelaia=zelaizki and idtxapelz = ? and idtxapelketam = ? order by mailazki,multzo,jardunaldia,pareguna,parordua,zelaia',[id,id],function(err,rows)     {

        if(err)
           console.log("Error Selecting : %s ",err );
        if(rows.length == 0 || (rows[0].txapelketaprest== 0 && !admin)){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Inskripzio amaiera egunaren ondoren izango dira partiduak ikusgai!',
           };
           //return res.redirect('/'); 
            return res.render('partiduak.handlebars', {title : 'Txaparrotan-Partiduak', data2:mailak, taldeizena: req.session.taldeizena,menuadmin: admin, taldekoa: zuretaldekoa} );

        }; 
        for (var i in rows) {
          if(rows[i].pareguna != null){
            data = rows[i].pareguna;
            rows[i].pareguna= data.getFullYear() +"-"+ (data.getMonth() +1) +"-"+ data.getDate();
          } 
         if(((rows[i].idgrupo == req.session.idgrupo) && zuretaldekoa) || !zuretaldekoa)
         {
          //taldeak[i] = JSON.stringify(rows[i]);
          if(vKategoria != rows[i].kategoriam){
            if(vKategoria !=null){
              //console.log("vKategoria:" +vKategoria);
              multzoa.partiduak = partiduak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              mailak[k] = maila;
              //console.log("Mailak:" +t + JSON.stringify(mailak[k]));
              k++;
            }
            vKategoria = rows[i].kategoriam;
            vMultzo = null;
            multzoak = []; 
            t=0;
            maila = {
                  kategoria    : rows[i].kategoriam,
                  mailaizena : rows[i].mailaizena
               };
               
          }
          if(vMultzo != rows[i].idgrupo){
            if(vMultzo !=null){
              //console.log("vMultzo:" +vMultzo);
              multzoa.partiduak = partiduak;
              multzoak[t] = multzoa;
              //console.log("Multzoak:" +t + JSON.stringify(multzoak[t]));
              t++;
            }
            vMultzo = rows[i].idgrupo;
            partiduak = []; 
            j=0;
            if(rows[i].multzo < 900){
              multzoizena = alfabeto[rows[i].multzo -1] + " multzoa";
            }
            else{
              if(1000- rows[i].multzo == 16)
                multzoizena = "Final hamaseirenak";
              else if(1000- rows[i].multzo == 8)
                multzoizena = "Final zortzirenak";
              else if(1000- rows[i].multzo == 4)
                multzoizena = "Final laurdenak";
              else if(1000- rows[i].multzo == 2)
                multzoizena = "Final erdiak";
              else if(1000- rows[i].multzo == 1)
                multzoizena = "Finala";

            }
            multzoa = {
                  multzo    : multzoizena,
                  admin : admin
               };
               
          }
          partiduak[j] = {
                  idpartidu    : rows[i].idpartidu,
                  taldeizena1: rows[i].izenafinala1,
                  taldeizena2: rows[i].izenafinala2,
                  idtalde1    : rows[i].idtalde1,
                  idtalde2    : rows[i].idtalde2,
                  jardunaldia : rows[i].jardunaldia,
                  pareguna  : rows[i].pareguna,
                  parordua  : rows[i].parordua,
                  zelaia : rows[i].zelaia,
                  zelaiizena : rows[i].zelaiizena,
                  emaitza1 : rows[i].emaitza1,
                  emaitza2 : rows[i].emaitza2,
                  golak1a : rows[i].golak1a,
                  golak1b : rows[i].golak1b,
                  golak2a : rows[i].golak2a,
                  golak2b : rows[i].golak2b,
                  goldeoro1 : rows[i].goldeoro1,
                  goldeoro2 : rows[i].goldeoro2,
                  shutout : rows[i].shutout,
                  admin : admin
               };
          j++;
       }
     }
        if(vKategoria !=null){
              multzoa.partiduak = partiduak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              mailak[k] = maila;
              k++;
            }
        if(admin){
          res.render('partiduak.handlebars', {title : 'Txaparrotan-Partiduak', data2:mailak, taldeizena: req.session.txapelketaizena,menuadmin: admin} );
        }
        else{
        res.render('partiduak.handlebars', {title : 'Txaparrotan-Partiduak', data2:mailak, taldeizena: req.session.taldeizena,menuadmin: admin, taldekoa: zuretaldekoa} );
        }
        
    });
  });
}

exports.kamisetak = function(req, res){
var id = req.session.idtxapelketa;

  req.getConnection(function(err,connection){
      
     connection.query('SELECT * FROM jokalariak,taldeak where idtaldej = idtaldeak and idtxapeltalde = ? order by kamisetaneurria',[id],function(err,rows)     {
          //connection.query('SELECT * FROM jokalariak order by kamisetaneurria',function(err,rows)     {
       
        if(err)
           console.log("Error Selecting : %s ",err );

        var n11 = 0;
        var n12 = 0;
        var s = 0;
        var m = 0;
        var l = 0;
        var xl = 0;
        var xxl = 0;
        var totala = 0;

        for (var i in rows) {
            if(rows[i].kamisetaneurria == '11-13'){ 
              n11 ++;             
            }
            if(rows[i].kamisetaneurria == '12-14'){
              n12 ++;             
            }
            if(rows[i].kamisetaneurria == 'S'){
              s ++;             
            }
            if(rows[i].kamisetaneurria == 'M'){
              m ++;             
            }
            if(rows[i].kamisetaneurria == 'L'){
              l ++;             
            }
            if(rows[i].kamisetaneurria == 'XL'){
              xl ++;             
            }
            if(rows[i].kamisetaneurria == 'XXL'){
             xxl ++;             
            }
         }
        
        totala = n11 + n12 + s + m + l + xl + xxl;
        res.render('kamisetakalkulua.handlebars', {title : 'Txaparrotan-Kamisetak', data2:n11, data3:n12, data4:s, 
          data5:m, data6:l, data7:xl, data8: xxl, data9:totala, taldeizena: req.session.txapelketaizena} );
         });
       
    });
  };

exports.sariak = function(req, res){
var id = req.session.idtxapelketa;
var vKategoria = req.body.kategoria4;

  req.getConnection(function(err,connection){
      
     connection.query('SELECT * FROM jokalariak,taldeak where idtaldej = idtaldeak and idtxapeltalde = ?  and kategoria = ? order by RAND()',[id, vKategoria],function(err,rows)     {
          //connection.query('SELECT * FROM jokalariak order by kamisetaneurria',function(err,rows)     {
       
        if(err)
           console.log("Error Selecting : %s ",err );

        
        res.render('sarienzozketa.handlebars', {title : 'Txaparrotan-Sarien zozketa', data:rows, taldeizena: req.session.txapelketaizena} );
         });
       
    });
  };

  exports.ordutegiaegin = function(req, res){
  var id = req.session.idtxapelketa;
  var imultzo = [];
  var r = 0;
  var idpar; 
  var vZelaia=0;
  var egunekobehin = 0;
  var vDenbora,vEguna,vOrdua,aOrdua,orduak,minutuak,segunduak,vBukaera,aBukaera,vAtsedena,vAtsedenaDenbora,atseordu;

  req.getConnection(function(err,connection){
   connection.query('SELECT MAX (jardunaldia) as jardunkop FROM grupoak,partiduak where multzo < 900 and idtxapelketam = ? and idgrupop = idgrupo ',[id],function(err,rowsp)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        console.log("Jardunkop: "+rowsp[0].jardunkop);
     
    connection.query('SELECT kategoriam , MAX (jardunaldia) as guztira FROM grupoak,partiduak where multzo < 900 and idtxapelketam = ? and idgrupop = idgrupo group by kategoriam ORDER BY guztira DESC',[id],function(err,rowsg)     {
    //connection.query('SELECT kategoriam ,count(*) as guztira FROM grupoak,partiduak where multzo < 900 and idtxapelketam = ? and idgrupop = idgrupo group by kategoriam ORDER BY guztira DESC',[id],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        console.log("Rowsg" + JSON.stringify(rowsg));

        for (var r=1; r<= rowsp[0].jardunkop ; r++){
          for (var j in rowsg){

            connection.query('SELECT * FROM grupoak,partiduak,txapelketa where idtxapelketam = ? and idtxapelketa = idtxapelketam and idgrupop = idgrupo and kategoriam = ? and jardunaldia = ? ',[id,rowsg[j].kategoriam, r],function(err,rows)     {            
              if(err)
                 console.log("Error Selecting : %s ",err );

              for(var k in rows){
                
              debugger;
              if (vZelaia == 0){
                  vZelaia = 1;
                  vEguna = new Date(rows[k].hasierakoeguna);
                  vBukaera = new Date(rows[k].hasierakoeguna);
                  vOrdua = rows[k].hasierakoordua;
                  aOrdua = vOrdua.split(":");
                  vEguna.setHours(aOrdua[0]);
                  vEguna.setMinutes(aOrdua[1]);
                  vEguna.setSeconds(aOrdua[2]);
                  aBukaera = rows[k].bukaerakoordua.split(":");
                  vBukaera.setHours(aBukaera[0]);
                  vBukaera.setMinutes(aBukaera[1]);
                  vBukaera.setSeconds(aBukaera[2]);
                  console.log("vEguna: "+vEguna+ "-"+vBukaera);
                  vDenbora= rows[k].partidudenbora * 60 * 1000;

                  vAtsedena = new Date(rows[k].hasierakoeguna);
                  atseordu = rows[k].atsedenordua;
                  //atseordu = "14:00:00";
                  if (atseordu == "00:00:00")
                        egunekobehin = 1;
                  aOrdua = atseordu.split(":");
                  vAtsedena.setHours(aOrdua[0]);
                  vAtsedena.setMinutes(aOrdua[1]);
                  vAtsedena.setSeconds(aOrdua[2]);
                  vAtsedenaDenbora= rows[k].atsedendenbora * 60 * 1000;                  
                  //vAtsedenaDenbora= 30 * 60 * 1000;
              } 
              else{
                
                vZelaia ++;
                if (vZelaia > rows[k].zelaikop){
                  vZelaia = 1;
                  vEguna.setTime(vEguna.getTime() + vDenbora);
                  console.log("Eguna-bukaera "+vEguna.getTime()+" " +vBukaera.getTime());

                  if(vEguna.getTime() >= vAtsedena.getTime() && egunekobehin == 0){
                    egunekobehin = 1;
                    vEguna.setTime(vEguna.getTime() + vAtsedenaDenbora);
                    console.log("Atsedena: "+vEguna+ " "+vAtsedena +" "+vAtsedenaDenbora);
                  }
                  if(vEguna.getTime() >= vBukaera.getTime()){

                    vEguna.setDate(vEguna.getDate()+1);
                    vOrdua = rows[k].hasierakoordua;
                    aOrdua = vOrdua.split(":");
                    vEguna.setHours(aOrdua[0]);
                    vEguna.setMinutes(aOrdua[1]);
                    vEguna.setSeconds(aOrdua[2]);
                    aBukaera = rows[k].bukaerakoordua.split(":");
                    vBukaera.setDate(vBukaera.getDate()+1);
                    vBukaera.setHours(aBukaera[0]);
                    vBukaera.setMinutes(aBukaera[1]);
                    vBukaera.setSeconds(aBukaera[2]);
                    console.log("Bukaera: "+vEguna+ " "+vBukaera);

                    vAtsedena.setDate(vAtsedena.getDate()+1);
                    atseordu = rows[k].atsedenaordua;
                  //atseordu = "14:00:00";
                  aOrdua = atseordu.split(":");
                  vAtsedena.setHours(aOrdua[0]);
                  vAtsedena.setMinutes(aOrdua[1]);
                  vAtsedena.setSeconds(aOrdua[2]);
                   if (atseordu == "00:00:00")
                        egunekobehin = 1;
                   else   
                    egunekobehin = 0;
                  }
                  orduak= vEguna.getHours();
                  minutuak = vEguna.getMinutes();
                  segunduak = vEguna.getSeconds();
                  vOrdua = orduak +":"+minutuak+":"+segunduak;
                console.log("vEguna3: "+vEguna);
                }
              }
              
              idpar = rows[k].idpartidu;
              console.log(idpar+ "g: " + rows[k].idgrupop+" p: "+rows[k].idtalde1+"-"+rows[k].idtalde2 + " vOrdua: "+vOrdua+ " Zelaia:" +vZelaia);

              var data = {
            
                pareguna    : vEguna,
                parordua    : vOrdua,
                zelaia      : vZelaia
        
              };
        
            var query = connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idpar], function(err, rowst)
            {
  
              if (err)                                                                                                                              
                console.log("Error Updating : %s ",err );
             // console.log("Rowst: " + JSON.stringify(rowst));
            });
            }
          });
          }
        } 
        //res.redirect(303,'/admin/kalkuluak');
      }); 
    });
   });
  res.redirect('/admin/kalkuluak');
};

exports.finalordutegia = function(req, res){
  var id = req.session.idtxapelketa;
  var imultzo = [];
  var r = 0;
  var idpar, vJardunaldi,vMaila; 
  var vZelaia=0;
  var vDenbora,vEguna,vOrdua,aOrdua,orduak,minutuak,segunduak,vBukaera,aBukaera;

  req.getConnection(function(err,connection){
   connection.query('SELECT pareguna,parordua FROM grupoak,partiduak where multzo < 900 and idtxapelketam = ? and idgrupop = idgrupo  ORDER BY pareguna DESC,parordua DESC',[id],function(err,rowsf)     {
        if(err)
           console.log("Error Selecting : %s ",err );
         console.log("Azkena:"+rowsf[0].pareguna+" "+rowsf[0].parordua)   
    connection.query('SELECT kategoriam ,count(*) FROM grupoak,partiduak,maila where multzo > 900 and idtxapelketam = ? and idgrupop = idgrupo and idmaila = kategoriam group by kategoriam ORDER BY COUNT(*) DESC, mailazki ASC',[id],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        console.log("Rowsg" + JSON.stringify(rowsg));
        //Adi jardunaldi kopuruarekin! =10
        for (var r=1; r< 10; r++){
          for (var j in rowsg){

            connection.query('SELECT * FROM grupoak,partiduak,txapelketa where multzo > 900 and idtxapelketam = ? and idtxapelketa = idtxapelketam and idgrupop = idgrupo and kategoriam = ? and jardunaldia = ? ',[id,rowsg[j].kategoriam, r],function(err,rows)     {            
              if(err)
                 console.log("Error Selecting : %s ",err );

              for(var k in rows){

              if (vZelaia == 0){
                  vZelaia = 1;
                  vJardunaldi = rows[k].jardunaldia;
                  vMaila = rows[k].kategoriam;
                  vEguna = new Date(rowsf[0].pareguna);
                  vBukaera = new Date(rows[k].pareguna);
                  vOrdua = rows[k].finalakordua;    
                  //vOrdua = "15:00:00";
                  aOrdua = vOrdua.split(":");
                  vEguna.setHours(aOrdua[0]);
                  vEguna.setMinutes(aOrdua[1]);
                  vEguna.setSeconds(aOrdua[2]);
                  aBukaera = rows[k].bukaerakoordua.split(":");
                  vBukaera.setHours(aBukaera[0]);
                  vBukaera.setMinutes(aBukaera[1]);
                  vBukaera.setSeconds(aBukaera[2]);
                  console.log("vEguna: "+vEguna+ "-"+vBukaera);
                  vDenbora= rows[k].partidudenbora * 60 * 1000;
                  //vEguna.setTime(vEguna.getTime() + vDenbora);   ADI goikoa
                  orduak= vEguna.getHours();
                  minutuak = vEguna.getMinutes();
                  segunduak = vEguna.getSeconds();
                  vOrdua = orduak +":"+minutuak+":"+segunduak;
                
              } 
              else{
                vZelaia ++;
                if (vZelaia > rows[k].zelaikop || (vJardunaldi != rows[k].jardunaldia && vMaila == rows[k].kategoriam)){
                  vZelaia = 1;
                  vJardunaldi = rows[k].jardunaldia;
                  vMaila = rows[k].kategoriam;
                  vEguna.setTime(vEguna.getTime() + vDenbora);
                  console.log("Eguna-bukaera "+vEguna.getTime()+" " +vBukaera.getTime());
                  if(vEguna.getTime()> vBukaera.getTime()){

                    vEguna.setDate(vEguna.getDate()+1);
                    vOrdua = rows[k].hasierakoordua;
                    aOrdua = vOrdua.split(":");
                    vEguna.setHours(aOrdua[0]);
                    vEguna.setMinutes(aOrdua[1]);
                    vEguna.setSeconds(aOrdua[2]);
                    aBukaera = rows[k].bukaerakoordua.split(":");
                    vBukaera.setDate(vBukaera.getDate()+1);
                    vBukaera.setHours(aBukaera[0]);
                    vBukaera.setMinutes(aBukaera[1]);
                    vBukaera.setSeconds(aBukaera[2]);
                    console.log("Bukaera: "+vEguna+ " "+vBukaera);
                  }
                  orduak= vEguna.getHours();
                  minutuak = vEguna.getMinutes();
                  segunduak = vEguna.getSeconds();
                  vOrdua = orduak +":"+minutuak+":"+segunduak;
                console.log("vEguna3: "+vEguna);
                }
              }
              
              idpar = rows[k].idpartidu;
              console.log(idpar+ "g: " + rows[k].idgrupop+" p: "+rows[k].idtalde1+"-"+rows[k].idtalde2 + " vOrdua: "+vOrdua+ " Zelaia:" +vZelaia);

              var data = {
            
                pareguna    : vEguna,
                parordua    : vOrdua,
                zelaia      : vZelaia
        
              };
        
            var query = connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idpar], function(err, rowst)
            {
  
              if (err)                                                                                                                              
                console.log("Error Updating : %s ",err );
              //console.log("Rowst: " + JSON.stringify(rowst));
            });
            }
          });
          }
        } 
        //res.redirect(303, '/admin/kalkuluak');
      }); 
    });
   });
  //res.redirect(303, '/admin/kalkuluak');
  res.redirect('/admin/kalkuluak');

};

exports.ordutegiaikusi = function(req, res){
var id = req.session.idtxapelketa;
var saioak = []; 
var saioa = {};
var partiduak = [];
var partidua = {};
var talde1,talde2,akronimoa;
//var zelaiak = [{zelaiizena: "ORDUA" }, {  zelaiizena: "Argiñano"}, {zelaiizena: "Tablaua"}, 
 //                                       {zelaiizena: "Santa Barbara"}, {zelaiizena: "Mollarri"},
   //                                     {zelaiizena: "Kanpiña"}, {zelaiizena: "Allepunta"}];

var zelaia;
var zelaiak = [{zelaiizena: "ORDUA" }];
//console.log("Zelai0:"+ JSON.stringify(zelaiak));
var j,t=0;
var k = 0;
var z=0;
var vOrdua, vEguna;
var admin = (req.path == "/admin/ordutegia");
var data, datastring;
var alfabeto = "ABCDEFGHIJKLMNOPQRSTUVXYZ";

  req.getConnection(function(err,connection){

    connection.query('SELECT * FROM zelaia where idtxapelz = ? order by zelaizki,idzelaia',[req.session.idtxapelketa],function(err,rows)     {

      //console.log(rows);
        for (var i in rows){
          zelaia= {};
          zelaia.zelaiizena = rows[i].zelaiizena;
          z++;
          zelaiak[z] = zelaia;
        }
        
    });

      
        connection.query('SELECT * FROM partiduak,grupoak,maila,txapelketa where idmaila = kategoriam and idtxapelketa= idtxapelketam and idtxapelketam = ? and idgrupop = idgrupo order by pareguna, parordua,zelaia',[req.session.idtxapelketa],function(err,rowsf)     {
      
          if(err)
           console.log("Error Selecting : %s ",err );
          if(rowsf.length == 0 || (rowsf[0].txapelketaprest == 0 && !admin)){  
            res.locals.flash = {
             type: 'danger',
             intro: 'Adi!',
             message: 'Inskripzio amaiera egunaren ondoren izango da ordutegia ikusgai!',
            };
            //return res.redirect('/'); 
            return res.render('ordutegiaadmin.handlebars', {title : 'Txaparrotan-Ordutegia', data2:saioak, data: zelaiak, taldeizena: req.session.taldeizena,menuadmin: admin} );

          };
          for (var i in rowsf) {  
          //ADIIII!!
          //if ((vEguna != rows[i].pareguna) || (vOrdua != rows[i].parordua)){ 
           if(vOrdua != rowsf[i].parordua){ 
            if(vEguna !=null){
              //console.log("vOrdu:" +vOrdua);
              //partidua = partiduak;
              saioa.partiduak = partiduak;
              saioak[t] = saioa;
              t++;
            }
            if(vEguna != rowsf[i].pareguna){
                data = rowsf[i].pareguna;
                if(data == null){
                  datastring = "00/00/00";
                }
                else{
                   datastring = data.getFullYear() + "/" + (data.getMonth() +1) + "/" + data.getDate();
                }
                partiduak = [{taldeizena1: datastring, taldeizena2: rowsf[i].parordua}];
            }  
            else {
                partiduak = [{taldeizena1: rowsf[i].parordua}];
            }
            vEguna = rowsf[i].pareguna;
            vOrdua = rowsf[i].parordua;

            j=1;
            saioa = {};
               
          }

          akronimoa = "";
          if(rowsf[i].multzo > 900){
              if(1000- rowsf[i].multzo == 16)
                akronimoa = rowsf[i].akronimoa +" 16renak ";
              else if(1000- rowsf[i].multzo == 8)
                akronimoa = rowsf[i].akronimoa +" 8renak ";
              else if(1000- rowsf[i].multzo == 4)
                akronimoa = rowsf[i].akronimoa +" 4rdenak ";
              else if(1000- rowsf[i].multzo == 2)
                akronimoa = rowsf[i].akronimoa +" Erdiak ";
              else if(1000- rowsf[i].multzo == 1)
                akronimoa = rowsf[i].akronimoa +" Finala ";

            }
           else{ 
                akronimoa = rowsf[i].akronimoa +" "+ alfabeto[rowsf[i].multzo -1] +" "+ rowsf[i].jardunaldia +".";
            }
          partiduak[j] = {
                  akronimoa      : akronimoa,
                  taldeizena1    : rowsf[i].izenafinala1,
                  taldeizena2    : rowsf[i].izenafinala2
               };
          j++;
        }
        if(vEguna !=null){
              saioa.partiduak = partiduak;
              saioak[t] = saioa;
            }
        if(admin){
          res.render('ordutegiaadmin.handlebars', {title : 'Txaparrotan-Ordutegia admin', data2:saioak, data: zelaiak, taldeizena: req.session.txapelketaizena,menuadmin: admin} );
        }
        else{
        res.render('ordutegiaadmin.handlebars', {title : 'Txaparrotan-Ordutegia', data2:saioak, data: zelaiak, taldeizena: req.session.taldeizena,menuadmin: admin} );
        }
    });
  });
};

exports.taldeordutegia = function(req, res){
var id = req.session.idtxapelketa;
var idtalde = req.session.idtalde;
var data = new Date();

  req.getConnection(function(err,connection){
      connection.query('SELECT *,t1.taldeizena taldeizena1, t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1, taldeak t2,zelaia where t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and p.zelaia=zelaizki and idtxapelz=t1.idtxapeltalde and t1.idtxapeltalde = ? and (t1.idtaldeak = ? or t2.idtaldeak = ?) order by pareguna, parordua',[id,idtalde,idtalde],function(err,rows)     {

        if(err)
           console.log("Error Selecting : %s ",err );
        
        for(var i in rows){
          data = rows[i].pareguna;
          rows[i].pareguna = data.getFullYear()+ "-"+ (data.getMonth() +1)+"-"+ data.getDate();
        }
        
        res.render('taldeordutegia.handlebars', {title : 'Txaparrotan-Talde ordutegia', data: rows, taldeizena: req.session.taldeizena} );  
    });
  });
};
exports.emaitzapartidu = function(req, res){
  var id = req.session.idtxapelketa;
  var idpar = req.params.partidu;

  req.getConnection(function(err,connection){
      connection.query('SELECT * FROM partiduak,grupoak where idgrupo=idgrupop and idtxapelketam= ? and idpartidu = ?',[id,idpar],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        console.log(rows);

        res.render('emaitzasartu.handlebars', {title : 'Txaparrotan-Emaitza sartu', data: rows, taldeizena: req.session.txapelketaizena} );
    });
  });
};

exports.partiduordua = function(req, res){
  var id = req.session.idtxapelketa;
  var idpar = req.params.partidu;

  req.getConnection(function(err,connection){
      //connection.query('SELECT *,t1.taldeizena taldeizena1,t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1,taldeak t2 where t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and t1.idtxapeltalde = ? and t2.idtxapeltalde = ? and idpartidu = ?',[id, id,idpar],function(err,rows)     {
      connection.query('SELECT * FROM partiduak where idpartidu = ?',[idpar],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        console.log(rows);

        res.render('partiduorduaaldatu.handlebars', {title : 'Txaparrotan-Partidu ordua aldatu', data: rows, taldeizena: req.session.txapelketaizena} );
    });
  });
};

function emaitzakalkulatu(golak1a,golak1b,golak2a,golak2b,goldeoro1,goldeoro2,shutout){
  emaitza1f=0;
  emaitza2f=0;

  if(golak1a > golak1b && golak2a > golak2b){
    emaitza1f=70;
    emaitza2f=0;
  }
  else if((golak1a > golak1b && goldeoro2=="A")||(goldeoro1=="A" && golak2a > golak2b)){
    emaitza1f=65;
    emaitza2f=5;
  }
  else if(goldeoro1=="A" && goldeoro2=="A"){
    emaitza1f=60;
    emaitza2f=10;
  }
  else if((golak1a > golak1b && goldeoro2=="B" && shutout=="A") || (goldeoro1=="B" && golak2a > golak2b && shutout=="A")){
    emaitza1f=55;
    emaitza2f=20;
  }
  else if((golak1a > golak1b && golak2a < golak2b && shutout=="A")|| (golak1a < golak1b && golak2a > golak2b && shutout=="A") ){
    emaitza1f=50;
    emaitza2f=25;
  }
  else if((goldeoro1=="A" && goldeoro2=="B" && shutout=="A")|| (goldeoro1=="B" && goldeoro2=="A" && shutout=="A") ){
    emaitza1f=45;
    emaitza2f=30;
  }
  else if((goldeoro1=="A" && golak2a < golak2b && shutout=="A") || (goldeoro1=="B" && golak2a > golak2b && shutout=="A") ){
    emaitza1f=40;
    emaitza2f=35;
  }
  if(golak1a < golak1b && golak2a < golak2b){
    emaitza1f=0;
    emaitza2f=70;
  }
  else if((golak1a < golak1b && goldeoro2=="B")||(goldeoro1=="B" && golak2a < golak2b)){
    emaitza1f=5;
    emaitza2f=65;
  }
  else if(goldeoro1=="B" && goldeoro2=="B"){
    emaitza1f=10;
    emaitza2f=60;
  }
  else if((golak1a < golak1b && goldeoro2=="A" && shutout=="B") || (goldeoro1=="A" && golak2a < golak2b && shutout=="B")){
    emaitza1f=20;
    emaitza2f=55;
  }
  else if((golak1a < golak1b && golak2a > golak2b && shutout=="B")|| (golak1a > golak1b && golak2a < golak2b && shutout=="B") ){
    emaitza1f=25;
    emaitza2f=50;
  }
  else if((goldeoro1=="B" && goldeoro2=="A" && shutout=="B")|| (goldeoro1=="A" && goldeoro2=="B" && shutout=="B") ){
    emaitza1f=30;
    emaitza2f=45;
  }
  else if((goldeoro1=="B" && golak2a > golak2b && shutout=="B") || (goldeoro1=="A" && golak2a < golak2b && shutout=="B") ){
    emaitza1f=35;
    emaitza2f=40;
  }
  //return emaitza1, emaitza2;
  return {emaitza1f: emaitza1f, emaitza2f: emaitza2f}
}

exports.emaitzasartu = function(req, res){
  var id = req.session.idtxapelketa;
  var idpar = req.params.partidu;
  var idparti,izenafinala,idtalde;

  var golak1a = req.body.golak1a,
      golak1b = req.body.golak1b,
      golak2a = req.body.golak2a,
      golak2b = req.body.golak2b,
      goldeoro1 = req.body.goldeoro1,
      goldeoro2 = req.body.goldeoro2,
      shutout = req.body.shutout;
      emaitza1 = req.body.emaitza1;
      emaitza2 = req.body.emaitza2;
  var bemaitza1,bemaitza2, jokatutakopartiduak, irabazitakopartiduak,puntuak, emaitza1f,emaitza2f;

  req.getConnection(function(err,connection){
    console.log("Emaitza z: "+emaitza1+" "+emaitza2);
    bemaitza1 = emaitzakalkulatu(golak1a,golak1b,golak2a,golak2b,goldeoro1,goldeoro2,shutout).emaitza1f;
    bemaitza2 = emaitzakalkulatu(golak1a,golak1b,golak2a,golak2b,goldeoro1,goldeoro2,shutout).emaitza2f;   
    console.log("Emaitza:" +bemaitza1+ "-" +bemaitza2);

    connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idpartidu = ? ',[idpar],function(err,rows)     {

        if(err)
           console.log("Error Selecting : %s ",err );

        var talde1=rows[0].idtalde1;
        var talde2=rows[0].idtalde2;

        var data = {

            emaitza1    : bemaitza1,
            emaitza2    : bemaitza2,
            golak1a    : golak1a,
            golak1b    : golak1b,
            golak2a    : golak2a,
            golak2b    : golak2b,
            goldeoro1    : goldeoro1,
            goldeoro2    : goldeoro2,
            shutout    : shutout
        
          };
        
        connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idpar], function(err, rowst)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

          if(rows[0].multzo <900){
           connection.query('SELECT * FROM taldeak where idtaldeak= ? and idtxapeltalde = ?',[talde1,id],function(err,rowst)     {
            if(err)
              console.log("Error Selecting : %s ",err );
            
            jokatutakopartiduak = rowst[0].jokatutakopartiduak;
            irabazitakopartiduak = rowst[0].irabazitakopartiduak;
            puntuak = rowst[0].puntuak;
            console.log("Jp:"+jokatutakopartiduak+" ip:" + irabazitakopartiduak+ " pun:"+ puntuak);
            console.log("Emaitza2:"+bemaitza1+"-"+bemaitza2);
            console.log("Emaitza3:"+emaitza1+"-"+emaitza2);
            if((emaitza1==null && emaitza2==null)||(emaitza1==0 && emaitza2==0)){
              jokatutakopartiduak++;             
              if(bemaitza1>bemaitza2){
                irabazitakopartiduak++; 
              }
              console.log("5");
            }
            if(emaitza1 > emaitza2 && bemaitza1 < bemaitza2){
              irabazitakopartiduak--;
              console.log("1");
            }
            if(emaitza1 < emaitza2 && bemaitza1 > bemaitza2){
              irabazitakopartiduak++;
              console.log("2");
            }
            puntuak = puntuak + (bemaitza1-emaitza1);
            var data = {

              jokatutakopartiduak    : jokatutakopartiduak,
              irabazitakopartiduak    : irabazitakopartiduak,
              puntuak    : puntuak        
            };

            connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,talde1], function(err, rowst)
            {
  
             if (err)
               console.log("Error Updating : %s ",err );

             connection.query('SELECT * FROM taldeak where idtaldeak= ? and idtxapeltalde = ?',[talde2,id],function(err,rowsp)     {
                if(err)
                  console.log("Error Selecting : %s ",err );

                jokatutakopartiduak = rowsp[0].jokatutakopartiduak;
                irabazitakopartiduak = rowsp[0].irabazitakopartiduak;
                puntuak = rowsp[0].puntuak;

                if((emaitza1==null && emaitza2==null)||(emaitza1==0 && emaitza2==0)){
                  jokatutakopartiduak++;
                  if(bemaitza1 < bemaitza2){
                    irabazitakopartiduak++;
                  }
                  console.log("0");
                }
                if(emaitza1 < emaitza2 && bemaitza1 > bemaitza2){
                  irabazitakopartiduak--;
                  console.log("3");
                }
                if(emaitza1 > emaitza2 && bemaitza1 < bemaitza2){
                  irabazitakopartiduak++;
                  console.log("4");
                }
                puntuak = puntuak + (bemaitza2-emaitza2);
                var data = {

                  jokatutakopartiduak    : jokatutakopartiduak,
                  irabazitakopartiduak    : irabazitakopartiduak,
                  puntuak    : puntuak        
                };
                connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,talde2], function(err, rowst)
                {
  
                  if (err)
                    console.log("Error Updating : %s ",err );
                  res.redirect('/admin/emaitzak');
                });
            });
        });
      });
      }
      else{
        if(bemaitza1 > bemaitza2){
          izenafinala = rows[0].izenafinala1;
          idtalde = rows[0].idtalde1;
        }
        else{
          izenafinala = rows[0].izenafinala2;
          idtalde = rows[0].idtalde2;
        }
        if(rows[0].idfinala1 != null){
            idparti = rows[0].idfinala1;
            var data = {

                  izenafinala1    : izenafinala,
                  idtalde1   : idtalde       
                };
        }
        else{
          if(rows[0].idfinala2 != null){
            idparti = rows[0].idfinala2;
            var data = {

                  izenafinala2    : izenafinala,
                  idtalde2   : idtalde       
                };
           }
        }
        connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idparti], function(err, rowst)
                {
  
                  if (err)
                    console.log("Error Updating : %s ",err );
                  res.redirect('/admin/emaitzak');
                });

      }
     });
     }); 
  });
  //res.redirect(303, '/admin/emaitzak');
};

exports.emaitzakikusi = function (req,res){ 
var sartugabeak = (req.path == "/admin/emaitzak");
var id = req.session.idtxapelketa;
var partiduak = [];
var j=0;
var data = new Date();

  req.getConnection(function(err,connection){
      //connection.query('SELECT *,t1.taldeizena taldeizena1,t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1,taldeak t2,grupoak where idgrupop=idgrupo and t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and t1.idtxapeltalde = ? and t2.idtxapeltalde = ? order by pareguna, parordua,zelaia',[id, id],function(err,rows)     {
      connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idtxapelketam = ? order by pareguna, parordua,zelaia',[id],function(err,rows)     {

        if(err)
           console.log("Error Selecting : %s ",err );
        for(var i in rows){

          data = rows[i].pareguna;
          if(data!= "0000-00-00"){
            rows[i].pareguna= data.getFullYear()+ "-" +(data.getMonth() +1) +"-"+ data.getDate();
          }
          
        
          if(((rows[i].emaitza1 == null || (rows[i].emaitza1 == 0 && rows[i].emaitza2 == 0)) && sartugabeak)
          || !sartugabeak){
            partiduak [j] = rows[i];
            j++;
          }

        }
        
        res.render('emaitzakadmin.handlebars', {title : 'Txaparrotan-Partiduak', data2:partiduak, taldeizena: req.session.txapelketaizena, sartugabe: sartugabeak} );
    });
  });
}

exports.emaitzenorriak = function (req,res){ 
var id = req.session.idtxapelketa;
var partiduak = [];
var j=0,k=1;
var data = new Date();

  req.getConnection(function(err,connection){
      connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idtxapelketam = ? order by pareguna, parordua,zelaia',[id],function(err,rows)     {

        if(err)
           console.log("Error Selecting : %s ",err );
        for(var i in rows){

          data = rows[i].pareguna;
          if(data!= "0000-00-00"){
            rows[i].pareguna= data.getFullYear()+ "-" +(data.getMonth() +1) +"-"+ data.getDate();
          }
          
          rows[i].i= k;
          rows[i].jauzi = k % 6;
          partiduak [j] = rows[i];
          j++;
          k++;
        }
        
        res.render('emaitzenorriak.handlebars', {title : 'Txaparrotan-Emaitzen orriak', data2:partiduak, taldeizena: req.session.txapelketaizena, layout: null });
    });
  });
}

exports.multzoakreset = function(req, res){
  var id = req.session.idtxapelketa;
  var vKategoria;
  vKategoria = req.body.kategoria3;
  var vGrupo;
  console.log("vKategoria: "+vKategoria+req.path);
  req.getConnection(function(err,connection){
          var data = {
            
            idgrupot    : null,
            jokatutakopartiduak : null,
            irabazitakopartiduak : null,
            puntuak : null

        
        };
        debugger;
        //Update taldea ta delete grupoak.
        connection.query("UPDATE taldeak set ? WHERE idtxapeltalde = ? and kategoria = ? ",[data,id,vKategoria], function(err, rowst)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

          connection.query("DELETE FROM grupoak WHERE idtxapelketam = ? and kategoriam = ? ",[id,vKategoria], function(err, rowsd)
            {
            
              if (err)
                console.log("Error Updating : %s ",err );
        
              res.redirect(303, '/admin/kalkuluak');
            });
        
        });
  }); 
};

exports.partiduakreset = function(req, res){
  var id = req.session.idtxapelketa;
  var vGrupo;
  console.log("Partiduak reset: " +id);
  req.getConnection(function(err,connection){
          var data = {

            jokatutakopartiduak : null,
            irabazitakopartiduak : null,
            puntuak : null

        
        };
        //Update taldea ta delete grupoak.
        connection.query("UPDATE taldeak set ? WHERE idtxapeltalde = ?  ",[data,id], function(err, rowst)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );

          connection.query('SELECT * FROM grupoak WHERE idtxapelketam = ? ',[id], function(err, rows)
            {
            
              if (err)
                console.log("Error Updating : %s ",err );

              for(var i in rows){

                connection.query("DELETE FROM partiduak WHERE idgrupop = ?  ",[rows[i].idgrupo], function(err, rowsd)
                {
            
                  if (err)
                   console.log("Error Updating : %s ",err );   

                });
              }
              res.redirect(303, '/admin/kalkuluak');
            });
        });
  }); 
};

exports.partiduorduaaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idpartidu = req.params.partidu;
    
    req.getConnection(function (err, connection) {
        console.log("Ordua "+input.parordua);

        var data = {
            
            parordua : input.parordua,
            pareguna   : input.pareguna,
            zelaia : input.zelaia

        };
        
        connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idpartidu], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/partiduak');
          
        });
    
    });
};

exports.taldeaeditatu = function(req, res){
  var id = req.session.idtxapelketa;
  var idtalde = req.params.talde;

  req.getConnection(function(err,connection){
      connection.query('SELECT * FROM taldeak  where idtaldeak = ?',[idtalde],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        res.render('taldeaaldatu.handlebars', {title : 'Txaparrotan-Taldearen datuak aldatu', data: rows, taldeizena: req.session.txapelketaizena} );
    });
  });
};

exports.taldeaaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idtaldea = req.params.talde;
    req.getConnection(function (err, connection) {

        var data = {
            
            taldeizena : input.taldeizena,
            balidatuta   : input.balidatuta,
            berezitasunak : input.berezitasunak,
            lehentasuna  : input.lehentasuna

        };

        if(input.idgrupot != null && input.idgrupot != ""){
          data.idgrupot = input.idgrupot;
        }
        
        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,idtaldea], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          //res.redirect('/admin/taldeakikusi');
          res.redirect('/admin/jokalarikopurua');
          
        });
    
    });
};

exports.taldeaezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtalde;
     var idtaldea = req.params.talde;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM taldeak  WHERE idtaldeak = ? ",[idtaldea], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/taldeakikusi');
             
        });
        
     });
};

exports.finalakegin = function (req,res){ 

var input = JSON.parse(JSON.stringify(req.body));
var id = req.session.idtxapelketa;

  req.getConnection(function(err,connection){
    //connection.query('SELECT * FROM maila where idtxapelm = ? and mailaizena = ?  ',[id,input.kategoriaf],function(err,rowsg)     {
    connection.query('SELECT * FROM maila where idtxapelm = ? and idmaila = ?  ',[id,input.kategoriaf],function(err,rowsg)     {
      if(err)
           console.log("Error Selecting : %s ",err );  
      console.log("mailaizena: "+rowsg[0].mailaizena+" "+rowsg[0].finalak);  

      if(rowsg[0].finalak == null){
          console.log("Maila honetako final mota aukeratu!");
          res.redirect(303, '/admin/mailakeditatu/'+rowsg[0].idmaila);
      }
      else{
      var partidukopuru = rowsg[0].finalak;
      var faseak = Math.log(partidukopuru) / Math.log(2);

      for(var f=0; f <= faseak; f++){

         var data = {
            
            multzo    : 1000 - partidukopuru,
            idtxapelketam : req.session.idtxapelketa,
            kategoriam : input.kategoriaf
        };

        var query = connection.query("INSERT INTO grupoak set ? ",data, function(err, rowsg)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );

        }); 

        partidukopuru = partidukopuru / 2;
       }

      res.redirect(303, '/admin/kalkuluak'); 
    }
    }); 
  });
};

exports.finalpartiduak = function (req,res){ 
var mailak = [];
var maila = {};
var multzoak = []; 
var multzoa = {};
var taldeak = [];
var j,t,p;
var k = 0;
var vKategoria, vMultzo,postua, imultzo;
var input = JSON.parse(JSON.stringify(req.body));
var id = req.session.idtxapelketa;
var kategoria = input.kategoriaf2;
//var taldekopuru = input.finala2 * 2;
var finalpartiduak = [];
var imultzo = [];
var vAkronimoa;

  req.getConnection(function(err,connection){

    connection.query('SELECT * FROM grupoak,maila where idmaila = kategoriam and idtxapelketam = ? and kategoriam = ? and multzo > 900 order by idgrupo ',[id,kategoria],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        if(rowsg[0].finalak == null){
          console.log("Maila honetako final mota aukeratu!");
          res.redirect(303, '/admin/mailakeditatu/'+rowsg[0].idmaila);
        }
        else{
        var taldekopuru = rowsg[0].finalak * 2;
        var partidukopuru = rowsg[0].finalak;
        console.log("Taldekopuru: "+taldekopuru);

        for (var j in rowsg){
          imultzo[j] = rowsg[j].idgrupo;
        }
        console.log("imultzo: "+JSON.stringify(imultzo));

      connection.query('SELECT * FROM taldeak,grupoak,maila where idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = ? and kategoria = ? order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc',[id,kategoria],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        vAkronimoa= rows[0].akronimoa;
        for (var i in rows) { 
           if(vKategoria != rows[i].kategoriam){
            if(vKategoria !=null){
              console.log("vKategoria:" +vKategoria);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              mailak[k] = maila;
              console.log("Mailak:" +t + JSON.stringify(mailak[k]));
              k++;
            }
            vKategoria = rows[i].kategoriam;
            vMultzo = null;
            multzoak = []; 
            t=0;
            maila = {
                  kategoria    : rows[i].kategoriam,
                  mailaizena  : rows[i].mailaizena
               };
               
          }
          if(vMultzo != rows[i].idgrupo){
            if(vMultzo !=null){
              console.log("vMultzo:" +vMultzo);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              console.log("Multzoak:" +t + JSON.stringify(multzoak[t]));
              t++;
            }
            vMultzo = rows[i].idgrupo;
            taldeak = []; 
            j=0;
            multzoa = {
                  multzo    : rows[i].multzo
               };
               
          }
          taldeak[j] = {
                  postua : j+1,
                  taldeizena    : rows[i].taldeizena,
                  jokatutakopartiduak    : rows[i].jokatutakopartiduak,
                  irabazitakopartiduak    : rows[i].irabazitakopartiduak,
                  puntuak    : rows[i].puntuak
               };
          j++;
          console.log("Taldeak:" + taldeak[j]);

        }
        if(vKategoria !=null){
              console.log("vKategoria:" +vKategoria);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              mailak[k] = maila;
              console.log("Mailak:" +t + JSON.stringify(mailak));
              k++;
        }

         var multzokopuru = mailak[0].multzoak.length;
         var finaltaldeakS = finalaksailkatu(partidukopuru,multzokopuru,taldekopuru);

      var finalekoak = finaltaldeakS.slice();
      var taulakopuru = finalekoak.length;
      var jardunaldi = 0;
      var faseak = Math.log(partidukopuru) / Math.log(2);

      for(var f=0; f <= faseak; f++){
          var ipartidu = 0;
          debugger;
          //var taulakopuru = finalekoak.length / 2;
          taulakopuru = taulakopuru / 2;
         
          var zenbanaka = Math.pow(2,f);
          var izenbanaka = 0;

          for(var i=0; i < taulakopuru; i++){

                //finalpartiduak[i] = finalekoak[ipartidu]+ "/"+ finalekoak[ipartidu +1];
                var izen1 = "";
                var izen2 = "";

                for(var j=0; j < zenbanaka; j++){
                  izen1 += finalekoak[izenbanaka + j] +" ";
                  izen2 += finalekoak[izenbanaka + zenbanaka + j]+" ";
                }

                finalpartiduak[i] = izen1+ "/"+ izen2;                

                var data ={
                      idgrupop    : imultzo[f],
                      izenafinala1   : izen1,
                      izenafinala2   : izen2,
                      jardunaldia : f + 1
                };

                var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                      {
                       if (err)
                         console.log("Error inserting : %s ",err ); 

                      });
                  
                ipartidu += 2;
                izenbanaka += zenbanaka * 2;

          }
         console.log("Finalpartiduakfase: "+f+ " :"+JSON.stringify(finalpartiduak));
         finalpartiduak = [];
        
        }
        res.redirect(303, '/admin/kalkuluak');
        
        }); 
      }
      });
    });
};

function finalaksailkatu (finala,multzokopuru,taldekopuru){
var multzozenbaki = 1;
         var postua = 1;
         var onena = 1;
         
         var betegarriak = (taldekopuru % multzokopuru);
         var ibetegarri = taldekopuru - betegarriak;
         var idgrupo;
         var alfabeto = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
         var finaltaldeak = [];
         var finaltaldeak1 = [];
         var finaltaldeak2 = [];

         var finaltaldeakS = [];
         var finaltaldeakS2 = [];

         for(var i=0; i < taldekopuru; i++){
            
            
            if(multzozenbaki > multzokopuru){
                multzozenbaki = 1;
                postua ++;
            }

            if(i < ibetegarri){
              finaltaldeak[i] = alfabeto[multzozenbaki -1 ] + "-" + postua;
              multzozenbaki++;
            }
            else{
              finaltaldeak[i] = postua +"-" +onena;
              onena++;
            }   

         }
         console.log("Finaltaldeak: "+JSON.stringify(finaltaldeak));

         if(finala == 16){
            var i1 = 0;
            var i2 = 0;
            var tmp;
            var nun1 = 0;
            var nun2 = 1;

            /*finaltaldeak1[i1] = finaltaldeak[0];

            for(var i=1; i < taldekopuru; i++){

              if(nun2 > 0){
                finaltaldeak2[i2] = finaltaldeak[i];
                i2++;
                nun2++;
                if(nun2 > 2){
                  nun2 = 0;
                }
              }

              else{
                finaltaldeak1[i1] = finaltaldeak[i];
                i1++;
                nun1++;
                if(nun1 > 2){
                  nun1 = 0;
                  nun2 = 1;
                }

              }*/

          i1 = 0;
          i2=15;
          iazkena = taldekopuru -1;

          for(var i=0; i < taldekopuru/2; i++){

              if(i % 2){
                finaltaldeak2[i1] = finaltaldeak[i];
                i1++;
                finaltaldeak2[i2] = finaltaldeak[iazkena];
                i2--;
                iazkena--;
              }

              else{
                finaltaldeak1[i1] = finaltaldeak[i];
                //i1++;
                finaltaldeak1[i2] = finaltaldeak[iazkena];
                iazkena--;
              }

             }

             finaltaldeak = [];

             for(var i=0; i < taldekopuru/2; i++){
              finaltaldeak[i] = finaltaldeak1[i];
             }
             console.log("Finaltaldeak1: "+JSON.stringify(finaltaldeak1));
             console.log("Finaltaldeak2: "+JSON.stringify(finaltaldeak2));
             console.log("Finaltaldeak: "+JSON.stringify(finaltaldeak));
         }

         var taldekop = taldekopuru;
         if(finala == 16){
          taldekop = (taldekopuru /2 )
         }
         var ihasiera = 0;
         var ibukaera = taldekop - 1;


         
         var tmp;

         for(var i=0; i < taldekop/2; i++){

            if(i % 2){
                finaltaldeakS[ibukaera] = finaltaldeak[i];
                ibukaera --;
                finaltaldeakS[ibukaera] = finaltaldeak[ibukaera];
                ibukaera --;
            }

            else{
              finaltaldeakS[ihasiera] = finaltaldeak[i];
              ihasiera ++;
              finaltaldeakS[ihasiera] = finaltaldeak[ibukaera];
              ihasiera ++;

            }
   

         }
         console.log("FinaltaldeakS: "+JSON.stringify(finaltaldeakS));

         if(finala == 8 || finala == 16){

                tmp = finaltaldeakS[2];
                finaltaldeakS[2] = finaltaldeakS[10];
                finaltaldeakS[10] = tmp;

                tmp = finaltaldeakS[3];
                finaltaldeakS[3] = finaltaldeakS[11];
                finaltaldeakS[11] = tmp;

                tmp = finaltaldeakS[4];
                finaltaldeakS[4] = finaltaldeakS[12];
                finaltaldeakS[12] = tmp;

                tmp = finaltaldeakS[5];
                finaltaldeakS[5] = finaltaldeakS[13];
                finaltaldeakS[13] = tmp;  

         }

      if(finala == 16){
          var taldekopuru2 = taldekopuru /2;
          var ihasiera2 = 0;
         var ibukaera2 = taldekopuru2 - 1;
         var tmp;

         for(var i=0; i < taldekopuru2/2; i++){

            if(i % 2){
                finaltaldeakS2[ibukaera2] = finaltaldeak2[i];
                ibukaera2 --;
                finaltaldeakS2[ibukaera2] = finaltaldeak2[ibukaera2];
                ibukaera2 --;
            }

            else{
              finaltaldeakS2[ihasiera2] = finaltaldeak2[i];
              ihasiera2 ++;
              finaltaldeakS2[ihasiera2] = finaltaldeak2[ibukaera2];
              ihasiera2 ++;

            }
   

         }
         console.log("FinaltaldeakS2: "+JSON.stringify(finaltaldeakS2));

         

                tmp = finaltaldeakS2[2];
                finaltaldeakS2[2] = finaltaldeakS2[10];
                finaltaldeakS2[10] = tmp;

                tmp = finaltaldeakS2[3];
                finaltaldeakS2[3] = finaltaldeakS2[11];
                finaltaldeakS2[11] = tmp;

                tmp = finaltaldeakS2[4];
                finaltaldeakS2[4] = finaltaldeakS2[12];
                finaltaldeakS2[12] = tmp;

                tmp = finaltaldeakS2[5];
                finaltaldeakS2[5] = finaltaldeakS2[13];
                finaltaldeakS2[13] = tmp;  
            
              
            var i12 = 16;
          
            for(var i=0; i < taldekop; i++){
              finaltaldeakS[i12] = finaltaldeakS2[i];
              i12++;
            }


         }
         console.log("FinaltaldeakSS: "+JSON.stringify(finaltaldeakS));
         return finaltaldeakS;
}

exports.finalakosatu = function (req,res){ 
var mailak = [];
var maila = {};
var multzoak = []; 
var multzoa = {};
var taldeak = [];
var j,t;
var k = 0;
var vKategoria, vMultzo,postua, imultzo;
var input = JSON.parse(JSON.stringify(req.body));
var id = req.session.idtxapelketa;
var kategoria = input.kategoriaf3;
var finalpartiduak = [];
var imultzo = [];
var vAkronimoa;

  req.getConnection(function(err,connection){

    connection.query('SELECT * FROM grupoak where idtxapelketam = ? and kategoriam = ? and multzo > 900 order by idgrupo ',[id,kategoria],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        for (var j in rowsg){
          imultzo[j] = rowsg[j].idgrupo;
        }
        console.log("imultzo: "+JSON.stringify(imultzo));

      connection.query('SELECT * FROM taldeak,grupoak,maila where idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = ? and kategoria = ? order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc',[id,kategoria],function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );

        vAkronimoa= rows[0].akronimoa;
        for (var i in rows) { 
           if(vKategoria != rows[i].kategoriam){
            if(vKategoria !=null){
              console.log("vKategoria:" +vKategoria);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              mailak[k] = maila;
              console.log("Mailak:" +t + JSON.stringify(mailak[k]));
              k++;
            }
            vKategoria = rows[i].kategoriam;
            vMultzo = null;
            multzoak = []; 
            t=0;
            maila = {
                  kategoria    : rows[i].kategoriam,
                  mailaizena  : rows[i].mailaizena
               };
               
          }
          if(vMultzo != rows[i].idgrupo){
            if(vMultzo !=null){
              console.log("vMultzo:" +vMultzo);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              console.log("Multzoak:" +t + JSON.stringify(multzoak[t]));
              t++;
            }
            vMultzo = rows[i].idgrupo;
            taldeak = []; 
            j=0;
            multzoa = {
                  multzo    : rows[i].multzo
               };
               
          }
          taldeak[j] = {
                  idtaldeak : rows[i].idtaldeak,
                  postua : j+1,
                  taldeizena    : rows[i].taldeizena,
                  jokatutakopartiduak    : rows[i].jokatutakopartiduak,
                  irabazitakopartiduak    : rows[i].irabazitakopartiduak,
                  puntuak    : rows[i].puntuak
               };
          j++;
          console.log("Taldeak:" + taldeak[j]);

        }
        if(vKategoria !=null){
              console.log("vKategoria:" +vKategoria);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              mailak[k] = maila;
              console.log("Mailak:" +t + JSON.stringify(mailak));
              k++;
        }

         var multzokopuru = mailak[0].multzoak.length;
         var multzo;
         var postu;
         var alfabeto = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
         var multzopostu;
         var vJardunaldi,a,f=0,p,idfinala1,idfinala2;
         var partiduenId=[];

         var partiduenId = new Array(10); 
         for (var b = 0; b < 10; b++) {
            partiduenId[b] = new Array(100); 
            for (var c = 0; c < 100; c++) {
              partiduenId[b][c] = 0;
            }
          }
         //JARDUNALDI DESC
         connection.query('SELECT * FROM grupoak,partiduak where multzo > 900 and idgrupop=idgrupo and idtxapelketam = ? and kategoriam = ? order by jardunaldia DESC,pareguna,parordua,zelaia',[id,kategoria],function(err,rowsf)     {
            if(err)
              console.log("Error Selecting : %s ",err );

            for (var i in rowsf) {
              debugger;
             f = rowsf[i].jardunaldia -1;
             if(vJardunaldi != rowsf[i].jardunaldia){
                a = 0;
                vJardunaldi = rowsf[i].jardunaldia;
                  console.log("PartiduenId: "+JSON.stringify(partiduenId[f+1]));
             }
             
             partiduenId[f][a] = rowsf[i].idpartidu;

             p = Math.floor(a / 2);
             a++;

             idfinala1 = null;
             idfinala2 = null;

             if(partiduenId[f+1][p] != 0){
                if(a%2){
                  idfinala1 = partiduenId[f+1][p];
                }
                else{
                  idfinala2 = partiduenId[f+1][p];
                }
             }

             if(rowsf[i].jardunaldia == 1){
              multzopostu = rowsf[i].izenafinala1.split("-");
              for (var j=0; j<28;j++){
                 if(alfabeto[j]==multzopostu[0]){
                   multzo = j;
                   break;
                }
              }
              postu = multzopostu[1] -1;
              var izena1 = mailak[0].multzoak[multzo].taldeak[postu].taldeizena;
              var idtalde1 = mailak[0].multzoak[multzo].taldeak[postu].idtaldeak;
              console.log("Izenafinala:"+rowsf[i].izenafinala1+ " "+multzo+" "+postu+" "+izena1);

              multzopostu = rowsf[i].izenafinala2.split("-");
              for (var j=0; j<28;j++){
                 if(alfabeto[j]==multzopostu[0]){
                   multzo = j;
                   break;
                }
              }
              postu = multzopostu[1] -1;
              var izena2 = mailak[0].multzoak[multzo].taldeak[postu].taldeizena;
              var idtalde2 = mailak[0].multzoak[multzo].taldeak[postu].idtaldeak;
              console.log("Izenafinala:"+rowsf[i].izenafinala2+ " "+multzo+" "+postu+" "+izena2)

              var data ={
                      izenafinala1   : izena1,
                      izenafinala2   : izena2,
                      idtalde1 : idtalde1,
                      idtalde2 : idtalde2,
                      idfinala1   : idfinala1,
                      idfinala2   : idfinala2
                };
             }
             else{

               var data ={
                      idfinala1   : idfinala1,
                      idfinala2   : idfinala2
                };
             }
             

             var query = connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,rowsf[i].idpartidu], function(err, rowsg)
                      {
                       if (err)
                         console.log("Error inserting : %s ",err );
                      });
            }
          res.redirect(303, '/admin/kalkuluak');
       });

        
        }); 
      });
    });
};

