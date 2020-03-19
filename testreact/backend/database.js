var mysql = require('mysql');
require('dotenv/config');

var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : 'memorial-site'
});
   
connection.connect((error) => {
  if (error) {
    console.log('Problem with database connection : ' + error.message);
  } else {
    console.log('Database connected!');
  }
});

module.exports = connection;