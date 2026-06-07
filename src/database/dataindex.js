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
    saveUninitialized: true,
    cookie: { secure: false }
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
            req.session.profileTerlogin = rows[0].profile;
            req.session.idTerlogin = rows[0].id;
            req.session.usernameTerlogin = rows[0].username;
            req.session.passwordTerlogin = rows[0].password;
            req.session.emailTerlogin = rows[0].email;
            req.session.bioTerlogin = rows[0].bio;
            res.json({ sukses: true });
        } else {
            res.json({ sukses: false, pesan: "Username atau Password kamu salah!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ sukses: false, pesan: "Terjadi error pada server"});
    };
});

indexData.get("/dashboard", async (req, res) => {
    try {
        if (!req.session.usernameTerlogin) {
            return res.redirect('/');
        }

        const username = req.session.usernameTerlogin;

        // 1. Ambil baris data company milik user
        const [rows] = await connection.query("SELECT * FROM company WHERE username = ?", [username]);
        
        // 2. AMAT PENTING: Ambil baris pertama (rows[0]) jika data ada, jika tidak ada berikan objek kosong {}
        const dataPerusahaan = (rows && rows.length > 0) ? rows[0] : {};

        // 3. Render ke EJS dengan melempar dataPerusahaan ke variabel namaPerusahaan
        res.render(join(__dirname, '../../src/website/dashboard.ejs'), {
            profile: req.session.profileTerlogin,
            id: req.session.idTerlogin,
            username: username,
            password: req.session.passwordTerlogin,
            email: req.session.emailTerlogin,
            bio: req.session.bioTerlogin,
            namaPerusahaan: dataPerusahaan // Melempar objek baris pertama data database
        });

    } catch (error) {
        console.error("Error pada saat render dashboard:", error);
        res.status(500).send("Terjadi kesalahan internal pada server");
    }
});


indexData.post('/dashboard/api/nama-perusahaan', async (req, res) => {
    try {
        if (!req.session.usernameTerlogin) {
            return res.status(401).json({ sukses: false, pesan: "Silahkan login terlebih dahulu!" });
        }

        const username = req.session.usernameTerlogin;
        const { namaPerusahaan } = req.body;

        if (!namaPerusahaan) {
            return res.status(400).json({ sukses: false, pesan: "Nama perusahaan harus diisi!" });
        }

        // 1. Ambil data baris company milik user saat ini
        const [rows] = await connection.query("SELECT * FROM company WHERE username = ?", [username]);

        // ==========================================
        // LOGIKA PENGECEKAN DAN PEMOTONGAN BALANCE
        // ==========================================
        let totalSekarang = rows.length === 0 ? 0 : rows[0].total_company;
        const nomorPerusahaanBaru = totalSekarang + 1;
        const biayaPembuatan = nomorPerusahaanBaru === 1 ? 0 : nomorPerusahaanBaru;

        if (biayaPembuatan > 0) {
            const [rowsUser] = await connection.query("SELECT balance FROM user WHERE username = ?", [username]);
            
            if (rowsUser.length === 0) {
                return res.status(404).json({ sukses: false, pesan: "Data user tidak ditemukan!" });
            }

            const userBalance = rowsUser[0].balance;
            if (userBalance < biayaPembuatan) {
                return res.status(400).json({ 
                    sukses: false, 
                    pesan: `Saldo tidak cukup! Membuat perusahaan ke-${nomorPerusahaanBaru} memerlukan $${biayaPembuatan} balance.` 
                });
            }

            // Kurangi saldo balance milik user di tabel user
            await connection.query("UPDATE user SET balance = balance - ? WHERE username = ?", [biayaPembuatan, username]);
        }
        // ==========================================

        // 2. Jika baris data belum ada, isi ke slot 1 dengan nilai awal balance=0 dan karyawan=0
        if (rows.length === 0) {
            const queryInsertBaru = `
                INSERT INTO company (username, total_company, id_company_1, name_company_1, level_company_1, balance_company_1, total_karyawan_1) 
                VALUES (?, 1, 1, ?, 1, 0, 0)
            `;
            await connection.query(queryInsertBaru, [username, namaPerusahaan]);
            
            // Set session manual untuk company 1
            req.session.totalCompany = 1;
            req.session.id_company_1 = 1;
            req.session.name_company_1 = namaPerusahaan;
            req.session.level_company_1 = 1;
            req.session.balance_company_1 = 0;
            req.session.total_karyawan_1 = 0;

            return res.json({ sukses: true, pesan: "Perusahaan ke-1 berhasil dibuat secara gratis!" });
        }

        // Jika baris data sudah ada, baca datanya
        const comp = rows[0]; 

        if (totalSekarang >= 10) {
            return res.status(400).json({ sukses: false, pesan: "Gagal! Batas maksimal pembuatan 10 perusahaan telah tercapai." });
        }

        // 3. Pengecekan slot kosong manual memanjang menggunakan IF-ELSE (Nilai default diubah ke 0)
        if (!comp.name_company_1) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_1 = 1, name_company_1 = ?, level_company_1 = 1, balance_company_1 = 0, total_karyawan_1 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_1 = 1;
            req.session.name_company_1 = namaPerusahaan;
            req.session.level_company_1 = 1;
            req.session.balance_company_1 = 0;
            req.session.total_karyawan_1 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-1 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else if (!comp.name_company_2) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_2 = 2, name_company_2 = ?, level_company_2 = 1, balance_company_2 = 0, total_karyawan_2 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_2 = 2;
            req.session.name_company_2 = namaPerusahaan;
            req.session.level_company_2 = 1;
            req.session.balance_company_2 = 0;
            req.session.total_karyawan_2 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-2 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else if (!comp.name_company_3) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_3 = 3, name_company_3 = ?, level_company_3 = 1, balance_company_3 = 0, total_karyawan_3 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_3 = 3;
            req.session.name_company_3 = namaPerusahaan;
            req.session.level_company_3 = 1;
            req.session.balance_company_3 = 0;
            req.session.total_karyawan_3 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-3 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else if (!comp.name_company_4) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_4 = 4, name_company_4 = ?, level_company_4 = 1, balance_company_4 = 0, total_karyawan_4 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_4 = 4;
            req.session.name_company_4 = namaPerusahaan;
            req.session.level_company_4 = 1;
            req.session.balance_company_4 = 0;
            req.session.total_karyawan_4 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-4 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else if (!comp.name_company_5) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_5 = 5, name_company_5 = ?, level_company_5 = 1, balance_company_5 = 0, total_karyawan_5 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_5 = 5;
            req.session.name_company_5 = namaPerusahaan;
            req.session.level_company_5 = 1;
            req.session.balance_company_5 = 0;
            req.session.total_karyawan_5 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-5 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        }
                else if (!comp.name_company_6) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_6 = 6, name_company_6 = ?, level_company_6 = 1, balance_company_6 = 0, total_karyawan_6 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_6 = 6;
            req.session.name_company_6 = namaPerusahaan;
            req.session.level_company_6 = 1;
            req.session.balance_company_6 = 0;
            req.session.total_karyawan_6 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-6 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else if (!comp.name_company_7) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_7 = 7, name_company_7 = ?, level_company_7 = 1, balance_company_7 = 0, total_karyawan_7 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_7 = 7;
            req.session.name_company_7 = namaPerusahaan;
            req.session.level_company_7 = 1;
            req.session.balance_company_7 = 0;
            req.session.total_karyawan_7 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-7 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else if (!comp.name_company_8) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_8 = 8, name_company_8 = ?, level_company_8 = 1, balance_company_8 = 0, total_karyawan_8 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_8 = 8;
            req.session.name_company_8 = namaPerusahaan;
            req.session.level_company_8 = 1;
            req.session.balance_company_8 = 0;
            req.session.total_karyawan_8 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-8 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else if (!comp.name_company_9) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_9 = 9, name_company_9 = ?, level_company_9 = 1, balance_company_9 = 0, total_karyawan_9 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_9 = 9;
            req.session.name_company_9 = namaPerusahaan;
            req.session.level_company_9 = 1;
            req.session.balance_company_9 = 0;
            req.session.total_karyawan_9 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-9 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else if (!comp.name_company_10) {
            await connection.query("UPDATE company SET total_company = total_company + 1, id_company_10 = 10, name_company_10 = ?, level_company_10 = 1, balance_company_10 = 0, total_karyawan_10 = 0 WHERE username = ?", [namaPerusahaan, username]);
            req.session.totalCompany = totalSekarang + 1;
            req.session.id_company_10 = 10;
            req.session.name_company_10 = namaPerusahaan;
            req.session.level_company_10 = 1;
            req.session.balance_company_10 = 0;
            req.session.total_karyawan_10 = 0;
            return res.json({ sukses: true, pesan: `Perusahaan ke-10 berhasil dibuat! Saldo terpotong $${biayaPembuatan}.` });
        } 
        else {
            return res.status(400).json({ sukses: false, pesan: "Tidak ada slot kosong!" });
        }

    } catch (error) {
        console.log(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ sukses: false, pesan: "Nama perusahaan sudah terdaftar!" });
        }
        res.status(500).json({ sukses: false, pesan: "Terjadi error internal pada server" });
    }
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

indexData.get("/profile", (req, res) => {
    if (!req.session.usernameTerlogin) {
        return res.redirect('/');
    }
    res.render(join(__dirname, '../../src/website/profile.ejs'), {
        profile: req.session.profileTerlogin,
        id: req.session.idTerlogin,
        username: req.session.usernameTerlogin,
        password: req.session.passwordTerlogin,
        email: req.session.emailTerlogin,
        bio: req.session.bioTerlogin,
    });
});

indexData.post('/profile/api/bio', async (req, res) => {
    try {
        const { bio: InputBio } = req.body;
        const userId = req.session?.idTerlogin;
        if (!userId) {
            return res.status(401).json({ pesan: "Silakan login terlebih dahulu" });
        }

        if (!InputBio || InputBio.trim() === "") {
            return res.status(400).json({ pesan: "Bio tidak boleh kosong, silakan isi bio!" });
        }
        const CekDataBio = "SELECT bio FROM user WHERE id = ?";
        const MasukkanDataBio = "UPDATE user SET bio = ? WHERE id = ?";
        const [rows] = await connection.query(CekDataBio, [userId]);
        const bioLamaDiDatabase = rows.length > 0 ? rows[0].bio : "";
        if (InputBio === bioLamaDiDatabase) {
            return res.status(400).json({ pesan: "Bio gagal diupdate, silahkan ubah bio" });
        }
        const [result] = await connection.query(MasukkanDataBio, [InputBio, userId]);
        if (result.affectedRows > 0) {
            req.session.bioTerlogin = InputBio;

            return res.json({ pesan: "Bio berhasil diperbarui ke database!" });
        } else {
            console.error("Gagal memperbarui database: Tidak ada baris yang berubah");
            return res.status(500).json({ pesan: "Gagal memperbarui database" });
        }
    } catch (error) {
        console.error("Error Sistem:", error);
        return res.status(500).json({ pesan: "Terjadi kesalahan internal pada server" });
    }
});

indexData.post('/profile/api/email', async (req, res) => {
    try {
        const { email: InputEmail } = req.body;
        const userId = req.session?.idTerlogin;
        if (!userId) {
            return res.status(401).json({ pesan: "Silakan login terlebih dahulu" });
        }

        if (!InputEmail || InputEmail.trim() === "") {
            return res.status(400).json({ pesan: "Email tidak boleh kosong, silakan isi email dengan benar!" });
        }
        const CekDataEmail = "SELECT email FROM user WHERE id = ?";
        const MasukkanDataBio = "UPDATE user SET email = ? WHERE id = ?";
        const [rows] = await connection.query(CekDataEmail, [userId]);
        const emailLamaDiDatabase = rows.length > 0 ? rows[0].email : "";
        if (InputEmail === emailLamaDiDatabase) {
            return res.status(400).json({ pesan: "Email gagal diupdate, silahkan ubah Email" });
        }
        const [result] = await connection.query(MasukkanDataBio, [InputEmail, userId]);
        if (result.affectedRows > 0) {
            req.session.emailTerlogin = InputEmail;
            return res.json({ pesan: "Email berhasil diperbarui ke database!" });
        } else {
            console.error("Gagal memperbarui database: Tidak ada baris yang berubah");
            return res.status(500).json({ pesan: "Gagal memperbarui database" });
        }
    } catch (error) {
        console.error("Error Sistem:", error);
        return res.status(500).json({ pesan: "Terjadi kesalahan internal pada server" });
    }
});

indexData.post('/profile/api/password', async (req, res) => {
    try {
        // Menangkap data dari fetch frontend
        const { passwordLama, passwordBaru, passwordKonfirmasi } = req.body;
        const userId = req.session?.idTerlogin;
        
        if (!userId) {
            return res.status(401).json({ pesan: "Silakan login terlebih dahulu" });
        }

        // ==========================================
        // LOGIKA 3: Cek jika ada kolom yang kosong
        // ==========================================
        if (!passwordLama || !passwordBaru || !passwordKonfirmasi || 
            passwordLama.trim() === "" || passwordBaru.trim() === "" || passwordKonfirmasi.trim() === "") {
            return res.status(400).json({ pesan: "Kolom ada yang kosong, silahkan lengkapi" });
        }

        // Ambil password lama yang tersimpan di database saat ini
        const CekDataPassword = "SELECT password FROM user WHERE id = ?";
        const [rows] = await connection.query(CekDataPassword, [userId]);
        const passwordDiatabase = rows.length > 0 ? rows[0].password : "";

        // ==========================================
        // LOGIKA 1: Validasi password lama
        // ==========================================
        if (passwordLama !== passwordDiatabase) {
            return res.status(400).json({ pesan: "Password Lama yang Anda masukkin salah" });
        }

        // ==========================================
        // LOGIKA 2: Validasi kesamaan password baru & konfirmasi
        // ==========================================
        if (passwordBaru !== passwordKonfirmasi) {
            return res.status(400).json({ pesan: "Password tidak sama, silahkan ketik ulang" });
        }

        // ==========================================
        // LOGIKA 4: Jalankan UPDATE jika Logika 1-3 Berhasil
        // ==========================================
        const MasukkanDataPassword = "UPDATE user SET password = ? WHERE id = ?";
        const [result] = await connection.query(MasukkanDataPassword, [passwordBaru, userId]);

        if (result.affectedRows > 0) {
            // Update juga data session di server agar sinkron
            req.session.passwordTerlogin = passwordBaru;
            
            return res.json({ pesan: "Password berhasil diperbarui ke database!" });
        } else {
            return res.status(500).json({ pesan: "Gagal memperbarui database" });
        }

    } catch (error) {
        console.error("Error Sistem:", error);
        return res.status(500).json({ pesan: "Terjadi kesalahan internal pada server" });
    }
});

indexData.post('/profile/api/username', async (req, res) => {
    try {
        const { username: InputUsername } = req.body;
        const userId = req.session?.idTerlogin;
        if (!userId) {
            return res.status(401).json({ pesan: "Silakan login terlebih dahulu" });
        }

        if (!InputUsername || InputUsername.trim() === "") {
            return res.status(400).json({ pesan: "Username tidak boleh kosong, silakan isi Username!" });
        }
        const CekDataUsername = "SELECT username FROM user WHERE id = ?";
        const MasukkanDataUsername = "UPDATE user SET username = ? WHERE id = ?";
        const [rows] = await connection.query(CekDataUsername, [userId]);
        const usernameLamaDiDatabase = rows.length > 0 ? rows[0].bio : "";
        if (InputUsername === usernameLamaDiDatabase) {
            return res.status(400).json({ pesan: "Username gagal diupdate, silahkan ubah Username" });
        }
        const [result] = await connection.query(MasukkanDataUsername, [InputUsername, userId]);
        if (result.affectedRows > 0) {
            req.session.usernameTerlogin = InputUsername;

            return res.json({ pesan: "Username berhasil diperbarui ke database!" });
        } else {
            console.error("Gagal memperbarui database: Tidak ada baris yang berubah");
            return res.status(500).json({ pesan: "Gagal memperbarui database" });
        }
    } catch (error) {
        console.error("Error Sistem:", error);
        return res.status(500).json({ pesan: "Terjadi kesalahan internal pada server" });
    }
});

indexData.post('/profile/api/avatar-color', async (req, res) => {
    try {
        // Menangkap data 'color' (berisi hex seperti #3b82f6) dari fetch frontend
        const { color: InputColor } = req.body;
        const userId = req.session?.idTerlogin;

        if (!userId) {
            return res.status(401).json({ pesan: "Silakan login terlebih dahulu" });
        }

        // 1. DAFTAR PEMETAAN WARNA (HEX TO STRING NAME)
        // Disesuaikan persis dengan susunan value <option> di dropdown modal EJS Anda
        const petaWarna = {
            "#e94560": "red-muda",
            "#3b82f6": "blue",
            "#10b981": "green",
            "#f59e0b": "yellow",
            "#8b5cf6": "purple",
            "#ef4444": "red",
            "#ec4899": "pink",
            "#06b6d4": "cyan"
        };

        // 2. LOGIKA PENENTUAN NAMA FILE GAMBAR
        let namaFileAvatar = "default-avatar.png"; // Setelan default awal

        // Jika InputColor dikirim dari frontend dan kodenya terdaftar di petaWarna
        if (InputColor && petaWarna[InputColor]) {
            // PERBAIKAN: Spasi pada namaWarnaTeks sudah dihapus/disatukan agar tidak memicu SyntaxError
            const namaWarnaTeks = petaWarna[InputColor];
            namaFileAvatar = `${namaWarnaTeks}`;
        }

        // 3. KUERI SQL: Ambil data nama file avatar saat ini di database untuk pembanding
        const CekDataAvatar = "SELECT profile FROM user WHERE id = ?";
        const [rows] = await connection.query(CekDataAvatar, [userId]);
        const avatarLamaDiDatabase = rows.length > 0 ? rows[0].profile : "";

        // Jika nama file gambar baru ternyata sama dengan yang sudah tersimpan
        if (namaFileAvatar === avatarLamaDiDatabase) {
            return res.status(400).json({ pesan: "Warna avatar sudah sama, silakan pilih warna lain!" });
        }

        // 4. KUERI SQL UPDATE: Menyimpan nama file gambar (format .png) ke kolom 'profile' Anda
        const MasukkanWarnaAvatar = "UPDATE user SET profile = ? WHERE id = ?";
        const [result] = await connection.query(MasukkanWarnaAvatar, [namaFileAvatar, userId]);

        if (result.affectedRows > 0) {
            // Mengupdate data session dengan string nama file gambar terbaru
            req.session.profileTerlogin = namaFileAvatar;

            return res.json({ pesan: `Profile berhasil diubah menjadi ${namaFileAvatar}!` });
        } else {
            console.error("Gagal memperbarui database: Tidak ada baris yang berubah");
            return res.status(500).json({ pesan: "Gagal memperbarui avatar di database" });
        }

    } catch (error) {
        console.error("Error Sistem:", error);
        return res.status(500).json({ pesan: "Terjadi kesalahan internal pada server" });
    }
});


export default indexData;