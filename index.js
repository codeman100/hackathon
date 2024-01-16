// Required modules
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Create Express app
const app = express();

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "jhonnydeep988141@",
    database: "code_spark"
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected');
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// app.set('language_page', __dirname + '/language_page');
app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'public')));


// Index page
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// DSA Page
app.get('/dsa_50', (req, res) => {
    res.render('dsa_50.ejs');
});


// Language Page
app.get('/languages', (req, res) => {
    res.render('languages.ejs');
});

app.get('/cpp', (req, res) => {
    res.render('language_page/cpp.ejs');
});

app.get('/c', (req, res) => {
    res.render('language_page/c.ejs');
});

app.get('/java', (req, res) => {
    res.render('language_page/java.ejs');
});

app.get('/javascript', (req, res) => {
    res.render('language_page/javascript.ejs');
});

app.get('/nodejs', (req, res) => {
    res.render('language_page/nodejs.ejs');
});

app.get('/python', (req, res) => {
    res.render('language_page/python.ejs');
});

app.get('/rust', (req, res) => {
    res.render('language_page/rust.ejs');
});

app.get('/sql', (req, res) => {
    res.render('language_page/sql.ejs');
});

app.get('/basic', (req, res) => {
    res.render('dsa/basic.ejs');
});

// Registration page
app.get('/register', (req, res) => {
    res.render('registration.ejs');
});

// Registration post request
app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;

    const SELECT_USER_QUERY = 'SELECT * FROM users WHERE email = ?';
    const INSERT_USER_QUERY = 'INSERT INTO users (email, name, password) VALUES (?, ?, ?)';

    // Check if the user already exists
    db.query(SELECT_USER_QUERY, [email], async (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            return res.send('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user if not already registered
        db.query(INSERT_USER_QUERY, [email, name, hashedPassword], (err, result) => {
            if (err) {
                res.send('Error registering user');
            } else {
                res.send('User registered successfully');
            }
        });
    });
});

// Login page
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

// Login post request
app.post('/login', async (req, res) => {
    // Login logic (verifying user credentials)
    const { email, password } = req.body;

    const SELECT_USER_QUERY = 'SELECT * FROM users WHERE email = ?';

    db.query(SELECT_USER_QUERY, [email], async (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length === 0) {
            return res.send('User not found');
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.send('Invalid password');
        }

        res.render('welcome.ejs', { name: user.name, email: user.email, password: user.password });
    });
});


// Forgot Password
const elasticEmailApiKey = '5911CC2BF23594D3F71D131A12F6C4706E29F81CE72216B3E93FB5258800F0F6738EC6E1966B46D8B287C1603DE270A1';

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password.ejs');
});

app.post('/forgot-password', async (req, res) => {
    const userEmail = req.body.email;

    db.query('SELECT * FROM users WHERE email = ?', [userEmail], async (err, results) => {
        if (err) {
            return res.status(500).send('Error finding user.');
        }

        if (results.length === 0) {
            return res.send('User not found. Please register.');
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const userId = results[0].id;

        db.query('UPDATE users SET reset_token = ? WHERE id = ?', [resetToken, userId], async (err) => {
            if (err) {
                return res.status(500).send('Error updating reset token.');
            }

            // Send the reset link to the user's email using Elastic Email API
            const resetLink = `http://localhost:3000/password-reset?token=${resetToken}`;
            try {
                const response = await axios.post('https://api.elasticemail.com/v2/email/send', {
                    apikey: '5911CC2BF23594D3F71D131A12F6C4706E29F81CE72216B3E93FB5258800F0F6738EC6E1966B46D8B287C1603DE270A1',
                    to: userEmail,
                    subject: 'Password Reset',
                    bodyText: `Click this link to reset your password: ${resetLink}`
                });

                console.log('Email sent:', response.data);
                res.send('Password reset link sent to your email.');
            } catch (error) {
                console.error('Error sending email:', error.response.data);
                res.status(500).send('Error sending email.');
            }
        });
    });
});

// App Reset

app.get('/password-reset', (req, res) => {
    const resetToken = req.query.token;
    res.render('password-reset', { token: resetToken });
});

app.post('/password-reset', (req, res) => {
    const resetToken = req.body.token;
    const newPassword = req.body.newPassword;

    db.query('UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?', [newPassword, resetToken], (err) => {
        if (err) {
            return res.status(500).send('Error updating password.');
        }

        res.send('Password updated successfully.');
    });
});

// Other routes and remaining code

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// f0875c05-8235-4384-acf7-8b8a04c43d74
// api key
// 330B83A50C7AEF2C8BA2BFA85E22A78D0C8763B9582097C6124686999E750EA76C3863437251953B1122047A8E0811B9
