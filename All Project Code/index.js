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
  bodyParser.urlencoded({
    extended: true,
  }),
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/home', async (req, res) => {
  let avatarImg = '/resources/img/ferret.png'; // Default avatar image
  if (req.session.user) {
      const username = req.session.user.username;
      const result = await db.oneOrNone('SELECT avatar FROM users_to_themes WHERE username = $1', [username]);
      if (result && result.avatar) {
          avatarImg = `/resources/img/${getBackgroundImage(result.avatar.toString())}.png`; 
      }
  }
  res.render('pages/home', { avatarImg });
});

app.get('/test', (req, res) => {
  res.render('pages/button_test');
});

app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/login', async (req, res) => {
  let avatarImg = '/resources/img/ferret.png'; // Default avatar image
  if (req.session.user) {
      const username = req.session.user.username;
      const result = await db.oneOrNone('SELECT avatar FROM users_to_themes WHERE username = $1', [username]);
      if (result && result.avatar) {
          avatarImg = `/resources/img/${getBackgroundImage(result.avatar.toString())}.png`; 
      }
  }
  res.render('pages/login', { avatarImg });
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


app.get('/register', async (req, res) => {
  let avatarImg = '/resources/img/ferret.png'; // Default avatar image
  if (req.session.user) {
      const username = req.session.user.username;
      const result = await db.oneOrNone('SELECT avatar FROM users_to_themes WHERE username = $1', [username]);
      if (result && result.avatar) {
          avatarImg = `/resources/img/${getBackgroundImage(result.avatar.toString())}.png`; 
      }
  }
  res.render('pages/register', { avatarImg });
});

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Insert the user
    const userQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    const userValues = [req.body.username, req.body.email, hashedPassword];
    await db.query(userQuery, userValues);

    // Insert a default theme
    const defaultTheme = 1;
    const themeQuery = 'INSERT INTO users_to_themes (username, avatar) VALUES ($1, $2)';
    await db.query(themeQuery, [req.body.username, defaultTheme]);

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.redirect('/register');
  }
});

app.get('/avatars', async (req, res) => {
  try {
      let avatarImg = '/resources/img/ferret.png';
      let avatarImgBackground = '/resources/img/ferret-background.png'; // Default avatar background image
      if (req.session.user) {
          const username = req.session.user.username;
          const result = await db.oneOrNone('SELECT avatar FROM users_to_themes WHERE username = $1', [username]);
          if (result && result.avatar) {
              avatarImg = `/resources/img/${getBackgroundImage(result.avatar.toString())}.png`;
              avatarImgBackground = `/resources/img/${getBackgroundImage(result.avatar.toString())}-background.png`
          }
      }
      res.render('pages/avatars', { avatarImg, avatarImgBackground });
  } catch (error) {
      console.error('Error:', error);
      res.redirect('/error');
  }
});

app.post('/avatars', async (req, res) => {
  try {
    // Check if the user is logged in
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const username = req.session.user.username; // Assuming the username is stored in the session
    const selectedAvatar = req.body.avatar;

    // Update the avatar in the database
    await db.query('UPDATE users_to_themes SET avatar = $1 WHERE username = $2', [selectedAvatar, username]);

    // Redirect back to the avatars page
    res.redirect('/avatars');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

function getBackgroundImage(avatarNumber) {
  const avatarMap = {
      '1': 'ferret',
      '2': 'buffalo',
      '3': 'iguana',
      '4': 'koala',
      '5': 'macaw',
      'default': 'ferret' 
  };
  return avatarMap[avatarNumber] || avatarMap['default'];
}

//app.listen(3000);
module.exports = app.listen(3000);