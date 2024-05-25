import Validator from "../src/controllers/validator.controller.js"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient({
    transactionOptions : {
        timeout : 9000,
        maxWait : 10000
    }
})


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
                    Equipo : { every :  { Fecha : { is : { ID : query_id.ID }}}}
                }
            })

            users.map(u => ({}))
            return res.send(users)
        }


        const user = await prisma.usuario.findFirst({
            where: {
                ID: parseInt(req.params.ID)
            },
            include : {
                Equipo : {
                    include : {
                        Fecha : true
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
        
        let { email, password } = req.body
        const user = await prisma.usuario.findFirst({
            where: {
                Mail: email,
            }
        })

        if (!user) { res.status(404); return res.send("Usuario no encontrado") }

        

        if (await Validator.comparePassword(password, user.Contrase_a) && req.cookies.token) {
            let user = await Validator.validationToken(req , res , next)

            if (user instanceof Error) {

                if (user.message === 'jwt expired') {
                    let token = await Validator.createToken({ email: email })
                    return res.cookie('token', token).status(200).send('Token expirado, se ha generado uno nuevo')
                }
                
                return res.status(401).send({ message: user.message })
            }

            return res.send(user)
        }

        return res.status(400).send("Contraseña incorrecta")

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

        const query_fecha = await prisma.$queryRaw`SELECT ID, fecha FROM Fecha order by ID desc LIMIT 1;`
        const user = await prisma.usuario.create({
            data: {
                Nickname: req.body["username"],
                Contrase_a: await Validator.hashPassword(req.body["password"]),
                Mail: req.body["email"],
                Presupuesto: 100,
                Transferencias: 2,
                Wildcard: true,
                usandoWildcard : 1,
                logged : true,
                Equipo: {
                    create: {
                        NombreEquipo: req.body["teamname"],
                        Puntuacion: 0,
                        Fecha: {
                            connect : {
                                ID : query_fecha[0].ID
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

        if (!parseInt(req.params.USERID)) {
            const team = await prisma.equipo.findMany({
                include : {
                    Fecha: {
                        where : {
                            ID : query_id[0].ID
                        }
                    },
                    Equipo_Jugador : true
                }
            })
            res.send(team)

            return team
        }
        const teams = await prisma.equipo.findMany({
            where: {
                ID_Usuario : parseInt(req.params.USERID)
            },
            include : {
                Equipo_Jugador : {
                    include : {
                        Jugador : true
                    }
                }
            }
        })
        // obtener el equipo que se pasa por ID
        res.send(teams)
        return teams
    }

    static async updateTeam(req, res, next) {
        if (parseInt(req.headers.transfer)) {
            return res.send(await Team.transferTeam(req))
        }
        let user_id = req.params.USERID
        let query_id = await prisma.$queryRaw`SELECT ID FROM Equipo where ID_Usuario like ${user_id}`
        const newTeam = await prisma.equipo.update({
            where: {
                ID : query_id[0].ID
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
        await prisma.$transaction(async (prisma) => {  
            const query_id = await Fecha.getFecha()

            let old_teams = await prisma.$queryRaw`SELECT * FROM Equipo e inner join Fecha f on e.ID_Fecha=f.ID where f.ID like ${query_id.ID}`
            console.log(old_teams)

            let nuevaFecha = await Fecha.createFecha(new Date()) //yyyy-m-d
            

            const resultado = await prisma.equipo.createMany({
                data : old_teams.map(t => ({
                    NombreEquipo : t.NombreEquipo,
                    Puntuacion : 0,
                    ID_Usuario : t.ID_Usuario,
                    Fecha : {
                        connect : {
                            ID : nuevaFecha.ID
                        }
                    }
                }))
            })
            console.log(resultado)
        })
        
        return res.send('Hecho')
    }
}


export class Fecha {

    static async getFecha(){
        const lastFecha = await prisma.fecha.findFirst({
            orderBy : [{
                ID: 'desc'
            }]
        })
        
        return lastFecha
    }

    static async createFecha(date){
        const newFecha = await prisma.fecha.create({
            data : {
                fecha : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                estaCerrado : 0
            }
        })
        
        return newFecha
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

        let where = req.params.ID ? {ID : parseInt(req.params.ID)} : {}


        const players = await prisma.jugador.findMany({
            where,
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
                goles: req.body.goals,
                asistencias: req.body.assists,
                intercepciones: req.body.interceptions,
                atajadas: req.body.saves,
                penalesErrados: req.body.failedPenalties,
                penalesAtajados: req.body.savedPenalties,
                asistioAClase: Boolean(req.body.assistance),
                puntos: req.body.points,
                Fecha : {
                    connect : {
                        ID : helper["ID"]
                    }
                },
                Jugador : {
                    connect : {
                        ID : parseInt(req.params.ID)
                    }
                }
            }
        })
        return res.json(newStat)
    }
}