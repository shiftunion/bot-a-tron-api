import consign from 'consign';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import config from './config.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


mongoose.connect(process.env.MONGO_DB_URI);

app.use(bodyParser.urlencoded(config.bodyParser));
app.use(bodyParser.json());
app.use(compression());

consign(config.consign) // autoloads script an App onject
  .include('models')
  .then('routes')
  .into(app)
;

app.listen(config.server.port, () => {
  if (!config.isTest) {
    console.log('Express-Mongoose TODO API');
    console.log(`Address: ${config.server.host}:${config.server.port}`);
  }
});

export default app;
