module.exports = {
cookieSecret: 'your cookie secret goes here',
gmail: {
user: 'txaparrotanapp2018@gmail.com',
password: 'antolakuntxa2018',
},
//twittereskubaloiaZKE: {
twitter: {
    consumer_key: 'HGlJgf90C64u3Z9TXOlKOAoxe',
    consumer_secret: 'YTkLulDJ1qjl4mZjFvJIsO3eunkx7ZU87MYm8fsFebJHZMEvGZ',
    access_token: '203467804-k5rOlskADqUaNljL3gIR6mFE8GEcOrWc4PbF6ICQ',
    access_token_secret: 'kXilp8jL7ztMhEsmt4yTKeaO0xQYKE9R7Afd0wZSMeM69',
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
        password : '4d96016a',
      //  port : 3306, //port mysql
        database:'heroku_4efa3ee4ff6c16c'
}
};