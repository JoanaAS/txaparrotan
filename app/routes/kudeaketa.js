exports.taldekopurua = function(req, res){
  var id = req.session.idtxapelketa;
  var guztirao = {}, guztira = [0,0,0,0,0,0,0], guztirak = [];

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT mailaizena,multzokop,finalak,         count(*) as guztira, sum(case when sexua = "X" then 1 else 0 end) as mixtoak, sum(case when balidatuta > 4 then 1 else 0 end) as onartuak, sum(case when balidatuta = 4 then 1 else 0 end) as aukeratuak, sum(case when (balidatuta > 0 and balidatuta < 4) then 1 else 0 end) as apuntatuak, sum(case when balidatuta = 0 then 1 else 0 end) as balidatugabeak FROM taldeak,maila where idtxapeltalde= ? and kategoria=idmaila group by kategoria ORDER BY mailazki',[id],function(err,rowsg)     {
    req.connection.query('SELECT mailaizena,multzokop,finalak,         count(*) as guztira, sum(case when sexua = \'X\' then 1 else 0 end) as mixtoak, sum(case when balidatuta > \'4\' then 1 else 0 end) as onartuak, sum(case when balidatuta = \'4\' then 1 else 0 end) as aukeratuak, sum(case when (balidatuta > \'0\' and balidatuta < \'4\') then 1 else 0 end) as apuntatuak, sum(case when balidatuta = \'0\' then 1 else 0 end) as balidatugabeak FROM taldeak,maila where idtxapeltalde= $1 and kategoria=idmaila group by mailazki,kategoria,mailaizena,multzokop,finalak ORDER BY mailazki',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsg = wrows.rows;     //postgres
         for(var i in rowsg){
            guztira[0] += parseInt(rowsg[i].guztira);
            guztira[1] += parseInt(rowsg[i].onartuak);
            guztira[2] += parseInt(rowsg[i].aukeratuak);
            guztira[3] += parseInt(rowsg[i].apuntatuak);
            guztira[4] += parseInt(rowsg[i].balidatugabeak);
            guztira[5] += parseInt(rowsg[i].mixtoak);
         }
         guztirao.guztira = guztira[0];
         guztirao.onartuak = guztira[1];
         guztirao.aukeratuak = guztira[2]; 
         guztirao.apuntatuak = guztira[3]; 
         guztirao.balidatugabeak = guztira[4];
         guztirao.mixtoak = guztira[5];

         guztirak[0] = guztirao; 
        res.render('taldekopurua.handlebars', {title : 'Txaparrotan-Taldeak', data2:rowsg, guztirak: guztirak, taldeizena: req.session.txapelketaizena} );
     });
       
};

exports.taldekopbalidatugabe = function(req, res){
  var id = req.session.idtxapelketa;
  var totala=0;

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT mailaizena,             count(*) as guztira FROM taldeak,maila where idtxapeltalde= ? and kategoria=idmaila and balidatuta = 0 group by kategoria ORDER BY mailazki',[id],function(err,rowsg)     {
    req.connection.query('SELECT mailaizena,             count(*) as guztira FROM taldeak,maila where idtxapeltalde= $1 and kategoria=idmaila and balidatuta = \'0\' group by kategoria ORDER BY mailazki',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
         rowsg = wrows.rows;     //postgres
         for(var i in rowsg){
          totala += parseInt(rowsg[i].guztira);
         }

        res.render('taldekopurua.handlebars', {title : 'Txaparrotan-Taldeak', data2:rowsg, taldetot: totala,taldeizena: req.session.txapelketaizena} );
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


//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM taldeak where balidatuta = 1 and idtxapeltalde = ? order by kategoria,sexua',[id],function(err,rows)     {
     req.connection.query('SELECT * FROM taldeak where balidatuta = \'1\' and idtxapeltalde = $1 order by kategoria,sexua',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
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
       
};

exports.jokalarikopurua = function(req, res){
  var id = req.session.idtxapelketa;
  var totala=0;

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT taldeizena,izenaard,herria,idgrupot,berezitasunak,balidatuta,lehentasuna,akronimoa,count(*) as guztira FROM taldeak,jokalariak,maila where idtxapeltalde= ? and idtaldeak = idtaldej and kategoria=idmaila group by taldeizena, izenaard, herria, idgrupot, berezitasunak, lehentasuna, balidatuta, akronimoa ORDER BY taldeizena',[id],function(err,rowsg)     {
    req.connection.query('SELECT idtaldeak, taldeizena,izenaard,herria,idgrupot,berezitasunak,balidatuta,lehentasuna,akronimoa,count(*) as guztira FROM taldeak,jokalariak,maila where idtxapeltalde= $1 and idtaldeak = idtaldej and kategoria=idmaila group by idtaldeak,taldeizena, izenaard, herria, idgrupot, berezitasunak, lehentasuna, balidatuta, akronimoa ORDER BY taldeizena',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
         rowsg = wrows.rows;     //postgres     
         for(var i in rowsg){
          totala += parseInt(rowsg[i].guztira);
         }

        res.render('jokalarikopurua.handlebars', {title : 'Txaparrotan-Jokalariak', data2:rowsg, jokalaritot: totala,taldeizena: req.session.txapelketaizena} );
     });
       
};

exports.kalkuluak = function(req, res){
  var id = req.session.idtxapelketa;
//postgres  req.getConnection(function (err, connection) {
//postgres      if (err)
//postgres              console.log("Error connection : %s ",err ); 
//postgres      connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[id],function(err,rows)  {
      req.connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = $1 order by mailazki ',[id],function(err,wrows)  {
        if (err)
                console.log("Error query : %s ",err ); 
        rows = wrows.rows;     //postgres      
        //console.log("mailak : " + JSON.stringify(rows)); 
        res.render('kalkuluak.handlebars', {title : 'Txaparrotan-Kalkuluak egin', taldeizena: req.session.txapelketaizena, idtxapelketa: req.session.idtxapelketa, mailak : rows, nondik:req.session.nondik});
      });   
  
};

exports.mezuakmenua = function(req, res){
  var id = req.session.idtxapelketa;
  var mezumotak = [{balioa:"jokgabe", mota:"Jokalaririk gabe"}, {balioa:"ordgabe", mota: "Ordaindu gabeak"},
                     {balioa:"erdiord", mota: "Erdi Ordainduak"}, {balioa:"onartuak",mota:"Onartuak"},
                       {balioa:"prest",mota:"Txapelketa prest"}, {balioa:"onargabe",mota:"Onartu gabeak"}];
  if(req.session.mezumota){
      for(var i in mezumotak ){
               if(req.session.mezumota == mezumotak[i].balioa){
                  mezumotak[i].aukeratua = true;
               }
               else
                  mezumotak[i].aukeratua = false;
      }
  }
        //console.log("mailak : " + JSON.stringify(rows)); 
  res.render('mezuak.handlebars', {title : 'Txaparrotan-Mezuak', motak : mezumotak, taldeizena: req.session.txapelketaizena, idtxapelketa: req.session.idtxapelketa, nondik:req.session.nondik, mezumota:req.session.mezumota});
};

exports.multzoakegin = function(req, res){
  var id = req.session.idtxapelketa;
  var vKategoria = req.body.kategoria;
//  var vmultzozki;
//  if(isNaN(req.body.multzozki))
//     vmultzozki = 0;
//  else 
//     vmultzozki = parseInt(req.body.multzozki);
//  console.log("multzo zki: " + vmultzozki);
  //var vMultzokopurua = req.body.multzokop;
  var imultzo = [], multzo;

//postgres  req.getConnection(function(err,connection){       
//postgres    connection.query('SELECT * FROM maila where idtxapelm = ? and idmaila = ? ',[id,vKategoria],function(err,rowsg)     {
    req.connection.query('SELECT * FROM maila where idtxapelm = $1 and idmaila = $2',[id,vKategoria],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsg = wrows.rows;     //postgres 
        // console.log("Rowsg:"+rowsg);
        if(rowsg[0].multzokop == null){
          console.log("Maila honetako multzo kopurua ipini!");
          res.redirect(303, '/admin/mailakeditatu/'+rowsg[0].idmaila);
        }
        else{
        var vMultzokopurua = rowsg[0].multzokop;

        for (var i=1; i<=vMultzokopurua;i++) {
//            multzo = i + vmultzozki;
            var data = {
            multzo    : i,            
//            multzo    : multzo,
            idtxapelketam : id,
            kategoriam : vKategoria,
            sexuam : " "
        };
//postgres        var query = connection.query("INSERT INTO grupoak set ? ",data, function(err, rowsg)
        var query = req.connection.query('INSERT INTO grupoak ("multzo","idtxapelketam","kategoriam","sexuam") VALUES ($1,$2,$3,$4) RETURNING idgrupo',[i,id,vKategoria," "], function(err, wrows)
        {
          if (err)
              console.log("Error inserting : %s ",err );
//postgres          imultzo[i] = rowsg.insertId;
          rows = wrows.rows;     //postgres
          imultzo[i] =  rows[0].idgrupo; 
      	});
        }
        res.redirect(303, '/admin/kalkuluak');
        }
     });
     
};

exports.multzoakbete = function(req, res){
  var id = req.session.idtxapelketa;
  vKategoria = req.body.kategoria2;
  //var vMultzokopurua = req.body.multzokop2;
  var vMultzokopurua = 0;
  var imultzo = [];

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT * FROM grupoak,maila where idmaila = kategoriam and idtxapelketam = ? and kategoriam = ? ',[id,vKategoria],function(err,rowsg)     {
    req.connection.query('SELECT * FROM grupoak,maila where idmaila = kategoriam and idtxapelketam = $1 and kategoriam = $2 ',[id,vKategoria],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsg = wrows.rows;     //postgres      
        vMultzokopurua = rowsg[0].multzokop;

        if(rowsg[0].multzokop == null){
          console.log("Maila honetako multzo kopurua ipini!");
          res.redirect(303, '/admin/mailakeditatu/'+rowsg[0].idmaila);
        }
        else{
        for (var j in rowsg){
          imultzo[rowsg[j].multzo] = rowsg[j].idgrupo;
        }
//postgres     connection.query('SELECT count(*) as mailakopurua FROM taldeak where balidatuta >= 4 and idtxapeltalde = ? and kategoria = ? ',[id,vKategoria],function(err,rowst)     {
     req.connection.query('SELECT count(*) as mailakopurua FROM taldeak where balidatuta >= \'4\' and balidatuta != \'admin\' and idtxapeltalde = $1 and kategoria = $2 ',[id,vKategoria],function(err,wrows)     {
      if(err)
           console.log("Error Selecting : %s ",err );
      rowst = wrows.rows;     //postgres   
//postgres      connection.query('SELECT * FROM taldeak where balidatuta >= 4 and idtxapeltalde = ? and kategoria = ? order by sexua desc,lehentasuna,idtaldeak',[id,vKategoria],function(err,rows)     {
      req.connection.query('SELECT * FROM taldeak where balidatuta >= \'4\' and balidatuta != \'admin\' and idtxapeltalde = $1 and kategoria = $2 order by sexua desc,lehentasuna,idtaldeak',[id,vKategoria],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
         //J/4 hondarra
        var multzozenbaki = 0;
        var vTaldekopurua = (Math.trunc(rowst[0].mailakopurua / vMultzokopurua));
        console.log("maila : "+ rowst[0].mailakopurua + "multzo : "+ vMultzokopurua + "talde : "+ vTaldekopurua);
//        if (rowst[0].mailakopurua > (vMultzokopurua * vTaldekopurua)) 
//              vTaldekopurua += 1;
//        console.log("maila2 : "+ rowst[0].mailakopurua + "multzo : "+ vMultzokopurua + "talde : "+ vTaldekopurua);
        var idgrupo;
        for (var i in rows){
//          multzozenbaki = (i % vMultzokopurua) + 1;  // ADI lehentasuna : rankin edo taldeburu
//          multzozenbaki = (Math.trunc(i / 4)) + 1;   // ADI lehentasuna : talde zenbakia  LAUNAKA
          if ( i < (vTaldekopurua * vMultzokopurua))
            multzozenbaki = (Math.trunc(i / vTaldekopurua)) + 1;   // ADI lehentasuna : talde zenbakia 
          else
            multzozenbaki = vMultzokopurua - (i % vMultzokopurua); 
          idgrupo = imultzo [multzozenbaki];
          id = rows[i].idtaldeak;
          console.log("i : "+ i + "multzozenbaki : "+ multzozenbaki + "idgrupo : "+ idgrupo + "id : "+ id);
          var data = {
            
            idgrupot    : idgrupo
        
          };
//postgres          connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,id], function(err, rowst)
          req.connection.query("UPDATE taldeak set idgrupot =$1 WHERE idtaldeak = $2 ",[idgrupo,id], function(err, rowst)
          {
            if (err)
              console.log("Error Updating : %s ",err );
          });
        }

        res.redirect(303, '/admin/kalkuluak');

       }); 
      });
     }
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
//var admin = (req.path == "/admin/sailkapenak");
var admin = (req.path.slice(0,7) == "/admin/");
var bigarrengoak = (req.path == "/admin/bigarrengoak");
var zuretaldekoa = (req.path == "/taldesailkapena");
//var txapelketaprest = 0;
var grupo, mixtoa;

//postgres  req.getConnection(function(err,connection){
//postgres      connection.query('SELECT *, (golakalde - golakkontra) AS golaberaje FROM taldeak,grupoak,maila,txapelketa where idgrupot=idgrupo and idtxapelketa = idtxapeltalde and kategoria=idmaila and idtxapeltalde = ? order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc, golaberaje desc',[req.session.idtxapelketa],function(err,rows)     {
      req.connection.query('SELECT *, (golakalde - golakkontra) AS golaberaje FROM taldeak,grupoak,maila,txapelketa where idgrupot=idgrupo and idtxapelketa = idtxapeltalde and kategoria=idmaila and idtxapeltalde = $1 and balidatuta != \'admin\' order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc, golaberaje desc, idtaldeak',[req.session.idtxapelketa],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
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
              //console.log("vKategoria:" +vKategoria);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              maila.bigarrengoak = bigarrengoak;
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
                  mailaizena  : rows[i].mailaizena
               };
               
          }
          if(vMultzo != rows[i].idgrupo){
            if(vMultzo !=null){
              //console.log("vMultzo:" +vMultzo);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              //console.log("Multzoak:" +t + JSON.stringify(multzoak[t]));
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
          if((j == 1 && bigarrengoak) || !bigarrengoak)
                taldeaikusi = 1;
          else 
                taldeaikusi = 0; 
          
          mixtoa = "";
          if (admin && rows[i].sexua=="X")
                   mixtoa = " *";

          taldeak[j] = {
                  postua : j+1,
                  taldeizena    : rows[i].taldeizena + mixtoa,
                  jokatutakopartiduak    : rows[i].jokatutakopartiduak,
                  irabazitakopartiduak    : rows[i].irabazitakopartiduak,
                  puntuak    : rows[i].puntuak,
                  golakalde : rows[i].golakalde,
                  golakkontra: rows[i].golakkontra,
                  golaberaje : rows[i].golaberaje,
                  taldeaikusi : taldeaikusi,
                  multzoizena : multzoizena
                  //setalde: rows[i].setalde,
                  //setkontra: rows[i].setkontra
               };
          j++;
          //console.log("Taldeak:" + taldeak[j]);
          
          //console.log(  );
         // console.log("Jokalari" + jokalariak);
         }
        }
        if(vKategoria !=null){
              //console.log("vKategoria:" +vKategoria);
              multzoa.taldeak = taldeak;
              multzoak[t] = multzoa;
              maila.multzoak = multzoak;
              maila.bigarrengoak = bigarrengoak;
              mailak[k] = maila;
              //console.log("Mailak:" +t + JSON.stringify(mailak));
              k++;
            }
        if(admin){
          res.render('sailkapenak.handlebars', {title : 'Txaparrotan-Sailkapenak admin', data2:mailak, taldeizena: req.session.txapelketaizena, menuadmin: admin} );
        }
        else{
          res.render('sailkapenak.handlebars', {title : 'Txaparrotan-Sailkapenak', data2:mailak, taldeizena: req.session.taldeizena, menuadmin: admin, taldekoa:zuretaldekoa} );

        }
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
  //console.log("KAixo" +JSON.stringify(taulaS));
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

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT * FROM taldeak,grupoak,maila,txapelketa where idtxapelketa = idtxapelketam and idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = ? order by mailazki,multzo',[req.session.idtxapelketa],function(err,rows)     {
    req.connection.query('SELECT * FROM taldeak,grupoak,maila,txapelketa where idtxapelketa = idtxapelketam and idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = $1 order by mailazki,multzo',[req.session.idtxapelketa],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        // console.log(rows);
        for (var i in rows) { 
          if(vKategoria != rows[i].kategoriam || vMultzo != rows[i].idgrupo){
            if(vKategoria !=null){
              //console.log("multzoak:" +JSON.stringify(multzoak));
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
//postgres                    var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                    var query = req.connection.query('INSERT INTO partiduak ("idgrupop","idtalde1","idtalde2","izenafinala1","izenafinala2","jardunaldia") VALUES ($1,$2,$3,$4,$5,$6)',[vMultzo,multzoak[i11],multzoak[i21],multzoizenak[i11],multzoizenak[i21], r+1], function(err, rowsg)
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
//postgres                    var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                    var query = req.connection.query('INSERT INTO partiduak ("idgrupop","idtalde1","idtalde2","izenafinala1","izenafinala2","jardunaldia") VALUES ($1,$2,$3,$4,$5,$6)',[vMultzo,multzoak[i21],multzoak[i11],multzoizenak[i21],multzoizenak[i11],r + jardunaldiak], function(err, rowsg)
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
          if(rows[i].sexua == "X") 
            multzoizenak[j] = rows[i].taldeizena + " *";
          else
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
//postgres                    var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                    var query = req.connection.query('INSERT INTO partiduak ("idgrupop","idtalde1","idtalde2","izenafinala1","izenafinala2","jardunaldia") VALUES ($1,$2,$3,$4,$5,$6)',[vMultzo,multzoak[i11],multzoak[i21],multzoizenak[i11],multzoizenak[i21], r+1], function(err, rowsg)
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
//postgres                    var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                    var query = req.connection.query('INSERT INTO partiduak ("idgrupop","idtalde1","idtalde2","izenafinala1","izenafinala2","jardunaldia") VALUES ($1,$2,$3,$4,$5,$6)',[vMultzo,multzoak[i21],multzoak[i11],multzoizenak[i21],multzoizenak[i11],r + jardunaldiak], function(err, rowsg)
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
var multzoizena, ezindaikusi;
//var txapelketaprest = 0;

//postgres  req.getConnection(function(err,connection){
      //connection.query('SELECT *,t1.taldeizena taldeizena1,t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1,taldeak t2,grupoak,maila,zelaia where idgrupop=idgrupo and t1.kategoria=idmaila and t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and p.zelaia=zelaizki and idtxapelz=t1.idtxapeltalde and t1.idtxapeltalde = ? and t2.idtxapeltalde = ? order by mailazki,multzo,jardunaldia',[id, id],function(err,rows)     {
//postgres      connection.query('SELECT * FROM partiduak,grupoak,maila,zelaia,txapelketa where idgrupop=idgrupo and idtxapelketa = idtxapelketam and kategoriam=idmaila and zelaia=zelaizki and idtxapelz = ? and idtxapelketam = ? order by mailazki,multzo,jardunaldia,pareguna,parordua,zelaia',[id,id],function(err,rows)     {
    req.connection.query('SELECT * FROM partiduak,grupoak,maila,zelaia,txapelketa where idgrupop=idgrupo and idtxapelketa = idtxapelketam and kategoriam=idmaila and zelaia=zelaizki and idtxapelz = $1 and idtxapelketam = $2 order by mailazki,multzo,jardunaldia,pareguna,parordua,zelaia',[id,id],function(err,wrows)     {
      if(err)
           console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres 
      ezindaikusi = 0;
      if(rows.length == 0)
           ezindaikusi = 1;
      else
       if (rows[0].txapelketaprest== 0)
             ezindaikusi = 1;
//      if(rows.length == 0 || (rows[0].txapelketaprest== 0 && !admin)){
      if(ezindaikusi && !admin){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Inskripzio amaiera egunaren ondoren izango dira partiduak ikusgai!',
           };
           //return res.redirect('/'); 
            return res.render('partiduak.handlebars', {title : 'Txaparrotan-Partiduak', data2:mailak, taldeizena: req.session.taldeizena,menuadmin: admin, taldekoa: zuretaldekoa} );
      };

      req.connection.query('SELECT * FROM partiduak,grupoak,maila,txapelketa where idgrupop=idgrupo and idtxapelketa = idtxapelketam and kategoriam=idmaila and idtxapelketam = $1 order by mailazki,multzo,jardunaldia,pareguna,parordua,idpartidu',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsp = wrows.rows;     //postgres 
        if(rowsp.length == 0){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Oraindik, Ez dago partidurik!',
           };
           //return res.redirect('/'); 
            return res.render('partiduak.handlebars', {title : 'Txaparrotan-Partiduak', data2:mailak, taldeizena: req.session.taldeizena,menuadmin: admin, taldekoa: zuretaldekoa} );
        }
 
        if(rows.length == 0)
             rows = wrows.rows;   // azkeneko select-a 

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

//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM jokalariak,taldeak where idtaldej = idtaldeak and idtxapeltalde = ? order by kamisetaneurria',[id],function(err,rows)     {
     req.connection.query('SELECT * FROM jokalariak,taldeak where idtaldej = idtaldeak and idtxapeltalde = $1 order by kamisetaneurria',[id],function(err,wrows)     {
          //connection.query('SELECT * FROM jokalariak order by kamisetaneurria',function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        var n11 = 0;
        var n12 = 0;
        var s = 0;
        var m = 0;
        var l = 0;
        var xl = 0;
        var xxl = 0;
        var totala = 0;

        for (var i in rows) {
            if(rows[i].kamisetaneurria == '9-10'){ 
              n11 ++;             
            }
            if(rows[i].kamisetaneurria == '11-12'){
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
  };

exports.kamisetenorriak = function(req, res){
var id = req.session.idtxapelketa;
var taldeak = [];
var taldea = {};
var t=0,k=1;
var n11 = 0;
var n12 = 0;
var s = 0;
var m = 0;
var l = 0;
var xl = 0;
var xxl = 0;
var totala = 0;
var vTalde;
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM jokalariak,taldeak,maila where idtaldej = idtaldeak and idmaila = kategoria and idtxapeltalde = ? order by mailazki,taldeizena,kamisetaneurria',[id],function(err,rows)     {
     req.connection.query('SELECT * FROM jokalariak,taldeak,maila where idtaldej = idtaldeak and idmaila = kategoria and idtxapeltalde = $1 order by mailazki,taldeizena,kamisetaneurria',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        for (var i in rows) { 
          if(vTalde != rows[i].idtaldeak){
            if(vTalde !=null){
              taldea.n11 = n11;
              taldea.n12 = n12;
              taldea.s = s;
              taldea.m = m;
              taldea.l = l;
              taldea.xl = xl;
              taldea.xxl = xxl;
              totala = n11 + n12 + s + m + l + xl + xxl;
              taldea.totala = totala;
              if (k % 10 == 0){
                taldea.jauzi = 1;
              }
              else{
                taldea.jauzi = 0;
              }
              // Inprimitzeko Imprimir -> Guardar PDF -> Margenes mínimos

              //console.log("k:" +k+ " jauzi: "+taldea.jauzi);
              k++;
              taldeak[t] = taldea;
              t++;
              n11 = 0;
              n12 = 0;
              s = 0;
              m = 0;
              l = 0;
              xl = 0;
              xxl = 0;
            }
            vTalde = rows[i].idtaldeak;
       
            taldea = {

                  idtaldeak  : rows[i].idtaldeak,
                  taldeizena    : rows[i].taldeizena,
                  akronimoa    : rows[i].akronimoa,
                  herria    : rows[i].herria,
                  izenaard    : rows[i].izenaard,
                  telefonoard    : rows[i].telefonoard,
                  balidatuta : rows[i].balidatuta,
                  i : t
               };
               
          }
            if(rows[i].kamisetaneurria == '9-10'){ 
              n11 ++;             
            }
            if(rows[i].kamisetaneurria == '11-12'){
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
        if(vTalde !=null){
              taldea.n11 = n11;
              taldea.n12 = n12;
              taldea.s = s;
              taldea.m = m;
              taldea.l = l;
              taldea.xl = xl;
              taldea.xxl = xxl;
              totala = n11 + n12 + s + m + l + xl + xxl;
              taldea.totala = totala;
              taldeak[t] = taldea;
              t++;
            }
        
        res.render('kamisetenorriak.handlebars', {title : 'Txaparrotan-Kamiseten orriak', data2:taldeak, taldeizena: req.session.txapelketaizena, layout: null });
         });

  };

exports.sariak = function(req, res){
var id = req.session.idtxapelketa;
var vKategoria = req.body.kategoria4;

//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM jokalariak,taldeak where idtaldej = idtaldeak and idtxapeltalde = ?  and kategoria = ? order by RAND()',[id, vKategoria],function(err,rows)     {
     req.connection.query('SELECT * FROM jokalariak,taldeak where idtaldej = idtaldeak and idtxapeltalde = $1  and kategoria = $2 order by random()',[id, vKategoria],function(err,wrows)     {
          //connection.query('SELECT * FROM jokalariak order by kamisetaneurria',function(err,rows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        
        res.render('sarienzozketa.handlebars', {title : 'Txaparrotan-Sarien zozketa', data:rows, taldeizena: req.session.txapelketaizena} );
         });

  };

  exports.ordutegiaegin = function(req, res){
  var id = req.session.idtxapelketa;
  var imultzo = [];
  var r = 0, j = 0, k = 0;
  var idpar; 
  var vZelaia=0;
  var egunekobehin = 0;
  var vDenbora,vEguna,vOrdua,aOrdua,orduak,minutuak,segunduak,vBukaera,aBukaera,vAtsedena,vAtsedenaDenbora,atseordu, Eguna;

//postgres  req.getConnection(function(err,connection){
//postgres   connection.query('SELECT MAX(jardunaldia) as jardunkop FROM grupoak,partiduak where multzo < 900 and idtxapelketam = ? and idgrupop = idgrupo ',[id],function(err,rowsp)     {
   req.connection.query('SELECT MAX(jardunaldia) as jardunkop FROM grupoak,partiduak where multzo < \'900\' and idtxapelketam = $1 and idgrupop = idgrupo ',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsp = wrows.rows;     //postgres
        console.log("Jardunkop: "+rowsp[0].jardunkop);
//postgres    connection.query('SELECT kategoriam , MAX(jardunaldia) as guztira FROM grupoak,partiduak,maila where multzo < 900 and idtxapelketam = ? and idgrupop = idgrupo and idmaila = kategoriam group by kategoriam ORDER BY guztira DESC, mailazki ASC',[id],function(err,rowsg)     {
    req.connection.query('SELECT kategoriam , MAX(jardunaldia) as guztira FROM grupoak,partiduak,maila where multzo < \'900\' and idtxapelketam = $1 and idgrupop = idgrupo and idmaila = kategoriam group by kategoriam, mailazki ORDER BY guztira DESC, mailazki ASC',[id],function(err,wrows)     {
    //connection.query('SELECT kategoriam ,count(*) as guztira FROM grupoak,partiduak where multzo < 900 and idtxapelketam = ? and idgrupop = idgrupo group by kategoriam ORDER BY guztira DESC',[id],function(err,rowsg)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsg = wrows.rows;     //postgres
        console.log("Rowsg" + JSON.stringify(rowsg));
/*        
//        for (var r=1; r<= rowsp[0].jardunkop ; r++){
        for ( r=1; r<= rowsp[0].jardunkop ; r++){
//          for (var j in rowsg){
           for (j = 0; j < rowsg.length; j++) {
           console.log(" j Rowsg" + j +"-"+rowsg[j].kategoriam+"-"+ r);
//postgres            connection.query('SELECT * FROM grupoak,partiduak,txapelketa where idtxapelketam = ? and idtxapelketa = idtxapelketam and idgrupop = idgrupo and kategoriam = ? and jardunaldia = ? ',[id,rowsg[j].kategoriam, r],function(err,rows)     {            
           req.connection.query('SELECT * FROM grupoak,partiduak,txapelketa where idtxapelketam = $1 and idtxapelketa = idtxapelketam and idgrupop = idgrupo and kategoriam = $2 and jardunaldia = $3 ORDER BY multzo,jardunaldia ',[id,rowsg[j].kategoriam, r],function(err,wrows)     {            
*/
           req.connection.query('SELECT * FROM partiduak,grupoak,maila,txapelketa where idgrupop=idgrupo and idtxapelketa = idtxapelketam and kategoriam=idmaila and idtxapelketa = $1 order by jardunaldia,ordutegiazki,mailazki,multzo',[id],function(err,wrows)     {

              if(err)
                 console.log("Error Selecting : %s ",err );
              rows = wrows.rows;     //postgres
//              for(var k in rows){
              for ( k = 0; k < rows.length; k++) {                
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
                    atseordu = rows[k].atsedenordua;
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
              Eguna = vEguna.getFullYear()+"-"+((vEguna.getMonth()<9?'0':'')+(vEguna.getMonth() + 1)) +"-"+((vEguna.getDate()<10?'0':'')+(vEguna.getDate())); ;

              console.log(idpar+ "g: " + rows[k].idgrupop+"-"+rows[k].kategoriam +" p: "+rows[k].idtalde1+"-"+rows[k].idtalde2 + "-"+ r +"-"+rows[k].jardunaldia + " Eguna: "+ Eguna+" vOrdua: "+vOrdua+ " Zelaia:" +vZelaia);

              var data = {
            
                pareguna    : vEguna,
                parordua    : vOrdua,
                zelaia      : vZelaia
        
              };
//postgres            var query = connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idpar], function(err, rowst)
            var query = req.connection.query("UPDATE partiduak set pareguna=$1,parordua=$2,zelaia=$3 WHERE idpartidu = $4 " ,[Eguna, vOrdua, vZelaia, idpar], function(err, rowst)
            {
  
              if (err)                                                                                                                              
                console.log("Error Updating : %s ",err );
             // console.log("Rowst: " + JSON.stringify(rowst));
            });
            }
          });
/*
          }
        } 
*/        
        //res.redirect(303,'/admin/kalkuluak');
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

//postgres  req.getConnection(function(err,connection){
//postgres   connection.query('SELECT pareguna,parordua FROM grupoak,partiduak where multzo < 900 and idtxapelketam = ? and idgrupop = idgrupo  ORDER BY pareguna DESC,parordua DESC',[id],function(err,rowsf)     {
   req.connection.query('SELECT pareguna,parordua FROM grupoak,partiduak where multzo < \'900\' and idtxapelketam =$1 and idgrupop = idgrupo  ORDER BY pareguna DESC,parordua DESC',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsf = wrows.rows;     //postgres
         console.log("Azkena:"+rowsf[0].pareguna+" "+rowsf[0].parordua)   
//postgres    connection.query('SELECT kategoriam ,count(*) FROM grupoak,partiduak,maila where multzo > 900 and idtxapelketam = ? and idgrupop = idgrupo and idmaila = kategoriam group by kategoriam ORDER BY COUNT(*) DESC, mailazki ASC',[id],function(err,rowsg)     {
    req.connection.query('SELECT kategoriam ,count(*) FROM grupoak,partiduak,maila where multzo > \'900\' and idtxapelketam = $1 and idgrupop = idgrupo and idmaila = kategoriam group by kategoriam, mailazki ORDER BY COUNT(*) DESC, mailazki ASC',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsg = wrows.rows;     //postgres 
        console.log("Rowsg" + JSON.stringify(rowsg));
        //Adi jardunaldi kopuruarekin! =10
/*
        for (r=1; r< 10; r++){
          for (var j in rowsg){
//postgres            connection.query('SELECT * FROM grupoak,partiduak,txapelketa where multzo > 900 and idtxapelketam = ? and idtxapelketa = idtxapelketam and idgrupop = idgrupo and kategoriam = ? and jardunaldia = ? ',[id,rowsg[j].kategoriam, r],function(err,rows)     {            
            req.connection.query('SELECT * FROM grupoak,partiduak,txapelketa where multzo > \'900\' and idtxapelketam = $1 and idtxapelketa = idtxapelketam and idgrupop = idgrupo and kategoriam = $2 and jardunaldia = $3 ',[id,rowsg[j].kategoriam, r],function(err,wrows)     {            
*/
            req.connection.query('SELECT * FROM partiduak,grupoak,maila,txapelketa where multzo > \'900\' and idgrupop=idgrupo and idtxapelketa = idtxapelketam and kategoriam=idmaila and idtxapelketa = $1 order by multzo, mailazki, izenafinala1',[id],function(err,wrows)     {

              if(err)
                 console.log("Error Selecting : %s ",err );
              rows = wrows.rows;     //postgres
              for(var k in rows){

              if (vZelaia == 0){
                  vZelaia = 1;
                  vJardunaldi = rows[k].jardunaldia;
                  vMaila = rows[k].kategoriam;
                  vEguna = new Date(rowsf[0].pareguna);
                  //vBukaera = new Date(rows[k].pareguna);
                  vBukaera = new Date(rowsf[0].pareguna);
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
//postgres            var query = connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idpar], function(err, rowst)
            var query = req.connection.query("UPDATE partiduak set pareguna=$1,parordua=$2,zelaia=$3 WHERE idpartidu = $4 " ,[vEguna, vOrdua, vZelaia, idpar], function(err, rowst)
            {
  
              if (err)                                                                                                                              
                console.log("Error Updating : %s ",err );
              //console.log("Rowst: " + JSON.stringify(rowst));
            });
            }
          });
/*
          }
        } 
*/        
        //res.redirect(303, '/admin/kalkuluak');
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
var emaitzabai, golak;

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT * FROM zelaia where idtxapelz = ? order by zelaizki,idzelaia',[req.session.idtxapelketa],function(err,rows)     {
    req.connection.query('SELECT * FROM zelaia where idtxapelz = $1 order by zelaizki,idzelaia',[req.session.idtxapelketa],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
      //console.log(rows);
        for (var i in rows){
          zelaia= {};
          zelaia.zelaiizena = rows[i].zelaiizena;
          z++;
          zelaiak[z] = zelaia;
        }
        
    });
//postgres        connection.query('SELECT * FROM partiduak,grupoak,maila,txapelketa where idmaila = kategoriam and idtxapelketa= idtxapelketam and idtxapelketam = ? and idgrupop = idgrupo order by pareguna, parordua,zelaia',[req.session.idtxapelketa],function(err,rowsf)     {
        req.connection.query('SELECT * FROM partiduak,grupoak,maila,txapelketa where idmaila = kategoriam and idtxapelketa= idtxapelketam and idtxapelketam = $1 and idgrupop = idgrupo order by pareguna, parordua,zelaia',[req.session.idtxapelketa],function(err,wrows)     {
          if(err)
           console.log("Error Selecting : %s ",err );
          rowsf = wrows.rows;     //postgres
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

                if(data == "0000-00-00" || data == null){
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
//          if(rowsf[i].emaitza1 != null || rowsf[i].emaitza2 != null){
          if(rowsf[i].emaitza1 != 0 || rowsf[i].emaitza2 != 0){            
              emaitzabai = 1;
              golak = rowsf[i].emaitza1 +"-"+ rowsf[i].emaitza2 +".";
          }    
          else
          {
              emaitzabai = 0;
              golak = "";    
          }
          
          partiduak[j] = {
                  akronimoa      : akronimoa,
                  taldeizena1    : rowsf[i].izenafinala1,
                  taldeizena2    : rowsf[i].izenafinala2,
                  golak1a        : rowsf[i].golak1a,
                  golak1b        : rowsf[i].golak1b,
                  goldeoro1        : rowsf[i].goldeoro1,
                  golak2a        : rowsf[i].golak2a,
                  golak2b        : rowsf[i].golak2b,
                  goldeoro2        : rowsf[i].goldeoro2,
                  shutout        : rowsf[i].shutout,
                  emaitza1        : rowsf[i].emaitza1,
                  emaitza2        : rowsf[i].emaitza2, 
                  emaitzabai     : emaitzabai,
                  golak          : golak
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

};

exports.taldeordutegia = function(req, res){
var id = req.session.idtxapelketa;
var idtalde = req.session.idtalde;
var data = new Date();
var ezerez = [];

//postgres  req.getConnection(function(err,connection){
//hemendik
//postgres    connection.query('SELECT * FROM txapelketa where idtxapelketa = ? ',[id],function(err,rows) {
    req.connection.query('SELECT * FROM txapelketa where idtxapelketa = $1 ',[id],function(err,wrows) {
      if(err)
           console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres
      if(rows.length == 0 || (rows[0].txapelketaprest == 0           )){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Inskripzio amaiera egunaren ondoren izango da ikusgai ordutegia!',
           };
        return res.render('taldeordutegia.handlebars', {title : 'Txaparrotan-Talde ordutegia', data : ezerez, taldeizena: req.session.taldeizena} );  
      };
  //honeaino 
//postgres      connection.query('SELECT *,t1.taldeizena taldeizena1, t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1, taldeak t2,zelaia where t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and p.zelaia=zelaizki and idtxapelz=t1.idtxapeltalde and t1.idtxapeltalde = ? and (t1.idtaldeak = ? or t2.idtaldeak = ?) order by pareguna, parordua',[id,idtalde,idtalde],function(err,rows)     {
      req.connection.query('SELECT *,t1.taldeizena taldeizena1, t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1, taldeak t2,zelaia where t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and p.zelaia=zelaizki and idtxapelz=t1.idtxapeltalde and t1.idtxapeltalde = $1 and (t1.idtaldeak = $2 or t2.idtaldeak = $3) order by pareguna, parordua',[id,idtalde,idtalde],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
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

  var goldeoro1 = [{balioa : " "}, {balioa : "A"}, {balioa : "B"}];
  var goldeoro2 = [{balioa : " "}, {balioa : "A"}, {balioa : "B"}];
  var shutout = [{balioa : " "}, {balioa : "A"}, {balioa : "B"}];

//postgres  req.getConnection(function(err,connection){
//postgres      connection.query('SELECT * FROM partiduak,grupoak where idgrupo=idgrupop and idtxapelketam= ? and idpartidu = ?',[id,idpar],function(err,rows)     {
      req.connection.query('SELECT * FROM partiduak,grupoak where idgrupo = idgrupop and idtxapelketam = $1 and idpartidu = $2',[id,idpar],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        //console.log(rows);

        for(var i in goldeoro1 ){
               if(rows[0].goldeoro1 == goldeoro1[i].balioa){
                  goldeoro1[i].aukeratua = true;
               }
               else
                  goldeoro1[i].aukeratua = false;
        }
        rows[0].gol1 = goldeoro1;
        for(var i in goldeoro2 ){
               if(rows[0].goldeoro2 == goldeoro2[i].balioa){
                  goldeoro2[i].aukeratua = true;
               }
               else
                  goldeoro2[i].aukeratua = false;
        }
        rows[0].gol2 = goldeoro2;
        for(var i in shutout ){
               if(rows[0].shutout == shutout[i].balioa){
                  shutout[i].aukeratua = true;
               }
               else
                  shutout[i].aukeratua = false;
        }
        rows[0].shut = shutout;        

        res.render('emaitzasartu.handlebars', {title : 'Txaparrotan-Emaitza sartu', data: rows, taldeizena: req.session.txapelketaizena} );
    });

};

exports.partiduordua = function(req, res){
  var id = req.session.idtxapelketa;
  var idpar = req.params.partidu;

//postgres  req.getConnection(function(err,connection){
      //connection.query('SELECT *,t1.taldeizena taldeizena1,t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1,taldeak t2 where t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and t1.idtxapeltalde = ? and t2.idtxapeltalde = ? and idpartidu = ?',[id, id,idpar],function(err,rows)     {
//postgres      connection.query('SELECT * FROM partiduak where idpartidu = ?',[idpar],function(err,rows)     {
      req.connection.query('SELECT *, to_char("pareguna", \'YYYY-MM-DD\') AS "pareguna" FROM partiduak where idpartidu = $1',[idpar],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
//        console.log(rows);
        console.log("Aldatu "+idpar);
        res.render('partiduorduaaldatu.handlebars', {title : 'Txaparrotan-Partidu ordua aldatu', data: rows, taldeizena: req.session.txapelketaizena} );
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
  else if((goldeoro2=="A" && golak1a < golak1b && shutout=="A") || (goldeoro2=="B" && golak1a > golak1b && shutout=="A") ){
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
  else if((goldeoro2=="B" && golak1a > golak1b && shutout=="B") || (goldeoro2=="A" && golak1a < golak1b && shutout=="B") ){
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

  var golak1a = parseInt(req.body.golak1a);
  var golak1b = parseInt(req.body.golak1b);
  var golak2a = parseInt(req.body.golak2a);
  var golak2b = parseInt(req.body.golak2b);
  var goldeoro1 = req.body.goldeoro1;
  var goldeoro2 = req.body.goldeoro2;
  var shutout = req.body.shutout;
  var emaitza1 = req.body.emaitza1;
  var emaitza2 = req.body.emaitza2;
  var lehengolak1a = req.body.lehengolak1a;
  var lehengolak2a = req.body.lehengolak2a;
  var lehengolak1b = req.body.lehengolak1b;
  var lehengolak2b = req.body.lehengolak2b;


  var bemaitza1,bemaitza2, jokatutakopartiduak, irabazitakopartiduak,puntuak, emaitza1f,emaitza2f;
  var golakalde=0, golakkontra=0, setalde=0, setkontra=0;

  //console.log("Emaitza z: "+emaitza1+" "+emaitza2);
  bemaitza1 = emaitzakalkulatu(golak1a,golak1b,golak2a,golak2b,goldeoro1,goldeoro2,shutout).emaitza1f;
  bemaitza2 = emaitzakalkulatu(golak1a,golak1b,golak2a,golak2b,goldeoro1,goldeoro2,shutout).emaitza2f;   
  //console.log("Emaitza:" +bemaitza1+ "-" +bemaitza2);

  if(bemaitza1 == 0 && bemaitza2 == 0){
           res.locals.flash = {
            type: 'danger',
            intro: 'Adi!',
            message: 'Emaitza 0 - 0 . Berriro sartu.'
           }; 
           var golde1 = [{balioa : " "}, {balioa : "A"}, {balioa : "B"}];
           var golde2 = [{balioa : " "}, {balioa : "A"}, {balioa : "B"}];
           var shutt = [{balioa : " "}, {balioa : "A"}, {balioa : "B"}];
           var data = [{
                        idpartidu : req.params.partidu,
                        izenafinala1 : req.body.izenafinala1,
                        izenafinala2 : req.body.izenafinala2,
                        golak1a : req.body.golak1a,
                        golak1b : req.body.golak1b,
                        golak2a : req.body.golak2a,
                        golak2b : req.body.golak2b,
                        goldeoro1 : req.body.goldeoro1,
                        goldeoro2 : req.body.goldeoro2,
                        shutout : req.body.shutout,
                        emaitza1 : req.body.emaitza1,
                        emaitza2 : req.body.emaitza2
           }];
           for(var i in golde1 ){
               if(goldeoro1 == golde1[i].balioa){
                  golde1[i].aukeratua = true;
               }
               else
                  golde1[i].aukeratua = false;
           }
           data[0].gol1 = golde1;
           for(var i in golde2 ){
               if(goldeoro2 == golde2[i].balioa){
                  golde2[i].aukeratua = true;
               }
               else
                  golde2[i].aukeratua = false;
           }
           data[0].gol2 = golde2;
           for(var i in shutt ){
               if(shutout == shutt[i].balioa){
                  shutt[i].aukeratua = true;
               }
               else
                  shutt[i].aukeratua = false;
           }
           data[0].shut = shutt;

           return res.render('emaitzasartu.handlebars', {title : 'Txaparrotan-Emaitza sartu', data : data , taldeizena: req.session.txapelketaizena} ); 
  };

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idpartidu = ? ',[idpar],function(err,rows)     {
    req.connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idpartidu = $1 ',[idpar],function(err,wrows)     {
      if(err)
           console.log("Error Selecting : %s ",err );
      rows = wrows.rows;     //postgres
      if (!(bemaitza1 == rows[0].emaitza1 && bemaitza2 == rows[0].emaitza2 &&          // ADI ADI  dato berdinak sartu dira
           golak1a == rows[0].golak1a && golak2a == rows[0].golak2a &&
            golak1b == rows[0].golak1b && golak2b == rows[0].golak2b ))
      {
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
//postgres        connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idpar], function(err, rowst)
        req.connection.query("UPDATE partiduak set emaitza1=$1, emaitza2=$2, golak1a=$3, golak1b=$4, golak2a=$5, golak2b=$6, goldeoro1=$7, goldeoro2=$8, shutout=$9 WHERE idpartidu = $10 ",[bemaitza1, bemaitza2, golak1a, golak1b, golak2a, golak2b, goldeoro1, goldeoro2, shutout,idpar], function(err, rowst)
        {
          if (err)
              console.log("Error Updating : %s ",err );

          if(rows[0].multzo <900){
//postgres           connection.query('SELECT * FROM taldeak where idtaldeak= ? and idtxapeltalde = ?',[talde1,id],function(err,rowst)     {
           req.connection.query('SELECT * FROM taldeak where idtaldeak= $1 and idtxapeltalde = $2',[talde1,id],function(err,wrows)     {
            if(err)
              console.log("Error Selecting : %s ",err );
            rowst = wrows.rows;     //postgres           
            jokatutakopartiduak = rowst[0].jokatutakopartiduak;
            irabazitakopartiduak = rowst[0].irabazitakopartiduak;
            puntuak = rowst[0].puntuak;
            golakalde = rowst[0].golakalde;
            // console.log("GOLAKALDE: "+rowst[0].golakalde+ "-"+golakalde);
            golakkontra = rowst[0].golakkontra;
            setalde = rowst[0].setalde;
            setkontra = rowst[0].setkontra;
            //console.log("Jp:"+jokatutakopartiduak+" ip:" + irabazitakopartiduak+ " pun:"+ puntuak);
            //console.log("Emaitza2:"+bemaitza1+"-"+bemaitza2);
            //console.log("Emaitza3:"+emaitza1+"-"+emaitza2);
            if((emaitza1==null && emaitza2==null) || (emaitza1==0 && emaitza2==0)){
              jokatutakopartiduak++;             
              if(bemaitza1>bemaitza2){
                irabazitakopartiduak++; 
              }
//              console.log("5");
            }
            if(emaitza1 > emaitza2 && bemaitza1 < bemaitza2){
              irabazitakopartiduak--;
//              console.log("1");
            }
            if(emaitza1 < emaitza2 && bemaitza1 > bemaitza2){
              irabazitakopartiduak++;
//              console.log("2");
            }
//            puntuak = puntuak + (bemaitza1-emaitza1);
//            golakalde = golakalde + (golak1a + golak2a - lehengolak1a - lehengolak2a);
//            golakkontra = golakkontra + (golak1b + golak2b - lehengolak1b - lehengolak2b);
            puntuak = puntuak + (bemaitza1 - rows[0].emaitza1);
            golakalde = golakalde + (golak1a + golak2a - rows[0].golak1a - rows[0].golak2a);
            golakkontra = golakkontra + (golak1b + golak2b - rows[0].golak1b - rows[0].golak2b);
            //setalde = setalde + (bemaitza1-emaitza1);
            //setkontra = setkontra + (bemaitza1-emaitza1);
            var data = {

              jokatutakopartiduak    : jokatutakopartiduak,
              irabazitakopartiduak    : irabazitakopartiduak,
              puntuak    : puntuak,
              golakalde : golakalde,
              golakkontra: golakkontra  
              //setalde : setalde,
              //setkontra: setkontra      
            };
//postgres            connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,talde1], function(err, rowst)
            req.connection.query("UPDATE taldeak set jokatutakopartiduak=$1, irabazitakopartiduak=$2, puntuak=$3, golakalde=$4, golakkontra=$5 WHERE idtaldeak = $6  ",[jokatutakopartiduak, irabazitakopartiduak, puntuak, golakalde, golakkontra, talde1], function(err, rowst)

            {
             if (err)
               console.log("Error Updating : %s ",err );
//postgres             connection.query('SELECT * FROM taldeak where idtaldeak= ? and idtxapeltalde = ?',[talde2,id],function(err,rowsp)     {
             req.connection.query('SELECT * FROM taldeak where idtaldeak= $1 and idtxapeltalde = $2',[talde2,id],function(err,wrows)     {
                if(err)
                  console.log("Error Selecting : %s ",err );
                rowsp = wrows.rows;     //postgres
                jokatutakopartiduak = rowsp[0].jokatutakopartiduak;
                irabazitakopartiduak = rowsp[0].irabazitakopartiduak;
                puntuak = rowsp[0].puntuak;
                golakalde = rowsp[0].golakalde;
                golakkontra = rowsp[0].golakkontra;
                setalde = rowsp[0].setalde;
                setkontra = rowsp[0].setkontra;

                if((emaitza1==null && emaitza2==null)||(emaitza1==0 && emaitza2==0)){
                  jokatutakopartiduak++;
                  if(bemaitza1 < bemaitza2){
                    irabazitakopartiduak++;
                  }
//                  console.log("0");
                }
                if(emaitza1 < emaitza2 && bemaitza1 > bemaitza2){
                  irabazitakopartiduak--;
//                  console.log("3");
                }
                if(emaitza1 > emaitza2 && bemaitza1 < bemaitza2){
                  irabazitakopartiduak++;
//                  console.log("4");
                }
//                puntuak = puntuak + (bemaitza2-emaitza2);
//                golakalde = golakalde + (golak1b + golak2b - lehengolak1b - lehengolak2b);
//                golakkontra = golakkontra + (golak1a + golak2a - lehengolak1a - lehengolak2a);
                puntuak = puntuak + (bemaitza2 - rows[0].emaitza2);
                golakalde = golakalde + (golak1b + golak2b - rows[0].golak1b - rows[0].golak2b);
                golakkontra = golakkontra + (golak1a + golak2a - rows[0].golak1a - rows[0].golak2a);
                //setalde = setalde + (bemaitza2-emaitza2);
                //setkontra = setkontra + (bemaitza2-emaitza2);

                var data = {

                  jokatutakopartiduak    : jokatutakopartiduak,
                  irabazitakopartiduak    : irabazitakopartiduak,
                  puntuak    : puntuak,
                  golakalde : golakalde,
                  golakkontra: golakkontra  
                  //setalde : setalde,
                  //setkontra: setkontra        
                };
//                console.log("data: " +JSON.stringify(data));
//postgres                connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,talde2], function(err, rowst)
                req.connection.query("UPDATE taldeak set jokatutakopartiduak=$1, irabazitakopartiduak=$2, puntuak=$3, golakalde=$4, golakkontra=$5 WHERE idtaldeak = $6  ",[jokatutakopartiduak, irabazitakopartiduak, puntuak, golakalde, golakkontra, talde2], function(err, rowst)
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
            req.connection.query("UPDATE partiduak set izenafinala1=$1, idtalde1=$2 WHERE idpartidu = $3 ",[izenafinala, idtalde, idparti], function(err, rowst)
                {
                  if (err)
                    console.log("Error Updating : %s ",err );
                  res.redirect('/admin/emaitzak');
                });    
           }
           else{
            if(rows[0].idfinala2 != null){
              idparti = rows[0].idfinala2;
              var data = {

                  izenafinala2    : izenafinala,
                  idtalde2   : idtalde       
                };
              req.connection.query("UPDATE partiduak set izenafinala2=$1, idtalde2=$2 WHERE idpartidu = $3 ",[izenafinala, idtalde, idparti], function(err, rowst)
                {
                  if (err)
                    console.log("Error Updating : %s ",err );
                  res.redirect('/admin/emaitzak');
                });
            }
           }
//postgres           connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idparti], function(err, rowst)
/*
           req.connection.query("UPDATE partiduak set izenafinala2=$1, idtalde2=$2 WHERE idpartidu = $3 ",[izenafinala, idtalde, idparti], function(err, rowst)
                {
                  if (err)
                    console.log("Error Updating : %s ",err );
                  res.redirect('/admin/emaitzak');
                });
*/                
          }
        });          
      }
      else     // ADI ADI  dato berdinak sartu dira
       { 
       console.log("Emaitza berdina: "+ bemaitza1 + "="+ rows[0].emaitza1 + "-"+ bemaitza2 + "="+ rows[0].emaitza2 + "-"+    
           golak1a + "="+ rows[0].golak1a + "-"+ golak2a + "="+ rows[0].golak2a + "-"+
            golak1b + "="+ rows[0].golak1b + "-"+ golak2b + "="+ rows[0].golak2b );

       res.redirect('/admin/sailkapenak');
       } 
     }); 

  //res.redirect(303, '/admin/emaitzak');
};

exports.emaitzakikusi = function (req,res){ 
var sartugabeak = (req.path == "/admin/emaitzak");
var id = req.session.idtxapelketa;
var partiduak = [];
var j=0;
var data = new Date();

//postgres  req.getConnection(function(err,connection){
      //connection.query('SELECT *,t1.taldeizena taldeizena1,t2.taldeizena taldeizena2 FROM partiduak p,taldeak t1,taldeak t2,grupoak where idgrupop=idgrupo and t1.idtaldeak=p.idtalde1 and t2.idtaldeak=p.idtalde2 and t1.idtxapeltalde = ? and t2.idtxapeltalde = ? order by pareguna, parordua,zelaia',[id, id],function(err,rows)     {
//postgres     connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idtxapelketam = ? order by pareguna, parordua,zelaia',[id],function(err,rows)     {
      req.connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idtxapelketam = $1 order by pareguna, parordua,zelaia',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
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

}

exports.emaitzenorriak = function (req,res){ 
var id = req.session.idtxapelketa;
var partiduak = [];
var j=0,k=1;
var data = new Date();

//postgres  req.getConnection(function(err,connection){
//postgres      connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idtxapelketam = ? order by pareguna, parordua,zelaia',[id],function(err,rows)     {
      req.connection.query('SELECT * FROM partiduak,grupoak where idgrupop=idgrupo and idtxapelketam = $1 order by pareguna, parordua,zelaia',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 
        for(var i in rows){

          data = rows[i].pareguna;
          if(data!= "0000-00-00"){
            rows[i].pareguna= data.getFullYear()+ "-" +(data.getMonth() +1) +"-"+ data.getDate();
          }
          
          rows[i].i= k;
          rows[i].jauzi = k % 6;
          // Inprimitzeko Imprimir -> Guardar PDF -> Margenak 6ra kuadratu
          partiduak [j] = rows[i];
          j++;
          k++;
        }
        
        res.render('emaitzenorriak.handlebars', {title : 'Txaparrotan-Emaitzen orriak', data2:partiduak, taldeizena: req.session.txapelketaizena, layout: null });
    });

}

exports.multzoakreset = function(req, res){
  var id = req.session.idtxapelketa;
  var vKategoria;
  vKategoria = req.body.kategoria3;
  var vGrupo;
  console.log("vKategoria: "+vKategoria+req.path);
//postgres  req.getConnection(function(err,connection){
          var data = {
            
            idgrupot    : null,
            jokatutakopartiduak : null,
            irabazitakopartiduak : null,
            puntuak : null,
            golakalde : null,
            golakkontra: null,  
            setalde : null,
            setkontra: null 

        
        };
        debugger;
        //Update taldea ta delete grupoak.
//postgres        connection.query("UPDATE taldeak set ? WHERE idtxapeltalde = ? and kategoria = ? ",[data,id,vKategoria], function(err, rowst)
//null        req.connection.query("UPDATE taldeak SET jokatutakopartiduak=NULL, irabazitakopartiduak=NULL, puntuak=NULL, golakalde=NULL, golakkontra=NULL, setalde=NULL, setkontra=NULL, idgrupot=NULL  WHERE idtxapeltalde = $1 and kategoria = $2 ",[id,vKategoria], function(err, rowst)
        req.connection.query("UPDATE taldeak SET jokatutakopartiduak=0, irabazitakopartiduak=0, puntuak=0, golakalde=0, golakkontra=0, setalde=0, setkontra=0, idgrupot=NULL  WHERE idtxapeltalde = $1 and kategoria = $2 ",[id,vKategoria], function(err, rowst)
        {
          if (err)
              console.log("Error Updating : %s ",err );
//postgres          connection.query("DELETE FROM grupoak WHERE idtxapelketam = ? and kategoriam = ? ",[id,vKategoria], function(err, rowsd)
          req.connection.query("DELETE FROM grupoak WHERE idtxapelketam = $1 and kategoriam = $2 ",[id,vKategoria], function(err, rowsd)
            {
              if (err)
                console.log("Error Deleting : %s ",err );
        
              res.redirect(303, '/admin/kalkuluak');
            });
        
        });
 
};

exports.partiduakreset = function(req, res){
  var id = req.session.idtxapelketa;
  var vGrupo;
  console.log("Partiduak reset: " +id);
//postgres  req.getConnection(function(err,connection){
          var data = {

            jokatutakopartiduak : null,
            irabazitakopartiduak : null,
            puntuak : null,
            golakalde : null,
            golakkontra: null,  
            setalde : null,
            setkontra: null 

        
        };
        //Update taldea ta delete grupoak.
//postgres        connection.query("UPDATE taldeak set ? WHERE idtxapeltalde = ?  ",[data,id], function(err, rowst)
//        req.connection.query("UPDATE taldeak jokatutakopartiduak=$1, irabazitakopartiduak=$2, puntuak=$3, golakalde=$4, golakkontra=$5, setalde=$6, setkontra=$7 WHERE idtxapeltalde = $8  ",[NULL,NULL,NULL,NULL,NULL,NULL,NULL, id], function(err, rowst)
//null        req.connection.query("UPDATE taldeak SET jokatutakopartiduak=NULL, irabazitakopartiduak=NULL, puntuak=NULL, golakalde=NULL, golakkontra=NULL, setalde=NULL, setkontra=NULL WHERE idtxapeltalde = $1  ",[id], function(err, rowst)
        req.connection.query("UPDATE taldeak SET jokatutakopartiduak=0, irabazitakopartiduak=0, puntuak=0, golakalde=0, golakkontra=0, setalde=0, setkontra=0 WHERE idtxapeltalde = $1  ",[id], function(err, rowst)

        {
  
          if (err)
              console.log("Error Updating : %s ",err );
//postgres          connection.query('SELECT * FROM grupoak WHERE idtxapelketam = ? ',[id], function(err, rows)
          req.connection.query('SELECT * FROM grupoak WHERE idtxapelketam = $1 ',[id], function(err, wrows)
            {
              if (err)
                console.log("Error Selecting : %s ",err );
              rows = wrows.rows;     //postgres
              for(var i in rows){
//postgres                connection.query("DELETE FROM partiduak WHERE idgrupop = ?  ",[rows[i].idgrupo], function(err, rowsd)
                req.connection.query("DELETE FROM partiduak WHERE idgrupop = $1  ",[rows[i].idgrupo], function(err, rowsd)
                {
            
                  if (err)
                   console.log("Error Deleting : %s ",err );   

                });
              }
              res.redirect(303, '/admin/kalkuluak');
            });
        });
 
};

exports.partiduorduaaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idpartidu = req.params.partidu;
    
//postgres    req.getConnection(function (err, connection) {
        console.log("Ordua "+input.parordua);

        var data = {
            
            parordua : input.parordua,
            pareguna   : input.pareguna,
            zelaia : input.zelaia,
            izenafinala1 : input.izenafinala1,
            izenafinala2 : input.izenafinala2

        };
//postgres        connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,idpartidu], function(err, rows)
        req.connection.query("UPDATE partiduak set parordua=$1, pareguna=$2, zelaia=$3 , izenafinala1=$4, izenafinala2=$5 WHERE idpartidu =$6 ",[input.parordua, input.pareguna, input.zelaia, input.izenafinala1, input.izenafinala2, idpartidu], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/admin/partiduak');
          
        });

};

exports.partiduaezabatu = function(req,res){
    
//    var idpartidu = req.params.partidu;
    var input = JSON.parse(JSON.stringify(req.body));
    var idpartidu = input.idpartidu;    

        req.connection.query("DELETE FROM partiduak WHERE idpartidu =$1",[idpartidu], function(err, rows)
        {
          if (err)
              console.log("Error Deleting : %s ",err );
 
          console.log("Ezabatu "+idpartidu);

          res.redirect('/admin/partiduak');
          
        });

};

exports.taldeagehitu = function(req,res){

  var admin = 1, aditestua = "Taldea admin";  
      req.connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = $1 ',[req.session.idtxapelketa],function(err,wrows)     {
        if(err)
              console.log("Error Selecting : %s ",err );
        rowsm = wrows.rows;     //postgres 
        res.render('taldeaksortu.handlebars', {title : 'Txaparrotan-Izen-ematea', taldeizena: req.session.taldeizena, idtxapelketa: req.session.idtxapelketa, mailak:rowsm, aditestua:aditestua, menuadmin:admin});
      });
};

exports.taldeaeditatu = function(req, res){
  var id = req.session.idtxapelketa;
  var idtalde = req.params.talde;

//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM taldeak  where idtaldeak = ?',[idtalde],function(err,rows)     {
      req.connection.query('SELECT * FROM taldeak  where idtaldeak = $1',[idtalde],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
//postgres        connection.query('SELECT idmaila, mailaizena FROM maila where idtxapelm = ? ',[req.session.idtxapelketa],function(err,rowsm)     {
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

          res.render('taldeaaldatu.handlebars', {title : 'Txaparrotan-Taldearen datuak aldatu', data: rows, taldeizena: req.session.txapelketaizena} );
        });
      });

};

exports.taldeaaldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var idtaldea = req.params.talde;
//postgres    req.getConnection(function (err, connection) {

        var data = {
            taldeizena : input.taldeizena,
            kategoria   : input.kategoria,
            sexua   : input.sexua,
            balidatuta   : input.balidatuta,
            berezitasunak : input.berezitasunak,
            lehentasuna  : input.lehentasuna,
            izenaard  : input.izenaard,
            telefonoard : input.telefonoard,
            emailard : input.emailard
        };

        if(input.idgrupot != null && input.idgrupot != ""){
          data.idgrupot = input.idgrupot;
        }
//postgres        connection.query("UPDATE taldeak set ? WHERE idtaldeak = ? ",[data,idtaldea], function(err, rows)
        req.connection.query("UPDATE taldeak set taldeizena=$1, kategoria=$2 , sexua=$3, balidatuta=$4, berezitasunak=$5, lehentasuna=$6, izenaard=$7, telefonoard=$8, emailard=$9, herria = $10 WHERE idtaldeak = $11 ",[input.taldeizena, input.kategoria, input.sexua, input.balidatuta, input.berezitasunak, input.lehentasuna, input.izenaard, input.telefonoard, input.emailard, input.herria, idtaldea], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );
         
          //res.redirect('/admin/taldeakikusi');
          res.redirect('/admin/jokalarikopurua');
          
        });

};

exports.taldeaezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtalde;
     var idtaldea = req.params.talde;
    
//postgres     req.getConnection(function (err, connection) {
//postgres        connection.query("DELETE FROM taldeak  WHERE idtaldeak = ? ",[idtaldea], function(err, rows)
        req.connection.query('DELETE FROM taldeak  WHERE idtaldeak = $1 ',[idtaldea], function(err, rows)
        {
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/admin/taldeakikusi');
        });

};

exports.taldeabalekoa = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtalde;
     var idtxapelketa = req.session.idtxapelketa;
     var idtaldea = req.params.talde;
    
//postgres     req.getConnection(function (err, connection) {
//postgres        connection.query("SELECT * FROM taldeak,maila, txapelketa WHERE idtaldeak = ? and idmaila = kategoria and idtxapelketa = idtxapeltalde ",[idtaldea], function(err, rows)
        req.connection.query('SELECT * FROM taldeak,maila, txapelketa WHERE idtaldeak = $1 and idmaila = kategoria and idtxapelketa = idtxapeltalde ',[idtaldea], function(err, wrows)
        {
          if(err)
            console.log("Error deleting : %s ",err );
          rows = wrows.rows;     //postgres
          if (rows[0].balidatuta == 0){

             //Enkriptatu talde zenbakia. Zenbaki hau aldatuz gero, taldea balidatu ere aldatu!
         var taldezenbakia= idtaldea * 3456789;
         var to = rows[0].emailard;
         var subj = "Ongi-etorri " + rows[0].izenaard;
         var hosta = req.hostname;
         if (process.env.NODE_ENV != 'production'){ 
          hosta += ":"+ (process.env.PORT || 3000);
         }
         
         var body = "<p>1. "+rows[0].taldeizena+" taldea "+rows[0].mailaizena+" mailan balidatu ahal izateko, </p>";
         body += "<h3> klik egin: http://"+hosta+"/taldeabalidatu/" + taldezenbakia+ ". </h3>";
         body += "<p>2. Ondoren, saioa hasi eta zure jokalariak gehitu.</p> <p>3. Hori egindakoan, " +rows[0].kontukorrontea+ " kontu korrontean  "+rows[0].prezioa+ "euro sartu eta kontzeptu bezala "+rows[0].taldeizena+"-"+rows[0].izenaard+" jarri.</p>";
         body += "<p style='color:#FF0000'>4. Hori egin arte, zure taldea ez da apuntaturik egongo.</p>";
         body += "<p style='color:#FFFF00'>5. Eguraldi txarra medioz, antolakuntzak ahalegin guztiak egingo ditu txapelketa bertan behera ez gelditzeko. Bertan behera gelditu ezkero, antolakuntza ez da kargo egiten gertatzen denarekin. Mila esker!</p> \n \n";
         body += "<h3> P.D: Mesedez ez erantzun helbide honetara, mezuak txaparrotan@gmail.com -era bidali</h3>" ;

          req.session.idtalde = idtaldea;
          emailService.send(to, subj, body);
          console.log("baleko emaila: " +to+ " talde izena: "+rows[0].taldeizena);
        }
             res.redirect('/admin/taldeakikusi');
             
        });

};

exports.finalakegin = function (req,res){ 

var input = JSON.parse(JSON.stringify(req.body));
var id = req.session.idtxapelketa;
var vMultzo;

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT * FROM maila where idtxapelm = ? and idmaila = ?  ',[id,input.kategoriaf],function(err,rowsg)     {
    req.connection.query('SELECT * FROM maila where idtxapelm = $1 and idmaila = $2  ',[id,input.kategoriaf],function(err,wrows)     {
      if(err)
           console.log("Error Selecting : %s ",err ); 
      rowsg = wrows.rows;     //postgres      
      console.log("mailaizena: "+rowsg[0].mailaizena+" "+rowsg[0].finalak);  

      if(rowsg[0].finalak == null){
          console.log("Maila honetako final mota aukeratu!");
          res.redirect(303, '/admin/mailakeditatu/'+rowsg[0].idmaila);
      }
      else{
      var partidukopuru = rowsg[0].finalak;
      var faseak = Math.log(partidukopuru) / Math.log(2);

      for(var f=0; f <= faseak; f++){
         vMultzo = 1000 - partidukopuru;
         var data = {
            
            multzo    : 1000 - partidukopuru,
            idtxapelketam : req.session.idtxapelketa,
            kategoriam : input.kategoriaf
        };
//postgres        var query = connection.query("INSERT INTO grupoak set ? ",data, function(err, rowsg)
        var query = req.connection.query('INSERT INTO grupoak (multzo,idtxapelketam,kategoriam) VALUES ($1,$2,$3)',[vMultzo, req.session.idtxapelketa, input.kategoriaf], function(err, rowsg)
        {
          if (err)
              console.log("Error inserting : %s ",err );

        }); 

        partidukopuru = partidukopuru / 2;
       }

      res.redirect(303, '/admin/kalkuluak'); 
    }
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
var vAkronimoa, vizen1, vizen2;

//postgres  req.getConnection(function(err,connection){
//postgres   connection.query('SELECT * FROM grupoak,maila where idmaila = kategoriam and idtxapelketam = ? and kategoriam = ? and multzo > 900 order by idgrupo ',[id,kategoria],function(err,rowsg)     {
    req.connection.query('SELECT * FROM grupoak,maila where idmaila = kategoriam and idtxapelketam = $1 and kategoriam = $2 and multzo > \'900\' order by multzo, idgrupo ',[id,kategoria],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsg = wrows.rows;     //postgres      
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

//postgres      connection.query('SELECT *, (golakalde - golakkontra) AS golaberaje FROM taldeak,grupoak,maila where idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = ? and kategoria = ? order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc, golaberaje desc',[id,kategoria],function(err,rows)     {  
      req.connection.query('SELECT *, (golakalde - golakkontra) AS golaberaje FROM taldeak,grupoak,maila where idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = $1 and kategoria = $2 order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc, golaberaje desc',[id,kategoria],function(err,wrows)     {  
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres        
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
                  puntuak    : rows[i].puntuak,
                  golaberaje : rows[i].golaberaje
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
                vizen1 = izen1.substring(0,45);
                vizen2 = izen2.substring(0,45);
//postgres                var query = connection.query("INSERT INTO partiduak set ? ",data, function(err, rowsg)
                var query = req.connection.query('INSERT INTO partiduak (idgrupop, izenafinala1, izenafinala2, jardunaldia) VALUES ($1,$2,$3,$4)',[imultzo[f], vizen1, vizen2, f + 1], function(err, rowsg)
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

//postgres  req.getConnection(function(err,connection){
//postgres    connection.query('SELECT * FROM grupoak where idtxapelketam = ? and kategoriam = ? and multzo > 900 order by idgrupo ',[id,kategoria],function(err,rowsg)     {
    req.connection.query('SELECT * FROM grupoak where idtxapelketam = $1 and kategoriam = $2 and multzo > \'900\' order by idgrupo ',[id,kategoria],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rowsg = wrows.rows;     //postgres 
        for (var j in rowsg){
          imultzo[j] = rowsg[j].idgrupo;
        }
        console.log("imultzo: "+JSON.stringify(imultzo));
//postgres      connection.query('SELECT *, (golakalde - golakkontra) AS golaberaje FROM taldeak,grupoak,maila where idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = ? and kategoria = ? order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc, golaberaje desc',[id,kategoria],function(err,rows)     {
      req.connection.query('SELECT *, (golakalde - golakkontra) AS golaberaje FROM taldeak,grupoak,maila where idgrupot=idgrupo and kategoria=idmaila and idtxapeltalde = $1 and kategoria = $2 order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc, golaberaje desc, idtaldeak',[id,kategoria],function(err,wrows)     {
//      req.connection.query('SELECT *, (golakalde - golakkontra) AS golaberaje FROM taldeak,grupoak,maila,txapelketa where idgrupot=idgrupo and idtxapelketa = idtxapeltalde and kategoria=idmaila and idtxapeltalde = $1 and balidatuta != \'admin\' order by mailazki,multzo,irabazitakopartiduak desc,puntuak desc, golaberaje desc
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres 

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
                  puntuak    : rows[i].puntuak,
                  golaberaje : rows[i].golaberaje
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
         var aldatutaldea;

         var partiduenId = new Array(10); 
         for (var b = 0; b < 10; b++) {
            partiduenId[b] = new Array(100); 
            for (var c = 0; c < 100; c++) {
              partiduenId[b][c] = 0;
            }
          }
         //JARDUNALDI DESC
//postgres         connection.query('SELECT * FROM grupoak,partiduak where multzo > 900 and idgrupop=idgrupo and idtxapelketam = ? and kategoriam = ? order by jardunaldia DESC,pareguna,parordua,zelaia',[id,kategoria],function(err,rowsf)     {
         req.connection.query('SELECT * FROM grupoak,partiduak where multzo > \'900\' and idgrupop=idgrupo and idtxapelketam = $1 and kategoriam = $2 order by jardunaldia DESC,pareguna,parordua,zelaia',[id,kategoria],function(err,wrows)     {
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsf = wrows.rows;     //postgres
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
              if (multzopostu[0] >= 1 && multzopostu[0] <= 9){
                postu = multzopostu[0] -1;
                for (var j=0; j<multzokopuru;j++){
                 for (var k=j+1; k<multzokopuru;k++){
                   if(mailak[0].multzoak[j].taldeak[postu].jokatutakopartiduak != mailak[0].multzoak[k].taldeak[postu].jokatutakopartiduak){
                      console.log("ADI!!Jokatutako partidu ezberdinak");
                   }
                   if(mailak[0].multzoak[j].taldeak[postu].irabazitakopartiduak < mailak[0].multzoak[k].taldeak[postu].irabazitakopartiduak){
                     aldatutaldea = mailak[0].multzoak[j].taldeak[postu];
                     mailak[0].multzoak[j].taldeak[postu] = mailak[0].multzoak[k].taldeak[postu]; 
                     mailak[0].multzoak[k].taldeak[postu] = aldatutaldea;
                   }
                   else if(mailak[0].multzoak[j].taldeak[postu].irabazitakopartiduak == mailak[0].multzoak[k].taldeak[postu].irabazitakopartiduak){
                    if(mailak[0].multzoak[j].taldeak[postu].puntuak < mailak[0].multzoak[k].taldeak[postu].puntuak){
                     aldatutaldea = mailak[0].multzoak[j].taldeak[postu];
                     mailak[0].multzoak[j].taldeak[postu] = mailak[0].multzoak[k].taldeak[postu]; 
                     mailak[0].multzoak[k].taldeak[postu] = aldatutaldea;
                    }
                    else if(mailak[0].multzoak[j].taldeak[postu].puntuak == mailak[0].multzoak[k].taldeak[postu].puntuak){
                    if(mailak[0].multzoak[j].taldeak[postu].golaberaje < mailak[0].multzoak[k].taldeak[postu].golaberaje){
                     aldatutaldea = mailak[0].multzoak[j].taldeak[postu];
                     mailak[0].multzoak[j].taldeak[postu] = mailak[0].multzoak[k].taldeak[postu]; 
                     mailak[0].multzoak[k].taldeak[postu] = aldatutaldea;
                    } 
                   }   
                   }    
                 }
                }
                multzo = multzopostu[1] - 1;                 
              }
              else{
               for (var j=0; j<28;j++){
                 if(alfabeto[j]==multzopostu[0]){
                   multzo = j;
                   break;
                 }
               }
               postu = multzopostu[1] -1;
              } 
              var izena1 = mailak[0].multzoak[multzo].taldeak[postu].taldeizena;
              var idtalde1 = mailak[0].multzoak[multzo].taldeak[postu].idtaldeak;
              console.log("Izenafinala:"+rowsf[i].izenafinala1+ " "+multzo+" "+postu+" "+izena1);

              multzopostu = rowsf[i].izenafinala2.split("-");
              if (multzopostu[0] >= 1 && multzopostu[0] <= 9){
                postu = multzopostu[0] -1;
                for (var j=0; j<multzokopuru;j++){
                 for (var k=j+1; k<multzokopuru;k++){
                   if(mailak[0].multzoak[j].taldeak[postu].irabazitakopartiduak < mailak[0].multzoak[k].taldeak[postu].irabazitakopartiduak){
                     aldatutaldea = mailak[0].multzoak[j].taldeak[postu];
                     mailak[0].multzoak[j].taldeak[postu] = mailak[0].multzoak[k].taldeak[postu]; 
                     mailak[0].multzoak[k].taldeak[postu] = aldatutaldea;
                   }
                   else if(mailak[0].multzoak[j].taldeak[postu].irabazitakopartiduak == mailak[0].multzoak[k].taldeak[postu].irabazitakopartiduak){
                    if(mailak[0].multzoak[j].taldeak[postu].puntuak < mailak[0].multzoak[k].taldeak[postu].puntuak){
                     aldatutaldea = mailak[0].multzoak[j].taldeak[postu];
                     mailak[0].multzoak[j].taldeak[postu] = mailak[0].multzoak[k].taldeak[postu]; 
                     mailak[0].multzoak[k].taldeak[postu] = aldatutaldea;
                    }
                    else if(mailak[0].multzoak[j].taldeak[postu].puntuak == mailak[0].multzoak[k].taldeak[postu].puntuak){
                    if(mailak[0].multzoak[j].taldeak[postu].golaberaje < mailak[0].multzoak[k].taldeak[postu].golaberaje){
                     aldatutaldea = mailak[0].multzoak[j].taldeak[postu];
                     mailak[0].multzoak[j].taldeak[postu] = mailak[0].multzoak[k].taldeak[postu]; 
                     mailak[0].multzoak[k].taldeak[postu] = aldatutaldea;
                    } 
                   }   
                   }    
                 }
                }
                multzo = multzopostu[1] - 1;                 
              }
              else{
               for (var j=0; j<28;j++){
                 if(alfabeto[j]==multzopostu[0]){
                   multzo = j;
                   break;
                 }
               }
               postu = multzopostu[1] -1;
              } 

              var izena2 = mailak[0].multzoak[multzo].taldeak[postu].taldeizena;
              var idtalde2 = mailak[0].multzoak[multzo].taldeak[postu].idtaldeak;
              console.log("Izenafinala:"+rowsf[i].izenafinala2+ " "+multzo+" "+postu+" "+izena2)

              var data ={
                      izenareset1   : rowsf[i].izenafinala1,
                      izenareset2   : rowsf[i].izenafinala2,
                      izenafinala1   : izena1,
                      izenafinala2   : izena2,
                      idtalde1 : idtalde1,
                      idtalde2 : idtalde2,
                      idfinala1   : idfinala1,
                      idfinala2   : idfinala2
                };
//postgres             var query = connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,rowsf[i].idpartidu], function(err, rowsg)
                var query = req.connection.query("UPDATE partiduak set izenareset1=$1, izenareset2=$2, izenafinala1=$3, izenafinala2=$4, idtalde1=$5, idtalde2=$6, idfinala1=$7, idfinala2=$8 WHERE idpartidu = $9 ",[rowsf[i].izenafinala1, rowsf[i].izenafinala2, izena1, izena2, idtalde1, idtalde2, idfinala1, idfinala2, rowsf[i].idpartidu], function(err, wrows)
                      {
                       if (err)
                         console.log("Error updating : %s ",err );
                      });                
             }
             else{

               var data ={
                      idfinala1   : idfinala1,
                      idfinala2   : idfinala2
                };

//postgres             var query = connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,rowsf[i].idpartidu], function(err, rowsg)
                var query = req.connection.query("UPDATE partiduak set idfinala1=$1, idfinala2=$2 WHERE idpartidu = $3 ",[idfinala1, idfinala2, rowsf[i].idpartidu], function(err, wrows)
                      {
                       if (err)
                         console.log("Error updating : %s ",err );
                      });
             }             
            }
          res.redirect(303, '/admin/kalkuluak');
       });

        }); 
      });

};

exports.finalakatzera = function (req,res){ 

var input = JSON.parse(JSON.stringify(req.body));
var id = req.session.idtxapelketa;
var kategoria = input.kategoriafa;

//postgres  req.getConnection(function(err,connection){
//postgres         connection.query('SELECT * FROM grupoak,partiduak where multzo > 900 and idgrupop=idgrupo and idtxapelketam = ? and kategoriam = ? order by jardunaldia DESC,pareguna,parordua,zelaia',[id,kategoria],function(err,rowsf)     {
         req.connection.query('SELECT * FROM grupoak,partiduak where multzo > \'900\' and idgrupop=idgrupo and idtxapelketam = $1 and kategoriam = $2 order by jardunaldia DESC,pareguna,parordua,zelaia',[id,kategoria],function(err,wrows)     {
            if(err)
              console.log("Error Selecting : %s ",err );
            rowsf = wrows.rows;     //postgres
            for (var i in rowsf) {
             if(rowsf[i].izenareset1 != null){
              var data ={
                      izenafinala1   : rowsf[i].izenareset1,
                      izenafinala2   : rowsf[i].izenareset2,
                      izenareset1   : null,
                      izenareset2   : null,
                      idtalde1 : null,
                      idtalde2 : null,
                      idfinala1   : null,
                      idfinala2   : null
                };          
//postgres               var query = connection.query("UPDATE partiduak set ? WHERE idpartidu = ? ",[data,rowsf[i].idpartidu], function(err, rowsg)
                var query = req.connection.query("UPDATE partiduak set izenareset1=$1, izenareset2=$2, izenafinala1=$3, izenafinala2=$4, idtalde1=$5, idtalde2=$6, idfinala1=$7, idfinala2=$8 WHERE idpartidu = $9 ",[null, null, rowsf[i].izenareset1, rowsf[i].izenareset2, null, null, null, null, rowsf[i].idpartidu], function(err, rowsg)
                {
                    if (err)
                        console.log("Error updating : %s ",err );
                });
             }
            }

          res.redirect(303, '/admin/kalkuluak');
       });

 };

