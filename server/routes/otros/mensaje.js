const Luz = require("../models/luz");
const Sensor = require("../models/sensor");
const Usuario = require("../models/user");
const verificar_token = require('../middlewares/autenticacion');
const verificaradmin = require('../middlewares/autenticacion').verificaradmin
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);



//mensajes publicos

app.get("/luces", [verificar_token.verificacion_token, verificaradmin], (req, res) => {
    let usuario = req.usuario;
    Luz.find({ user_id: usuario._id })
        .exec((err, respuesta) => {
            if (err) {
                return;
            }
            if (res) {
                res.json({
                    ok: true,
                    respuesta
                });
            }

        });
});




app.get("/sensores", [verificar_token.verificacion_token, verificaradmin], (req, res) => {
    let usuario = req.usuario;
    Sensor.find({ user_id: usuario._id })
        .exec((err, respuesta) => {
            if (err) {
                return;
            }
            if (res) {
                res.json({
                    ok: true,
                    respuesta
                });
            }

        });
});



/*app.post("/mensajesGET", (req, res) => {
    const de = req.body.de;
    const para = req.body.para
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 10;
    limite = Number(limite);


    { $and: [{ de }, { para }] }
    Mensaje.find({
            $or: [
                { $and: [{ de }, { para }] },
                { $and: [{ de: para }, { para: de }] }

            ]
        })
        // .skip(desde)
        // .limit(limite)
        .populate('de para')
        .exec((err, respuesta) => {
            if (err) {
                return;
            }
            if (res) {
                res.json({
                    ok: true,
                    respuesta
                });
            }
        });
});
*/
// mensajes privado
app.post('/mensajes/:id', (req, res) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }
    io.in(id).emit('mensaje-privado', payload);


    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});



app.post("/mensajes", (req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = { cuerpo, de };

    io.emit("mensaje-nuevo", payload);

    res.json({
        ok: true,
        cuerpo,
        de
    });
});

module.exports = app;