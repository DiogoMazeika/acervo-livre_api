import {
  thumbnailService,
  getArquivoService,
  getArquivosService,
  getTagsService,
  postArquivoService,
  putArquivoService,
  createThumbnailService,
  deleteFileService,
  pdfService
} from '../services/arquivos.service.js';

export async function getPdf(req, res) {
  try {
    const { id } = req.params;
    const { path, status } = pdfService(id);
    if (status === 200) {
      res.type('application/pdf');
      res.sendFile(path);
    } else {
      res.sendStatus(status);
    }
  } catch (e) {
    res.sendStatus(500);
  }
}

export async function thumbnail(req, res) {
  try {
    const { id } = req.params;
    const { path, status } = thumbnailService(id);
    if (status === 200) {
      res.type("jpg");
      res.sendFile(path);
    } else {
      res.sendStatus(status);
    }
  } catch (e) {
    res.sendStatus(500);
  }
}

export async function getArquivos(req, res) {
  try {
    const data = await getArquivosService();
    res.send(data);
  } catch (e) {
    console.debug(e);
    res.sendStatus(500); // 418 🍵
  }
}

export async function getArquivo(req, res) {
  try {
    const { id } = req.query;
    const data = await getArquivoService(id);
    res.send(data);
  } catch (e) {
    console.debug(e);
    res.sendStatus(500); // 418 🍵
  }
}

export async function getTags(req, res) {
  try {
    const data = await getTagsService();
    res.send(data);
  } catch (e) {
    console.debug(e);
    res.sendStatus(500); // 418 🍵
  }
}

export async function putArquivo(req, res) {
  try {
    const { nome, id } = req.body;
    await putArquivoService(nome, id);
    res.sendStatus(200);
  } catch (e) {
    console.debug(e);
    res.sendStatus(500); // 418 🍵
  }
}

export async function postArquivo(req, res) {
  try {
    const { nome, arquivo } = req.body;
    const id = await postArquivoService(nome, arquivo);
    res.json({ id });
  } catch (e) {
    console.debug(e);
    res.sendStatus(500); // 418 🍵
  }
}

export async function uploadFile(req, res) {
  try {
    const { file } = res.req;
    const [id] = file.filename.split(/_(.+)/);
    await createThumbnailService(file.filename, id);
    res.send({ file: file.filename, id });
  } catch (e) {
    res.sendStatus(500); // 418 🍵
  }
}

export async function deleteFile(req, res) {
  try {
    const { file } = req.body;
    await deleteFileService(file);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500); // 418 🍵
  }
}
