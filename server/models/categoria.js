const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let rolesValidos = {
    values: ['Estudiante', 'Docente'],
    message: "{VALUE} no es un tipo valido"
};

let Schema = mongoose.Schema;


let mensajesSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    cuerpo: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: rolesValidos,
        required: [true, 'El tipo es NECESARIO']
    },

    /*  de: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },*/


});




mensajesSchema.plugin(uniqueValidator, {
    message: "{PATH} debe de ser único"
});


module.exports = mongoose.model("Categoria", mensajesSchema);