import { conn } from "../../server.js";

export async function postUsuarioDb(nome, login, senha) {
    const teste = await conn.query(
      `
      insert into usuarios (
        nome,
        login,
        senha
      )
      values (?, ?, ?)
      `, [nome, login, senha]
    );
  
    return teste[0].insertId
}

export async function usuarioDb(login) {
  const [rows] = await conn.query(
    `
    select * from usuarios
    where login = ?
    `, [login]
  );

  return rows[0];
}