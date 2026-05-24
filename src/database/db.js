import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_minerwebsite",
});

try {
  await connection.query("SELECT 10");
  console.log("database connection success ...");
} catch (error) {
  console.log("connection failed : ", error);
}

export default connection; 