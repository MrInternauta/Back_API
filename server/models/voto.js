const mongoose = require('mongoose');




let Schema = mongoose.Schema;


let mensajesSchema = new Schema({


    participante: {
        type: Schema.Types.ObjectId,
        ref: "Participante",
        required: true,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true,
    },
    votador: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

});






module.exports = mongoose.model("Voto", mensajesSchema);