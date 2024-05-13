import Validator from "../src/controllers/validator.controller.js"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

const PRISMA = new PrismaClient()


export class Account {
    static prisma = PRISMA

    static async deleteAccount(req, res, next){
        await prisma.usuario.delete({
            where: {
                ID : parseInt(req.params.id)
            }
        })
        return "Se borro xD"
    }

    static async getAccount(req , res , next){
        const user = await prisma.usuario.findFirst({
            where : {
                ID : req.body.id
            }
        })
        
        return user
    }

    static async UpdateAccount(req , res , next){
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

        return user
    }

    static async login(req , res , next){
        const token = await Validator.createToken({ email: req.body.email })
        let { email, password } = req.body
        const user = await prisma.usuario.findFirst({
            where: {
                Mail: email,
                Contrase_a: password
            }
        })
        if (!user) {res.status(404) ; return "no hay na"}

        res.cookie('token', token)
        return user
    }

    static async register(req , res , next){
        try {
            const token = await Validator.createToken({ email: req.body.email})
            console.log('token is generated')
            res.cookie('token', token)
            console.log('token:', token)
        } catch(e) {
            console.log(e)
            console.log('Hay un error')
        }
        
        const user = await prisma.usuario.create({
            data: {
                Nickname: req.body["username"],
                Contrase_a: req.body["password"],
                Mail: req.body["email"],
                Presupuesto: 100,
                Transferencias: 2,
                Wildcard: true,
                Equipo: {
                    create: {
                        NombreEquipo: req.body["teamname"],
                        Puntuacion: 0,
                        Alineacion : {
                            create : {
                                posgk : 0,
                                pos1: 0,
                                pos2: 0,
                                pos3: 0,
                                pos4: 0,
                                pos5: 0,
                                pos6: 0
                            }
                        },
                        Banca: {
                            create: {
                                pos1: 0,
                                pos2: 0
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
    static prisma = PRISMA

    static async getTeam(req , res , next){
        if (req.params.team) return Team.teams[req.params.team]
        
        return Team.teams
    }

    static async updateTeam(req , res , next){
        Team.teams[req.body.name] = req.body
        return Team.teams
    }
}

export class Player {
    static prisma = PRISMA

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


    static async handlePlayer(req , res , next){
        
        await log(req)
        
        if (req.method == "GET") res.send(await Player.getPlayers(req , res , next)) 
        else if (req.method == "PATCH") res.send(await Player.updatePlayer(req , res , next))

        else res.status(403).send("Metodo no permitido")
    }

    static async getPlayers(req , res , next){

        const players = await prisma.jugador.findMany({
            where : {
                nombre: {
                    contains : req.params.name??""
                    }
                },
            include : {
                Estadistica: {
                    select : {
                        goles : true,
                        asistencias : true,
                        intercepciones : true,
                        atajadas : true,
                        penalesErrados : true,
                        penalesAtajados : true,
                        asistioAClase : true,
                        puntos : true
                      }
                  }
              }   
        })

        return players
        
    }

    static async updatePlayer(req , res , next){
        Player.players[req.body.name] = req.body
        return Player.players
    }

    
}


export class Stat {


    static async handleStat(req, res, next) {
        
        await log(req)
        
        if (req.method == "POST") res.send(await Stat.createStat(req, res, next))
    }


    static async createStat(req, res, next) {
        let helper = await prisma.fecha.findFirst({ select : {ID : true}, orderBy : { ID : 'desc'}})
        const newStat = await prisma.estadistica.create({
            data: {
                ID_Fecha : helper['ID'],
                ID_Jugador : parseInt(req.body.playerId),
                goles : parseInt(req.body.goals),
                asistencias : parseInt(req.body.assists),
                intercepciones : parseInt(req.body.interceptions),
                atajadas : parseInt(req.body.saves),
                penalesErrados : parseInt(req.body.failedPenalties),
                penalesAtajados : parseInt(req.body.savedPenalties),
                asistioAClase : Boolean(req.body.assistance),
                puntos : parseInt(req.body.points)
            }
        })
        return newStat
    }
}