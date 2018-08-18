/////
//Puerto
/////
process.env.PORT = process.env.PORT || 3000;

/////
//Entorno
/////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/////
//Base de datos
/////
let urldb;
if (process.env.NODE_ENV == 'dev') {
    urldb = 'mongodb://localhost:27017/cafe'
} else {
    urldb = 'mongodb://cafe-user:123456a@ds123532.mlab.com:23532/cafe'
}
urldb = 'mongodb://cafe-user:123456a@ds123532.mlab.com:23532/cafe'
process.env.ENV_DB = urldb;