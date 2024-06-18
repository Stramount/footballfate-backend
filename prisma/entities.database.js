import Validator from "../src/controllers/validator.controller.js"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient({
    transactionOptions: {
        timeout: 9000,
        maxWait: 10000
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

        if (!req.params.ID) {
            const query_id = await prisma.$queryRaw`SELECT ID FROM Fecha order by ID desc LIMIT 1;`
            const users = await prisma.usuario.findMany({
                where: {
                    Equipo: { every: { Fecha: { is: { ID: query_id.ID } } } }
                }
            })

            users.map(u => ({}))
            return res.send(users)
        }


        const user = await prisma.usuario.findFirst({
            where: {
                ID: parseInt(req.params.ID)
            },
            include: {
                Equipo: {
                    include: {
                        Fecha: true
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


        if (await Validator.comparePassword(password, user.Contrase_a)) {
            let tokenValid = await Validator.validationToken(req.cookies.token)

            if (tokenValid instanceof Error) {

                if (tokenValid.message === 'jwt expired' || tokenValid.message === 'Token no dado') {
                    let token = await Validator.createToken({ email: email })
                    return res.cookie('token', token).cookie("user" , user.ID).status(200).send(user)
                }

                return res.status(401).send({ message: tokenValid.message })
            }

            return res.cookie("user" , user.ID).send(user)
        }

        return res.status(400).send({message : "Contraseña incorrecta"})

    }

    static async register(req, res, next) {
        try {
            const token = await Validator.createToken({ email: req.body.email })
            console.log('token is generated')
            res.cookie('token', token)
            console.log('token:', token)
        } catch (e) {
            console.log(e)
            return res.status(401).send(e)
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
                usandoWildcard: 1,
                logged: true,
                Equipo: {
                    create: {
                        NombreEquipo: req.body["teamname"],
                        Puntuacion: 0,
                        Fecha: {
                            connect: {
                                ID: query_fecha[0].ID
                            }
                        }


                    }
                }
            },
            include: {
                Equipo: {
                    include: {
                        Equipo_Jugador: {
                            include: {
                                Jugador: true
                            }
                        }
                    }
                }
            }
        })

        res.cookie("user", user.ID)
        return res.json(user)
    }
}

export class Team {

    static async getTeam(req, res, next) {

        const query_id = Fecha.getFecha()

        if (!parseInt(req.params.USERID)) {
            const team = await prisma.equipo.findMany({
                where: {
                    Fecha_ID: query_id.ID
                },
                include: {
                    Equipo_Jugador: {
                        include: {
                            Jugador: true
                        }
                    }
                }
            })
            res.send(team)

            return team
        }
        const teams = await prisma.equipo.findMany({
            where: {
                ID_Usuario: parseInt(req.params.USERID)
            },
            include: {
                Equipo_Jugador: {
                    include: {
                        Jugador: true
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
                ID: query_id[0].ID
            },
            data: {
                NombreEquipo: req.body.teamname ?? Team.getTeam(req, { send: () => { } })["NombreEquipo"]
            }
        })

        return res.send(newTeam)
    }

    static async transferTeam(req) {
        const { USERID } = req.params// recibis el id del usuario
        const { players, cantTransfers } = req.body; // recibis los nuevos jugadores

        const fecha = await Fecha.getFecha()

        if (fecha.estaCerrado){
            return {message : "No es posible hacer transferencias cuando la fecha esta cerrada"}
        }

        const team = await prisma.equipo.findFirst({
            where: {
                ID_Usuario : parseInt(USERID),
                Fecha_ID: fecha.ID
            }
        })

        let user = {}

        await Account.getAccount(
            {
                params: {
                    ID: parseInt(USERID)
                }
            },

            {
                json: (data) => { user = data }
            },

            () => { }
        )

        let minusPoints = cantTransfers.length > user.Transferencias ? cantTransfers.length * 2 : 0

        let transferTransaction = [
            prisma.usuario.update({
                where: { ID: parseInt(USERID) },
                data: {
                    Presupuesto: req.body.budget,
                    Transferencias: 2 - cantTransfers.length
                },
                include: { Equipo: true }
            }),

            prisma.equipo.update({
                where: {
                    ID : team.ID
                },

                data: {
                    Puntuacion: minusPoints
                }
            }),

            prisma.equipo_Jugador.deleteMany({
                where : {ID_Equipo : team.ID},
            }),

            prisma.equipo_Jugador.createMany({
                data: players.map(ply => ({
                    playerOrder : ply.playerOrder,
                    estaEnBanca: ply.estaEnBanca,
                    esCapitan : ply.esCapitan,
                    ID_Equipo : team.ID,
                    ID_Jugador : ply.ID_Jugador
                }))
            })
        ]

        for (let IDJugador of cantTransfers){
            transferTransaction.push(
                prisma.jugador.update({
                    where : {ID : IDJugador},
                    data : {cantTransfer : {increment : 1}}
                })
            )
        }

        // Realizar todas las operaciones en una transacción
        await prisma.$transaction(transferTransaction)
        return "ok"
    }

    static async createTeam(req, res, next) { // se usa para cuando hacemos la nueva semana

        await prisma.$transaction(async (prisma) => {
            const query_id = await Fecha.getFecha()

            // Actualizar el wildcard de todos los usuarios, si lo estan usando (1 == true) se desactiva

            await prisma.usuario.updateMany({
                where: {
                    usandoWildcard: 1
                },
                data: {
                    Wildcard: false,
                    usandoWildcard: 0
                }
            })

            const oldTeams = await prisma.equipo.findMany({
                where: {
                    Fecha_ID: query_id.ID
                },
                include: {
                    Equipo_Jugador: true
                }
            })

            let nuevaFecha = await Fecha.createFecha() //yyyy-m-d

            await prisma.equipo.createMany({
                data: oldTeams.map(t => ({
                    NombreEquipo: t.NombreEquipo,
                    Puntuacion: 0,
                    ID_Usuario: t.ID_Usuario,
                    Fecha_ID: nuevaFecha.ID
                }))
            })

            const newTeams = await prisma.equipo.findMany({
                where: {
                    Fecha_ID: nuevaFecha.ID
                }
            })

            await Player.updatePrice()

            let data = []

            for (let i in oldTeams) {
                for (const ej of oldTeams[i].Equipo_Jugador) {
                    data.push({
                        ID_Equipo: newTeams[i].ID,
                        esCapitan: ej.esCapitan,
                        estaEnBanca: ej.estaEnBanca,
                        ID_Jugador: ej.ID_Jugador,
                        playerOrder: ej.playerOrder
                    })
                }
            }

            await prisma.equipo_Jugador.createMany({
                data
            })


        })


        return res.send('Hecho')
    }
}


export class Fecha {

    static async getFecha() {
        const lastFecha = await prisma.fecha.findFirst({
            orderBy: [{
                ID: 'desc'
            }]
        })

        return lastFecha
    }

    static async createFecha() {
        let date = new Date(Date.now() + 604800000)

        const newFecha = await prisma.fecha.create({
            data: {
                fecha: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                estaCerrado: 0
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

    static async updatePrice(){
        let players = []

        await Player.getPlayers({params : {}}, {json : (data) => players = data})

        let data = []

        for (let player of players){
            let points = player.Estadistica[player.Estadistica.length-1]?.puntos
            if (!points){
                continue
            }

            if (player.Estadistica[player.Estadistica.length - 1].puntos >= 10){
                player.precio += Math.fround(points/ 4)
            }
            else {
                player.precio -= Math.fround(points / 4)
            }

            if (player.precio < 4.5){
                player.precio = 4.5
            }

            data.push(prisma.jugador.update({where : {ID : player.ID}, data: {precio : player.precio}}))
        }

        await prisma.$transaction(data)
    }

    static async getPlayers(req, res, next) {

        let where = req.params?.ID ? { ID: parseInt(req.params.ID) } : {}


        const players = await prisma.jugador.findMany({
            where,
            include: {
                Estadistica: {
                    select: {
                        ID_Fecha: true,
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

    static async getPlayerPoints(stats , player) {
        let points = 0
        if (!stats.assistance) return

        points++

        switch (player.categoria) {
            case 'DEL':
                points += stats.goals * 4
                break
            case 'DF':
                points += stats.goals * 6
                break
            case 'MC':
                points += stats.goals * 5
                break
            case 'PT':
                points += stats.goals * 10
                break
        }
        points += stats.assists * 3
        points -= stats.failedPenalties * 2
        points += player.categoria === 'PT' ? 0 : parseInt(stats.interceptions / 2)
        points += stats.savedPenalties * 5
        points += player.categoria === 'PT' ? parseInt(stats.saves / 2) : 0
        return points
    }

    static async createStat(req, res, next) {
        let id_fecha = await Fecha.getFecha()

        let player = {}
        
        await Player.getPlayers({params : {ID : req.params.ID}} , {json : (data) => player  = data})

        console.log(player)

        const newStat = await prisma.estadistica.create({
            data: {
                goles: req.body.goals,
                asistencias: req.body.assists,
                intercepciones: req.body.interceptions,
                atajadas: req.body.saves,
                penalesErrados: req.body.failedPenalties,
                penalesAtajados: req.body.savedPenalties,
                asistioAClase: req.body.assistance,
                puntos: await Stat.getPlayerPoints(req.body , player[0]),
                Fecha: {
                    connect: {
                        ID: id_fecha.ID
                    }
                },
                Jugador: {
                    connect: {
                        ID: parseInt(req.params.ID)
                    }
                }
            }
        })
        return res.json(newStat)
    }
}