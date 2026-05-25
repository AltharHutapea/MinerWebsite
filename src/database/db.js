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
  await connection.query("SELECT 10");
  console.log("database connection success ...");
} catch (error) {
  console.log("connection failed : ", error);
}

export default connection;
