import express from "express";
import {
  registrar,
  autenticar,
  confirmar,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Autenticacion, registro y confirmacion de usuarios

router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/recuperar_password", recuperarPassword);
router
  .route("/recuperar_password/:token")
  .get(comprobarToken)
  .post(nuevoPassword);
router.get("/perfil", checkAuth, perfil);

export default router;
