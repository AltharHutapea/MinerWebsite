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

indexData.post('/', async (req, res)=>{
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

indexData.get('/register', (req, res)=>{
    res.render(join(__dirname, '../../src/website/register.ejs')); 
});

indexData.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // PERBAIKAN 3: Gunakan OR, bukan AND untuk cek duplikat
        const cekData = "SELECT * FROM user WHERE username = ? OR email = ?";
        const masukData = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
        
        const [rows] = await connection.query(cekData, [username, email]);
        
        if (rows.length > 0 ){
            req.session.usernameterdata = rows[0].username;
            req.session.emailterdata = rows[0].email;
            return res.json({sukses: false, pesan: "Username atau email sudah terdaftar"});
        } else {
            // PERBAIKAN 2 & 4: Jalankan query dulu, baru kirim SATU respon saja
            await connection.query(masukData, [username, email, password]);
            return res.json({sukses: true, pesan: "Pendaftaran berhasil!"});
        };
    } catch (error) { // PERBAIKAN 2: Typo nama variabel error
        console.log(error);
        res.status(500).json({ sukses: false, pesan: "Terjadi error pada server"});
    }
});
export default indexData;