// Importar cliente prisma
import { PrismaClient } from '@prisma/client'

export class Database{
    constructor(){
        this.prisma = new PrismaClient()
        this.entities = {
            user: new User(this.prisma)
        }
    }
}

class User {
    constructor(prisma){
        this.prisma = prisma
    }

    async userHi(req , res , next){
        console.log("Metodo Usado: " + req.method) // solo metodos GET y PATCH para el usuario
        console.log("Header usados: ")
        console.log(req.headers)
        console.log("URL usada " + req.url)
        console.log("Query usada: ")
        console.log(req.query)
        console.log("Parametros usado: ")
        console.log(req.params)
        console.log("Body de la request")
        console.log(req.body)

        if (req.method != "GET") return res.send(await User.validateRecivedUser(req.body))
        else return res.send( await User.validateRecivedUser({email: req.headers.email , password: req.headers.password}))
    }

    static async validateRecivedUser(user){
        
        return "se ha validado el usuario: ".concat(user.username ?? user.email)
    }
}