import { Router } from "express";

export const AdminRouter = Router()

AdminRouter.get("/" , (req , res) => res.send("Ruta de admins bien pro, nashe nashe nasheeeee"))