import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';

const Product = () => {
    const [shoes, setShoes] = useState([]);
    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || null; // Simplified user retrieval
    const [showQuantityControls, setShowQuantityControls] = useState({});

    useEffect(() => {
        const fetchAllShoes = async () => {
            try {
                const res = await axios.get('http://localhost:8800/shoes');
                setShoes(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllShoes();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage whenever it changes
    }, [cart]);

    const handleAddToCart = (shoe) => {
        if (!user) {
            alert("Please Login First!");
            navigate('/LoginSignup');
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

    const handleCancelFromCart = (shoe) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== shoe.id));
        setShowQuantityControls((prev) => ({ ...prev, [shoe.id]: false }));
    };

    const handleIncreaseQuantity = (shoe) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === shoe.id && item.quantity < shoe.quantity
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const handleDecreaseQuantity = (shoe) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === shoe.id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const handleGoToCart = () => {
        navigate('/Cart');
    };

    return (
        <div>
            <div className="header3">
                <h1>Marketplace</h1>
                <button onClick={handleGoToCart} className="cart-btn">Cart</button>
                <Link to={user ? "/LandingPage2" : "/"} className="back-btn">Back</Link>
            </div>

            <div className='shoes'>
                {shoes.map((shoe) => (
                    <div className='shoe' key={shoe.id}>
                        <div className='container-product'>
                            {shoe.image && <img src={`http://localhost:8800${shoe.image}`} alt={shoe.prod_name} />}
                        </div>
                        <h2>{shoe.prod_name}</h2>
                        <p>{shoe.prod_description}</p>
                        <p>Stock: {shoe.quantity}</p>
                        <span>₱{shoe.price}</span>
                        {showQuantityControls[shoe.id] ? (
                            <>
                                <p>Quantity: {cart.find(item => item.id === shoe.id)?.quantity || 0}</p>
                                <button onClick={() => handleDecreaseQuantity(shoe)}>-</button>
                                <button onClick={() => handleIncreaseQuantity(shoe)} disabled={cart.find(item => item.id === shoe.id)?.quantity >= shoe.quantity}>+</button>
                                <button onClick={() => handleCancelFromCart(shoe)}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => handleAddToCart(shoe)}>Add to cart</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Product;
