var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


var UserUbicationSchema = new Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }
});
UserUbicationSchema.plugin(uniqueValidator, {
    message: '{PATH} should be unique.'
});

module.exports = mongoose.model('UserUbication', UserUbicationSchema);