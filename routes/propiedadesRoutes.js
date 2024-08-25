import { Router } from "express";
import { admin, crear } from "../controllers/propiedadCortroller.js";

const router = Router();

router.get("/misPropiedades", admin);
router.get("/propiedades/crear", crear);

export default router;
