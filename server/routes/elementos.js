const express = require('express');

// const bcrypt = require('bcrypt');
const _ = require('underscore');

const Luz = require('../models/luz');
const Sensor = require('../models/sensor');
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const app = express();
// ------------------ ELEMENTOS ------------------------
//...::: OBTENER USUARIOS PAGINADOS DEL 1 AL 5 :::...


app.get('/elementos/listar/:tipo/:id', [verificar_token.verificacion_token], function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let Elemento;

    req.params.tipo === 'luz' ? Elemento = Luz : Elemento = Sensor;
    let peticion;
    req.params.id !== undefined ? peticion = Elemento.find({ user_id: req.params.id }) : peticion = Elemento.find()
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


app.get('/elementos/listar/sala/:tipo/:id', [verificar_token.verificacion_token], function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let Elemento;

    req.params.tipo === 'luz' ? Elemento = Luz : Elemento = Sensor;
    let peticion;
    req.params.id !== undefined ? peticion = Elemento.find({ sala_id: req.params.id }) : peticion = Elemento.find()
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
app.post('/elemento/crear/:elemento', [verificar_token.verificacion_token], function(req, res) {
    let elementoTipo = req.params.elemento;
    let body = req.body;
    let elemnto;
    if (elementoTipo === 'luz') {
        elemnto = new Luz({
            nombre: body.nombre,
            user_id: body.user_id,
            sala_id: body.sala_id,
            estado: body.estado,
        });
    }
    if (elementoTipo === 'sensor') {
        elemnto = new Sensor({
            nombre: body.nombre,
            user_id: body.user_id,
            sala_id: body.sala_id,
            metrica: body.metrica
        });
    }
    let Elemento;
    req.params.tipo === 'luz' ? Elemento = Luz : Elemento = Sensor;
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
app.put('/elemento/actualizar/:id/:tipo', [verificar_token.verificacion_token], function(req, res) {

    let body = req.body
    let id = req.params.id;
    let Elemento;
    req.params.tipo === 'luz' ? Elemento = Luz : Elemento = Sensor;

    let actual = {
        nombre: body.nombre,
        user_id: body.user_id,
        sala_id: body.sala_id,
        estado: body.estado,
        metrica: body.metrica
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
app.delete('/elemento/borrar/:id/:tipo', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    let Elemento;
    req.params.tipo === 'luz' ? Elemento = Luz : Elemento = Sensor;

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