import { Router } from "express";

export const router = Router()

const defaultPath = "/"
const apiPath = "/api/"

// mensaje para la direccion localhost/8008/
router.get(defaultPath , (req , res) => res.send("Root"))

// hacer alguna confirmación para proteger la api
router.use(apiPath , (req , res, next) => next())

router.get(apiPath , (req , res) => res.send("hi")) // bienvenida a la API

// aqui defino un middleware para saber si hay un parametro despues de /jugadores
router.use(apiPath + "jugadores" , (req , res , next) => {
    //podriamos aprovechar y tener los datos preparados antes de pasar
    //al get


    // expresion regular, para enviarlo al get con PARAM o mantenerlo acá
   if(/\/.([^/]+)/.test(req.url) && req.method == "GET"){
       
       return next() // continuamos al router get
   }

   return res.send("Aqui los jugadores")
})

router.get(apiPath + "jugadores/:param",
          (req , res) => res.status(200).header("Content-Type" , "text/html").sendFile("../../DATA/htmlprueba.html" , {root: __dirname})) //solucionar este forbidden
