import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Fetch cart items from the backend when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                alert("Please Login First!");
                navigate("/LoginSignup");
                return;
            }

            const response = await axios.get(`http://localhost:8800/cart/${user.userID}`);
            setCart(response.data);
        } catch (err) {
            console.error("Error fetching cart items:", err);
        }
    };

    fetchCartItems();
}, [navigate]);


  // Update cart item quantity in the backend
  const updateCartItemQuantity = async (productId, quantity) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        await axios.put(`http://localhost:8800/cart/${user.userID}/${productId}`, {
            quantity: quantity,
        });
    } catch (err) {
        console.error("Error updating cart item quantity:", err);
    }
};


  // Remove item from cart
  const handleRemoveFromCart = async (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        await axios.delete(`http://localhost:8800/cart/${user.userID}/${productId}`);

        setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
        localStorage.removeItem("cart");
        alert("Item removed from cart!");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        alert("Failed to remove item. Please try again.");
      }
    }
  };

  // Increase quantity
  const handleIncreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

    const updatedItem = cart.find((item) => item.product_id === id);
    if (updatedItem && updatedItem.quantity < updatedItem.stock) {
      updateCartItemQuantity(id, updatedItem.quantity + 1);
    }
  };

  // Decrease quantity
  const handleDecreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    const updatedItem = cart.find((item) => item.product_id === id);
    if (updatedItem && updatedItem.quantity > 1) {
      updateCartItemQuantity(id, updatedItem.quantity - 1);
    }
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate('/checkout', { state: { cart } });
  };

  // Calculate total price
  const total = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div>
      <div className="header3">
        <h1>Your Cart</h1>
        <Link to="/Product" className="back-to-products-btn">← Back to Products</Link>
      </div>
      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty!</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.product_id} className="cart-item">
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
                <button
                  className="quantity-btn"
                  onClick={() => handleDecreaseQuantity(item.product_id)}
                >
                  -
                </button>
                <button
                  className="quantity-btn"
                  onClick={() => handleIncreaseQuantity(item.product_id)}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.product_id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="total">
        <h3>Total: ₱{total.toLocaleString()}</h3>
        <button
          onClick={handleCheckout}
          className="checkout-btn"
          disabled={cart.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
