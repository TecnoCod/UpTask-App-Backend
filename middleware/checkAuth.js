import jwt from "jsonwebtoken";
import Usuario from "../models/Usuarios.js";

const checkAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRETA);
      req.usuario = await Usuario.findById(payload.id).select(
        "-password -confirmado -token -createdAt -updatedAt -__v"
      );

      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Hubo un Error" });
    }
  }

  if (!token) {
    const error = new Error("Token no Valido");
    return res.status(401).json({ msg: error.message });
  }
  next();
};
export default checkAuth;
