import { Precio, Categoria, Propiedad } from "../models/index.js";
import { Op } from "sequelize";

const inicio = async (req, res) => {
  const [precios, categorias, casas, departamentos] = await Promise.all([
    Precio.findAll({ raw: true }),
    Categoria.findAll({ raw: true }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 1,
      },
      include: [
        {
          model: Precio,
          as: "precio",
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 2,
      },
      include: [
        {
          model: Precio,
          as: "precio",
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
  ]);
  // console.log(categorias);

  res.render("inicio", {
    pagina: "Inicio",
    categorias,
    precios,
    casas,
    departamentos,
    csrfToken: req.csrfToken(),
  });
};
const categoria = async (req, res) => {
  const { id } = req.params;
  //comprobar que la categoria exista
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    return res.redirect("/404");
  }

  //obtener las propiedades de la categoria
  const propiedades = await Propiedad.findAll({
    where: {
      categoriaId: id,
    },
    include: [
      {
        model: Precio,
        as: "precio",
      },
    ],
  });

  res.render("categoria", {
    pagina: `${categoria.nombre} en venta`,
    categoria,
    propiedades,
    csrfToken: req.csrfToken(),
  });
};
const noEncontrado = (req, res) => {
  res.render("404", {
    pagina: "No encontrada",
    csrfToken: req.csrfToken(),
  });
};
const buscador = async (req, res) => {
  const { termino } = req.body;
  //validar que termino no este vacio
  if (!termino.trim()) {
    return res.redirect("back");
  }
  //consultar las propiedades
  const propiedades = await Propiedad.findAll({
    where: {
      titulo: {
        [Op.like]: "%" + termino + "%",
      },
    },
    include: [
      {
        model: Precio,
        as: "precio",
      },
    ],
  });
  res.render("busqueda", {
    pagina: "Resultados de la busqueda",
    propiedades,
    csrfToken: req.csrfToken(),
  });
};

export { inicio, categoria, noEncontrado, buscador };
