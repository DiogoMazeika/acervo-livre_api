import { Router } from 'express';
const router = Router();

import { teste } from '../controllers/teste.controller.js';

router.use((req, res, next) => {
  if (req.session.login) {
    next();
  } else {
    next();
    req.session.login = 'a';
    // res.send('atualize para logar !!');
  }
});

// Rota GET para '/teste'
router.get('/aqui', teste);

export default router;
