const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const verificar_token_img = require('../middlewares/autenticacion').verificacion_token_img

app.get('/imagen/:tipo/:img', (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    //res.sendFile(pathImagen);
    if (fs.existsSync(pathImagen)) {
        // res.sendFile(pathImagen);
    } else {
        let noimagepath = path.resolve(__dirname, '../assets/no-image.jpg');
        pathImagen = noimagepath;
        // res.sendFile(noimagepath)
    }

    res.sendFile(pathImagen)

})
module.exports = app;