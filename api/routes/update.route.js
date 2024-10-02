import express from "express"
import { update } from "../controllers/update.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/update/:id", verifyToken, update)

export default router
