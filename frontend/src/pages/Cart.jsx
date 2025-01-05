import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            alert("Please Login First!");
            navigate('/LoginSignup');
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    }, [cart]);

    // Remove item from cart
    const handleRemoveFromCart = (id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.id !== id);
            console.log('Item removed', updatedCart); // Log removed item
            return updatedCart;
        });
    };

    // Increase item quantity in cart
    const handleIncreaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.quantity < item.stock // Ensure quantity is within stock limit
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Decrease item quantity in cart
    const handleDecreaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.quantity > 1 // Prevent going below quantity 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    // Checkout handler
    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Proceeding to Checkout...");
        // Add checkout logic here
    };

    // Calculate total price of cart items
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Log cart state for debugging
    console.log('Current cart state:', cart);

    return (
        <div>
            <div className="header3">
                <h1>Your Cart</h1>
                <Link to="/Product">Back to Products</Link>
            </div>
            <div className="cart-container">
                {cart.length === 0 ? (
                    <div className='h11'>
                    <p>Your cart is empty!</p>
                    </div>
                ) : (
                    cart.map((item) => (
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
                                <div className="quantity-controls">
                                    <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                                    <button onClick={() => handleIncreaseQuantity(item.id)}disabled={item.quantity >= item.stock} // Disable button if quantity >= stock
                                            >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn"> Remove </button>
                        </div>
                    ))
                )}
            </div>
            <div className='total'>
            <h8>Total: ₱{total}</h8>
            <button onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
