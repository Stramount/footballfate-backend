import EquipoModelo from "../../data/models/team.model.js";

export function getEquipo(req, res) {
    return res.send(EquipoModelo.getEquipo(req))
}

export function updateEquipo(req, res) {
    EquipoModelo.updateTeam(req)
    return res.send("El equipo se actualizo correctamente!")
}

export function transferenciaEquipo(req, res) {
    EquipoModelo.transferTeam(req)
    return res.send("Se realizo la transferencia!")
}
