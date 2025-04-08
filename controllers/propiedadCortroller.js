import { validationResult } from "express-validator";
import {
  Precio,
  Categoria,
  Propiedad,
  Mensaje,
  Usuario,
} from "../models/index.js";
import { unlink } from "node:fs/promises";
import { esVendedor, formatearFecha } from "../helpers/index.js";

const admin = async (req, res) => {
  //leer querystring
  const { pagina: paginaActual } = req.query;

  const expresion = /^[1-9]$/;

  if (!expresion.test(paginaActual)) {
    return res.redirect("/misPropiedades?pagina=1");
  }

  try {
    const { id } = req.usuario;
    //limites y offset para el paginador
    const limit = 4;
    const offset = paginaActual * limit - limit;

    const [propiedades, total] = await Promise.all([
      Propiedad.findAll({
        limit: limit, //limites
        offset: offset, //offset
        where: {
          usuarioId: id,
        },
        include: [
          {
            model: Categoria,
            as: "categoria",
          },
          {
            model: Precio,
            as: "precio",
          },
          {
            model: Mensaje,
            as: "mensajes",
          },
        ],
      }),
      Propiedad.count({
        where: {
          usuarioId: id,
        },
      }),
    ]);
    // console.log(propiedades);
    // console.log(total);

    res.render("propiedades/admin", {
      pagina: "Mis propiedades",
      propiedades,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total / limit),
      paginaActual: Number(paginaActual),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.log(error);
  }
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

const agregarImagen = async (req, res) => {
  const { id } = req.params;
  //validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/misPropiedades");
  }
  //validar que la propiedad no este publicada
  if (propiedad.publicado) {
    return res.redirect("/misPropiedades");
  }
  //validar que la propiedad pertenece a quien visita esta pagina
  // console.log(req.usuario.id );
  // console.log(propiedad.usuarioId);
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/misPropiedades");
  }

  res.render("propiedades/agregar-imagen", {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    propiedad,
    csrfToken: req.csrfToken(),
  });
};

const almacenarImagen = async (req, res, next) => {
  //almacenar imagen
  const { id } = req.params;
  //validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/misPropiedades");
  }
  //validar que la propiedad no este publicada
  if (propiedad.publicado) {
    return res.redirect("/misPropiedades");
  }

  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/misPropiedades");
  }

  try {
    // almacenar la imagen y publiacar propiedad
    propiedad.imagen = req.file.filename;
    propiedad.publicado = 1;
    await propiedad.save();

    next();
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  const { id } = req.params;
  //validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/misPropiedades");
  }
  //validar que la propiedad pertenece a quien visita esta pagina
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/misPropiedades");
  }
  //consultar modelo precio y categoria
  const [precios, categorias] = await Promise.all([
    Precio.findAll(),
    Categoria.findAll(),
  ]);

  res.render("propiedades/editar", {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad,
  });
};

const guardarCambios = async (req, res) => {
  //verificar la validacion
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    //consultar modelo precio y categoria
    const [precios, categorias] = await Promise.all([
      Precio.findAll(),
      Categoria.findAll(),
    ]);
    res.render("propiedades/editar", {
      pagina: "Editar Propiedades",
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }
  const { id } = req.params;
  //validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/misPropiedades");
  }
  //validar que la propiedad pertenece a quien visita esta pagina
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/misPropiedades");
  }

  //reescribir propiedad y actualizarla
  try {
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

    propiedad.set({
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
    });
    await propiedad.save();
    res.redirect("/misPropiedades");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;
  //validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/misPropiedades");
  }
  //validar que la propiedad pertenece a quien visita esta pagina
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/misPropiedades");
  }
  //eliminar la imagen asociada
  await unlink(`public/uploads/${propiedad.imagen}`);

  //eliminar la propiedad
  await propiedad.destroy();
  res.redirect("/misPropiedades");
};

//Muestra una propiedad
const mostrarPropiedad = async (req, res) => {
  const { id } = req.params;
  // console.log(req.usuario);
  //validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {
        model: Categoria,
        as: "categoria",
      },
      {
        model: Precio,
        as: "precio",
      },
    ],
  });
  if (!propiedad || !propiedad.publicado) {
    return res.redirect("/404");
  }

  res.render("propiedades/mostrar", {
    pagina: propiedad.titulo,
    propiedad,
    usuario: req.usuario,
    csrfToken: req.csrfToken(),
    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
  });
};

const enviarMensaje = async (req, res) => {
  const { id } = req.params;
  //validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {
        model: Categoria,
        as: "categoria",
      },
      {
        model: Precio,
        as: "precio",
      },
    ],
  });
  if (!propiedad || !propiedad.publicado) {
    return res.redirect("/404");
  }

  //renderizar los errores
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("propiedades/mostrar", {
      pagina: propiedad.titulo,
      propiedad,
      usuario: req.usuario,
      csrfToken: req.csrfToken(),
      esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
      errores: resultado.array(),
    });
  }

  const { mensaje } = req.body;
  const { id: propiedadId } = req.params;
  const { id: usuarioId } = req.usuario;

  //almacenar el mensaje
  await Mensaje.create({
    mensaje,
    propiedadId,
    usuarioId,
  });

  res.redirect("/");
};

//leer mensajes recibidos
const verMensajes = async (req, res) => {
  const { id } = req.params;
  //validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {
        model: Mensaje,
        as: "mensajes",
        include: [
          {
            model: Usuario.scope("eliminarPassword"),
            as: "usuario",
          },
        ],
      },
    ],
  });
  if (!propiedad) {
    return res.redirect("/misPropiedades");
  }
  //validar que la propiedad pertenece a quien visita esta pagina
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/misPropiedades");
  }
  res.render("propiedades/mensajes", {
    pagina: "Mensajes",
    mensajes: propiedad.mensajes,
    formatearFecha,
  });
};

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes,
};
