import { Router } from 'express';
const router = Router();
import { upload } from '../../server.js';

import {
  deleteFile,
  getArquivo,
  getArquivos,
  getPdf,
  getTags,
  postArquivo,
  putArquivo,
  thumbnail,
  uploadFile,
} from '../controllers/arquivos.controller.js';

router.get('/thumbnail/:cd', thumbnail);
router.get('/pdf/:id', getPdf);

router.get('/arquivos', getArquivos);
router.get('/arquivo', getArquivo);
router.get('/tags', getTags);

router.put('/arquivo', putArquivo);

router.post('/arquivo', postArquivo);
router.post('/uploadFile', upload.single('file'), uploadFile);

router.delete('/deleteFile', deleteFile);

export default router;
