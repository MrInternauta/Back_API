const express = require('express')
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin

let app = express()
let Producto = require('../models/producto')

//Obtener todos los productos
app.get('/productos', verificar_token.verificacion_token, (req, res) => {
    Producto.find()
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe producto'
                    }
                })
            }

            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })
            })

        })
        //traer todos los productos
        //pupulate categoria, ususario
        //paginado

})

//crear nuevo producto
app.post('/productos', [verificar_token.verificacion_token, verificaradmin], (req, res) => {
    let id_usuario = req.usuario._id
    let body = req.body
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: id_usuario
    })

    producto.save((err, productobd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productobd) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productobd
        });

    })

    //guardar usuarip
    //guardar categoria
    //regresar

})

//Obtener todos los productos por id
app.get('/productos/:id', (req, res) => {
    let id = req.params.id
    Producto.findById(id, ((err, productobd) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productobd) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productobd
            })
        }))
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        //traer uno los productos
        //pupulate categoria, ususario

})

app.put('/productos/:id', [verificar_token.verificacion_token, verificaradmin], (req, res) => {
    let producto_id = req.params.id
    let id_usuario = req.usuario._id
    let body = req.body
    let nuevo = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: id_usuario
    }
    Producto.findByIdAndUpdate(producto_id, nuevo, { new: true, runValidators: true }, (err, productobd) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productobd) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productobd
            })
        })
        //guardar usuarip
        //guardar categoria
        //regresar

})

//borrar  producto
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id
    Producto.findByIdAndRemove(id, (err, productobd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productobd) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productobd
        })

    })


})

app.get('/productos/buscar/:termino', (req, res) => {
    let termino = req.params.termino
    let regu = new RegExp(termino, 'i')
    Producto.find({
            nombre: regu
        })
        .populate('categoria', 'nombre')
        .exec((err, productobd) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productobd
            })

        })
})


module.exports = app