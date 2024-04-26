import { Router } from "express";
import * as Controller from "../controllers/middlewares.controller.js"

export const router = Router()

const apiPath = "/api/"

// hacer alguna confirmación para proteger la api
router.use(apiPath , (req , res, next) => {console.log("middleware") ; next()})

router.get(apiPath , (req , res) => res.send("hi")) // bienvenida a la API

router.all(apiPath + "usuario" , Controller.userController)

router.get(apiPath + "equipo/:user" , (req , res) => {res.send("obtener a " + req.params.user)})
router.put(apiPath + "equipo/:user" , (req , res) => res.send("modificar a " + req.params.user))