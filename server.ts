import { App } from './src/App';
import * as bodyParser from 'body-parser';
import env from 'dotenv';
import cors from 'cors';


import { Logger } from './src/middlewares/logger'
import { PointController } from './src/controllers/PointController';
import { UserController } from './src/controllers/UserController';

env.config();
const app = new App({
  port: parseInt(process.env.PORT || '5000', 10),
  controllers: [
    PointController,
    UserController
  ],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cors(),
    Logger,
  ]
});

app.listen();
