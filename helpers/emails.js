import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;

  // Enviar email
  await transport.sendMail({
    from: "Bienes Raices",
    to: email,
    subject: "Confirma tu cuenta en Bienes Raices",
    text: "Confirma tu cuenta en Bienes Raices",
    html: `<p>Hola ${nombre}, comprueba tu cuenta de Bienes Raices</p>
    <p>Accede al siguiente enlace para confirmar tu cuenta:
    <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirmar/${token}">Confirmar Cuenta</a></p>
    
    <p>Si no has solicitado esta cuenta, puedes ignorar este mensaje</p>
    `,
  });
};

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;

  // Enviar email
  await transport.sendMail({
    from: "Bienes Raices",
    to: email,
    subject: "Restablece tu password en Bienes Raices",
    text: "Restablece tu password en Bienes Raices",
    html: `<p>Hola ${nombre}, has solicitado restablecer tu password en Bienes Raices</p>
    <p>Sigue el siguiente enlace para generar un password nuevo:
    <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/olvidePassword/${token}">Restablecer Password</a></p>
    
    <p>Si tu no solicitaste el cambio de password, puedes ignorar este mensaje</p>
    `,
  });
};

export { emailRegistro, emailOlvidePassword };
