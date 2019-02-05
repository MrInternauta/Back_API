const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: "{VALUE} don't is type valid."
};

let Schema = mongoose.Schema;


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is NECESARIO']
    },
    lastname: {
        type: String,
        required: [true, 'The lastname is NECESARIO']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is NECESARIO']
    },
    password: {
        type: String,
        required: [true, 'The password is NECESARIO']
    },
    google: {
        type: Boolean,
        default: false,
        required: false,

    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
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

module.exports = mongoose.model('User', userSchema);