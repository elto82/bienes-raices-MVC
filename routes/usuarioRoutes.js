import { Router } from "express";
import {
  comprobarToken,
  confirmar,
  formularioLogin,
  formularioOlvidePassword,
  formularioRegistro,
  nuevoPassword,
  registrar,
  resetPassword,
  autenticar,
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/login", formularioLogin);

router.post("/login", autenticar);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/confirmar/:token", confirmar);

router.get("/olvidePassword", formularioOlvidePassword);

router.post("/olvidePassword", resetPassword);
//almacena el nuevo password

router.get("/olvidePassword/:token", comprobarToken);

router.post("/olvidePassword/:token", nuevoPassword);

export default router;
