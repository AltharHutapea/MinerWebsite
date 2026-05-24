import connection from "./db.js";

const cekData = `SELECT * from user`;
const testData1 = `
  INSERT IGNORE INTO user (username, password, role, level) 
  VALUES ('Asep', '123', 'admin_level_3', 160);
`;
const testData2 = `
  INSERT IGNORE INTO user (username, password, role, level) 
  VALUES ('Bocil', '123', 'admin_level_3', 1000);
`;
async function hasil(){
    try {
        await connection.query(testData1);
        await connection.query(testData2);
        const [rows] = await connection.query(cekData)
        console.log(rows);
    } catch (error) {
        console.log("Ini eror nya \n", error);
    }
};

export default hasil;