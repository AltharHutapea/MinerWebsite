import connection from './db.js';

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('free', 'admin_level_1', 'admin_level_2', 'admin_level_3') DEFAULT 'free',
    level INT DEFAULT 1
  );
`;

const seedAdminQuery = `
  INSERT IGNORE INTO user (id, username, password, role, level) 
  VALUES ('1', 'Althar', 'password123', 'admin_level_1', 10);
`;

async function setupDatabase() {
  try {
    // Jalankan kueri untuk memeriksa keberadaan tabel 'user'
    const [rows] = await connection.query("SHOW TABLES LIKE 'user'");

    // Kondisi IF: Jika tabel sudah ditemukan di database
    if (rows.length > 0) {
      console.log("database sudah dibuat");
    } 
    // Kondisi ELSE: Jika tabel belum ada, maka buat tabel baru dan isi data default
    else {
      // 1. Buat tabel baru
      await connection.query(createTableQuery);
      console.log("Tabel 'user' berhasil dibuat untuk pertama kali.");

      // 2. Masukkan data admin pertama
      await connection.query(seedAdminQuery);
      console.log("Data admin default berhasil ditambahkan.");
      
      console.log("Setup database selesai!");
    }
  } catch (error) {
    // Blok catch tetap dibutuhkan untuk mengantisipasi jika koneksi MySQL mati/error gawat lainnya
    console.error("Terjadi kesalahan sistem pada database: ", error);
  }
}
export default setupDatabase;