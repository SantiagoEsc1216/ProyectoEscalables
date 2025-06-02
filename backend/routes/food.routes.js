const express = require("express");
const router = express.Router();
const foodCtrl = require("../controllers/food.controller");

router.get("/", foodCtrl.getAllFoods); // GET /api/foods

module.exports = router;
