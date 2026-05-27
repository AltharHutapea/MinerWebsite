import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
  user: "2n32FnfBzv4XyJi.root",
  password: "GdNOFr9wpqZnn3ml",
  database: "db_minerwebsite",
  port: 4000, // DIUBAH: Menjadi angka tanpa tanda kutip
  // TAMBAHKAN KODE DI BAWAH INI
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

try {
  // 2. Buat database secara otomatis jika belum ada di server
  await connection.query("CREATE DATABASE IF NOT EXISTS db_minerwebsite");
  console.log("Database siap digunakan (sudah ada / baru dibuat).");

  // 3. Masuk dan gunakan database tersebut
  await connection.query("USE db_minerwebsite");

} catch (error) {
  console.log("Gagal menyiapkan database: ", error.message);
}

try {
  await connection.query("SELECT 10");
  console.log("database connection success ...");
} catch (error) {
  console.log("connection failed : ", error);
}

export default connection;
