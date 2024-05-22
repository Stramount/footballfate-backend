import { PrismaClient } from "@prisma/client"

let prisma = new PrismaClient()

let ID = await prisma.$queryRaw`SELECT ID FROM Fecha order by ID desc LIMIT 1;`

console.log(ID)