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


// Other routes and remaining code

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// f0875c05-8235-4384-acf7-8b8a04c43d74
// api key
// 330B83A50C7AEF2C8BA2BFA85E22A78D0C8763B9582097C6124686999E750EA76C3863437251953B1122047A8E0811B9
