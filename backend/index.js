import express from "express";
import mysql from "mysql";
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';

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
    const { name, email, password, address, phoneNumber, role } = req.body;

    if (!name || !email || !password || !address || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const userRole = role === "admin" ? "user" : role; // Default to "user" if "admin" is attempted

    const query = "INSERT INTO user (`name`, `email`, `password`, `address`, `phoneNumber`, `role`) VALUES (?)";

    const values = [name, email, password, address, phoneNumber, userRole];

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error("Database error:", err); 
            return res.status(500).json({ message: "Database error." });
        }
        return res.status(201).json({ message: "Signup successful." });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const query = "SELECT * FROM user WHERE email = ?";

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err); 
            return res.status(500).json({ message: "Database error." });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = results[0];

        if (user.password === password) {
            return res.status(200).json({ message: "Login successful.", user: { id: user.id, name: user.name, role: user.role } });
        } else {
            return res.status(401).json({ message: "Invalid email or password." });
        }
    });
});


app.listen(8800, () => {
    console.log("connected to backend");
});