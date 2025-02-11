require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./User.js');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.static(__dirname));


// Connessione MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // password di default per XAMPP
  database: 'userdb'
});

// Test della connessione
connection.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
  } else {
    console.log('Connesso al database con successo!');
  }
});

// Endpoint per il login
app.post('/api/login', async (req, res) => {
    console.log('Ricevuta richiesta di login:', req.body);
    const { email, password } = req.body;
    
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, results) => {
            if (err) {
                console.error('Errore database:', err);
                return res.status(500).json({ success: false, error: 'Errore del database' });
            }

            if (results.length === 0) {
                console.log('Email non trovata:', email);
                return res.status(401).json({ success: false, error: 'Email non trovata' });
            }

            try {
                const match = await bcrypt.compare(password, results[0].password);
                console.log('Risultato confronto password:', match);
                if (match) {
                    return res.json({ 
                        success: true,
                        email: results[0].email 
                    });
                } else {
                    return res.status(401).json({ success: false, error: 'Password non corretta' });
                }
            } catch (error) {
                console.error('Errore bcrypt:', error);
                return res.status(500).json({ success: false, error: 'Errore durante il login' });
            }
        }
    );
});

// Route per servire login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'));
});

// Route per servire login.js
app.get('/login.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/login.js'));
});

// Route per servire home.html
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Route per servire stylelogin.css
app.get('/stylelogin.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'stylelogin.css'));
});

// Route per ottenere i dati dell'utente
app.get('/api/user/data', (req, res) => {
    try {
        connection.query(
            'SELECT email FROM users WHERE email = ?',
            [req.query.email],
            (err, results) => {
                if (err) {
                    console.error('Errore database:', err);
                    return res.status(500).json({ error: 'Errore del database' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: 'Utente non trovato' });
                }

                res.json({
                    email: results[0].email,
                    currentDateTime: new Date().toLocaleString('it-IT')
                });
            }
        );
    } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
});

function registerUser(email, password, callback) {
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return callback({ error: 'Errore del database' });
        }
        
        if (results.length > 0) {
            return callback({ error: 'Email già registrata' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            connection.query(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email, hashedPassword],
                (err, results) => {
                    if (err) {
                        return callback({ error: 'Errore durante la registrazione' });
                    }
                    callback({ success: true, message: 'Registrazione completata' });
                }
            );
        } catch (error) {
            callback({ error: 'Errore durante la registrazione' });
        }
    });
}

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    registerUser(email, password, (result) => {
        if (result.error) {
            res.status(400).json({ error: result.error });
        } else {
            res.json({ success: true, message: result.message });
        }
    });
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});