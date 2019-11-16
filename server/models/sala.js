const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;


let salaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'The name is NECESARIO']
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

});



module.exports = mongoose.model('Sala', salaSchema);