/*
 * GET customers listing.
 */

exports.ikusi = function(req, res){
//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM jokalariak',function(err,rows)     {
     req.connection.query('SELECT * FROM jokalariak',function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres        
        res.render('jokalariak.handlebars', {title : 'Txaparrotan-Jokalariak', data:rows, taldeizena: req.session.taldeizena} );
                           
     });

};

exports.bilatu = function(req, res){
//postgres  req.getConnection(function(err,connection){
     
     var id= '16';  
//postgres     connection.query('SELECT * FROM jokalariak,taldeak where idtaldej= ? and idtaldej=idtaldeak',[id],function(err,rows)     {
     req.connection.query('SELECT * FROM jokalariak,taldeak where idtaldej= $1 and idtaldej=idtaldeak',[id],function(err,wrows)     {
        if(err)
           console.log("Error Selecting : %s ",err );
        rows = wrows.rows;     //postgres
        //console.log(rows);
        res.render('datuak.handlebars', {title : 'Txaparrotan-Datuak', data:rows, taldeak:rows[0], taldeizena: req.session.taldeizena} );
     });

};

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers-Node.js"});
};
exports.editatu = function(req, res){
  var neurriak = [{neurria:"9-10"}, {neurria:"11-12"}, {neurria:"S"}, {neurria:"M"}, {neurria:"L"}, {neurria:"XL"}, {neurria:"XXL"}];
  //var id = req.params.id;
  var admin = (req.path.slice(0,24) == "/admin/jokalariakeditatu");

  if (admin)
    req.session.idtalde = req.params.idtaldeak;
  var id = req.session.idtalde;
  var idjokalari = req.params.idjokalari;

//postgres  req.getConnection(function(err,connection){
//postgres     connection.query('SELECT * FROM jokalariak WHERE idtaldej = ? and idjokalari = ?',[id,idjokalari],function(err,rows)
     req.connection.query('SELECT * FROM jokalariak WHERE idtaldej = $1 and idjokalari = $2',[id,idjokalari],function(err,wrows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            rows = wrows.rows;     //postgres
            for(var i in neurriak ){
               if(rows[0].kamisetaneurria == neurriak[i].neurria){
                  neurriak[i].aukeratua = true;
               }
               else
                  neurriak[i].aukeratua = false;
            }
            rows[0].neurriak = neurriak;

            rows[0].admin = admin;
            res.render('jokalariakeditatu.handlebars', {page_title:"Jokalaria aldatu",data:rows, taldeizena: req.session.taldeizena, menuadmin: admin});
                           
       });
 
};
/*Save the customer*/

exports.sortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    console.log("idtalde:" + req.session.idtalde);
    var id = req.session.idtalde;
    var admin = (req.path.slice(0,21) == "/admin/jokalariasortu");
                                       
    if (input.telefonoa == ''){
      input.telefonoa = 0;
    }

//postgres    req.getConnection(function (err, connection) {
        
        var data = {
            
            jokalariizena : input.jokalariizena,
            emailaj   : input.emaila,
            telefonoaj   : input.telefonoa,
            kamisetaneurria   : input.kamisetaneurria,
            idtaldej    : id
        };
       // console.log(data);
//postgres        var query = connection.query("INSERT INTO jokalariak set ? ",data, function(err, rows)
        var query = req.connection.query('INSERT INTO jokalariak ("jokalariizena","emailaj","telefonoaj","kamisetaneurria","idtaldej") VALUES ($1,$2,$3,$4,$5)',[input.jokalariizena,input.emaila,input.telefonoa,input.kamisetaneurria,id], function(err, rows)
        {
          if (err)
              console.log("Error inserting : %s ",err );
          if (admin)
             res.redirect('/admin/taldeakikusi'); 
          else    
             res.redirect('/jokalariak');
        });
       // console.log(query.sql); 

};/*Save edited customer*/
exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idtalde;
    var idjokalari = req.params.idjokalari;
    var admin = (req.path.slice(0,23) == "/admin/jokalariakaldatu");
//    if (admin)
//      id = req.params.idtaldeak;
//    console.log("idtalde:" + id + "Admin : " + admin + "idjokalari:" + idjokalari);                                        
//postgres    req.getConnection(function (err, connection) {

        var data = {
            jokalariizena : input.jokalariizena,
            emailaj   : input.emaila,
            telefonoaj   : input.telefonoa,
            kamisetaneurria   : input.kamisetaneurria
        };
//postgres        connection.query("UPDATE jokalariak set ? WHERE idtaldej = ? and idjokalari = ? ",[data,id,idjokalari], function(err, rows)
        req.connection.query("UPDATE jokalariak set jokalariizena=$1,emailaj=$2,telefonoaj=$3,kamisetaneurria=$4 WHERE idtaldej = $5 and idjokalari = $6 ",[input.jokalariizena, input.emaila, input.telefonoa, input.kamisetaneurria,id,idjokalari], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );
         
          if (admin)
             res.redirect('/admin/taldeakikusi'); 
          else    
             res.redirect('/jokalariak');
       
        });

};

exports.ezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtalde;
     var idjokalari = req.params.idjokalari;

     var admin = (req.path.slice(0,24) == "/admin/jokalariakezabatu");
     if (admin)
        id = req.params.idtaldeak;                                    
//postgres     req.getConnection(function (err, connection) {
//postgres        connection.query("DELETE FROM jokalariak  WHERE idtaldej = ? and idjokalari = ?",[id,idjokalari], function(err, rows)
        req.connection.query("DELETE FROM jokalariak  WHERE idtaldej = $1 and idjokalari = $2",[id,idjokalari], function(err, rows)
        {
            
          if(err)
                 console.log("Error deleting : %s ",err );
          if (admin)
             res.redirect('/admin/taldeakikusi'); 
          else    
             res.redirect('/jokalariak');
             
        });
        
};