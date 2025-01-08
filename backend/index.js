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
    const q = "INSERT INTO shoes (`prod_name`, `prod_description`, `image`, `price`, `quantity`) VALUES (?)";
    const values = [
        req.body.prod_name,
        req.body.prod_description,
        req.file ? `/images/${req.file.filename}` : null,
        req.body.price,
        req.body.quantity
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
    const q = "UPDATE shoes SET `prod_name`= ?, `prod_description`= ?, `image` = ?, `price` =?, `quantity` =? WHERE id =?";

    const values = [
        req.body.prod_name,
        req.body.prod_description,
        req.file ? `/images/${req.file.filename}` : req.body.image, 
        req.body.price,
        req.body.quantity
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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    // Query admin table first
    const adminQuery = "SELECT * FROM admin WHERE email = ?";
    db.query(adminQuery, [email], (err, adminResults) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error during login." });
        }

        if (adminResults.length > 0) {
            const admin = adminResults[0];
            if (admin.password !== password) {
                return res.status(401).json({ message: "Invalid email or password." });
            }

            return res.status(200).json({
                message: "Login successful.",
                user: {
                    userID: admin.id,
                    username: admin.username,
                    name: admin.name,
                    role: "Admin"
                }
            });
        } else {
            // Query user table if not an admin
            const userQuery = "SELECT userID, username, name, email, password, role FROM user WHERE email = ?";
            db.query(userQuery, [email], (err, userResults) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ message: "Database error during login." });
                }

                if (userResults.length === 0) {
                    return res.status(401).json({ message: "Invalid email or password." });
                }

                const user = userResults[0];
                const hash = crypto.createHash('sha256').update(password).digest('hex');
                if (user.password !== hash) {
                    return res.status(401).json({ message: "Invalid email or password." });
                }

                console.log("User found:", user);

                return res.status(200).json({
                    message: "Login successful.",
                    user: {
                        userID: user.userID,
                        username: user.username,
                        name: user.name,
                        role: user.role
                    }
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

// CHANGE PASSWORD
app.post("/user/change-password", (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "Email, current password, and new password are required." });
    }

    const q = "SELECT password FROM user WHERE email = ?";
    db.query(q, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = results[0];
        const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');

        if (user.password !== currentHash) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }

        const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');
        const updateQuery = "UPDATE user SET password = ? WHERE email = ?";
        db.query(updateQuery, [newHash, email], (updateErr) => {
            if (updateErr) {
                console.error("Database error:", updateErr);
                return res.status(500).json({ message: "Error updating password." });
            }

            return res.json({ message: "Password changed successfully." });
        });
    });
});

// Save Cart Endpoint
app.post("/cart", (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ message: "User ID and items are required." });
    }

    const values = items.map(item => [userId, item.product_id, item.quantity]);

    // Corrected SQL query to handle merging items
    const query = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES ?
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;

    db.query(query, [values], (err) => {
        if (err) {
            console.error("Error inserting cart items:", err);
            return res.status(500).json({ message: "Error saving cart." });
        }
        return res.status(200).json({ message: "Cart saved successfully." });
    });
});

app.get("/cart/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT c.user_id, c.product_id, c.quantity, s.prod_name, s.price, s.image, s.quantity AS stock
        FROM cart c
        JOIN shoes s ON c.product_id = s.id
        WHERE c.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error loading cart:", err);
            return res.status(500).json({ message: "Error loading cart." });
        }

        res.json(results);
    });
});

app.put("/cart/:cartID", (req, res) => {
    const cartID = req.params.cartID;
    const { quantity } = req.body;

    const query = "UPDATE cart SET quantity = ? WHERE cartID = ?";
    db.query(query, [quantity, cartID], (err, result) => {
        if (err) {
            console.error("Error updating cart item:", err);
            return res.status(500).json({ message: "Server error." });
        }

        return res.json({ message: "Cart item updated successfully." });
    });
});

// Delete a specific item from the cart
app.delete("/cart/:userID/:productID", (req, res) => {
    const { userID, productID } = req.params;
  
    const query = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
    db.query(query, [userID, productID], (err, result) => {
      if (err) {
        console.error("Error deleting item from cart:", err);
        return res.status(500).json({ message: "Error removing item from cart." });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Item not found in cart." });
      }
  
      return res.status(200).json({ message: "Item removed from cart successfully." });
    });
  });
  
// Endpoint to get order history for a specific user
app.get("/orders/:userId", (req, res) => {
    const userId = req.params.userId;

    const q = `
        SELECT o.id AS orderId, o.total_price AS totalPrice, o.created_at AS orderDate,
               oi.product_id AS productId, oi.quantity, oi.price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC`;

    db.query(q, [userId], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error fetching order history." });
        }
        return res.json(data);
    });
});

// Enhanced checkout endpoint with stock validation
app.post("/checkout", (req, res) => {
    const { userId, items, totalCost } = req.body;

    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ message: "User ID and items are required." });
    }

    // Check stock availability for each product
    const stockQuery = "SELECT id, prod_name, quantity FROM shoes WHERE id IN (?)";
    const productIds = items.map((item) => item.product_id);

    db.query(stockQuery, [productIds], (err, products) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error checking stock." });
        }

        // Validate stock availability
        for (const item of items) {
            const product = products.find((p) => p.id === item.product_id);
            if (!product || product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.prod_name}.` });
            }
        }

        // Insert the order into the orders table
        const orderQuery = "INSERT INTO orders (user_id, total_price) VALUES (?, ?)";
        db.query(orderQuery, [userId, totalCost], (err, orderResult) => {
            if (err) {
                console.error("Error inserting order:", err);
                return res.status(500).json({ message: "Error creating order." });
            }

            const orderId = orderResult.insertId;

            // Insert order items into the order_items table
            const orderItemsQuery = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
            const orderItems = items.map((item) => [
                orderId,
                item.product_id,
                item.quantity,
                item.price || 0,
            ]);

            db.query(orderItemsQuery, [orderItems], (err) => {
                if (err) {
                    console.error("Error inserting order items:", err);
                    return res.status(500).json({ message: "Error creating order items." });
                }

                // Respond with a success message
                return res.status(201).json({ message: "Order created successfully." });
            });
        });
    });
});

app.put("/cart/:userID/:productID", (req, res) => {
    const { userID, productID } = req.params;
    const { quantity } = req.body;

    // Correct query to update quantity based on user_id and product_id
    const query = "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
    db.query(query, [quantity, userID, productID], (err, result) => {
        if (err) {
            console.error("Error updating cart item:", err);
            return res.status(500).json({ message: "Server error." });
        }

        return res.status(200).json({ message: "Cart item updated successfully." });
    });
});

  

app.listen(8800, () => {
    console.log("connected to backend");
});