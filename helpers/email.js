import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // informacion del email
  const info = await transporter.sendMail({
    from: '"UpTask - Administrador de Proyectos" <administrador@uptask.com>',
    to: email,
    subject: "UpTask - Confirma tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola ${nombre}, para confirmar tu cuenta en <span>UpTask</span></p> 
    <p>haz click en el siguiente enlace:<a href="${process.env.FRONTEND}/confirmar/${token}">Comprobar Cuenta</a></p>
    
    <p>Si no has solicitado una cuenta en <span>UpTask</span>, ignora este mensaje.</p>`,
  });
};

export const emailRecuperarPassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // informacion del email
  const info = await transporter.sendMail({
    from: '"UpTask - Administrador de Proyectos" <administrador@uptask.com>',
    to: email,
    subject: "UpTask - Reestablecer contraseña",
    text: "Reestablecer contraseña",
    html: `<p>Hola ${nombre}, has solicitado restablecer tu contraseña <span>UpTask</span></p> 
    <p>haz click en el siguiente enlace:<a href="${process.env.FRONTEND}/olvide-password/${token}">Reestablecer Contraseña</a></p>
    
    <p>Si no has solicitado cambio de contraseña en <span>UpTask</span>, ignora este mensaje.</p>`,
  });
};
