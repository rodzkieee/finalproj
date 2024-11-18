import express from "express";
import mysql from "mysql";
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ediwow09",
    database: "marketplace"
});

app.use(express.json());
app.use(cors());
app.use('/images', express.static('images')); // Serve uploaded files

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
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
        req.file ? `/images/${req.file.filename}` : null, // Save the file path
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
        req.file ? `/images/${req.file.filename}` : req.body.image, // Update image if a new file is uploaded
        req.body.price
    ];

    db.query(q, [...values, shoeId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Successfully Updated");
    });
});

app.listen(8800, () => {
    console.log("connected to backend");
});