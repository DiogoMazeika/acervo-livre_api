import { conn } from "../../server.js";

export default async function testeDb() {
  const [rows] = await conn.query(
    'SELECT * FROM arquivos LIMIT 100'
  );

  return rows;
}