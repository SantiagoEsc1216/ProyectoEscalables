const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader  = req.headers["authorization"];

  if (!authHeader ) {
    return res.status(403).json({ mensaje: "Token no proporcionado" });
  }

  const token = authHeader.split(' ')[1]; // Esto te da solo el token

  if (!token) {
    return res.status(403).json({ mensaje: "Token mal formado" });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
    //next();
};

module.exports = verificarToken;
