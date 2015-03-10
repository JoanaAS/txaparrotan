var credentials = require('./credentials.js');
var emailService = require('./lib/email.js')(credentials);
emailService.send('joana.agirrezabal@gmail.com', 'Hood River tours on sale today!',
'Get \'em while they\'re hot!');