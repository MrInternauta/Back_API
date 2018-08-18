require('./config/config')
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
    //Iniciar  el servidor
const app = express()
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//importar las rutas de los usuarios y usarlos
app.use(require('./routes/usuario'))
    //Conexion a mongodb
mongoose.connect(process.env.ENV_DB, (err, res) => {
    if (err) {
        console.log('Error en la conexion a la db')
        throw new Error;
    } else {
        console.log('Conexion a db realizada')
    }
});

//eschando el servidor
app.listen(process.env.PORT, () => {
    console.log('Escuchado en port ' + process.env.PORT)
})