import { Router } from "express";

export const router = Router()
const defaultPath = "/api/"

function getDocument(req , res , next){
    console.log(typeof req)
}

router.get(defaultPath, getDocument)