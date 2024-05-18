import prisma from "../database.js";


class JugadorModelo {

    static async getPlayers(req) {
        await prisma.jugador.findMany({
            where: {
                nombre: {
                    contains: req.params.name ?? ""
                }
            },
            include: {
                Estadistica: {
                    select: {
                        goles: true,
                        asistencias: true,
                        intercepciones: true,
                        atajadas: true,
                        penalesErrados: true,
                        penalesAtajados: true,
                        asistioAClase: true,
                        puntos: true
                    }
                }
            }
        })
    }
}


export default JugadorModelo