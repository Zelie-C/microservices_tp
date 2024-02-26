import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import "dotenv/config"
import { Sequelize } from 'sequelize';

const port = parseInt(process.env.PORT as string);
const database = process.env.DATABASE!
const username = process.env.USERNAME!
const password = process.env.PASSWORD!
const server = process.env.SERVER!
const url = process.env.API_URL!

import { CarModel } from './model/Car';
import { carRouter } from './router/Car';

export const sequelize = new Sequelize(database, username, password, {
  host: server,
  dialect: 'postgres',
  dialectOptions: {
    ssl: true,
  }
});

export const Car = CarModel(sequelize)

// sequelize.sync({ force: true });
sequelize.sync();

let app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/cars', carRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})