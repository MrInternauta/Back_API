const express = require('express')
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin

let app = express()
let Viaje = require('../models/viaje')
let ViajeUbicacion = require('../models/viajeOD')
let Usuario = require('../models/user')
    //...::: LISTAR VIAJES :::...
app.get('/viajes/listar', verificar_token.verificacion_token, (req, res) => {
    Viaje.find()
        .exec((err, viajes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!viajes) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe viaje'
                    }
                })
            }

            Viaje.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    viajes,
                    cuantos: conteo
                })
            })

        })

})

//...::: CREAR VIAJES :::...
app.post('/viajes/crear', [verificar_token.verificacion_token], (req, res) => {
    let body = req.body
    let viaje = new Viaje({
        pasajero: body.pasajero,
        conductor: body.conductor,
        fechainicio: body.fechainicio,
        ubicacion: {
            lat_o: body.lat_o,
            lng_o: body.lng_o,
            lat_d: body.lat_d,
            lng_d: body.lng_d,
        }
    })
    if (!viaje.conductor) {
        //Asignar conductor, viaje.conductor = 

    }
    //Asignar precio viaje.precio =
    //cambiar estado del viaje peticion - asignado viaje.estado = 'asignado'
    viaje.save((err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Viaje no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        });

    })

})

//...::: MOSTRAR VIAJE :::...
app.get('/viajes/mostrar/conductor/:id', (req, res) => {
    let id = req.params.id


    Viaje.findOne({
        conductor: id
    }, ((err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No se encontro el viaje"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        })
    }))
})

//...::: MOSTRAR VIAJE :::...
app.get('/viajes/mostrar/pasajero/:id', (req, res) => {
    let id = req.params.id


    Viaje.findOne({
        pasajero: id
    }, ((err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No se encontro el viaje"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        })
    }))
})






//...::: ACTUALIZAR VIAJE :::...
app.put('/viajes/actualizar/pasajero/:id', [verificar_token.verificacion_token], (req, res) => {


    let viaje_id = req.params.id
    let body = req.body
    let nuevo = {
        conductor: body.conductor,
        estado: body.estado,
        ubicacion: {
            lat_o: body.lat_o,
            lng_o: body.lng_o,
            lat_d: body.lat_d,
            lng_d: body.lng_d,
        }
    }

    //Verifica si el viaje no esta siendo terminado
    if (nuevo.estado !== 'terminado') {
        //Verifica si no existe cambio
        if (nuevo.estado === 'cambiar' && nuevo.estado !== "curso") {

            if (!nuevo.conductor) {
                //Asignar conductor, viaje.conductor = 


            }
            nuevo.estado = 'asignado'

            //Asignar precio viaje.precio = (Calcular precio)
        }




    }

    //Verifica si no estan terminado o cancelando el viaje
    if (nuevo.estado === 'cancelado' || nuevo.estado === 'terminado') {
        nuevo.fechafin = new Date();
    }



    Viaje.findOneAndUpdate({
        pasajero: viaje_id
    }, nuevo, {
        new: true,
        runValidators: true
    }, (err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Viaje no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        })
    })
})



//...::: ACTUALIZAR VIAJE :::...
app.put('/viajes/actualizar/conductor/:id', [verificar_token.verificacion_token], (req, res) => {
        let viaje_id = req.params.id
        let body = req.body
        let nuevo = {
                conductor: body.conductor,
                estado: body.estado,
            }
            //Verifica si el viaje no esta siendo terminado
        if (nuevo.estado !== 'terminado') {
            //Verifica si no existe cambio
            if (nuevo.estado === 'cambiar' && nuevo.estado !== "curso") {

                if (!nuevo.conductor) {
                    //Asignar conductor, viaje.conductor = 
                }
                nuevo.estado = 'asignado'
                    //Asignar precio viaje.precio = (Calcular precio)
            }


        }

        //Verifica si no estan terminado o cancelando el viaje
        if (nuevo.estado === 'cancelado' || nuevo.estado === 'terminado') {
            nuevo.fechafin = new Date();
        }



        Viaje.findOneAndUpdate({
            conductor: viaje_id
        }, nuevo, {
            new: true,
            runValidators: true
        }, (err, viajedb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!viajedb) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "Viaje no encontrado"
                    }
                });
            }
            res.json({
                ok: true,
                viaje: viajedb
            })
        })
    })
    //...::: ELIMINAR VIAJE POR ID :::...
app.delete('/viajes/borrar/pasajero/:id', (req, res) => {
    let id = req.params.id
    Viaje.findOneAndRemove({
        pasajero: id
    }, (err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Viaje no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        })

    })


})

//...::: ELIMINAR VIAJE POR ID :::...
app.delete('/viajes/borrar/conductor/:id', (req, res) => {
    let id = req.params.id
    Viaje.findOneAndRemove({
        conductor: id
    }, (err, viajedb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!viajedb) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Viaje no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            viaje: viajedb
        })

    })


})

module.exports = app