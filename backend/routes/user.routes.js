const express = require("express");
const router = express.Router();
const usuarioCtrl = require("../controllers/user.controller");

router.post("/register", usuarioCtrl.registerUser);
router.get("/:id", usuarioCtrl.getUser);

module.exports = router;
