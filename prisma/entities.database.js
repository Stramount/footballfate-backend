import Validator from "../src/controllers/validator.controller.js"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()


export class Account {

    static async deleteAccount(req, res, next) {
        await prisma.usuario.delete({
            where: {
                ID: parseInt(req.params.ID)
            }
        })

        return res.status(200).send("Usuario eliminado")
    }

    static async getAccount(req, res, next) {

        if (!req.params.ID){
            const query_id = await prisma.$queryRaw`SELECT ID FROM Fecha order by ID desc LIMIT 1;`
            const users = await prisma.usuario.findMany({
                where : {
                    Equipo : { every : { Equipo_Fecha : { every : { Fecha : { is : { ID : query_id.ID }}}}}}
                }
            })
            return res.send(users)
        }


        const user = await prisma.usuario.findFirst({
            where: {
                ID: parseInt(req.params.ID)
            },
            include : {
                Equipo : {
                    include : {
                        Equipo_Fecha : {
                            include : {
                                Fecha : true
                            }
                        }
                    }
                }
            }
        })

        return res.json(user)
    }

    static async UpdateAccount(req, res, next) {
        const id = parseInt(req.params.id)
        const user = await prisma.usuario.update({
            where: {
                ID: id
            },
            data: {
                Nickname: req.body.username,
                Contrase_a: req.body.password,
                Mail: req.body.email,
                Equipo: {
                    update: {
                        where: {
                            ID: id
                        },
                        data: {
                            NombreEquipo: req.body.teamname
                        }
                    }
                }
            }
        })

        return res.json(user)
    }

    static async login(req, res, next) {
        const token = await Validator.createToken({ email: req.body.email })
        let { email, password } = req.body
        const user = await prisma.usuario.findFirst({
            where: {
                Mail: email,
                Contrase_a: password
            }
        })
        if (!user) { res.status(404); return res.send("Usuario no encontrado") }

        res.cookie('token', token)

        return res.json(user)
    }

    static async register(req, res, next) {
        try {
            const token = await Validator.createToken({ email: req.body.email })
            console.log('token is generated')
            res.cookie('token', token)
            console.log('token:', token)
        } catch (e) {
            console.log(e)
            console.log('Hay un error')
        }

        const query_id = await prisma.$queryRaw`SELECT ID FROM Fecha order by ID desc LIMIT 1;`
        const user = await prisma.usuario.create({
            data: {
                Nickname: req.body["username"],
                Contrase_a: req.body["password"],
                Mail: req.body["email"],
                Presupuesto: 100,
                Transferencias: 2,
                Wildcard: true,
                usandoWildcard : 1,
                Equipo: {
                    create: {
                        NombreEquipo: req.body["teamname"],
                        Puntuacion: 0,
                        Equipo_Fecha : {
                            create: {
                                ID_Fecha : query_id.ID,
                            }
                        }
                    }
                }
            }
        })

        return res.json(user)

    }
}

export class Team {

    static async getTeam(req, res, next) {

        const query_id = await prisma.$queryRaw`SELECT ID FROM Fecha order by ID desc LIMIT 1;`

        if (!req.params.ID) {
            const team = await prisma.equipo.findMany({
                include : {
                    Equipo_Fecha: 
                    {
                        where : {
                            ID_Fecha : query_id
                        }
                    },
                    Equipo_Jugador : true
                }
            })
            res.send(team)

            return team
        }
        const team = await prisma.equipo.findUnique({
            where: {
                ID: parseInt(req.params.ID)
            },
            include : {
                Equipo_Jugador : true
            }
        })
        // obtener el equipo que se pasa por ID
        // Realizar un ordenamiento de la alineacion para enviar al front

        res.send(team)

        return team
    }

    static async updateTeam(req, res, next) {
        if (parseInt(req.headers.transfer)) {
            return res.send(await Team.transferTeam(req))
        }

        const newTeam = await prisma.equipo.update({
            where: {
                ID: parseInt(req.params.ID)
            },
            data: {
                NombreEquipo: req.body.teamname ?? Team.getTeam(req , {send : () => {}})["NombreEquipo"]
            }
        })

        return res.send(newTeam)
    }

    static async transferTeam(req) {
        const {USERID , ID} = req.params// recibis el id del equipo y usuario
        const { players , cantTransfers } = req.body; // recibis los nuevos jugadores

        

        let user = {}

          await Account.getAccount(
            {
                params : {
                    ID : parseInt(USERID)
                }
            },

            {
                json : (data) => {user = data}
            },
            
            () => {}
          )

          let minusPoints = cantTransfers > user.Transferencias ? cantTransfers * 2 : 0

        // Realizar todas las operaciones en una transacción
        await prisma.$transaction(async (prisma) => {
          // Actualizar el presupuesto del usuario


          await prisma.usuario.update({
            where: { ID: parseInt(USERID) },
            data: {
              Presupuesto: req.body.budget
            }
          });
          
          await prisma.equipo.update(
            {
                where : {
                    ID : parseInt(ID)
                },

                data : {
                    Puntuacion : minusPoints
                }

            }
          )

          // Actualizar los jugadores del equipo
          await prisma.equipo_Jugador.deleteMany({
            where: { ID_Equipo: parseInt(ID) }
          });
      
          await prisma.equipo_Jugador.createMany({
            data: players.map(p => ({
              order: p.order,
              estaEnBanca: p.estaEnBanca,
              esCapitan: p.esCapitan,
              ID_Equipo: parseInt(ID),
              ID_Jugador: p.ID_Jugador
            }))
          });
        });
        return "ok"
      }

    static async createTeam(req, res, next) { // se usa para cuando hacemos la nueva semana
        // crea una copia del equipo
        // y lo asocia a la ultima fecha creada
        // se reinician los puntos a 0
        return res.send("Equipos Creados")
    }
}

export class Player {

    static players = {
        "testPlayer": {
            name: "testPlayer",
            team: "testTeam",
            stats: {
                goles: 0,
                asistencias: 0
            }
        }
    }

    static async getPlayers(req, res, next) {

        const players = await prisma.jugador.findMany({
            where: {
                ID : parseInt(req.params.ID)
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

        return res.json(players)

    }
}


export class Stat {

    static async createStat(req, res, next) {
        let helper = await prisma.fecha.findFirst({ select: { ID: true }, orderBy: { ID: 'desc' } })
        const newStat = await prisma.estadistica.create({
            data: {
                ID_Fecha: helper['ID'],
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
        return res.json(newStat)
    }
}