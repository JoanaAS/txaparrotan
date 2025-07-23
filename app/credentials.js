module.exports = {
cookieSecret: 'your cookie secret goes here',
gmail: {
user: 'txaparrotanapp2022@gmail.com',
// password: 'Antolakuntxa2022',
password: 'auoqodqzgdpyklsg',
},
/*
twittereskubaloiaZKE: {
	consumer_key: 'HGlJgf90C64u3Z9TXOlKOAoxe',
    consumer_secret: 'YTkLulDJ1qjl4mZjFvJIsO3eunkx7ZU87MYm8fsFebJHZMEvGZ',
    access_token: '203467804-k5rOlskADqUaNljL3gIR6mFE8GEcOrWc4PbF6ICQ',
    access_token_secret: 'kXilp8jL7ztMhEsmt4yTKeaO0xQYKE9R7Afd0wZSMeM69',
//screen_name: '',
    timeout_ms: 60*1000
},
*/
twitter: {
    consumer_key: 'Hv2eLR9DEbHscwkp8oMMYurhD',
    consumer_secret: 'zsrHGRA1ZYSLs9fz35RdiKd5tjK7M2EWE1km1TafdpcsgW8AUG',
    access_token: '1401990134-NjqxZguG7GpivMJHlEkO41LO0wXoNDouuYlpN0K',
    access_token_secret: 'EXralFrFdyT8Vr4uPluxi6alrpJCZyDn2ZQE5RoYkGkNI',
//screen_name: '',
    timeout_ms: 60*1000
},
dbdevelop: {
        host: 'localhost',
        user: 'root',
        password : 'joanaagi',
        port : 3306, //port mysql
        //database:'txaparrotan'
        database: 'heroku_aebe9d14ec5f8d2'  // 'heroku_4efa3ee4ff6c16c'
},
pgdevelop: {
        host: 'localhost',
        user: 'postgres',
        password : 'pxab570416p',                    //root
        port : 5432, //portpostgres                   // 
        database: 'txaparrotan',      // 'probatzen'  'txaparrotan'  'heroku_'
//        max: 10, // Limita a 10 conexiones simultáneas
        idleTimeoutMillis: 30000 // Cierra conexiones inactivas después de 30 segundos

},
dbproduction: {
//        host: 'us-cluster-east-01.k8s.cleardb.net',            'us-cdbr-iron-east-02.cleardb.net',
//        user: 'b2e41a658b178d',                                'b52372483fde60',
//        password : 'a2e8ce90070606f',                           '4fd964e83256734',      // '4d96016a'
      //  port : 3306, //port mysql
//        database: 'heroku_aebe9d14ec5f8d2'                     'heroku_4efa3ee4ff6c16c'
        host: 'caij57unh724n3.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
        user: 'uej7j9knbq4ovl',
        password : 'p545fb6535bd9cc5b6ddc2431068236ee0c5d8657c1252748cc71ac9c0a0d1c23',                   //'ff86419e'
        port : 5432,                //port postgres
        database:'d2u8dq0h0par9c'
//        ssl: true
}
};
