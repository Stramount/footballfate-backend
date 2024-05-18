import { Router } from "express"
import { deleteUsuario, getUsuario, login, register, updateUsuario } from "../../domain/controllers/user.controller.js"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/cuenta/:ID", getUsuario)
router.delete("/cuenta/:ID", deleteUsuario)
router.patch("/cuenta/:ID", updateUsuario)

export default router