import { Router } from "express";

export const router = Router()

const apiPath = "/api/"

// hacer alguna confirmación para proteger la api
router.use(apiPath , (req , res, next) => {console.log("middleware") ; next()})

router.get(apiPath , (req , res) => res.send("hi")) // bienvenida a la API

router.all(apiPath + "cuenta" , (req , res) => res.send("todos los metodos para cuenta, post, get, put, delete, etc"))

router.get(apiPath + "equipo/:user" , (req , res) => res.send("obtener a " + req.params.user))
router.put(apiPath + "equipo/:user" , (req , res) => res.send("modificar a " + req.params.user))
