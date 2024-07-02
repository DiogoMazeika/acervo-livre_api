import { existsSync, readdir, realpathSync, rename } from 'fs';
import { PdfExtractor } from 'pdf-extractor';
import { unlink } from 'fs';
import {
  getArquivoDb,
  getArquivoPath,
  getArquivosDb,
  getTagsDb,
  postArquivoDb,
  putArquivoDb,
} from '../data/arquivos.db.js';

export async function pdfService(id) {
  const data = await getArquivoPath(id);
  const { pdf } = data;
  const resultadoBusca = { path: `uploads/${pdf}`, status: 404 };

  if (existsSync(resultadoBusca.path)) {
    resultadoBusca.path = realpathSync(resultadoBusca.path);
    resultadoBusca.status = 200;
  }

  console.debug(resultadoBusca);
  return resultadoBusca;
}

export function thumbnailService(cd) {
  let path = `assets/imagens/thumbnails/thumb_${cd}.png`;

  if (cd === 'logo') path = 'assets/imagens/logo.png';

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
  const { id, nome, original, path, cd } = query[0];
  return { id, nome, file: { original, path, cd } };
}

export async function getTagsService() {
  const query = await getTagsDb();
  query.push({ id: -1 });
  return query;
}

export async function putArquivoService(
  id,
  nome,
  tags,
  { original, path, cd }
) {
  await putArquivoDb(id, nome, original, path, cd);

  const promises = [];

  if (Array.isArray(tags) && tags.length > 0) {
    tags.forEach((t) => {
      promises.push(t);
    });
  }

  return true;
}

export async function postArquivoService(nome, tags, { orginal, path, cd }) {
  const id = await postArquivoDb(nome, orginal, path, cd);

  const promises = [];

  if (Array.isArray(tags) && tags.length > 0) {
    tags.forEach((t) => {
      // { id, nome }
      promises.push(t);
    });
  }

  return id;
}

export async function createThumbnailService(path, cd) {
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
  await pdfExtractor.parse(`uploads/${path}`);

  readdir(outputDir, async (err, assets) => {
    assets.forEach((asset) => {
      const [_, extensao] = asset.split(/(?=\.[^.]+$)/);
      if (asset === 'page-1.png')
        rename(
          `${outputDir}/${asset}`,
          `${outputDir}/thumb_${cd}.png`,
          () => {}
        );
      else if (extensao !== '.png') unlink(`${outputDir}/${asset}`, () => {});
    });
  });
}

export async function deleteFileService({ path, cd }) {
  unlink(`uploads/${path}`, () => {});
  unlink(`assets/imagens/thumbnails/thumb_${cd}.png`, () => {});
}
