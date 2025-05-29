const Usuario = require("../models/user.model");

exports.createUser = async (req, res) => {
    try {
        const nuevoUsuario = new User(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
};
