const express = require('express');

// const bcrypt = require('bcrypt');
const _ = require('underscore');

const Sala = require('../models/sala');
const verificar_token = require('../middlewares/autenticacion');
const app = express();
// ------------------ ELEMENTOS ------------------------
app.get('/sala/listar/:id', [verificar_token.verificacion_token], function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let Elemento = Sala;

    let peticion;
    peticion = Elemento.find({ user_id: req.params.id })
    peticion.exec((err, element) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Elemento.count({ estado: true }, (_err) => {
            res.json({
                ok: true,
                element
            });
        });
    })
});

//...::: CREAR ELEMENTOS :::...
app.post('/sala/crear/', [verificar_token.verificacion_token], function(req, res) {
    let body = req.body;
    let elemnto;
    elemnto = new Sala({
        nombre: body.nombre,
        user_id: body.user_id,
    });
    elemnto.save(((_error, elemnt) => {
        if (_error) {
            return res.status(400).json({
                ok: false,
                _error
            });
        }
        res.json({
            ok: true,
            elemnt
        });
    }));
});

//...::: CAMBIAR ELEMENTOS POR ID (del ELEMTO):::...
app.put('/sala/actualizar/:id', [verificar_token.verificacion_token], function(req, res) {

    let body = req.body
    let id = req.params.id;
    let Elemento = Sala;
    let actual = {
        nombre: body.nombre,
    }

    Elemento.findByIdAndUpdate(id, actual, {
        new: true,
        runValidators: true
    }, (err, element) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            element
        });
    })
});



//...::: BORRAR  EEMNTO POR ID (del ELEMENTO):::...
app.delete('/sala/borrar/:id', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    let Elemento = Sala;
    Elemento.findByIdAndRemove(
        id, (err, element) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!element) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: req.params.tipo + ' no encontrad@'
                    }
                });
            }

            res.json({
                ok: true,
                element
            })

        });
});




module.exports = app;