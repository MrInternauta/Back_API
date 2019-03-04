const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/categoria');
const Voto = require('../models/voto');
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const app = express();
// ------------------ USUARIO ------------------------
//...::: OBTENER USUARIOS PAGINADOS DEL 1 AL 5 :::...
app.get('/categoria/listar', [verificar_token.verificacion_token], function(req, res) {
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
                    categorias: usuarios,
                    cuantos: conteo
                });
            });
        });
});

app.get('/categoria/listar/:id', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    let cat = [];
    Voto.find({ votador: id })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            usuarios.forEach(element => {
                cat.push(element.categoria);
            });
            Usuario.find({ _id: { $nin: cat } })
                .exec((err, categorias) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        categorias
                    });
                });
        });
});




//...::: CREAR USUARIO :::...
app.post('/categoria/crear', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        cuerpo: body.description,
        role: body.role

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
            categoria: usuarioDB
        });
    });
});





//...::: BORRAR  USUARIO POR ID (del usuario):::...
app.delete('/categoria/borrar/:id', [verificar_token.verificacion_token, verificaradmin], function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndRemove(
        id, (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado,
            })

        });
});




module.exports = app;