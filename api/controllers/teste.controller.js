import { testeService } from '../services/teste.service.js';

export async function teste(req, res) {
  try {
    const data = await testeService();
    res.send(data);
  } catch (e) {
    console.debug(e);
    res.sendStatus(500); // 418 🍵
  }
}
