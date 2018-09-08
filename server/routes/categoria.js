const express = require('express')
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin

let app = express()
let Categoria = require('../models/categoria')
    //requerir token en los servicios

//Mostrar las categorias
app.get('/categoria', verificar_token.verificacion_token, (req, res) => {
    Categoria.find()
        .populate('usuario', 'nombre email') //trae el usuario id
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })
            })


        })

})

//Get mostrar categira por id
app.get('/categoria/:id', verificar_token.verificacion_token, (req, res) => {
    let id = String(req.params.id);
    Categoria.findById(id, (err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }

                })
            }

            res.json({
                ok: true,
                categoria
            })
        })
        //Categoria.findById
})

//Crear categoria
app.post('/categoria', [verificar_token.verificacion_token, verificaradmin], (req, res) => {

    let id_usuario = req.usuario._id
    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id_usuario
    })
    categoria.save((err, categoriadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriadb) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriadb
        });
    })

    //regresa categoria
    //req.usuario._id
})

//actualiza categoria
app.put('/categoria/:id', [verificar_token.verificacion_token, verificaradmin], (req, res) => {
        let id = String(req.params.id)
        let id_usuario = req.usuario._id
        let descripcion = req.body.descripcion
        let categoria = {
            descripcion,
            id: id_usuario
        }
        Categoria.findByIdAndUpdate(id, categoria, { new: true, runValidators: true }, (err, categoriadb) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if (!categoriadb) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Categoria no encontrada'
                        }
                    });
                }


                res.json({
                    ok: true,
                    categoria: categoriadb
                })
            })
            //regresa categoria
            //req.usuario._id
    })
    //Eliminar categoria (solo admin, token)
app.delete('/categoria/:id', [verificar_token.verificacion_token, verificaradmin], (req, res) => {
    let id = req.params.id
    Categoria.findByIdAndRemove(id, (err, categoriadb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categoriadb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La categoria no existe'
                    }
                });
            }


            res.json({
                ok: true,
                categoria: categoriadb
            })
        })
        //regresa categoria
        //req.usuario._id
})
module.exports = app