import { Router } from "express";
import { getEquipo, transferenciaEquipo, updateEquipo } from "../../domain/controllers/team.controller.js";


const router = Router()

router.get("/equipo/:ID", getEquipo)
router.patch("/equipo/:ID", updateEquipo)
router.patch("/equipo/:ID/IDTEAM", transferenciaEquipo)