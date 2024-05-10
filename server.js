import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import pg from 'pg';
import { readdir } from 'fs';

// import { port } from './config/default.json';
const port = 8080;
const app = express();

/* const pool = new pg.Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'seu_banco_de_dados',
  password: 'sua_senha',
  port: 5432,
}); */

app.use(
  session({
    secret: 'my-secret', // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
      maxAge: 1000,
    },
  })
);

/* app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
); */

app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>');
    res.write('<p>expires in: ' + req.session.cookie.maxAge / 1000 + 's</p>');
    res.end();
  } else {
    req.session.views = 1;
    res.end('welcome to the session demo. refresh!');
  }
  //   return res.send('funciona!');
});

readdir('./api/routes', async (err, files) => {
  const p = [];
  files.forEach((file) => {
    p.push(
      import(`./api/routes/${file}`).then((vl) => {
        app.use(`/api/${file.replace('.js', '')}`, vl.default);
      })
    );
  });

  await Promise.all(p);

  app.use((req, res) => {
    res.sendStatus(404);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
