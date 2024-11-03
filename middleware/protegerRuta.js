import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

const protegerRuta = async (req, res, next) => {
  // console.log("desde middleware");
  // console.log(req.cookies._token);
  //verificar si hay un token
  const { _token } = req.cookies;
  if (!_token) {
    return res.redirect("/auth/login");
  }

  //comprobar el token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    // console.log(decoded);
    const usuario = await Usuario.scope("eliminarPassword").findByPk(
      decoded.id
    );
    // console.log(usuario.id);
    //almacenar el usuario al req
    if (usuario) {
      req.usuario = usuario;
      // console.log(req.usuario.id);
    } else {
      return res.redirect("/auth/login");
    }
    return next();
  } catch (error) {
    return res.clearCookie("_token").redirect("/auth/login");
  }
};

export default protegerRuta;
