import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const identificarUsuario = async (req, res, nesxt) => {
  //identificar si hay un token en las cookies
  const { _token } = req.cookies;
  if (!_token) {
    req.usuario = null;
    return nesxt();
  }
  //comprobar el token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    const usuario = await Usuario.scope("eliminarPassword").findByPk(
      decoded.id
    );
    //si el usuario existe
    if (usuario) {
      req.usuario = usuario;
    }
    return nesxt();
  } catch (error) {
    console.log(error);
    return res.clearCookie("_token").redirect("/auth/login");
  }
};
export default identificarUsuario;
