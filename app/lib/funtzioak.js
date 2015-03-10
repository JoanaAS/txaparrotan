
module.exports = function(){
var benjaminN = []; 
  var benjaminM = [];
  var alebinN = [];
  var alebinM = [];
  var infantilN = [];
  var infantilM = [];
  var helduakN = [];
  var helduakM = [];

  req.getConnection(function(err,connection){
      
     connection.query('SELECT * FROM taldeak where balidatuta = 1 and idtxapeltalde = ? ',[req.session.idtxapelketa],function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );

        var ibn = 0;
        var ibm = 0;
        var ian = 0;
        var iam = 0;
        var iin = 0;
        var iim = 0;
        var ihn = 0;
        var ihm = 0;

        for (var i in rows) {
            if(rows[i].kategoria == 'Benjaminak' && rows[i].sexua == 'Neska'){
              //console.log("benjamin neskak" +rows[i]);
              //benjaminN += rows[i];
              benjaminN[ibn] = rows[i]; 
              ibn ++;             
            }
            if(rows[i].kategoria == 'Benjaminak' && rows[i].sexua == 'Mutila'){
              //console.log("benjamin mutilak" +rows[i]);
              //benjaminN += rows[i];
              benjaminM[ibm] = rows[i]; 
              ibm ++;             
            }
            if(rows[i].kategoria == 'Alebinak' && rows[i].sexua == 'Neska'){
              //console.log("benjamin mutilak" +rows[i]);
              //benjaminN += rows[i];
              alebinN[ian] = rows[i]; 
              ian ++;             
            }
            if(rows[i].kategoria == 'Alebinak' && rows[i].sexua == 'Mutila'){
              //console.log("benjamin mutilak" +rows[i]);
              //benjaminN += rows[i];
              alebinM[iam] = rows[i]; 
              iam ++;             
            }
            if(rows[i].kategoria == 'Infantilak' && rows[i].sexua == 'Neska'){
              //console.log("benjamin mutilak" +rows[i]);
              //benjaminN += rows[i];
              infantilN[iin] = rows[i]; 
              iin ++;             
            }
            if(rows[i].kategoria == 'Infantilak' && rows[i].sexua == 'Mutila'){
              //console.log("benjamin mutilak" +rows[i]);
              //benjaminN += rows[i];
              infantilM[iim] = rows[i]; 
              iim ++;             
            }
            if(rows[i].kategoria == 'Helduak' && rows[i].sexua == 'Neska'){
             // console.log("benjamin mutilak" +rows[i]);
              //benjaminN += rows[i];
              helduakN[ihn] = rows[i]; 
              ihn ++;             
            }
            if(rows[i].kategoria == 'Helduak' && rows[i].sexua == 'Mutila'){
              //console.log("benjamin mutilak" +rows[i]);
              //benjaminN += rows[i];
              helduakM[ihm] = rows[i]; 
              ihm ++;             
            }
         }    
    });
}