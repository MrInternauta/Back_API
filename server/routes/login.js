const express = require('express');

// const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/user');

const app = express();




app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuariodb) {
            return res.status(500).json({
                ok: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }
        if (body.password != usuariodb.password) {
        // if (!bcrypt.compareSync(body.password, usuariodb.password)) {

            return res.status(500).json({
                ok: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }
        let token = jwt.sign({
                usuario: usuariodb,

            },
            process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            }
        )

        res.json({
            ok: true,
            usuario: usuariodb,
            token
        })


    })
})




module.exports = app;