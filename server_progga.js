const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { connection } = require('./connection'); // Adjust the path as needed

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// Endpoint to count total operations for a user
app.get('/api/medical-history/count-operations', async (req, res) => {
  let conn;
  try {
    conn = await connection();
    const result = await conn.execute(
      `SELECT COUNT(*) AS operation_count 
       FROM medical_history 
       WHERE LOWER(treatment) LIKE '%operation%'`
    );
    res.json(result.rows[0][0]); // Assuming result.rows[0][0] contains the count
  } catch (err) {
    console.error('Error fetching operation count:', err);
    res.status(500).send('Error fetching operation count');
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Endpoint to fetch medical history
app.get('/api/medical-history', async (req, res) => {
  let conn;
  try {
    conn = await connection();
    const result = await conn.execute('SELECT * FROM medical_history');
    res.json(result.rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Endpoint to add medical history
app.post('/api/medical-history', async (req, res) => {
  const medicalHistory = req.body;
  let conn;
  try {
    conn = await connection();
    const insertPromises = medicalHistory.map(entry =>
      conn.execute(
        'INSERT INTO medical_history (year, incident, treatment) VALUES (:year, :incident, :treatment)',
        [entry.year, entry.incident, entry.treatment],
        { autoCommit: true }
      )
    );
    await Promise.all(insertPromises);
    res.status(200).send('Data inserted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Endpoint to delete selected medical history rows
app.post('/api/medical-history/delete', async (req, res) => {
  const { rows } = req.body;
  let conn;

  try {
    conn = await connection();
    console.log('Rows to delete:', rows);
    const deletePromises = rows.map(row => 
      conn.execute(
        'DELETE FROM medical_history WHERE year = :year AND incident = :incident AND treatment = :treatment',
        [row.year, row.incident, row.treatment],
        { autoCommit: true }
      )
    );
    const results = await Promise.all(deletePromises);
    console.log('Delete results:', results); // Debugging output
    
    res.status(200).send('Data deleted successfully');
  } catch (err) {
    console.error('Error deleting data', err);
    res.status(500).send('Error deleting data');
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Endpoint to fetch all doctors or search doctors
app.get('/api/doctors', async (req, res) => {
  let conn;
  const searchQuery = req.query.search;
  let sql = 'SELECT * FROM doctor';
  let params = [];

  if (searchQuery) {
    sql += ` WHERE LOWER(name) LIKE :name OR LOWER(department) LIKE :department OR LOWER(location) LIKE :location`;
    const search = `%${searchQuery.toLowerCase()}%`;
    params = [search, search, search];
  }

  sql += ' ORDER BY experience DESC'; // Add ORDER BY clause to sort by experience in descending order

  try {
    conn = await connection();
    const result = await conn.execute(sql, params);
    console.log('Query result:', result);
    res.json(result.rows || []);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Error fetching data', error: err });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
