import { Router } from 'express';
const router = Router();

import { info, login, postUsuario } from '../controllers/login.controller.js';

router.post('/usuario', postUsuario);
router.post('/login', login);

router.use((req, res, next) => {
    if (req.session.login) {
      next();
    } else {
      res.sendStatus(401)
    }
});

router.get('/info', info);

export default router;
