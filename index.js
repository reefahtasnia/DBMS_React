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
      VALUES (UPPER(:firstname), UPPER(:lastname), UPPER(:email), TO_DATE(:dob, 'YYYY-MM-DD'))
      RETURNING userid INTO :userid`;

    // Debug log for bind variables
    console.log("Insert User Bind Variables:", {
      firstname,
      lastname,
      email,
      dob,
    });

    const userResult = await conn.execute(
      insertUserQuery,
      {
        firstname: firstname,
        lastname: lastname,
        email: email,
        dob: dob,
        userid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, // Correctly configured for RETURNING INTO usage
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
      hashedPassword: hash,
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
      "SELECT userid FROM users WHERE email = UPPER(:email)",
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
      return res
        .status(404)
        .json({ message: "Password not set for this user" });
    }
    console.log(passwordResult[0][0]);
    const hashed_password = passwordResult[0][0];
    const match = await bcrypt.compare(password, hashed_password);

    if (match) {
      res.status(201).json({
        message: "Login successful",
        userId: userid,
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

app.get("/api/user", async (req, res) => {
  const userId = req.query.userId;
  console.log(`Fetching user data for userId: ${userId}`); // Log the userId to debug

  if (!userId) {
    console.log("No userId provided");
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const query = "SELECT * FROM Users WHERE userid = UPPER(:userId)";
    const userResults = await run_query(query, { userId });
    console.log("User data retrieved:", userResults); // Log the result to debug

    if (userResults.length === 0) {
      console.log("No user found for the provided userId");
      return res.status(404).json({ message: "User not found" });
    }
    const data = userResults[0];
    console.log(data);
    res.json(data); // Ensure you are sending the correct part of the
    console.log(res.json.data);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/api/user/update", async (req, res) => {
  const { userId, fullName, email, dob, phone, bloodGroup, address } = req.body;

  const [firstname, lastname] = fullName.split(" ");

  let formattedDob;
  try {
    formattedDob = new Date(dob).toISOString().slice(0, 10);
  } catch (error) {
    console.error("Invalid date format for dob:", dob);
    return res
      .status(400)
      .json({ message: "Invalid date format for date of birth" });
  }

  let conn;
  try {
    conn = await connection();

    const updateQuery = `
      UPDATE Users
      SET
        firstname = UPPER(:firstname),
        lastname = UPPER(:lastname),
        email = UPPER(:email),
        date_of_birth = TO_DATE(:dob, 'YYYY-MM-DD'),
        phone_number = :phone,
        blood_group = :bloodGroup,
        address = :address
      WHERE userid = :userId
    `;

    const params = {
      userId,
      firstname,
      lastname,
      email,
      dob: formattedDob,
      phone,
      bloodGroup,
      address,
    };

    console.log("Update query parameters:", params);

    const result = await conn.execute(updateQuery, params, {
      autoCommit: true,
    });

    console.log("Update result:", result);

    // Check if any rows were affected
    if (!result || result.rowsAffected === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
});

app.post("/api/doctorSignup", async (req, res) => {
  const {
    regno, // Using regno as BMDC
    fullname,
    email,
    gender,
    phone,
    dept,
    mbbsYear,
    hosp,
    chamber,
    password,
    dob, // expecting dob in 'YYYY-MM-DD' format
  } = req.body;

  if (!email || !fullname || !regno || !mbbsYear || !dob) {
    console.log(email, fullname, regno, mbbsYear, dob); // Updated to log regno instead of BMDC
    return res.status(400).json({ message: "Missing required fields" });
  }

  let conn;
  try {
    conn = await connection();
    console.log(req.body);
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ message: "Invalid date of birth" });
    }

    const insertQuery = `
      INSERT INTO Doctors (BMDC, fullname, email, gender, phone, dept, mbbsYear, hosp, chamber, date_of_birth)
      VALUES (UPPER(:BMDC), UPPER(:fullname), UPPER(:email), UPPER(:gender), UPPER(:phone), UPPER(:dept), :mbbsYear, UPPER(:hosp), UPPER(:chamber), :dob)
    `;

    const bindVars = {
      BMDC: regno, 
      fullname,
      email,
      gender,
      phone,
      dept,
      mbbsYear,
      hosp,
      chamber,
      dob: { val: dobDate, type: oracledb.DATE },
    };

    await conn.execute(insertQuery, bindVars, { autoCommit: true });

    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash,req.body.BMDC);
    const insertPasswordQuery = "INSERT INTO Passwords (BMDC, hashed_password) VALUES (:BMDC, :hashedPassword)";
    await conn.execute(
      insertPasswordQuery,
      { BMDC:regno, hashedPassword: hash },
      { autoCommit: true }
    );
    
    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.error("Error during doctor signup:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
});

app.post("/api/doctorLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the BMDC for the given email from the Doctors table
    const doctorResults = await run_query(
      "SELECT BMDC FROM Doctors WHERE email = UPPER(:email)",
      { email }
    );

    console.log("Doctor Results:", doctorResults);  // Log the results for debugging

    if (doctorResults.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const bmdc = doctorResults[0][0];  // Assuming BMDC is the first element in the array
    console.log("BMDC:", bmdc);

    const passwordResults = await run_query(
      "SELECT hashed_password FROM Passwords WHERE BMDC = :bmdc",
      { bmdc }
    );

    console.log("Password Results:", passwordResults);  // Log the results for debugging

    if (passwordResults.length === 0 || !passwordResults[0][0]) {
      return res.status(404).json({ message: "Password not set for this doctor" });
    }

    const hashed_password = passwordResults[0][0]; 
    console.log("Hashed Password:", hashed_password);

    const match = await bcrypt.compare(password, hashed_password);

    if (match) {
      res.status(200).json({
        message: "Login successful",
        BMDC: bmdc,  
      });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error during doctor login process:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.get("/api/doctoruser", async (req, res) => {
  const { BMDC } = req.query;
  console.log(`Fetching doctor data for BMDC: ${BMDC}`);

  if (!BMDC) {
    return res.status(400).json({ message: "BMDC is required" });
  }

  try {
    const query = "SELECT * FROM Doctors WHERE BMDC = :BMDC";
    const results = await run_query(query, { BMDC });

    if (results.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctor = results[0];
    console.log("Doctor data retrieved:", doctor);
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.post("/api/doctor/update", async (req, res) => {
  const { BMDC, fullname, email, phone, dept, mbbsYear, hosp, chamber } = req.body;

  let conn;
  try {
    conn = await connection();
    const updateQuery = `
      UPDATE Doctors
      SET
        fullname = UPPER(:fullname),
        email = UPPER(:email),
        phone = UPPER(:phone),
        dept = UPPER(:dept),
        mbbsYear = :mbbsYear,
        hosp = UPPER(:hosp),
        chamber = UPPER(:chamber)
      WHERE BMDC = :BMDC
    `;

    const params = {
      BMDC,
      fullname,
      email,
      phone,
      dept,
      mbbsYear,
      hosp,
      chamber
    };

    const result = await conn.execute(updateQuery, params, { autoCommit: true });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Doctor not found or no updates made" });
    }

    res.status(200).json({ message: "Doctor profile updated successfully" });
  } catch (error) {
    console.error("Error during doctor profile update:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
});


