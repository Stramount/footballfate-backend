import Validator from "../src/controllers/validator.controller.js"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

async function crear_usuario(param){
    
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

    static async handleAccount(req , res , next){
        
        await log(req)
        
        if (req.url.match(/cuenta/)) {
            if (req.method == "GET") res.send(await Account.getAccount(req , res , next))
            else if (req.method == "PATCH") res.send(await Account.UpdateAccount(req , res , next))
        }
        
        if (req.method == "POST" && req.url.match(/login/)) res.send(await Account.login(req , res , next))
        else if (req.method == "POST" && req.url.match(/register/)) res.send(await Account.register(req , res , next))
        else res.status(403).send("Metodo no permitido")
    }

    static async getAccount(req , res , next){
        if (req.params.email) return Account.accounts[req.params.email]
        
        return Account.accounts
    }

    static async UpdateAccount(req , res , next){
        const id = parseInt(req.params.id)
        const accountFonud = Account.accounts.find(a => a.id === id)
        if (!accountFonud)
            return 'La cuenta no existe'
        Account.accounts[Account.accounts.indexOf(accountFonud)] = {
            ...req.body,
            id
        }
        return Account.accounts
    }

    static async login(req , res , next){
        let acc = Account.accounts[req.body.email]
        try {
            const token = await Validator.createToken({ email: req.body.email })
        } catch(e) {
            console.log(e)
        }
        res.cookie('token', token)
        if (acc && acc.password == req.body.password) return acc

        return "Usuario no encontrado"
    }

    static async register(req , res , next){
        if (Account.accounts.find(a => a.email === req.body.email)) return "Usuario ya registrado"
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
        
        return Account.accounts
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
        
        if (req.method == "GET") res.send(await Player.getPlayer(req , res , next)) 
        else if (req.method == "PATCH") res.send(await Player.updatePlayer(req , res , next))

        else res.status(403).send("Metodo no permitido")
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