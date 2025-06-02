const Food = require("../models/food.model");

exports.getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        console.log(foods);
        res.json(foods);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los alimentos", error: error.message });
    }
};
