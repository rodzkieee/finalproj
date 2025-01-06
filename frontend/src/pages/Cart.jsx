import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            alert("Please Login First!");
            navigate('/LoginSignup');
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const handleRemoveFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const handleIncreaseQuantity = (id) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id && item.quantity < item.stock
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const handleDecreaseQuantity = (id) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
    
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (!user || !user.userID) {
            alert("Please log in to complete your order.");
            navigate('/LoginSignup');
            return;
        }
    
        setLoading(true);
    
        try {
            const payload = {
                userId: user.userID,
                cart: cart.map(item => ({
                    prodID: item.id, // Changed from 'id' to 'prodID'
                    quantity: item.quantity,
                    price: item.price
                }))
            };
    
            console.log("Checkout Payload:", payload);
    
            const response = await axios.post("http://localhost:8800/checkout", payload);
    
            if (response.status === 201) {
                alert("Order placed successfully!");
                setCart([]);
                localStorage.removeItem('cart');
            }
        } catch (err) {
            console.error("Error during checkout:", err.response?.data || err.message);
    
            if (err.response && err.response.data && err.response.data.message) {
                alert(`Error: ${err.response.data.message}`);
            } else {
                alert("An error occurred during checkout. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    

    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div>
            <div className="header3">
                <h1>Your Cart</h1>
                <Link to="/Product">Back to Products</Link>
            </div>
            <div className="cart-container">
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty!</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img
                                src={`http://localhost:8800${item.image}`}
                                alt={item.prod_name}
                                className="cart-item-image"
                            />
                            <h2>{item.prod_name}</h2>
                            <p>₱{item.price}</p>
                            <p>Stock: {item.stock}</p>
                            <p>Quantity: {item.quantity}</p>
                            <div className="cart-item-controls">
                                <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                                <button
                                    onClick={() => handleIncreaseQuantity(item.id)}
                                    disabled={item.quantity >= item.stock}
                                >
                                    +
                                </button>
                            </div>
                            <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="total">
                <h3>Total: ₱{total.toLocaleString()}</h3>
                <button onClick={handleCheckout} disabled={cart.length === 0 || loading}>
                    {loading ? "Processing..." : "Checkout"}
                </button>
            </div>
        </div>
    );
};

export default Cart;
