import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connection from './database/db.js';
import indexData from '../src/database/dataindex.js';
import cors from 'cors';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.use(cors());
router.use(express.json()); 
router.use(express.static("../src"));

router.use('/', indexData);

export default router;
