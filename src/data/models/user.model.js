import prisma from "../database.js"

class UsuarioModelo {

    static async findMany() {
        return prisma.usuario.findMany()
    }
}

export default UsuarioModelo