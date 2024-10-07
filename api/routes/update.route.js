const express = require("express")
const { update } = require("../controllers/update.controller.js")
const { verifyToken } = require("../utils/verifyUser.js")

const router = express.Router()

router.post("/update/:id", verifyToken, update)

module.exports = router
