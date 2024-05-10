import { Router } from "express";
const router = Router();

import { teste } from "../controllers/teste.controller.js";

/* router.get((req, res, next) => {
  next();
}); */

// Rota GET para '/teste'
router.get("/aqui", teste);

export default router;
