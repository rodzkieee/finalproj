import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleConfirmPurchase = async () => {
    try {
      // Simulate order confirmation logic (e.g., saving to backend)
      alert('Order confirmed! Thank you for your purchase.');
      navigate('/'); // Redirect to home or order confirmation page
    } catch (error) {
      console.error('Error confirming purchase:', error);
      alert('Failed to confirm purchase. Please try again.');
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-items">
        {cart.map((item) => (
          <div key={item.product_id} className="checkout-item">
            <img src={`http://localhost:8800${item.image}`} alt={item.prod_name} />
            <div>
              <h2>{item.prod_name}</h2>
              <p>₱{item.price} x {item.quantity}</p>
              <p>Total: ₱{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="checkout-summary">
        <h3>Total: ₱{total.toLocaleString()}</h3>
        <button onClick={handleConfirmPurchase} className="confirm-btn">Confirm Purchase</button>
        <button onClick={() => navigate(-1)} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default Checkout;
