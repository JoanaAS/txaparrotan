/*
 * GET customers listing.
 */

exports.ikusi = function(req, res){
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM jokalariak',function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
            res.render('jokalariak.handlebars', {title : 'Txaparrotan-Jokalariak', data:rows, taldeizena: req.session.taldeizena} );
                           
         });
       
    });
  
};

exports.bilatu = function(req, res){
  req.getConnection(function(err,connection){
     
     var id= '16';  
     connection.query('SELECT * FROM jokalariak,taldeak where idtaldej= ? and idtaldej=idtaldeak',[id],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
        console.log(rows);
        res.render('datuak.handlebars', {title : 'Txaparrotan-Datuak', data:rows, taldeak:rows[0], taldeizena: req.session.taldeizena} );
                           
      });
       
    });
  
};

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers-Node.js"});
};
exports.editatu = function(req, res){
  var neurriak = [{neurria:"11-13"}, {neurria:"12-14"}, {neurria:"S"}, {neurria:"M"}, {neurria:"L"}, {neurria:"XL"}, {neurria:"XXL"}]
  //var id = req.params.id;
  var id = req.session.idtalde;
  var idjokalari = req.params.idjokalari;
    
  req.getConnection(function(err,connection){
       
     connection.query('SELECT * FROM jokalariak WHERE idtaldej = ? and idjokalari = ?',[id,idjokalari],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            for(var i in neurriak ){
               if(rows[0].kamisetaneurria == neurriak[i].neurria){
                  neurriak[i].aukeratua = true;
               }
               else
                  neurriak[i].aukeratua = false;
            }

            rows[0].neurriak = neurriak;
     
            res.render('jokalariakeditatu.handlebars', {page_title:"Jokalaria aldatu",data:rows, taldeizena: req.session.taldeizena});
                           
         });
                 
    }); 
};
/*Save the customer*/

exports.sortu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    console.log("idtalde:" + req.session.idtalde);
    var id = req.session.idtalde;

    req.getConnection(function (err, connection) {
        
        var data = {
            
            jokalariizena : input.jokalariizena,
            emailaj   : input.emaila,
            telefonoaj   : input.telefonoa,
            kamisetaneurria   : input.kamisetaneurria,
            idtaldej    : id
        };
        
        console.log(data);
        var query = connection.query("INSERT INTO jokalariak set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
             res.redirect('/jokalariak');
          
        });
        
        
       // console.log(query.sql); 
    
    });
};/*Save edited customer*/
exports.aldatu = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    //var id = req.params.id;
    var id = req.session.idtalde;
    var idjokalari = req.params.idjokalari;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            jokalariizena : input.jokalariizena,
            emailaj   : input.emaila,
            telefonoaj   : input.telefonoa,
            kamisetaneurria   : input.kamisetaneurria,
        
        };
        
        connection.query("UPDATE jokalariak set ? WHERE idtaldej = ? and idjokalari = ? ",[data,id,idjokalari], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/jokalariak');
          
        });
    
    });
};

exports.ezabatu = function(req,res){
          
     //var id = req.params.id;
     var id = req.session.idtalde;
     var idjokalari = req.params.idjokalari;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM jokalariak  WHERE idtaldej = ? and idjokalari = ?",[id,idjokalari], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/jokalariak');
             
        });
        
     });
};