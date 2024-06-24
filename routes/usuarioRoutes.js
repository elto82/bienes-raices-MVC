import { Router } from "express";
import {
  formularioLogin,
  formularioOlvidePassword,
  formularioRegistro,
  registrar,
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/olvidePassword", formularioOlvidePassword);

export default router;
