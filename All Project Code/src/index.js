app.get('/welcome', (req, res) => {
    res.json({status: 'success', message: 'Welcome!'});
  });

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
  
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (!user) {
      return res.redirect('/register');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Incorrect username or password.');
    }

    req.session.user = user;
    req.session.save();

    res.redirect('/discover');
  } catch (error) {
    console.error(error);
    res.render('pages/login');
  }
});



app.listen(3000);
// module.exports = app.listen(3000);