const Usuario = require("../models/user.model");
const Counter = require("../models/counter.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findOne({id: id});
  
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener el usuario", error: error.message });
    }
  };

  exports.registerUser = async (req, res) => {
    try {
      // Obtener el siguiente número de ID
      let counter = await Counter.findOneAndUpdate(
        { model: "User" },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  
      const nuevoUsuario = new Usuario({
        id: counter.count,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
      });
  
      await nuevoUsuario.save();
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al registrar usuario", error: error.message });
    }
  };

  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
  
      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) {
        return res.status(401).json({ mensaje: "Contraseña incorrecta" });
      }
  

      const payload = {
        id: usuario.id,
        role: usuario.role,
        email: usuario.email
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h" 
      });
  
      res.json({
        mensaje: "Login exitoso",
        token,
        usuario: {
          id: usuario.id,
          name: usuario.name,
          role: usuario.role,
          email: usuario.email
        }
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
    }
  };