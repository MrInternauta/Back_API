const express = require('express');

// const bcrypt = require('bcrypt');
const _ = require('underscore');

const Luz = require('../models/luz');
const Sensor = require('../models/sensor');
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const app = express();
let entras_totales = [19, 21, 23, 24, 26];
let salidas_totales = [7, 11, 12, 13, 15, 16, 18, 22, 29, 31, 32, 33, 35, 36, 37, 38, 40];
// ------------------ ELEMENTOS ------------------------
//...::: OBTENER USUARIOS PAGINADOS DEL 1 AL 5 :::...

// {
//     "nombre": "Rasberry",
//      "entradas": [
//             {"p1": 19},
//             {"p2": 21},
//             {"p3": 23},
//             {"p4": 24},
//             {"p5": 26} ],
//       "salidas": [
//             {"p1": 7},
//             {"p2": 11},
//             {"p3": 12},
//             {"p4": 13},
//             {"p5": 15}
//             {"p6": 16},
//             {"p7": 18},
//             {"p8": 22},
//             {"p9": 29},
//             {"p10": 31},
//             {"p11": 32},
//             {"p12": 33},
//             {"p13": 35},
//             {"p14": 36},
//             {"p15": 37},
//             {"p16": 38},
//             {"p17": 40}
//         ]  
// }

let pines_disponibles = (id_user, tipo)=>{
    return new Promise((resolve, reject)=>{
        if(tipo == 'entradas'){
            Sensor.find({ user_id: id_user }, (err, element) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                element.forEach((value)=>{
                    entras_totales = entras_totales.filter((pin) => pin != value.pin)
                });
                resolve(entras_totales == [] || entras_totales[0] == undefined || entras_totales[0] == null ? 0 : entras_totales[0])
                // console.log(entras_totales);
                // return !entras_totales[0] ? 0 : entras_totales[0];
            });
        }
        if (tipo == 'salidas') {
            Luz.find({ user_id: id_user }, (err, element) => {
                if (err) {
                    reject(err)
                }
                element.forEach((value)=>{
                    salidas_totales = salidas_totales.filter((pin)=> pin != value.pin);
                });
                resolve(salidas_totales == [] || salidas_totales[0] == undefined || salidas_totales[0] == null ? 0 : salidas_totales[0])
                // console.log(salidas_totales);
                // return !salidas_totales[0] ? 0 : salidas_totales[0]; 
            });
        }
    })
}
        
        
    
       
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
    pines_disponibles(body.user_id,elementoTipo == 'luz' ? 'salidas' : 'entradas').then((val) =>{
        if (elementoTipo === 'luz') {
            elemnto = new Luz({
                nombre: body.nombre,
                user_id: body.user_id,
                sala_id: body.sala_id,
                estado: body.estado,
                pin: val
            });
        }
        if (elementoTipo === 'sensor') {
            elemnto = new Sensor({
                nombre: body.nombre,
                user_id: body.user_id,
                sala_id: body.sala_id,
                metrica: body.metrica,
                pin: val
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
    })

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