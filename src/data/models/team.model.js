import prisma from "../database.js";

class EquipoModelo {

    static async getEquipo(req) {
        let id = req.params.id
        await prisma.equipo.findUnique({
            where: {
                ID: id
            },
            include: {
                Equipo_Jugador: {
                    where: {
                        ID_Equipo: id
                    },
                    include: {
                        Jugador: true
                    }
                }
            }
        })
    }

    static async updateTeam(req) {
        await prisma.equipo.update({
            where: {
                ID: req.params.id
            },
            data: {
                NombreEquipo: req.body.teamname ?? EquipoModelo.getEquipo(req)["NombreEquipo"]
            }
        })
    }

    static async transferTeam(req) {
        const Userid = parseInt(req.params.id) // recibis el id del usuario
        const id = parseInt(req.params.id.idteam); // recibis el id del equipo
        const { players } = req.body; // recibis los nuevos jugadores
      
        // Obtener los jugadores actuales del equipo y sus precios
        const currentPlayers = await prisma.equipo_Jugador.findMany({
          where: { ID_Equipo: id },
          select: {
            ID_Jugador: true,
            Jugador: { select: { precio: true } }
          }
        });
      
        // Crear un Set para los IDs de los nuevos jugadores para búsquedas rápidas
        const newPlayerIds = new Set(players.map(p => p.ID_Jugador));
      
        // Calcular el costo recuperado y de transferencia en una sola pasada
        let costoRecuperado = 0;
        let costoDeTransferencia = 0;
      
        // creamos un mapa para un mejor recorrido
        const currentPlayerMap = new Map();  
      
        for (const cp of currentPlayers) { 
        // realizamos un set para dar una coleccion de valores
          currentPlayerMap.set(cp.ID_Jugador, cp);  
          if (!newPlayerIds.has(cp.ID_Jugador)) {
            costoRecuperado += cp.Jugador.precio;
          }
        }
      
        for (const p of players) {
          if (!currentPlayerMap.has(p.ID_Jugador)) { 
            costoDeTransferencia += p.precio;
          }
        }
      
        // Realizar todas las operaciones en una transacción
        await prisma.$transaction(async (prisma) => {
          // Actualizar el presupuesto del usuario
          await prisma.usuario.update({
            where: { ID: Userid },
            data: {
              Presupuesto: {
                increment: costoRecuperado - costoDeTransferencia
              }
            }
          });
      
          // Actualizar los jugadores del equipo
          await prisma.equipo_Jugador.deleteMany({
            where: { ID_Equipo: id }
          });
      
          await prisma.equipo_Jugador.createMany({
            data: players.map(p => ({
              order: p.order,
              estaEnBanca: p.estaEnBanca,
              esCapitan: p.esCapitan,
              ID_Equipo: id,
              ID_Jugador: p.ID_Jugador
            }))
          });
        });
      }
}


export default EquipoModelo