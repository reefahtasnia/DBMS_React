import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { connection, run_query } from "./connection.js";
import oracledb from "oracledb";

dotenv.config();

const app = express();
const PORT = 5000;
const saltRounds = 10;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this if your frontend address changes
  })
);

app.get("/api", (req, res) => {
  res.send("API is working");
});

app.post("/api/signup", async (req, res) => {
  const { firstname, lastname, email, password, dob } = req.body;

  // Debug logs
  console.log("Received signup request with data:", req.body);

  let conn;
  try {
    // Open a new connection
    conn = await connection();

    // Check if user already exists
    const checkUserQuery = "SELECT * FROM Users WHERE email = :email";
    const result = await conn.execute(checkUserQuery, [email], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    if (result.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Insert new user
    const insertUserQuery = `
      INSERT INTO Users (firstname, lastname, email, date_of_birth)
      VALUES (:firstname, :lastname, :email, TO_DATE(:dob, 'YYYY-MM-DD'))
      RETURNING userid INTO :userid`;

    // Debug log for bind variables
    console.log("Insert User Bind Variables:", {
      firstname,
      lastname,
      email,
      dob
    });

    const userResult = await conn.execute(
      insertUserQuery,
      {
        firstname: firstname,
        lastname: lastname,
        email: email,
        dob: dob,
        userid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } // Correctly configured for RETURNING INTO usage
      },
      { autoCommit: false }
    );

    const userId = userResult.outBinds.userid[0];

    const hash = await bcrypt.hash(password, saltRounds);

    // Insert hashed password
    const insertPasswordQuery =
      "INSERT INTO Passwords (userid, hashed_password) VALUES (:userId, :hashedPassword)";
    
    // Debug log for password insertion
    console.log("Insert Password Bind Variables:", {
      userId,
      hashedPassword: hash
    });

    await conn.execute(
      insertPasswordQuery,
      { userId, hashedPassword: hash },
      { autoCommit: false }
    );

    // Commit the transaction
    await conn.commit();

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Close the connection
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResults = await run_query(
      "SELECT userid FROM users WHERE email = :email",
      { email }
    );

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userid = userResults[0][0]; // assuming userid is the first column in the SELECT
    console.log(userid);
    const passwordResult = await run_query(
      "SELECT hashed_password FROM passwords WHERE userid = :userid",
      { userid: userid }
    );

    if (passwordResult.length === 0 || !passwordResult[0][0]) {
      return res.status(404).json({ message: "Password not set for this user" });
    }
    console.log(passwordResult[0][0]);
    const hashed_password = passwordResult[0][0];
    const match = await bcrypt.compare(password, hashed_password);

    if (match) {
      res.status(201).json({
        message: "Login successful",
        userid
      });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Endpoint to search doctors based on location and department using run_query from connection.js
// Endpoint to search doctors based on location and department using run_query from connection.js
app.post('/api/search-doctors', async (req, res) => {
  const { location, department } = req.body;
  
  try {
    // Construct the query with placeholders for bind parameters
    const query = `
      SELECT * FROM doctors
      WHERE TRIM(LOWER(practiced_area)) = TRIM(LOWER(:location))
      AND TRIM(LOWER(department)) = TRIM(LOWER(:department))
    `;
    const params = {
      location: location,
      department: department
    };
    console.log(params);
    // Use run_query to execute the query with parameters
    const doctors = await run_query(query, params);
    console.log('Doctors:', doctors);
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found matching the criteria" });
    }

    res.status(200).json({
      message: "Doctors retrieved successfully",
      data: doctors
    });

  } catch (error) {
    console.error('Error during doctor search:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});


