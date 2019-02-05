const express = require('express');
const _ = require('underscore');
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin

const Hospital = require('../models/hospital');
const Usuario = require('../models/user');
const Medico = require('../models/medico');
const app = express();


app.get('/busqueda/todo/:busqueda', function(req, res) {
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i')
    Promise.all([
            BuscarHospitales(busqueda, regex),
            BuscarUsuarios(busqueda, regex),
            BuscarMedicos(busqueda, regex)
        ])
        .then((data) => {
            res.json({
                ok: true,
                Hospitales: data[0],
                Medicoa: data[2],
                Usuarios: data[1]
            });
        }).catch((err) => {
            res.status(400).json({
                ok: false,
                err
            });
        })

});

app.get('/busqueda/coleccion/:coleccion/:busqueda', function(req, res) {
    const busqueda = req.params.busqueda;
    const coleccion = req.params.coleccion;
    if (!busqueda || !coleccion) {
        return res.status(400).json({
            ok: false,
            message: 'Busqueda incorrecta'
        });
    }
    const regex = new RegExp(busqueda, 'i')
    let promesa;
    if (coleccion === 'Medicos') {
        promesa = BuscarMedicos(busqueda, regex)
    }
    if (coleccion === 'Hospitales') {
        promesa = BuscarHospitales(busqueda, regex)

    }
    if (coleccion === 'Usuarios') {
        promesa = BuscarUsuarios(busqueda, regex)

    }
    if (!promesa) {
        return res.status(400).json({
            ok: false,
            message: 'Busqueda incorrecta'
        });
    }
    promesa
        .then((data) => {
            res.json({
                ok: true,
                [coleccion]: data
            });
        }).catch((err) => {
            res.status(400).json({
                ok: false,
                err
            });
        })

});



function BuscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'name lastname email')
            .or([{ name: regex }, { lastname: regex }, { email: regex }])
            .exec((err, UsuarioDB) => {
                if (err) {
                    reject('Error al cargar usuarios')
                } else {
                    resolve(UsuarioDB)
                }

            })

    });

}

function BuscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .exec((err, HospitalDB) => {
                if (err) {
                    reject('Error al cargar hospitales')
                } else {
                    resolve(HospitalDB)
                }

            })
    });

}

function BuscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('hospital')

        .exec((err, MedicoDB) => {
            if (err) {
                reject('Error al cargar medicos')
            } else {
                resolve(MedicoDB)
            }

        })
    });

}


module.exports = app;