import express from 'express';
import session from 'express-session';
import { readdir } from 'fs';
import multer from 'multer';
import mysql from 'mysql2/promise';
import config from './config/default.js';
import env from './env.js';

export const conn = await mysql.createConnection(env.database);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now()}_${file.originalname.replace(
        /[^A-Z0-9_-\s()!@#$&.,]/gi,
        '_'
      )}`
    );
  },
});
export const upload = multer({ storage });

const {
  server: { port },
} = config;
const app = express();

app.use(
  session({
    secret: 'my-secret', // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified // TODO: comolidar?
    saveUninitialized: false, // don't create session until something stored
    cookie: {
      maxAge: 1000 * 60,
    },
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.get('/', (req, res) => {
  /* if (req.session.views) {
    req.session.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>');
    res.write('<p>expires in: ' + req.session.cookie.maxAge / 1000 + 's</p>');
    res.end();
  } else {
    req.session.views = 1;
    res.end('welcome to the session demo. refresh!');
  } */
  return res.send('funciona!');
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
