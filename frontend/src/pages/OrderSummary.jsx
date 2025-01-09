import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSummary.css';

const OrderSummary = () => {
    const [orderSummary, setOrderSummary] = useState([]);
    const navigate = useNavigate();

    // Fetch order summary on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            fetch(`http://localhost:8800/order-summary/${user.userID}`)
                .then((res) => res.json())
                .then((data) => {
                    // Sort data by order ID
                    const sortedData = data.sort((a, b) => a.order_id - b.order_id);
                    setOrderSummary(sortedData);
                })
                .catch((err) => console.error('Error fetching order summary:', err));
        }
    }, []);

    return (
        <>
            <div className="header-summary">
                <h2>Order Summary</h2>
                <button className="navigate-button" onClick={() => navigate('/LandingPage2')}>
                    Home
                </button>
            </div>
            <div className="order-summary">
                {orderSummary.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orderSummary.map((order) => (
                        <div key={order.order_id} className="order-item">
                            <h3>Order ID: {order.order_id}</h3>
                            <p><strong>Name:</strong> {order.name}</p>
                            <p><strong>Address:</strong> {order.address}</p>
                            <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
                            <p><strong>Total Price:</strong> ₱{order.total_price}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {order.status}</p>

                            <div className="order-products">
                                <h4>Products:</h4>
                                <div className="product-item">
                                    <img
                                        src={`http://localhost:8800${order.image}`}
                                        alt={order.prod_name}
                                        className="product-image"
                                    />
                                    <div className="product-details">
                                        <p><strong>Product Name:</strong> {order.prod_name}</p>
                                        <p><strong>Quantity:</strong> {order.quantity}</p>
                                        <p><strong>Price:</strong> ₱{order.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default OrderSummary;
