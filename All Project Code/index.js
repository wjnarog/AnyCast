const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
//const bcrypt = require('bcrypt');
//require('dotenv').config();

const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

const app = express();

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });

app.post('/login', async (req, res) => {
  
  try {
    // console.log(req.body);
    const { username, password } = req.body;
  
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (!user) {
      return res.status(401).json({status: 'error', message: 'User not found'});
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({status: 'error', message: 'Incorrect username or password'});
    }

    req.session.user = user;
    req.session.save();

    //res.redirect('');
    return res.status(200)
  } catch (error) {
    console.error(error);
    res.status(500).json({status: 'error', message: 'Internal Server Error'});
  }
});



//app.listen(3000);
module.exports = app.listen(3000);