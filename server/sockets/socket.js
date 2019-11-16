const Luz = require('../models/luz');
const Sensor = require('../models/sensor');


const sensor = (cliente, io) => {
    cliente.on("configurar-sensor", (payload, callback) => {
        const id_sensor = payload.id_sensor;
        Sensor.findByIdAndUpdate(id_sensor, {
            nombre: payload.nombre_sensor,
            metrica: payload.metrica_sensor
        }, (err, resp) => {
            if (err) {
                console.log('error al actualizar sensor');
                console.log(payload);
                return
            }
            io.emit("visualizar-sensor", resp);
            callback({
                ok: true,
                sensor: resp
            })
        })
    });

}

const luz = (cliente, io) => {
    cliente.on("configurar-luz", (payload, callback) => {
        const id_user = payload.id_user;
        const id = payload.id_luz;
        Luz.findByIdAndUpdate(id, {
            nombre: payload.nombre_luz,
            estado: payload.estado_luz
        }, (err, resp) => {
            if (err) {
                console.log('error al actualizar luz');
                console.log(payload);
                return
            }
            io.emit("visualizar-luz", resp);
            callback({
                ok: true,
                luz: resp
            })
        })
    });

}

const versensor = (cliente, io) => {

    cliente.on("ver-sensor", (payload, callback) => {
        const id_sensor = payload.id_sensor;
        Sensor.findById(id_sensor, (err, resp) => {
            if (err) {
                console.log('error al ver sensor');
                console.log(payload, err);
                return
            }
            io.emit("visualizar-sensor", resp);
            callback({
                ok: true,
                sensor: resp
            })
        })
    });

}

const verluz = (cliente, io) => {

    cliente.on("ver-luz", (payload, callback) => {
        const id_luz = payload.id_luz;
        Luz.findById(id_luz, (err, resp) => {
            if (err) {
                console.log('error al ver luz');
                console.log(payload);
                return
            }
            io.emit("visualizar-luz", resp);
            callback({
                ok: true,
                luz: resp
            })
        })
    });

}

module.exports = {
    sensor,
    luz,
    verluz,
    versensor
};