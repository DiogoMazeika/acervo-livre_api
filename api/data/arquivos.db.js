import { conn } from '../../server.js';

export async function getArquivoPath(id) {
  const [rows] = await conn.query(
    `
    select
      path as pdf,
      cd_path as cd
    from arquivos
    where id = ?
    `,
    [id]
  );

  return rows[0];
}

export async function getArquivosDb(usuarioId) {
  const [rows] = await conn.query(
    `
    select
      id,
      nome,
      cd_path as cd
    from arquivos
    where (usuario_criador = ? or ? is null)
    `, [usuarioId, usuarioId]
  );

  return rows;
}

export async function getArquivoDb(id) {
  const [rows] = await conn.query(
    `
    select
      id,
      nome,
      nome_original as original,
      path,
      cd_path as cd
    from arquivos
    where id = ?
    `,
    [id]
  );

  return rows;
}

export async function getTagsDb() {
  const [rows] = await conn.query('select * from tags');

  return rows;
}

export async function putArquivoDb(id, nome, nomeOriginal, path, cdPath) {
  await conn.query(
    `
    update arquivos
    set nome = ?,
      nome_original = ?,
      path = ?,
      cd_path = ?
    where id = ?
    `,
    [nome, nomeOriginal, path, cdPath, id]
  );

  return true;
}

export async function postArquivoDb(nome, nomeOriginal, path, cdPath) {
  const teste = await conn.query(
    `
    insert into arquivos
    (
      nome,
      nome_original,
      path,
      cd_path,
      usuario_criador
    ) values (?, ?, ?, ?, ?)
    `,
    [nome, nomeOriginal, path, cdPath, 1]
  );

  return teste[0].insertId;
}

export async function postArquivoTagDb(arquivoId, tagId) {
  await conn.query(
    `
    insert into arquivo_tag (arquivo_id, tag_id)
    values (?, ?)
    `,
    [arquivoId, tagId]
  );
}
