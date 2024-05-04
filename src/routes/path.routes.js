import { Router } from "express";
import { AdminRouter } from "./admin.routes.js";
import mainController from "../controllers/main.controller.js";

export const APIrouter = Router()


// hacer alguna confirmación para proteger la api
APIrouter.use("/admin" , AdminRouter)

APIrouter.use("/" , (req , res, next) => {
    console.log("middleware")
    next()
})

APIrouter.get("/", (req , res) => res.send("hi")) // bienvenida a la API

APIrouter.post("/auth/login" , mainController.database.entities.account.handleAccount) // router para login (POST)
APIrouter.post("/auth/register" , mainController.database.entities.account.handleAccount) // router para registro (POST)

APIrouter.all(["/cuenta" , "/cuenta/:email"] , mainController.database.entities.account.handleAccount) // router para la cuenta (GET , PATCH)

APIrouter.all(["/usuario", "/usuario/:user"], mainController.database.entities.user.handleUser) // router para el usuario (GET , PATCH)

APIrouter.all(["/equipo", "/equipo/:nombreEquipo"], mainController.database.entities.team.handleTeam) // leer un equipo o editarlo

APIrouter.all(["/jugador", "/jugador/:name"] , mainController.database.entities.player.handlePlayer) // leer un jugador o editarlo
