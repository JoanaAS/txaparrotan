module.exports = {
cookieSecret: 'your cookie secret goes here',
gmail: {
user: 'txaparrotanapp2018@gmail.com',
password: 'Antolakuntxa2018',
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
        database:'heroku_4efa3ee4ff6c16c'
},
dbproduction: {
        host: 'us-cdbr-iron-east-02.cleardb.net',
        user: 'b52372483fde60',
        password : '4fd964e83256734',      // '4d96016a'
      //  port : 3306, //port mysql
        database:'heroku_4efa3ee4ff6c16c'
}
};
