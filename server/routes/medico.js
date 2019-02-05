const express = require('express');
const _ = require('underscore');
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const Medico = require('../models/medico');
const app = express();

// ------------------ USUARIO ------------------------
//...::: OBTENER USUARIOS PAGINADOS DEL 1 AL 5 :::...
app.get('/medico', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Medico.find()
        .skip(desde)
        .limit(limite)
        .populate('User', 'nombre email')
        .populate('Hospital', 'nombre')
        .exec((err, MedicoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Medico.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    Medicos: MedicoDB,
                    cuantos: conteo
                });
            });
        });
});

//...::: OBTENER USUARIO POR ID :::...
app.get('/medico/:id', (req, res) => {
    let id = req.params.id
    Medico.findById(id)
        .exec(((err, MedicoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!MedicoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "Medico no encontrado"
                    }
                });
            }
            res.json({
                ok: true,
                Medico: MedicoDB
            })
        }))
})

//...::: CREAR USUARIO :::...
app.post('/medico', [verificar_token.verificacion_token], function(req, res) {
    let body = req.body;


    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital // role: body.role
    });
    medico.save((err, MedicoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            Medico: MedicoDB
        });
    });
});

//...::: CAMBIAR USUARIO POR ID (del usuario):::...
app.put('/medico/:id', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    let body = req.body
    let actual = {
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    }
    Medico.findByIdAndUpdate(id, actual, {
        new: true,
        runValidators: true
    }, (err, MedicoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            Medico: MedicoDB
        });
    })
});

//...::: CAMBIAR USUARIO POR ID (del usuario):::...
app.delete('/medico/:id', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    Medico.findByIdAndRemove(id, (err, MedicoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            Medico: MedicoDB
        });
    })

});




module.exports = app;