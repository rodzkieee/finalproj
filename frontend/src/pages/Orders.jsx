import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:8800/orders');
                
                // Sort orders by ID in ascending order
                const sortedOrders = res.data.sort((a, b) => a.id - b.id);

                setOrders(sortedOrders);
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            await axios.put(`http://localhost:8800/orders/${orderId}`, { status });
            alert('Order status updated successfully');
            window.location.reload();
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status');
        }
    };

    return (
        <div className="orders-page">
            <div className="header">
                <h1>Admin Orders Management</h1>
                <div className="header-buttons">
                    <div className="back-order">
                        <button className="back-order-button">
                            <Link to="/Shoes">Back</Link>
                        </button>
                    </div>
                </div>
            </div>

            <div className="orders-container">
                {orders.map((order) => (
                    <div key={order.id} className="order-item">
                        <h3>Order ID: {order.id}</h3>
                        <p><strong>Name:</strong> {order.name}</p>
                        <p><strong>Address:</strong> {order.address}</p>
                        <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
                        <p><strong>Total Price:</strong> ₱{order.total_price}</p>
                        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Status:</strong></p>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In-Transit">In-Transit</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
