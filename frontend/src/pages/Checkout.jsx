import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCart = location.state?.cart || [];

  const [cart, setCart] = useState(initialCart);

  const handleIncreaseQuantity = (productId, stock) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId && item.quantity < stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleConfirmPurchase = async () => {
    // Prompt the user for confirmation
    const isConfirmed = window.confirm('Are you sure you want to confirm the purchase?');
    if (!isConfirmed) {
      return;
    }

    try {
      // Get the logged-in user's ID from local storage (or context/state)
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userID) {
        alert('User not logged in!');
        return;
      }

      const response = await fetch('http://localhost:8800/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userID, // Dynamically use the logged-in user's ID
          items: cart,
          totalCost: total,
        }),
      });

      if (response.ok) {
        // Remove purchased items from the database (via backend)
        const deleteResponse = await fetch('http://localhost:8800/cart/clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userID }),
        });

        if (deleteResponse.ok) {
          localStorage.removeItem('cart'); // Clear cart in local storage
          alert('Order confirmed! Thank you for your purchase.');
          navigate('/Product'); // Redirect to home or order confirmation page
        } else {
          alert('Failed to remove items from the cart.');
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to confirm purchase: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error confirming purchase:', error);
      alert('Failed to confirm purchase. Please try again.');
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="header-checkout">
        <h1 className="checkout-header">Checkout</h1>
      </div>

      {/* Checkout Container */}
      <div className="checkout-container">
        <div className="checkout-items">
          {cart.map((item) => (
            <div key={item.product_id} className="checkout-item">
              <img
                src={`http://localhost:8800${item.image}`}
                alt={item.prod_name}
                className="checkout-item-image"
              />
              <div className="checkout-item-details">
                <h2 className="checkout-item-name">{item.prod_name}</h2>
                <p className="checkout-item-price">₱{item.price}</p>
                <p className="checkout-item-stock">Stock: {item.stock}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleDecreaseQuantity(item.product_id)}>-</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.product_id, item.stock)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <p className="checkout-item-total">
                  Total: ₱{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout-summary">
          <h3 className="checkout-total">Total: ₱{total.toLocaleString()}</h3>
          <div className="checkout-buttons">
            <button onClick={handleConfirmPurchase} className="confirm-btn">
              Confirm Purchase
            </button>
            <button onClick={() => navigate(-1)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
