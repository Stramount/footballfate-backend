import JugadorModelo from "../../data/models/player.model.js";

export function getAllPlayers(req, res) {
    return res.send(JugadorModelo.getPlayers(req))
}