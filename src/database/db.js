import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
  user: "2n32FnfBzv4XyJi.root",
  password: "GdNOFr9wpqZnn3ml",
  database: "test", // Ganti ke database "test" agar aman dari sistem bawaan
  port: 4000,       // Tambahkan port 4000 khusus untuk TiDB Cloud
  ssl: {
    rejectUnauthorized: true // <-- BARIS INI WAJIB ADA AGAR TIDAK ERROR INSECURE TRANSPORT!
  }
});

try {
  await connection.query("SELECT 10");
  console.log("database connection success ...");
} catch (error) {
  console.log("connection failed : ", error);
}

export default connection;
