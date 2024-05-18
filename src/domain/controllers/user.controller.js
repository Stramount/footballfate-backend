import UsuarioModelo from "../../data/models/user.model.js";
import Validator from "./validator.controller.js";

export async function register(req, res) {
    try {
        const token = await Validator.createToken({ email: req.body.email })
        res.cookie('token', token)
      } 
    catch (e) {
        console.log("El error es: ", e)
      }
    UsuarioModelo.register(req)
    return res.send("El usuario se ha creado!")
}

export async function login(req, res) {
    UsuarioModelo.login(req)
    const token = await Validator.createToken({ email: req.body.email })
    res.cookie('token', token)
    return res.send("Usuario logeado con exito!")
}

// export function getUsuarios(res) {
//     return res.send(UsuarioModelo.getAllUsers())
// }

export function getUsuario(req, res) {
    return res.send(UsuarioModelo.getUser(req))
}

export function deleteUsuario(req, res) {
    UsuarioModelo.deleteUser(req)
    return res.send("El usuario ha sido borrado con exito")
}

export function updateUsuario(req, res) {
    UsuarioModelo.updateUser(req)
    return res.send("El usuario se ha actualizado exitosamente!")
}
