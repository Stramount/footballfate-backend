import { PrismaClient } from "@prisma/client";
import { Fecha } from "./prisma/entities.database";

let prisma = new PrismaClient()
let query_id = await Fecha.getFecha()

console.log(query_id)

console.log(await prisma.$queryRaw`SELECT e.ID , e.NombreEquipo , e.Puntuacion , e.ID_Usuario
                                   FROM Equipo e 
                                   inner join Equipo_Fecha ef 
                                   on e.ID = ef.ID_Equipo 
                                   inner join Fecha f
                                   on ef.ID_Fecha = f.ID
                                   inner join Equipo_Jugador ej
                                   on 
                                   where f.ID = 3`)