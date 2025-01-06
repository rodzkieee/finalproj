import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
    // Retrieve cart items from local storage
    const [cart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    
    // Retrieve logged-in user from local storage
    const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
    
    // State to manage total cost
    const [totalCost, setTotalCost] = useState(0);
    
    // State to store fetched user details
    const [userData, setUserData] = useState(null);
    
    const navigate = useNavigate();

    // ✅ Fetch user data from backend using the stored userID
    useEffect(() => {
        if (!user || !user.userID) {
            alert("Please login to proceed to checkout.");
            navigate('/LoginSignup');
            return;
        }
        
        axios.get(`http://localhost:8800/user/${user.userID}`)
            .then(response => {
                if (response.data) {
                    console.log("User data received:", response.data);
                    setUserData(response.data);  // ✅ Store the fetched user data
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                alert("Failed to load user details.");
            });
    }, [user, navigate]);
    

    // ✅ Calculate total cost of the items in the cart
    useEffect(() => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalCost(total);
    }, [cart]);

    // ✅ Handle checkout process
    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            const payload = {
                userId: user.userID,
                items: cart.map(item => ({
                    productID: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalCost
            };

            console.log("Checkout Payload:", payload);

            const response = await axios.post("http://localhost:8800/checkout", payload);

            if (response.status === 201) {
                alert("Order placed successfully!");
                localStorage.removeItem('cart'); // Clear the cart after successful checkout
                navigate('/OrderSummary');
            } else {
                alert("Failed to place the order.");
            }
        } catch (err) {
            console.error("Error during checkout:", err.response?.data || err.message);
            alert(`Checkout Error: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {/* ✅ Display user details (Name, Phone Number, and Address) */}
            <div className="delivery-address">
                <h3>Delivery Address</h3>
                {userData ? (
                    <>
                        <p><strong>{userData.name}</strong></p>
                        <p>{userData.address}</p>
                        <p>Phone: (+63) {userData.phoneNumber}</p>
                        <a href="/profile" className="change-link">Change</a>
                    </>
                ) : (
                    <p>Loading address...</p>
                )}
            </div>

            {/* ✅ Display Cart Summary */}
            <div className="checkout-summary">
                {cart.map((item) => (
                    <div key={item.id} className="checkout-item">
                        <div className="checkout-item-image-container">
                            <img
                                src={`http://localhost:8800${item.image}`}
                                alt={item.prod_name}
                                className="checkout-item-image"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
                            />
                        </div>
                        <div className="checkout-item-details">
                            <h2>{item.prod_name}</h2>
                            <p>₱{item.price} x {item.quantity}</p>
                            <p>Subtotal: ₱{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
                <h3>Total Cost: ₱{totalCost.toLocaleString()}</h3>
                <button onClick={handleCheckout} className="checkout-button">
                    Confirm Order
                </button>
            </div>
        </div>
    );
};

export default Checkout;
