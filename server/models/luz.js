const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');





let Schema = mongoose.Schema;


let luzSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "La descripcion es necesaria"]
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sala_id: {
        type: Schema.Types.ObjectId,
        ref: "Sala",
        required: true,
    },
    estado: {
        type: Boolean,
        default: false
    }, 
    pin: {
        type: Number,
        default: 0
    }

});




luzSchema.plugin(uniqueValidator, {
    message: "{PATH} debe de ser único"
});


module.exports = mongoose.model("Luz", luzSchema);