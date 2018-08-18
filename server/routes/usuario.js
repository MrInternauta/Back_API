const express = require('express')
const bcrypt = require('bcrypt')
    //Iniciar  el servidor
const Usuario = require('../models/usuario')
const app = express()

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0
    let limite = req.query.limite || 5
    limite = Number(limite)
    desde = Number(desde)
    Usuario.find({ estado: true }, 'name email role img google')
        .skip(desde)
        .limit(limite)


    .exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        Usuario.count({ estado: true }, (err, conteo) => {
            res.json({
                ok: true,
                tamaño: conteo,
                usuarios
            })
        })


    })
})

app.post('/usuario', function(req, res) {
    let body = req.body;
    //crear usuario modelo
    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id
    let body = req.body;
    //actualizarlo
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id
    let cambio = {
            estado: false
        }
        //actualizarlo
    Usuario.findByIdAndUpdate(id, cambio, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
module.exports = app;