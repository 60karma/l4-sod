const mysql2 = require('mysql2');
const connect = mysql2.createConnection({
  host: 'localhost',
  user:'root',
  password: 'password',
    database: 'glory_crud'
});
conn.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
    });
    module.exports = conn;
