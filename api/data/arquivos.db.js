import { conn } from "../../server.js";

export async function getArquivoPath(id) {
  const [rows] = await conn.query(
    `
    select
      arquivo_path as pdf
    from arquivos
    where id = ?
    `, [id]
  );

  return rows[0];
}

export async function getArquivosDb() {
  const [rows] = await conn.query(
    'select * from arquivos'
  );

  return rows;
}

export async function getArquivoDb(id) {
  const [rows] = await conn.query(
    `
    select *
    from arquivos
    where id = ?
    `, [id]
  );

  return rows;
}

export async function getTagsDb() {
  const [rows] = await conn.query(
    'select * from tags'
  );

  return rows;
}

export async function putArquivoDb(nome, id) {
  await conn.query(
    `
    update arquivos
    set nome = ?
    where id = ?
    `, [nome, id]
  );

  return true;
}

export async function postArquivoDb(nome, arquivo) {
  const teste = await conn.query(
    `
    insert into arquivos (nome, arquivo_)
    values (?)
    `, [nome, arquivo]
  );

  return teste[0].insertId
}