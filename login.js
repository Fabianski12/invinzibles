const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userdb'
});

// Funzione per la registrazione
function registerUser(name, email, password, callback) {
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
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
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

// Funzione per il login
function loginUser(email, password, callback) {
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, results) => {
            if (err) {
                return callback({ error: 'Errore del database' });
            }

            if (results.length === 0) {
                return callback({ error: 'Email non trovata' });
            }

            try {
                const user = results[0];
                const match = await bcrypt.compare(password, user.password);
                
                if (match) {
                    callback({ 
                        success: true, 
                        message: 'Login effettuato',
                        email: user.email  // Aggiungiamo l'email alla risposta
                    });
                } else {
                    callback({ error: 'Password non corretta' });
                }
            } catch (error) {
                callback({ error: 'Errore durante il login' });
            }
        }
    );
}

// Funzione per gestire il login
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Salviamo sia l'email che lo stato del login
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userLoggedIn', 'true');
            alert('Login effettuato con successo!');
            window.location.replace('/home.html');
        } else {
            alert(data.error || 'Errore durante il login');
        }
    })
    .catch(error => {
        alert('Errore di connessione');
        console.error('Errore:', error);
    });
}

// Funzione per gestire la registrazione
function handleRegister() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registrazione completata con successo!');
            document.getElementById('registerForm').reset();
        } else {
            alert(data.error || 'Errore durante la registrazione');
        }
    })
    .catch(error => {
        alert('Errore di connessione');
        console.error('Errore:', error);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se l'utente è già loggato
    if (localStorage.getItem('userLoggedIn') === 'true') {
        window.location.replace('/home.html');
    }

    // Per la registrazione
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Per il login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

module.exports = {
    registerUser,
    loginUser
};

// Funzione per validare l'email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

function handleSignup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validazione base
    if (!validateEmail(email)) {
        alert('Inserisci un indirizzo email valido');
        return;
    }

    if (password !== confirmPassword) {
        alert('Le password non coincidono');
        return;
    }

    if (password.length < 6) {
        alert('La password deve contenere almeno 6 caratteri');
        return;
    }

    // Invio dati al server
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            email: email, 
            password: password 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registrazione completata con successo!');
            toggleForms(); // Torna al form di login
            document.getElementById('signupForm').reset();
        } else {
            alert(data.error || 'Errore durante la registrazione');
        }
    })
    .catch(error => {
        alert('Errore di connessione');
        console.error('Errore:', error);
    });
}


// Aggiungiamo anche una funzione per il logout
function handleLogout() {
    localStorage.removeItem('userEmail');
    localStorage.setItem('userLoggedIn', 'false');
    window.location.replace('/login.html');
}
