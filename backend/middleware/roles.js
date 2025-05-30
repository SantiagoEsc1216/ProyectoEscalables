const permitirRol = (...rolesPermitidos) => {
    return (req, res, next) => {
      const usuario = req.user;
  
      if (!usuario) {
        return res.status(401).json({ mensaje: "Usuario no autenticado" });
      }
  
      if (!rolesPermitidos.includes(usuario.role)) {
        return res.status(403).json({ mensaje: "Acceso denegado: rol insuficiente" });
      }
  
      next();
    };
  };
  
  module.exports = permitirRol;