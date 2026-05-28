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

const DefaultProfile = `ALTER TABLE user ADD COLUMN profile VARCHAR(255) DEFAULT 'default-avatar.png';`;
const Bio = `ALTER TABLE user ADD COLUMN bio VARCHAR(300)`;

async function BuatTableUser() {
  try {
    const [rows] = await connection.query("SHOW TABLES LIKE 'user'");
    if (rows.length > 0) {
      console.log('Table User sudah ada');
    } else {
      await connection.query(TableUser);
      console.log(`Tabel User berhasil dibuat`);
    }
  } catch (error) {
    console.error("Terjadi kesalahan sistem pada database (BuatTableUser): ", error);
  }
}

async function BuatColumnProfile(){
  try {
    const [rows] = await connection.query("SHOW COLUMNS FROM user LIKE 'profile'");
    if (rows.length > 0) {
      console.log('Column Profile sudah ada');
    } else {
      await connection.query(DefaultProfile);
      console.log('Column Profile berhasil dibuat');
    }
  } catch (error) {
    console.error("Terjadi kesalahan sistem pada database (BuatColumnProfile): ", error);
  }
}

async function BuatBio(){
  try {
    const [rows] = await connection.query("SHOW COLUMNS FROM user LIKE 'bio'");
    if (rows.length > 0) {
      console.log('Bio sudah ada');
    } else {
      await connection.query(Bio);
      console.log('Bio berhasil dibuat');
    }
  } catch (error) {
    console.error("Terjadi kesalahan sistem pada database (BuatBio): ", error);
  }
}

async function setupDatabase() {
  await BuatTableUser();
  await BuatColumnProfile();
  await BuatBio();
}

export default setupDatabase;