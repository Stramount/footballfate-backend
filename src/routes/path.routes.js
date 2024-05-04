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

APIrouter.all(["/usuario", "/usuario/:user"], mainController.database.entities.user.userHi) // router para la cuenta (GET , PATCH , PUT , DELETE)

APIrouter.get(["/equipo", "/equipo/:nombreEquipo"], (req , res) => {res.send("obtener a el equipo de alguien")}) // leer un equipo
APIrouter.patch(["/equipo", "/equipo/:nombreEquipo"], (req , res) => {res.send("modificar un equipo")})

APIrouter.get(["/jugador", "/jugador/:name"] , (req , res) => {res.send("Obtener 1 o más jugadores y sus estadisticas")})
APIrouter.patch("/jugador/:name" , (req , res) => {res.send("Sumar a su ultima estadistica, una transferencia")})