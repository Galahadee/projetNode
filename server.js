import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import MongoStore from 'connect-mongo';
import route from './routes/routes.js';
import session from 'express-session';
import mongoose from 'mongoose';
import flash from "connect-flash";

// ==========
// App initialization
// ==========

dotenv.config();
const { APP_HOSTNAME, APP_PORT, SESSION_SECRET, NODE_ENV,MONGO_STRING,MONGO_DB_NAME } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'pug');
app.locals.pretty = NODE_ENV !== 'production'; // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
app.use(session({
  name: 'NODEPROJECT_SESSION',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: `${MONGO_STRING}${MONGO_DB_NAME}` })
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash_success = req.flash("success");
  res.locals.flash_error=req.flash("error");
  next();
});


// ==========
// App routers
// ==========

app.use('/', route);

// ==========
// App start
// ==========
try {
  await mongoose.connect(`${MONGO_STRING}${MONGO_DB_NAME}`)
  console.log('✅ Connecté à la base MongoDB')
}
catch (err) {
  console.error('Erreur de connexion', err.message)
}

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
});
