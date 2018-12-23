
const usuarios_conectados = require("../classes/usuario-lista");


 const conectar_cliente = (cliente, io) => {
    usuarios_conectados.agregar({
      id: cliente.id,
      nombre: "sin-nombre",
      sala: "sin-sala"
    });

}
//Maneja cuando un usuario se desconecta
 const desconectar = (cliente, io) => {
    //cuando un usuario se desconecta
    cliente.on('disconnect', () => {
        //imprime 
        usuarios_conectados.borrarUsuario(cliente.id);
        io.emit("usuarios-activos", usuarios_conectados.getLista());

    })
}

//escuchar mensajes
 const mensaje = (cliente, io) => {
    //cuando el cliente emmite el evento mensaje
    cliente.on('mensaje', (payload) => {
        //imprime el mensaje
        console.log('Mensaje recibido: ', payload);

        io.emit('mensaje-nuevo', payload);
    })

}

 const config_user = (cliente, io) => {
    cliente.on("configurar-usuario", (payload, callback) => {
        usuarios_conectados.actualizarNombre(cliente.id, payload.nombre);
        io.emit("usuarios-activos", usuarios_conectados.getLista() );

        callback({
            ok: true,
            mensaje: "Cliente " + payload.nombre + " configurado"
        })

    });

}

 const lista_usuarios = (cliente, io) => {
    cliente.on("obtener-usuarios", () => {
        io.to(cliente.id).emit("usuarios-activos", usuarios_conectados.getLista());
    });
};

module.exports = {
    conectar_cliente,
    desconectar,
    mensaje,
    config_user,
    lista_usuarios
}