import Validator from "../src/controllers/validator.controller.js"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

const PRISMA = new PrismaClient()


async function log(req) {
    console.log("Metodo Usado: " + req.method)
    console.log("Header usados: ")
    console.log(req.headers)
    console.log("URL usada " + req.url)
    console.log("Query usada: ")
    console.log(req.query)
    console.log("Parametros usado: ")
    console.log(req.params)
    console.log("Body de la request")
    console.log(req.body)
    console.log("Cookies")
    console.log(req.cookies.token)
}


export class Account {
    static prisma = PRISMA

    static accounts = [
        {
            id: 2,
            email: "test@gmail.com",
            username: "testAccount",
            password: "test1234",
            teamname: "testTeam"
        }
    ]

    static async deleteAccount(req, res, next){
        await prisma.usuario.delete({
            where: {
                ID : parseInt(req.params.id)
            }
        })
        return "Se borro xD"
    }
   
    static async handleAccount(req , res , next){
        
        await log(req)
        
        if (req.url.match(/cuenta/)) {
            if (req.method == "GET") res.send(await Account.getAccount(req , res , next))
            else if (req.method == "DELETE") res.send(await Account.deleteAccount(req, res, next))
            else if (req.method == "PATCH") res.send(await Account.UpdateAccount(req , res , next))
            return
        }
        
        if (req.method == "POST" && req.url.match(/login/)) res.send(await Account.login(req , res , next))
        else if (req.method == "POST" && req.url.match(/register/)) res.send(await Account.register(req , res , next))
        else res.status(403).send("Metodo no permitido")
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



export class User {
    static prisma = PRISMA

    static users = {
        "testUser": {
            username: "testUser",
            teamname: "testTeam",
            email: "test@gmail.com"
        }
    }

    static async handleUser(req , res , next){
        
        await log(req)
        
        if (req.method == "GET") res.send(await User.getUser(req , res , next)) 
        else if (req.method == "PATCH") res.send(await User.updateUser(req , res , next))
        else res.status(403).send("Metodo no permitido")
    }

    static async getUser(req , res , next){
        if (req.params.user) return User.users[req.params.user]
        
        return User.users
    }

    static async updateUser(req , res , next){
        User.users[req.body.username] = req.body
        return User.users
    }
}

export class Team {
    static prisma = PRISMA

    static teams = {
        "testTeam": {
            name: "testTeam",
            players: ["testPlayer"]
        }
    }

    static async handleTeam(req , res , next){
        
        await log(req)
        
        if (req.method == "GET") res.send(await Team.getTeam(req , res , next)) 
        else if (req.method == "PATCH") res.send(await Team.updateTeam(req , res , next))
        else res.status(403).send("Metodo no permitido")
    }

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