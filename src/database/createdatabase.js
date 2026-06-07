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
const TableCompany = `
  CREATE TABLE IF NOT EXISTS company (
    username VARCHAR(50) NOT NULL PRIMARY KEY,
    total_company INT NOT NULL DEFAULT 0,

    -- Company 1
    id_company_1 INT,
    name_company_1 VARCHAR(100) UNIQUE,
    description_company_1 VARCHAR(50),
    xp_company_1 INT DEFAULT 0,
    level_company_1 INT DEFAULT 0,
    balance_company_1 INT NOT NULL DEFAULT 0,
    total_karyawan_1 INT NOT NULL DEFAULT 0,

    -- Company 2
    id_company_2 INT,
    name_company_2 VARCHAR(100) UNIQUE,
    description_company_2 VARCHAR(50),
    xp_company_2 INT DEFAULT 0,
    level_company_2 INT DEFAULT 0,
    balance_company_2 INT NOT NULL DEFAULT 0,
    total_karyawan_2 INT NOT NULL DEFAULT 0,

    -- Company 3
    id_company_3 INT,
    name_company_3 VARCHAR(100) UNIQUE,
    description_company_3 VARCHAR(50),
    xp_company_3 INT DEFAULT 0,
    level_company_3 INT DEFAULT 0,
    balance_company_3 INT NOT NULL DEFAULT 0,
    total_karyawan_3 INT NOT NULL DEFAULT 0,

    -- Company 4
    id_company_4 INT,
    name_company_4 VARCHAR(100) UNIQUE,
    description_company_4 VARCHAR(50),
    xp_company_4 INT DEFAULT 0,
    level_company_4 INT DEFAULT 0,
    balance_company_4 INT NOT NULL DEFAULT 0,
    total_karyawan_4 INT NOT NULL DEFAULT 0,

    -- Company 5
    id_company_5 INT,
    name_company_5 VARCHAR(100) UNIQUE,
    description_company_5 VARCHAR(50),
    xp_company_5 INT DEFAULT 0,
    level_company_5 INT DEFAULT 0,
    balance_company_5 INT NOT NULL DEFAULT 0,
    total_karyawan_5 INT NOT NULL DEFAULT 0,

    -- Company 6
    id_company_6 INT,
    name_company_6 VARCHAR(100) UNIQUE,
    description_company_6 VARCHAR(50),
    xp_company_6 INT DEFAULT 0,
    level_company_6 INT DEFAULT 0,
    balance_company_6 INT NOT NULL DEFAULT 0,
    total_karyawan_6 INT NOT NULL DEFAULT 0,

    -- Company 7
    id_company_7 INT,
    name_company_7 VARCHAR(100) UNIQUE,
    description_company_7 VARCHAR(50),
    xp_company_7 INT DEFAULT 0,
    level_company_7 INT DEFAULT 0,
    balance_company_7 INT NOT NULL DEFAULT 0,
    total_karyawan_7 INT NOT NULL DEFAULT 0,

    -- Company 8
    id_company_8 INT,
    name_company_8 VARCHAR(100) UNIQUE,
    description_company_8 VARCHAR(50),
    xp_company_8 INT DEFAULT 0,
    level_company_8 INT DEFAULT 0,
    balance_company_8 INT NOT NULL DEFAULT 0,
    total_karyawan_8 INT NOT NULL DEFAULT 0,

    -- Company 9
    id_company_9 INT,
    name_company_9 VARCHAR(100) UNIQUE,
    description_company_9 VARCHAR(50),
    xp_company_9 INT DEFAULT 0,
    level_company_9 INT DEFAULT 0,
    balance_company_9 INT NOT NULL DEFAULT 0,
    total_karyawan_9 INT NOT NULL DEFAULT 0,

    -- Company 10
    id_company_10 INT,
    name_company_10 VARCHAR(100) UNIQUE,
    description_company_10 VARCHAR(50),
    xp_company_10 INT DEFAULT 0,
    level_company_10 INT DEFAULT 0,
    balance_company_10 INT NOT NULL DEFAULT 0,
    total_karyawan_10 INT NOT NULL DEFAULT 0
);
`;

const DefaultProfile = `ALTER TABLE user ADD COLUMN profile VARCHAR(255) DEFAULT 'default-avatar.png';`;
const Bio = `ALTER TABLE user ADD COLUMN bio VARCHAR(300)`;
const Balance = `ALTER TABLE user ADD COLUMN balance INT NOT NULL DEFAULT 0`;

async function BuatTableCompany() {
  try {
    const [rows] = await connection.query("SHOW TABLES LIKE 'company'");
    if (rows.length > 0) {
      console.log('Table Company sudah ada');
    } else {
      await connection.query(TableCompany);
      console.log(`Tabel Company berhasil dibuat`);
    }
  } catch (error) {
    console.error("Terjadi kesalahan sistem pada database (BuatTableCompany): ", error);
  }
}

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

async function BuatColumnProfile() {
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

async function BuatBio() {
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

async function BuatBalance(){
  try {
    const [rows] = await connection.query("SHOW COLUMNS FROM user LIKE 'balance'");
    if (rows.length > 0) {
      console.log('Balance sudah ada');
    } else {
      await connection.query(Balance);
      console.log("Balance berhasil dibuat");
    }
  } catch (error){
    console.error("Terjadi kesalahan sistem pada database (BuatBalance): ", error);
  }
}

async function setupDatabase() {
  await BuatTableUser();
  await BuatColumnProfile();
  await BuatBio();
  await BuatTableCompany();
  await BuatBalance();
}

export default setupDatabase;