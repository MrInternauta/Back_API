const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/voto');
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const app = express();
// ------------------ USUARIO ------------------------
//...::: OBTENER USUARIOS PAGINADOS DEL 1 AL 5 :::...
app.get('/voto/listar', [verificar_token.verificacion_token], function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find()
        // .skip(desde)
        // .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    votos: usuarios,
                    cuantos: conteo
                });
            });
        });
});

app.get('/voto/listar/:id', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    Usuario.find({ votador: id })
        // .skip(desde)
        // .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    votos: usuarios,
                    cuantos: conteo
                });
            });
        });
});



//...::: CREAR USUARIO :::...
app.post('/voto/crear', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        participante: body.participante,
        categoria: body.categoria,
        votador: body.votador
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            voto: usuarioDB
        });
    });
});



module.exports = app;