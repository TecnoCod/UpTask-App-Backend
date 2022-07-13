import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Usuarios from "../models/Usuarios.js";
import { emailRegistro, emailRecuperarPassword } from "../helpers/email.js";

const registrar = async (req, res) => {
  // Evitar registros duplicados

  const { email } = req.body;
  const existeUsuarios = await Usuarios.findOne({ email });

  if (existeUsuarios) {
    const error = new Error("Usuario ya registrado");
    return res.status(404).json({ msg: error.message });
  }

  try {
    // generar token y guardarlo en la base de datos
    const usuario = new Usuarios(req.body);
    usuario.token = generarId();
    await usuario.save();
    // Enviar email de confirmacion
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    // Enviar respuesta
    res.json({
      msg: "Usuario registrado correctamente, Revisa tu Email para confirmar tu cuenta!",
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  // Comprobar si el usuario existe
  const { email, password } = req.body;
  const usuario = await Usuarios.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  // Comprobar si el usuario esta confirmado

  if (!usuario.confirmado) {
    const error = new Error("El usuario no esta confirmado");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar si el password es correcto
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("Password incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const validarToken = await Usuarios.findOne({ token });
  if (!validarToken) {
    const error = new Error("Token invalido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    validarToken.confirmado = true;
    validarToken.token = ""; // Eliminar el token al estar confirmado, es de un solo uso por seguridad
    await validarToken.save();
    res.json({ msg: "Usuario confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();

    // enviar email
    emailRecuperarPassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({ msg: "Se ha enviado un email" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuarios.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token invalido");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const usuario = await Usuarios.findOne({ token });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  try {
    usuario.password = password;
    usuario.token = "";
    await usuario.save();
    res.json({ msg: "Password actualizado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
