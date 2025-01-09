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
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [showQuantityControls, setShowQuantityControls] = useState({});
  const [selectedQuantities, setSelectedQuantities] = useState({});

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

  // Add to Cart button functionality (shows quantity controls)
  const handleAddToCart = (shoe) => {
    if (!user) {
      alert("Please Login First!");
      navigate("/LoginSignup");
      return;
    }

    setShowQuantityControls((prev) => ({ ...prev, [shoe.id]: true }));
    setSelectedQuantities((prev) => ({ ...prev, [shoe.id]: 1 }));
  };

  // Confirm Add to Cart
  const handleConfirmAddToCart = async (shoe) => {
    const confirmation = window.confirm(
      `Are you sure you want to add ${shoe.prod_name} to your cart?`
    );
    if (confirmation) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          alert("Please Login First!");
          navigate("/LoginSignup");
          return;
        }

        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.product_id === shoe.id);

          if (existingItem) {
            return prevCart.map((item) =>
              item.product_id === shoe.id
                ? { ...item, quantity: item.quantity + selectedQuantities[shoe.id] }
                : item
            );
          } else {
            return [...prevCart, { ...shoe, quantity: selectedQuantities[shoe.id] }];
          }
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        const cartItem = {
          userId: user.userID,
          items: [{ product_id: shoe.id, quantity: selectedQuantities[shoe.id] }],
        };

        await axios.post("http://localhost:8800/cart", cartItem);
        alert("Item added to cart!");
      } catch (err) {
        console.error("Error adding item to cart:", err);
      }
    }
  };

  // Cancel Add to Cart
  const handleCancelAddToCart = (shoe) => {
    setShowQuantityControls((prev) => ({ ...prev, [shoe.id]: false }));
    setSelectedQuantities((prev) => {
      const updated = { ...prev };
      delete updated[shoe.id];
      return updated;
    });
  };

  // Buy Now
  const handleBuyNow = (shoe) => {
    if (!user) {
      alert("Please Login First!");
      navigate("/LoginSignup");
      return;
    }

    const confirmation = window.confirm(`Are you sure you want to buy ${shoe.prod_name}?`);
    if (confirmation) {
      navigate("/Checkout", {
        state: {
          cart: [
            {
              product_id: shoe.id,
              prod_name: shoe.prod_name,
              price: shoe.price,
              quantity: 1,
              stock: shoe.quantity,
              image: shoe.image,
            },
          ],
        },
      });
    }
  };

  // Increase Quantity
  const handleIncreaseQuantity = (shoe) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [shoe.id]: Math.min((prev[shoe.id] || 1) + 1, shoe.quantity),
    }));
  };

  // Decrease Quantity
  const handleDecreaseQuantity = (shoe) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [shoe.id]: Math.max((prev[shoe.id] || 1) - 1, 1),
    }));
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
            onClick={() => navigate("/Cart")}
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

    {/* Show stock if quantity is greater than 0 */}
    {shoe.quantity > 0 ? (
      <p>Stock: {shoe.quantity}</p>
    ) : (
      <p className="out-of-stock">Out of Stock</p>
    )}

    <span>₱{shoe.price}</span>

    {/* Hide action buttons if stock is zero */}
    {shoe.quantity > 0 && (
      <>
        {showQuantityControls[shoe.id] ? (
          <>
            <p>Quantity: {selectedQuantities[shoe.id]}</p>
            <div className="quantity-controls">
              <button onClick={() => handleDecreaseQuantity(shoe)}>-</button>
              <button
                onClick={() => handleIncreaseQuantity(shoe)}
                disabled={selectedQuantities[shoe.id] >= shoe.quantity}
              >
                +
              </button>
            </div>
            <div className="action-buttons">
              <button className="ok-btn" onClick={() => handleConfirmAddToCart(shoe)}>
                OK
              </button>
              <button className="cancel-btn" onClick={() => handleCancelAddToCart(shoe)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="action-buttons">
            <button onClick={() => handleAddToCart(shoe)}>Add to Cart</button>
            <button className="buy-btn" onClick={() => handleBuyNow(shoe)}>
              Buy Now
            </button>
          </div>
        )}
      </>
    )}
  </div>
))}


      </div>
    </div>
  );
};

export default Product;
