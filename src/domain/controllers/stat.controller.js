import EstadisticaModelo from "../../data/models/stat.model.js";


export function createEstadistica(req, res) {
    EstadisticaModelo.createStat(req)
    return res.send("Las estadisticas fueron creadas correctamente!")
}