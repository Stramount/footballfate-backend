import { Router } from "express";
import { AdminRouter } from "./admin.routes.js";
import mainController from "../controllers/main.controller.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

export const APIrouter = Router()

// hacer alguna confirmación para proteger la api
APIrouter.use("/admin" , AdminRouter)

APIrouter.use("/" , (req , res, next) => {
    console.log("middleware")
    next()
})

APIrouter.get("/", (req , res) => res.send("hi")) // bienvenida a la API

APIrouter.post("/auth/login", mainController.validator.validateSchema(loginSchema), mainController.database.entities.account.handleAccount) // router para login (POST)
APIrouter.post("/auth/register", mainController.validator.validateSchema(registerSchema), mainController.database.entities.account.handleAccount) // router para registro (POST)

APIrouter.all(["/cuenta" , "/cuenta/:id"], mainController.validator.validationToken, mainController.database.entities.account.handleAccount) // router para la cuenta (GET , PATCH)

APIrouter.all(["/usuario", "/usuario/:user"], mainController.validator.validationToken, mainController.database.entities.user.handleUser) // router para el usuario (GET , PATCH)

APIrouter.patch(["/equipo", "/equipo/:nombreEquipo"], mainController.validator.validationToken, mainController.database.entities.team.handleTeam) // leer un equipo o editarlo

APIrouter.get(["/equipo", "/equipo/:nombreEquipo"], mainController.database.entities.team.handleTeam) // leer un equipo o editarlo

APIrouter.patch(["/jugador", "/jugador/:name"], mainController.validator.validationToken, mainController.database.entities.player.handlePlayer) // leer un jugador o editarlo

APIrouter.get(["/jugador", "/jugador/:name"], mainController.database.entities.player.handlePlayer) // leer un jugador o editarlo

APIrouter.post(["/stat", "/stat/:nombreJugador"], mainController.database.entities.stat.handleStat)
