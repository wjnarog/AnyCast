const express = require('express');
//const bodyParser = require('body-parser');
//const pgp = require('pg-promise')();
//require('dotenv').config();

const app = express();

app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: 'error', message: 'Incorrect username or password' });
    }

    req.session.user = user;
    req.session.save();

    res.redirect('/discover');
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


// app.get('/register', (req, res) => {
//   res.render('pages/register'); 
// });

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const values = [req.body.username, hashedPassword];

    console.log('Before database query');
    await db.query(query, values);
    console.log('After database query, ', values);

    res.json({ status: 'success', message: 'Registration successful' }); // Change this response as needed
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Registration failed: ' + error.message });
  }
});



//app.listen(3000);
module.exports = app.listen(3000);