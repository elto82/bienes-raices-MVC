import { Router } from "express";
import {
  formularioLogin,
  formularioOlvidePassword,
  formularioRegistro,
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);

router.get("/olvidePassword", formularioOlvidePassword);

export default router;
