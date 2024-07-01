import { existsSync, readdir, realpathSync, rename } from "fs";
import { PdfExtractor } from "pdf-extractor";
import { unlink } from 'fs';
import { getArquivoDb, getArquivoPath, getArquivosDb, getTagsDb, postArquivoDb, putArquivoDb } from '../data/arquivos.db.js';

export async function pdfService(id) {
  const data = await getArquivoPath(id);
  const { pdf } = data
  const resultadoBusca = { path: `uploads/${pdf}`, status: 404 };

  if (existsSync(resultadoBusca.path)) {
    resultadoBusca.path = realpathSync(resultadoBusca.path);
    resultadoBusca.status = 200;
  }

  console.debug(resultadoBusca);
  return resultadoBusca;
}

export function thumbnailService(id) {
  let path = `assets/imagens/thumbnails/thumb_${id}.png`;
  if (id === 'logo') path = 'assets/imagens/logo.png';

  const resultadoBusca = { path, status: 404 };

  if (existsSync(resultadoBusca.path)) {
    resultadoBusca.path = realpathSync(resultadoBusca.path);
    resultadoBusca.status = 200;
  }

  return resultadoBusca;
}

export async function getArquivosService() {
  return await getArquivosDb();
}

export async function getArquivoService(id) {
  const query = await getArquivoDb(id);
  return query[0];
}

export async function getTagsService() {
  const query = await getTagsDb();
  query.push({ id: -1 });
  return query;
}

export async function putArquivoService(nome, id) {
  await putArquivoDb(nome, id);
  return true;
}

export async function postArquivoService(nome, arquivo) {
  const id = await postArquivoDb(nome, arquivo);
  return id;
}

export async function createThumbnailService(file, id) {
  const outputDir = 'assets/imagens/thumbnails';
  const pdfExtractor = new PdfExtractor(outputDir, {
    viewportScale: (width, height) => {
      //dynamic zoom based on rendering a page to a fixed page size 
      if (width > height) {
        //landscape: 1100px wide
        return 1100 / width;
      }
      //portrait: 800px wide
      return 800 / width;
    },
    pageRange: [1, 1],
  });
  await pdfExtractor.parse(`uploads/${file}`);

  readdir(outputDir, async (err, assets) => {
    assets.forEach((asset) => {
      const [_, extensao] = asset.split(/(?=\.[^.]+$)/);
      if (asset === 'page-1.png')
        rename(`${outputDir}/${asset}`, `${outputDir}/thumb_${id}.png`, () => { });
      else if (extensao !== '.png') unlink(`${outputDir}/${asset}`, () => { });
    });
  });
}

export async function deleteFileService({ file, id }) {
  unlink(`uploads/${file}`, () => { });
  unlink(`assets/imagens/thumbnails/thumb_${id}.png`, () => { });
}