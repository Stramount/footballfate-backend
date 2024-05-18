import { Router } from "express";
import { getAllPlayers } from "../../domain/controllers/player.controller.js";

const router = Router()

router.get("/players", getAllPlayers)