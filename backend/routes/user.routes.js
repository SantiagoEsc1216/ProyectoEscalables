const express = require("express");
const router = express.Router();
const usuarioCtrl = require("../controllers/user.controller");

router.post("/", usuarioCtrl.createUser);
router.get("/", usuarioCtrl.getUser);

module.exports = router;
