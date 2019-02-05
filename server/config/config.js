// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 5000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ============================
//  Vencimiento del token
// ============================
//segundo * mitutos * horas * dias
process.env.CADUCIDAD_TOKEN = '48h'

// ============================
//  SEED de autenticacion
// ============================
process.env.SEED = process.env.SEED || 'secret-token-DES'



// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/pedirtaxi';

} else {

    urlDB = process.env.MONGOURL
}

process.env.URLDB = urlDB

// ============================
//  Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '803830275778-cb74qlcoid5okpqojo1q73punb26khp2.apps.googleusercontent.com'