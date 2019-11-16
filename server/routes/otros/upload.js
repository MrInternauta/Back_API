const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/user');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    // Valida tipo
    let tiposValidos = ['medico', 'usuarios', 'hospitales'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo
    // 183912kuasidauso-123.jpg
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        console.log(tipo);
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'medico':
                imagenMedico(id, res, nombreArchivo);
                break;
            case 'hospitales':
                imagenHospital(id, res, nombreArchivo);
                break;
            default:


                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'error'
                    }
                });

        }



    });

});




function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });


    });


}



function imagenHospital(id, res, nombreArchivo) {

    Hospital.findById(id, (err, HospitalBD) => {

        if (err) {
            borraArchivo(nombreArchivo, 'hospitales');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!HospitalBD) {

            borraArchivo(nombreArchivo, 'hospitales');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'HOSPITAL no existe'
                }
            });
        }

        borraArchivo(HospitalBD.img, 'hospitales')

        HospitalBD.img = nombreArchivo;

        HospitalBD.save((err, hospitalGuardado) => {

            res.json({
                ok: true,
                hospital: hospitalGuardado,
                img: nombreArchivo
            });

        });


    });


}










function imagenMedico(id, res, nombreArchivo) {

    Medico.findById(id, (err, MedicoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'medico');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!MedicoDB) {

            borraArchivo(nombreArchivo, 'medico');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'medico no existe'
                }
            });
        }

        borraArchivo(MedicoDB.img, 'medico')

        MedicoDB.img = nombreArchivo;

        MedicoDB.save((err, medicoGuardado) => {

            res.json({
                ok: true,
                medico: medicoGuardado,
                img: nombreArchivo
            });

        });


    });


}






function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }


}

module.exports = app;