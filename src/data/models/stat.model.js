import prisma from "../database.js";


class EstadisticaModelo {

    static async createStat(req) {
        let { fechaid } = await prisma.fecha.findFirst({ select: { ID: true }, orderBy: { ID: 'desc' } })
        await prisma.estadistica.create({
            data: {
                ID_Fecha: fechaid,
                ID_Jugador: parseInt(req.body.playerId),
                goles: parseInt(req.body.goals),
                asistencias: parseInt(req.body.assists),
                intercepciones: parseInt(req.body.interceptions),
                atajadas: parseInt(req.body.saves),
                penalesErrados: parseInt(req.body.failedPenalties),
                penalesAtajados: parseInt(req.body.savedPenalties),
                asistioAClase: Boolean(req.body.assistance),
                puntos: parseInt(req.body.points)
            }
        })
    }
}



export default EstadisticaModelo
