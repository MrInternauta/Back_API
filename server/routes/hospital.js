const express = require('express');
const _ = require('underscore');
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const Hospital = require('../models/hospital');
const Usuario = require('../models/user');

const app = express();

// ------------------ USUARIO ------------------------
//...::: OBTENER USUARIOS PAGINADOS DEL 1 AL 5 :::...
app.get('/hospital', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Hospital.find()
        .skip(desde)
        .limit(limite)
        .populate('Usuario')
        .exec((err, HospitalDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Hospital.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    Hospitales: HospitalDB,
                    cuantos: conteo
                });
            });
        });
});

//...::: OBTENER USUARIO POR ID :::...
app.get('/hospital/:id', (req, res) => {
    let id = req.params.id
    Hospital.findById(id)
        .populate('User', 'nombre email')
        .exec(

            ((err, HospitalDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!HospitalDB) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: "Hospital no encontrado"
                        }
                    });
                }
                res.json({
                    ok: true,
                    Hospital: HospitalDB
                })
            }))
})

//...::: CREAR USUARIO :::...
app.post('/hospital', [verificar_token.verificacion_token], function(req, res) {
    let body = req.body;


    let hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
            // role: body.role
    });
    hospital.save((err, HospitalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            Hospital: HospitalDB
        });
    });
});

//...::: CAMBIAR USUARIO POR ID (del usuario):::...
app.put('/hospital/:id', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    let body = req.body
    let actual = {
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    }
    Hospital.findByIdAndUpdate(id, actual, {
        new: true,
        runValidators: true
    }, (err, HospitalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            Hospital: HospitalDB
        });
    })
});

//...::: CAMBIAR USUARIO POR ID (del usuario):::...
app.delete('/hospital/:id', [verificar_token.verificacion_token], function(req, res) {
    let id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, HospitalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            Hospital: HospitalDB
        });
    })

});




module.exports = app;