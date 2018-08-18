const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
}
let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required!']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is required!']
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: roles
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    },
    google: {
        type: Boolean,
        required: true,
        default: false
    }
});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico.' })
module.exports = mongoose.model('Usuario', usuarioSchema)