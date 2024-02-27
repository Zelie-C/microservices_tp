import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Sequelize } from 'sequelize';

import { UserModel } from './model/User';
import { TokenBlacklistModel } from './model/TokenBlackList';
import { userRouter } from './router/User';
import { authRouter } from './router/Auth';
import { verifyToken } from './middlewares/verifyToken';
import debug from 'debug';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/database.sqlite'
});

// sequelize.sync({ force: true });
sequelize.sync();

export const User = UserModel(sequelize)
export const TokenBlacklist = TokenBlacklistModel(sequelize)

let app = express();
app.use(cors());


const port = parseInt(process.env.PORT as string);
const carUrl = process.env.CAR_SERVICE_URL!;
const pythonServiceUrl = process.env.PYTHON_SERVICE_URL!;

const carOptions = {
    target: carUrl,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^\/cars': '/'
    },
}

const pythonOptions = {
    target: pythonServiceUrl,
    target: pythonServiceUrl,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^/pythonservices': '/'
    },
}

const carProxy = createProxyMiddleware(carOptions)
const pythonProxy = createProxyMiddleware(pythonOptions)

app.use('/cars', verifyToken, carProxy)
app.use('/pythonservices', verifyToken, pythonProxy)

app.use(express.json());

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.listen(port)