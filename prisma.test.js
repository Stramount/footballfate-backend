import { PrismaClient } from "@prisma/client"

let prisma = new PrismaClient()

let hola = await prisma.$queryRaw`SELECT ID, fecha FROM Fecha order by ID desc LIMIT 1;`

console.log(hola.ID, hola.fecha)