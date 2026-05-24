import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connection from "./db.js";
import session from 'express-session';

const indexData = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

indexData.use(cors());

indexData.use(express.json());

indexData.use(session({
    secret: 'kunci-rahasia-miner-kamu',
    resave: false,
    saveUninitialized: true
}));

indexData.get('/', (req, res)=>{
    res.render(join(__dirname, '../../src/website/index.ejs'));
});

indexData.post('/prosesdata', async (req, res)=>{
    try {
        const { username, password } = req.body;
        const cekData = "SELECT * FROM user WHERE username = ? AND password = ?";
        const [rows] = await connection.query(cekData, [username, password]);
        if (rows.length > 0) {
            req.session.usernameTerlogin = rows[0].username; 
            res.json({ sukses: true });
        } else {
            res.json({ sukses: false, pesan: "Username atau Password kamu salah!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ sukses: false, pesan: "Terjadi error pada server"});
    };
});
indexData.get("/dashboard", (req, res) => {
    if (!req.session.usernameTerlogin) {
        return res.redirect('/');
    }
    res.render(join(__dirname, '../../src/website/dashboard.ejs'), {
        username: req.session.usernameTerlogin
    });
});

indexData.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Gagal hapus session:", err);
            return res.send("Gagal log out");
        }
        res.redirect('/');
    });
});

export default indexData;