import { Router } from "express";
import { AdminRouter } from "./admin.routes.js";
import mainController from "../controllers/main.controller.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";


export const APIrouter = Router()
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

// hacer alguna confirmación para proteger la api
APIrouter.use("/admin" , AdminRouter)

APIrouter.use("/" , (req , res, next) => {
    console.log("middleware")
    log(req)
    next()
})

APIrouter.get("/", (req , res) => res.send("hi")) // bienvenida a la API

APIrouter.post("/auth/login", mainController.validator.validateSchema(loginSchema), mainController.database.entities.account.login) // router para login (POST)
APIrouter.post("/auth/register", mainController.validator.validateSchema(registerSchema), mainController.database.entities.account.register) // router para registro (POST)

APIrouter.use(mainController.validator.validationToken)

APIrouter.get(["/cuenta" , "/cuenta/:ID"], mainController.database.entities.account.getAccount) // router para la cuenta (GET)
APIrouter.patch(["/cuenta/:ID"], mainController.database.entities.account.UpdateAccount) // router para la cuenta (PATCH)
APIrouter.delete(["/cuenta/:ID"], mainController.database.entities.account.deleteAccount) // router para la cuenta (DELETE)

APIrouter.get(["/equipo", "/equipo/:ID"], mainController.database.entities.team.getTeam) // leer un equipo
APIrouter.patch(["/equipo/:ID"], mainController.database.entities.team.updateTeam) // editar un equipo
APIrouter.post("/equipo" , mainController.database.entities.team.createTeam) //crea un equipo

APIrouter.post(["/stat", "/stat/:ID"], mainController.database.entities.stat.createStat) // crea stats de un jugador

APIrouter.get(["/jugador", "/jugador/:ID"], mainController.database.entities.player.getPlayers) // leer un jugador o editarlo
