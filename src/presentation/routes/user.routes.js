import { Router } from "express"
import { register } from "../../domain/controllers/user.controller.js"

const router = Router()

router.post("/register", register)

export default router