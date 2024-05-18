import { Router } from "express";
import { createEstadistica } from "../../domain/controllers/stat.controller.js";


const router = Router()

router.post("/stat", createEstadistica)

