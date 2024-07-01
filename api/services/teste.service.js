import data from '../data/teste.db.js';

export async function testeService(){
    return await data();
}