//import Validator from "../../domain/controllers/validator.controller.js"
import prisma from "../database.js"

class UsuarioModelo {   

    static async getUser(req) {
        return await prisma.usuario.findUnique({
            where: {
                ID: parseInt(req.params.id)
            },
            include : {
                Equipo : true
            }
        })
    }

    static async getAllUsers() { 
        return await prisma.usuario.findMany({})
    }

    static async deleteUser(req) {
        await prisma.usuario.delete({
            where: {
                ID: parseInt(req.params.id)
            }
        })
    }

    static async updateUser(req) {
        await prisma.usuario.update({
            where: {
                ID: parseInt(req.params.id)
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
    }

    static async login(req) {
        let { email, password } = req.body
//        const token = await Validator.createToken({ email : email })

        const user = await prisma.usuario.findFirst({
            where : {
                Mail : email,
                Contrase_a : password
            }
        })
        if (!user) { return "Usuario no encontrado"}

    }

    static async register(req) {
        let { nickname, teamname, email, password} = req.body
        await prisma.usuario.create({
            data : {
                Nickname: nickname,
                Contrase_a : password,
                Mail : email,
                Presupuesto : 100,
                Transferencias : 2,
                Wildcard : true,
                Equipo : {
                    create : {
                        NombreEquipo : teamname,
                        Puntuacion : 0
                    }
                }
            }
        })
    }
}

export default UsuarioModelo