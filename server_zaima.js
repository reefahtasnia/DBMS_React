const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(cors());
app.use(bodyParser.json());

// Oracle DB Connection Configuration
const dbConfig = {
  user: 'system',
  password: 'zaima101',
  connectString: 'localhost:1521/ORCL'
};

// Fetch Products from Oracle DB
app.get('/api/products', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM products`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database Error');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Add product to cart
app.post('/api/cart', async (req, res) => {
  const { productId, title, price, quantity } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'INSERT INTO cart (productid, title, price, quantity) VALUES (:productId, :title, :price, :quantity)',
      { productId, title, price, quantity },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (err) {
    console.error('Error inserting into the cart table:', err);
    res.status(500).json({ error: 'Error inserting into the cart table' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Fetch Cart Data
app.get('/api/cart', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT * FROM cart');
    res.json(result.rows.map(row => ({
      productId: row[0],
      title: row[1],
      price: row[2],
      quantity: row[3],
    })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Database Error');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Remove Product from Cart
app.delete('/api/cart/:id', async (req, res) => {
  const productId = req.params.id;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM cart WHERE productid = :productId',
      { productId },
      { autoCommit: true }
    );
    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (err) {
    console.error('Error removing product from the cart table:', err);
    res.status(500).json({ error: 'Error removing product from the cart table' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Update Product Quantity in Cart
app.put('/api/cart/:id', async (req, res) => {
  const productId = req.params.id;
  const { change } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      'UPDATE cart SET quantity = quantity + :change WHERE productid = :productId',
      { change, productId },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).json({ error: 'Product not found in cart' });
    } else {
      res.status(200).json({ message: 'Product quantity updated successfully' });
    }
  } catch (err) {
    console.error('Error updating product quantity:', err);
    res.status(500).json({ error: 'Error updating product quantity' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
