import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.css";
import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";

const Product = () => {
  const [shoes, setShoes] = useState([]);
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [showQuantityControls, setShowQuantityControls] = useState({});

  // Fetch product data from the backend
  useEffect(() => {
    const fetchAllShoes = async () => {
      try {
        const res = await axios.get("http://localhost:8800/shoes");
        setShoes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllShoes();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart functionality
  const handleAddToCart = (shoe) => {
    if (!user) {
      alert("Please Login First!");
      navigate("/LoginSignup");
      return;
    }

    setCart((prevCart) => {
      const itemExists = prevCart.find((item) => item.id === shoe.id);
      if (itemExists) {
        return prevCart.map((item) =>
          item.id === shoe.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...shoe, quantity: 1, stock: shoe.quantity }];
    });

    setShowQuantityControls((prev) => ({ ...prev, [shoe.id]: true }));
  };

  // Remove from cart functionality
  const handleCancelFromCart = (shoe) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== shoe.id));
    setShowQuantityControls((prev) => ({ ...prev, [shoe.id]: false }));
  };

  // Increase quantity functionality
  const handleIncreaseQuantity = (shoe) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === shoe.id && item.quantity < shoe.quantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity functionality
  const handleDecreaseQuantity = (shoe) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === shoe.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Navigate to the cart page
  const handleGoToCart = () => {
    navigate("/Cart");
  };

  // Handle Buy Now button click
  const handleBuyNow = (shoe) => {
    const confirmation = window.confirm(`Are you sure you want to buy ${shoe.prod_name}?`);
    if (confirmation) {
      handleAddToCart(shoe);
      alert("Successfully added to the cart!");
      window.location.reload();
    }
  };

  // Filter shoes based on the search term
  const filteredShoes = shoes.filter((shoe) =>
    shoe.prod_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="header3">
        <h1>Marketplace</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search products..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="cart-wrapper"
            role="button"
            aria-label="Go to cart"
            onClick={handleGoToCart}
          >
            <div className="cart-btn-fix">
              <ion-icon name="cart-outline"></ion-icon>
            </div>
          </div>
          <Link to={user ? "/LandingPage2" : "/"} className="back-btn-cart">
            Back
          </Link>
        </div>
      </div>

      <div className="shoes">
        {filteredShoes.map((shoe) => (
          <div className="shoe" key={shoe.id}>
            <div className="container-product">
              {shoe.image && (
                <img
                  src={`http://localhost:8800${shoe.image}`}
                  alt={shoe.prod_name}
                />
              )}
            </div>
            <h2>{shoe.prod_name}</h2>
            <p>{shoe.prod_description}</p>
            <p>Stock: {shoe.quantity}</p>
            <span>₱{shoe.price}</span>

            {showQuantityControls[shoe.id] ? (
              <>
                <p>Quantity: {cart.find((item) => item.id === shoe.id)?.quantity || 0}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleDecreaseQuantity(shoe)}>-</button>
                  <button
                    onClick={() => handleIncreaseQuantity(shoe)}
                    disabled={
                      cart.find((item) => item.id === shoe.id)?.quantity >= shoe.quantity
                    }
                  >
                    +
                  </button>
                </div>
                <div className="action-buttons">
                  <button className="buy-btn" onClick={() => handleBuyNow(shoe)}>
                    Buy Now
                  </button>
                  <button
                    className="cancel"
                    onClick={() => handleCancelFromCart(shoe)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => handleAddToCart(shoe)}>Add to Cart</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
