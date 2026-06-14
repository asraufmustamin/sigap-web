const mysql = require('mysql2/promise');

async function check() {
  const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sigap_db',
  });
  
  try {
    const [rows] = await db.query('DESCRIBE reports');
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

check();
