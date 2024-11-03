import { Router } from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadCortroller.js";
import protegerRuta from "../middleware/protegerRuta.js";

const router = Router();

router.get("/misPropiedades", protegerRuta, admin);
router.get("/propiedades/crear", crear);
router.post(
  "/propiedades/crear",
  body("titulo").notEmpty().withMessage("El titulo es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 50 })
    .withMessage("La descripción debe tener al menos 50 caracteres"),
  body("categoria").isNumeric().withMessage("Selecciona una categoría"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precios"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona la cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona la cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  body("lng").notEmpty().withMessage("Ubica la propiedad en el mapa"),

  guardar
);

export default router;
