import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};
const registrar = async (req, res) => {
  // Extraer los datos
  const { email, password, nombre } = req.body;

  // Validación
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);
  await check("repetirPassword")
    .equals(req.body.password)
    .withMessage("Los passwords no son iguales")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // Si hay errores
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre,
        email,
      },
    });
  }

  // Verificar que el usuario no esté registrado
  try {
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.render("auth/registro", {
        pagina: "Crear Cuenta",
        errores: [{ msg: "El usuario ya está registrado" }],
        usuario: {
          nombre,
          email,
        },
      });
    }

    //almacenar el usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      token: generarId(),
    });

    // Enviar email de confirmación
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });

    // Redirigir o mostrar un mensaje de éxito
    res.render("templates/mensaje", {
      pagina: "Cuenta Creada Correctamente",
      mensaje:
        "Se ha registrado correctamente, revisa tu correo para confirmar tu cuenta",
    });
  } catch (error) {
    console.error(error);
    res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "Hubo un error, intenta nuevamente" }],
      usuario: {
        nombre,
        email,
      },
    });
  }
};

//confirmar cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;
  //verificar se el token es valido
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmarCuenta", {
      pagina: "Error al confirmar cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }
  //confirmar la cuenta del usuario
  try {
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    res.render("auth/confirmarCuenta", {
      pagina: "Cuenta Confirmada",
      mensaje: "La cuenta se ha confirmado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.render("auth/confirmarCuenta", {
      pagina: "Error al confirmar cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }
};
const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvidePassword", {
    pagina: "Olvide mi password",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
};
