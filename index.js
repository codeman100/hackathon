const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Client } = require('pg');
const { Pool } = require('pg');

// const dbHost = process.env.DB_HOST;
// const dbUser = process.env.DB_USER;
// const dbPassword = process.env.DB_PASSWORD;
// const dbName = process.env.DB_DATABASE;
// const dbPort = process.env.DB_PORT;


const pool = new Pool({
    user: 'jhvnszuj',
    host: 'manny.db.elephantsql.com',
    database: 'jhvnszuj',
    password: '5N0OwGkPL7u3MTIcMxO3fJqo6saFBLZs',
    port: 5432, 
});

// Create Express app
const app = express();

const connectionString = 'postgres://jhvnszuj:5N0OwGkPL7u3MTIcMxO3fJqo6saFBLZs@manny.db.elephantsql.com/jhvnszuj';
const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect()
    .then(() => {
        console.log('Connected to ElephantSQL database');
    })
    .catch((err) => {
        console.error('Error connecting to ElephantSQL:', err);
    });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
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

    const SELECT_USER_QUERY = 'SELECT * FROM users WHERE email = $1';
    const INSERT_USER_QUERY = 'INSERT INTO users (email, name, password) VALUES ($1, $2, $3)';

    pool.query(SELECT_USER_QUERY, [email], async (err, results) => {
        if (err) {
            throw err;
        }

        if (results.rows.length > 0) {
            return res.send('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query(INSERT_USER_QUERY, [email, name, hashedPassword], (err, result) => {
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
    const { email, password } = req.body;

    const SELECT_USER_QUERY = 'SELECT * FROM users WHERE email = $1';

    pool.query(SELECT_USER_QUERY, [email], async (err, results) => {
        if (err) {
            throw err;
        }

        if (results.rows.length === 0) {
            return res.send('User not found');
        }

        const user = results.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.send('Invalid password');
        }

        // Assuming you have a 'welcome.ejs' file in your 'views' directory
        res.render('welcome.ejs', { name: user.name, email: user.email });
    });
});



process.on('SIGINT', () => {
    client.end();
    process.exit();
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
