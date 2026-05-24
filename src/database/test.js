import connection from "./db.js";

const cekData = `SELECT * from user`;
const test1 = `
  INSERT INTO user (username, password, email, role) 
  VALUES ('Owner', '123', 'owner@gmail.com', 'owner' );
`;
const test2 = `
  INSERT INTO user (username, password, email, role) 
  VALUES ('Admin', '123', 'admin@gmail.com', 'admin' );
`;
const test3 = `
  INSERT INTO user (username, password, email, role) 
  VALUES ('Member', '123', 'member@gmail.com', 'member' );
`;
async function hasil(){
    try {
        await connection.query(test1);
        await connection.query(test2);
        await connection.query(test3);
        const [rows] = await connection.query(cekData)
        console.log(rows);
    } catch (error) {
        console.log("Ini eror nya \n", error);
    }
};

export default hasil;