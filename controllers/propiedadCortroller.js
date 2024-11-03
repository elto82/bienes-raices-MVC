import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
    barra: true,
  });
};

//formulario para crear una nueva propiedad
const crear = async (req, res) => {
  //consultar modelo precio y categoria
  const [precios, categorias] = await Promise.all([
    Precio.findAll(),
    Categoria.findAll(),
  ]);

  res.render("propiedades/crear", {
    pagina: "Crear Propiedades",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
  });
};

const guardar = async (req, res) => {
  //validacion
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //consultar modelo precio y categoria
    const [precios, categorias] = await Promise.all([
      Precio.findAll(),
      Categoria.findAll(),
    ]);
    return res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      barra: true,
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  //crear regirstro
  const {
    titulo,
    descripcion,
    habitaciones,
    estacionamiento,
    wc,
    calle,
    lat,
    lng,
    precio: precioId,
    categoria: categoriaId,
  } = req.body;

  const { id: usuarioId } = req.usuario;

  try {
    const propiedad = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
      usuarioId,
      imagen: "",
    });
    const { id } = propiedad;

    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export { admin, crear, guardar };
