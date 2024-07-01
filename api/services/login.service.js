import bcrypt from 'bcrypt';
const saltRounds = 10;

import { postUsuarioDb, usuarioDb } from '../data/usuario.db.js';

export async function postUsuarioService(nome, login, s) {
  const senha = await bcrypt.hash(`${s}_80085`, saltRounds);
  await postUsuarioDb(nome, login, senha);
}

export async function loginService(login, s) {
  const data = await usuarioDb(login);
  const { senha } = data;

  const s2 = await bcrypt.compare(`${s}_80085`, senha);

  if (s2) return { ok: true, l: login };
  return { ok: false };
}
