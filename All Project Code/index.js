const express = require('express');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
//
const bcrypt = require('bcrypt');
const path = require('path');
const axios = require('axios');

const app = express();
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

app.set('views', path.join(__dirname, 'src', 'views'));
app.use('/resources', express.static(path.join(__dirname, 'src', 'resources')));
app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json());




app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {

  res.render('pages/home');
});

app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/login', (req,res) => {
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    const hash = await bcrypt.hash(password, 10);

    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1;', username);
    if (!user) {
      console.log("User does NOT exist");
      return res.redirect('/register');
      //return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    //May not be encrypting and comparing password (only comparing)
    // console.log("Before Bcrypt comparison");
    // console.log("Hashed Password:", hash);
    // console.log("User.password:", user.password);
    const match = await bcrypt.compare(password , user.password);
    // console.log("Match:", match);
    if (!match) {
      console.log("Incorrect Pass");
      throw new Error('Incorrect username or password.');
      //return res.status(401).json({ status: 'error', message: 'Incorrect username or password' });
    }
    //console.log("After Bcrypt comparison");

    req.session.user = user;
    req.session.save();
    
    console.log("successfully logged in");
    res.redirect('/home');
    //return res.status(200).json({ status: 'success', message: 'Successfully Logged In'});
  } catch (error) {
    console.log('ERROR');
    res.render('pages/login');
    //res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


app.get('/register', (req, res) => {
  res.render('pages/register'); 
});

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    const values = [req.body.username, req.body.email, hashedPassword];

    console.log('Before database query');
    await db.query(query, values);
    console.log('After database query, ', values);

    res.redirect('/login');
    //res.status(200).json({ status: 'success', message: 'Registration successful' }); // Change this response as needed
  } catch (error) {
    console.error(error);
    res.redirect('/register');
    //res.status(500).json({ status: 'error', message: 'Registration failed: ' + error.message });
  }
});

app.get('/avatars', (req,res) => {
  res.render('pages/avatars');
});

// app.post('/avatars', async (req, res) => {
//   try {
//     // Check if the user is logged in
//     const user = req.session.user;
//     if (!user) {
//       return res.status(401).json({ status: 'error', message: 'Unauthorized' });
//     }

//     // Get the selected avatar value from the request body
//     const selectedAvatar = req.body.avatar;

//     // Save the selected avatar to the database (assuming you have a users_to_themes table)
//     await db.none('INSERT INTO users_to_themes (username, avatar) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET avatar = $2', [user.username, selectedAvatar]);

//     res.status(200).json({ status: 'success', message: 'Avatar saved successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });



//app.listen(3000);
module.exports = app.listen(3000);