const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'userdb'
});

// Funzione per creare un nuovo utente con password criptata
const createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
      connection.query(
        query,
        [userData.email, hashedPassword],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// Funzione per verificare le credenziali dell'utente
const verifyUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], async (err, results) => {
      if (err) reject(err);
      if (results.length === 0) resolve(null);
      
      const user = results[0];
      const isValid = await bcrypt.compare(password, user.password);
      resolve(isValid ? user : null);
    });
  });
};

// Funzione per ottenere un utente
const getUser = (req, res) => {
  const userId = req.params.id;
  
  const query = 'SELECT id, username, email FROM users WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Errore nel recupero utente:', err);
      return res.status(500).json({ error: 'Errore nel recupero utente' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json(results[0]);
  });
};

// Funzione per aggiornare un utente
const updateUser = (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;
  
  const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  connection.query(query, [username, email, userId], (err, results) => {
    if (err) {
      console.error('Errore nell\'aggiornamento utente:', err);
      return res.status(500).json({ error: 'Errore nell\'aggiornamento utente' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json({ message: 'Utente aggiornato con successo' });
  });
};

// Funzione per eliminare un utente
const deleteUser = (req, res) => {
  const userId = req.params.id;
  
  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Errore nell\'eliminazione utente:', err);
      return res.status(500).json({ error: 'Errore nell\'eliminazione utente' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json({ message: 'Utente eliminato con successo' });
  });
};

module.exports = {
  createUser,
  verifyUser,
  getUser,
  updateUser,
  deleteUser
};