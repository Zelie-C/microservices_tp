import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';


let app = express();
app.use(cors());
app.use(bodyParser.json());

const port = parseInt(process.env.PORT as string);
const carUrl = process.env.CAR_API_URL!;

app.use('/car', createProxyMiddleware({ target: carUrl, changeOrigin: true }));


app.listen(port)