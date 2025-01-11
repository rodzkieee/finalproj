import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCart = location.state?.cart || [];
  const [cart] = useState(initialCart);

  // User information state
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    paymentMethod: 'COD' // Default payment method
  });

  // Fetch user information on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      fetch(`http://localhost:8800/user/${user.username}`)
        .then((res) => res.json())
        .then((data) => {
          setUserInfo((prev) => ({
            ...prev,
            name: data.name,
            address: data.address,
            phoneNumber: data.phoneNumber
          }));
        })
        .catch((err) => console.error('Error fetching user data:', err));
    }
  }, []);

  // Update user info state when inputs change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle purchase confirmation
  const handleConfirmPurchase = async () => {
    const isConfirmed = window.confirm("Are you sure you want to confirm the purchase?");
    if (!isConfirmed) return;
  
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        alert("User not logged in!");
        return;
      }
  
      // Send the order to the backend
      const response = await fetch("http://localhost:8800/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userID,
          items: cart,
          totalCost: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          shippingAddress: userInfo.address,
          paymentMethod: userInfo.paymentMethod,
        }),
      });
  
      if (response.ok) {
        alert("Order confirmed! Thank you for your purchase.");
  
        // Update the remaining cart in localStorage
        const remainingCart = location.state?.remainingCart || [];
        localStorage.setItem("cart", JSON.stringify(remainingCart));
  
        // Redirect to the order summary page
        navigate("/ordersummary");
      } else {
        alert("Failed to confirm purchase.");
      }
    } catch (error) {
      console.error("Error confirming purchase:", error);
      alert("Failed to confirm purchase. Please try again.");
    }
  };
  

  return (
    <>
      <div className="header-checkout">
        <h1 className="checkout-header">Checkout</h1>
      </div>

      <div className="checkout-container">
        <div className="user-info">
          <h3>Delivery Information</h3>
          <div className="form-group">
            <p>Name:</p>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <p>Address:</p>
            <input
              type="text"
              name="address"
              value={userInfo.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <p>Phone Number:</p>
            <input
              type="text"
              name="phoneNumber"
              value={userInfo.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <p>Payment Method:</p>
            <select
              name="paymentMethod"
              value={userInfo.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="COD">COD (Cash on Delivery)</option>
              <option value="Gcash">Gcash</option>
              <option value="Maya">Maya</option>
            </select>
          </div>
        </div>

        <div className="checkout-items">
          {cart.map((item) => (
            <div key={item.product_id} className="checkout-item">
              {item.image && (
                <img
                  src={`http://localhost:8800${item.image}`}
                  alt={item.prod_name}
                  className="checkout-item-image"
                />
              )}
              <div className="checkout-item-details">
                <h2>{item.prod_name}</h2>
                <p>₱{item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-summary">
          <h3>Total: ₱{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</h3>
          <div className='confirm-cancel'>
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
