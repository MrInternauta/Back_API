
const usuarios_conectados = require("../classes/usuario-lista");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/user");

//  const conectar_cliente = (cliente, io) => {
//     usuarios_conectados.agregar({
//       id: cliente.id,
//       nombre: "sin-nombre",
//       sala: "sin-sala"
//     });

// }
//Maneja cuando un usuario se desconecta
 const desconectar = (cliente, io) => {
    //cuando un usuario se desconecta
    cliente.on('disconnect', () => {
        //imprime 
        usuarios_conectados.borrarUsuario(cliente.id);
        io.emit("usuarios-activos", usuarios_conectados.getLista());

    })
}



 const config_user = (cliente, io) => {
    cliente.on("configurar-usuario", (payload, callback) => {
        const usuario = usuarios_conectados.getUsuario_xnombre(payload.nombre);
        if (!usuario && payload.nombre != 'sin-nombre'){
            Usuario.findById(payload.nombre, (err, usersb) => {
                if(err){
                    console.log('err find user');
                    console.log(payload.nombre);
                }
                if(usersb){
                    usuarios_conectados.agregar({
                      id: cliente.id,
                      nombre: payload.nombre,
                      sala: "sin-sala",
                      usuario: usersb._doc
                    });
                    io.emit("usuarios-activos", usuarios_conectados.getLista());

                    callback({
                        ok: true,
                        mensaje: "Cliente " + payload.nombre + " configurado"
                    })
                }

            })
        }
        
        

    });

}

const verificar_token = (cliente, io) => {
    cliente.on('verificar-token', (payload, callback)=>{
        jwt.verify(payload, process.env.SEED, (err, decoded) => {
          if (err) {
              callback({ok: false});
          } else {
              callback({ok: true});
           
          }
        });
    })
};
const getUsuario = (cliente, io) => {
    cliente.on('usuario-profile', (payload) => {
        let id = payload
        Usuario.findById(id, ((err, usuarioDB) => {
            if (err) {
                io.to(cliente.id).emit('usuario-profile', false);
            }
            if (!usuarioDB) {
                io.to(cliente.id).emit("usuario-profile", false);
            }
            if(usuarioDB) {
                io.to(cliente.id).emit("usuario-profile", usuarioDB);
            }
            
        }))

    })
};

 const lista_usuarios = (cliente, io) => {
    cliente.on("obtener-usuarios", () => {
        io.to(cliente.id).emit("usuarios-activos", usuarios_conectados.getLista());
    });
};

module.exports = {
  desconectar,
  config_user,
  lista_usuarios,
  verificar_token,
  getUsuario,
};