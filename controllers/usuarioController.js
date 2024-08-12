import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
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
        csrfToken: req.csrfToken(),
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
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  // Extraer los datos
  const { email, password, nombre } = req.body;

  // Validación
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // Si hay errores
    return res.render("auth/olvidePassword", {
      pagina: "Olvide mi password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  //buscar el usuario
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/olvidePassword", {
      pagina: "Olvide mi password",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El email no pertenece a ningún usuario" }],
    });
  }
  //generar un token y enviar el email
  usuario.token = generarId();
  await usuario.save();

  //enviar el email
  emailOlvidePassword({
    email,
    nombre,
    token: usuario.token,
  });

  //renderizar el mensaje
  res.render("templates/mensaje", {
    pagina: "Reestablece tu password",
    mensaje: "Revisa tu email para reestablecer tu password",
  });
};
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmarCuenta", {
      pagina: "Reestablece tu password",
      mensaje: "Hubo un error al validar tu información, intenta de nuevo",
      error: true,
    });
  }
  //mostrar el formulario para reestablecer el password
  res.render("auth/resetPassword", {
    pagina: "Reestablece tu password",
    csrfToken: req.csrfToken(),
  });
};
const nuevoPassword = async (req, res) => {
  //validar el password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // Si hay errores
    return res.render("auth/resetPassword", {
      pagina: "Reestablece tu password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  //identificar quien hace el cambio
  const usuario = await Usuario.findOne({ where: { token } });
  //hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();

  res.render("auth/confirmarCuenta", {
    pagina: "Password Restablecido",
    mensaje: "Tu password se ha reestablecido correctamente",
  });
};

const autenticar = async (req, res) => {
  //validacion
  await check("email")
    .isEmail()
    .withMessage("El email es obligatorio")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("El password es obligatorio")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  //Verificar si el usuario existe
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no existe" }],
    });
  }

  //comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "Tú cuenta no ha sido confirmada" }],
    });
  }

  //Revisar el password
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "Password Incorrecto" }],
    });
  }

  //Autenticar al usuario
  const token = generarJWT(usuario.id);
  console.log(token);

  //Almacenar el token en una cookie
  return res
    .cookie("_token", token, {
      httpOnly: true,
      //secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })
    .redirect("/misPropiedades");
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticar,
};
