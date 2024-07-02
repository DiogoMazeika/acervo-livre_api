import { loginService, postUsuarioService } from '../services/login.service.js';

export async function postUsuario(req, res) {
  try {
    const { nome, login, senha, senha2 } = req.body;

    await postUsuarioService(nome, login, senha, senha2);
    res.sendStatus(200);
  } catch (e) {
    console.debug(e);
    res.sendStatus(500);
  }
}

export async function login(req, res) {
  const { l, s } = req.body;

  const data = await loginService(l, s);

  if (data.ok) {
    req.session.login = data.l;
    res.send(data);
  }
  else res.sendStatus(418);
}

export async function info(req, res) {
  res.send(req.session.login);
}