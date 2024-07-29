import express from 'express';
import bodyParser from 'body-parser';
import { router as userRouter } from './routers/user.router';

const app = express();
require('dotenv').config();

app.use(bodyParser.json());

app.use('/api/v1/user', userRouter);


export { app };
