import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from "path/posix";
import productRouter from './src/route.js';
import connection from './src/database/db.js';
import setupDatabase from './src/database/createdatabase.js';
import hasil from './src/database/test.js'

const app = express();
const port = 1703;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());
setupDatabase();
hasil();
app.use(express.json()); 
app.use(express.static("src"));
app.use('/', productRouter);

app.listen(port, ()=>{
    console.log(`Server berjalan di port ${port}`)
}); 
