import { PrismaClient } from "@prisma/client";
import { Fecha } from "./prisma/entities.database.js";

let prisma = new PrismaClient()
let query_id = await Fecha.getFecha()

console.log(query_id)



console.log(await prisma.$queryRaw`SELECT NombreEquipo, ID_Usuario
                                   FROM Equipo e 
                                   inner join Equipo_Fecha ef 
                                   on e.ID = ef.ID_Equipo 
                                   inner join Fecha f
                                   on ef.ID_Fecha = f.ID
                                   inner join Equipo_Jugador ej
                                   on e.ID = ej.ID_Equipo
                                   inner join Jugador j
                                   on ej.ID_Jugador = j.ID
                                   where f.ID = 1`)