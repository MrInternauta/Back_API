const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['Estudiante', 'Docente'],
    message: "{VALUE} no es un tipo valido"
};

let Schema = mongoose.Schema;


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es NECESARIO']
    },
    description: {
        type: String,
        required: [true, 'La descripcion es NECESARIA']
    },
    role: {
        type: String,
        enum: rolesValidos,
        required: [true, 'El tipo es NECESARIO']
    },
    img: {
        type: String,
        required: false
    },

});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


userSchema.plugin(uniqueValidator, { message: '{PATH} should be unique.' });

module.exports = mongoose.model('Participante', userSchema);