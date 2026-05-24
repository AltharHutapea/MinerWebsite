import connection from './db.js';

const TableUser = `
  CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(225) NOT NULL,
    role ENUM('member', 'admin', 'owner') DEFAULT 'member',
    level INT DEFAULT 0,
    xp INT DEFAULT 0
  );
`;

async function setupDatabase() {
  try {
    const [rows] = await connection.query("SHOW TABLES LIKE 'user'");
    if (rows.length > 0) {
      console.log('Table User sudah ada"');
    } else {
      await connection.query(TableUser);
      console.log(`Tabel User berhasil dibuat`);
    }
  } catch (error) {
    console.error("Terjadi kesalahan sistem pada database: ", error);
  }
}

export default setupDatabase; 