import { Router } from "express";


export const router = Router()
const defaultPath = "/api/"


router.get(defaultPath + "jugadores/:param" , (req , res) => res.status(200).send(req.params.param))
router.get(defaultPath , (req , res) => res.send("hi"))