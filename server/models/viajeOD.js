var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


var ViajeODSchema = new Schema({
    lat_o: {
        type: Number,
        required: true
    },
    lng_o: {
        type: Number,
        required: true
    },
    lat_d: {
        type: Number,
        required: true
    },
    lng_d: {
        type: Number,
        required: true
    },
    viaje: {
        type: Schema.Types.ObjectId,
        ref: 'Viaje',
    }
});

ViajeODSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('ViajeOriDes', ViajeODSchema);