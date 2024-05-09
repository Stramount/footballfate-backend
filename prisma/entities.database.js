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
        if (req.params.email) return Account.accounts[req.params.email]
        
        return Account.accounts
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
            Account.accounts.push(req.body)
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
                        Puntuacion: 0
                    }
                }
            }
        })
    
        return user

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

    static async getPlayer(req , res , next){
        if (req.params.player) return Player.players[req.params.player]
        
        return Player.players
    }

    static async updatePlayer(req , res , next){
        Player.players[req.body.name] = req.body
        return Player.players
    }
}