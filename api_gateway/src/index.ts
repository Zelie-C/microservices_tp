import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Sequelize } from 'sequelize';

import { UserModel } from './model/User';
import { TokenBlacklistModel } from './model/TokenBlackList';
import { userRouter } from './router/User';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/database.sqlite'
});

export const User = UserModel(sequelize)
export const TokenBlacklist = TokenBlacklistModel(sequelize)

let app = express();
app.use(cors());
app.use(bodyParser.json());

const port = parseInt(process.env.PORT as string);
const carUrl = process.env.CAR_API_URL!;


app.use('/car', createProxyMiddleware({ target: carUrl, changeOrigin: true }));
app.use('/user', userRouter);

app.listen(port)