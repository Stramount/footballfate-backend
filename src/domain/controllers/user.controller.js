import UsuarioModelo from "../../data/models/user.model.js";

export function register(req, res) {

}

export function login(req, res) {
    
}

export function getUsuarios(req, res) {
    return UsuarioModelo.findMany()
}

export function deleteUsuario(req, res) {

}