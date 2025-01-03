import express from "express";
import mysql from "mysql";
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';


const app = express();


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ediwow09",
    database: "marketplace"
});

app.use(express.json());
app.use(cors());
app.use('/images', express.static('images')); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    res.json("this is the backend");
});

app.get("/shoes", (req, res) => {
    const q = "SELECT * FROM shoes";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post("/shoes", upload.single('image'), (req, res) => {
    const q = "INSERT INTO shoes (`prod_name`, `prod_description`, `image`, `price`) VALUES (?)";
    const values = [
        req.body.prod_name,
        req.body.prod_description,
        req.file ? `/images/${req.file.filename}` : null,
        req.body.price
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Success");
    });
});

app.delete("/shoes/:id", (req, res) => {
    const shoeId = req.params.id;
    const q = "DELETE FROM shoes WHERE id= ?";

    db.query(q, [shoeId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Successfully Deleted");
    });
});

app.put("/shoes/:id", upload.single('image'), (req, res) => {
    const shoeId = req.params.id;
    const q = "UPDATE shoes SET `prod_name`= ?, `prod_description`= ?, `image` = ?, `price` =? WHERE id =?";

    const values = [
        req.body.prod_name,
        req.body.prod_description,
        req.file ? `/images/${req.file.filename}` : req.body.image, 
        req.body.price
    ];

    db.query(q, [...values, shoeId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Successfully Updated");
    });
});


app.post("/signup", (req, res) => {
    const { username, name, email, password, address, phoneNumber } = req.body;

    // Basic validation
    if (!username || !name || !email || !password || !address || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Validate email format (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if email already exists in admin table
    const adminQuery = "SELECT * FROM admin WHERE email = ?";
    db.query(adminQuery, [email], (err, adminResults) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error during email check." });
        }

        if (adminResults.length > 0) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Check if email already exists in user table
        const userQuery = "SELECT * FROM user WHERE email = ?";
        db.query(userQuery, [email], (err, userResults) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error during email check." });
            }

            if (userResults.length > 0) {
                return res.status(400).json({ message: "Email is already registered." });
            }

            // Set role as "Customer" by default
            const userRole = "Customer";

            // SQL query to insert user
            const query = "INSERT INTO user (username, name, email, password, address, phoneNumber, role) VALUES (?)";

            // Hash password using SHA-256
            const hash = crypto.createHash('sha256').update(password).digest('hex');

            const values = [username, name, email, hash, address, phoneNumber, userRole];

            // Execute the query
            db.query(query, [values], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Database error during user creation." });
                }
                return res.status(201).json({ message: "Signup successful." });
            });
        });
    });
});



app.post("/login", (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || (req.body.role === 'user' && !username)) {
        return res.status(400).json({ message: "Email, password are required." });
    }

    // Query admin table first (admin only needs email)
    const adminQuery = "SELECT * FROM admin WHERE email = ?";
    db.query(adminQuery, [email], (err, adminResults) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error during login." });
        }

        if (adminResults.length > 0) {
            const admin = adminResults[0];

             // Direct password comparison for admin (no hashing)
             if (admin.password !== password) {
                return res.status(401).json({ message: "Invalid email or password." });
            }

            return res.status(200).json({ 
                message: "Login successful.", 
                user: { id: admin.id, name: admin.name, role: "Admin" } 
            });
        } else {
            // If not an admin, query user table (user requires email and username)
            const userQuery = "SELECT * FROM user WHERE email = ?";
            db.query(userQuery, [email], (err, userResults) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Database error during login." });
                }

                if (userResults.length === 0) {
                    return res.status(401).json({ message: "Invalid email or password." });
                }

                const user = userResults[0];

                // Compare hashed password for user
                const hash = crypto.createHash('sha256').update(password).digest('hex');
                if (user.password !== hash) {
                    return res.status(401).json({ message: "Invalid email, username, or password." });
                }

                return res.status(200).json({ 
                    message: "Login successful.", 
                    user: { id: user.id, username: user.username, name: user.name, role: "Customer" } 
                });
            });
        }
    });
});

// GET USER PROFILE BY USERNAME
app.get("/user/:username", (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: "Username is required." });
    }

    const q = "SELECT username, name, email, password, address, phoneNumber FROM user WHERE username = ?";

    db.query(q, [username], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error fetching user data." });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.json(data[0]);
    });
});


// UPDATE USER PROFILE
app.put("/user", (req, res) => {
    const { username, name, email, password, address, phoneNumber } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    let fields = [];
    let values = [];

    if (username) {
        fields.push("username = ?");
        values.push(username);
    }
    if (name) {
        fields.push("name = ?");
        values.push(name);
    }
    if (password) {
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        fields.push("password = ?");
        values.push(hash);
    }
    if (address) {
        fields.push("address = ?");
        values.push(address);
    }
    if (phoneNumber) {
        fields.push("phoneNumber = ?");
        values.push(phoneNumber);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update." });
    }

    const q = `UPDATE user SET ${fields.join(", ")} WHERE email = ?`;
    values.push(email);

    db.query(q, values, (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error updating user data." });
        }
        return res.json({ message: "User profile updated successfully." });
    });
});


// DELETE USER PROFILE
app.delete("/user", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required to delete the account." });
    }

    const q = "DELETE FROM user WHERE email = ?";

    db.query(q, [email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error deleting user account." });
        }
        return res.json({ message: "User account deleted successfully." });
    });
});

app.listen(8800, () => {
    console.log("connected to backend");
});