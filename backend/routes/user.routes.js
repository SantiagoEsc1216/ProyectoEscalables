const express = require("express");
const router = express.Router();
const usuarioCtrl = require("../controllers/user.controller");


router.post("/register", usuarioCtrl.registerUser);
router.post("/login", usuarioCtrl.loginUser);
router.get("/:id", usuarioCtrl.getUser);

module.exports = router;
