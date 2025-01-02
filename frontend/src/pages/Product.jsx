import { Link } from "react-router-dom";    
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import axios from 'axios';
import './Product.css';

const Product = () => {
    const [shoes, setShoes] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Check for user authentication
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Fetch shoes data
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

    // Redirect to login/signup if not logged in
    const handleButtonClick = () => {
        if (!user) {
            alert("Please Login First!");
            navigate('/LoginSignup');
        }
    };

    return (
        <div>
            <h1>Marketplace</h1>
            <div className='shoes'>
                {shoes.map((shoe) => (
                    <div className='shoe' key={shoe.id}>
                        <div className='container'>
                            {shoe.image && <img src={`http://localhost:8800${shoe.image}`} alt={shoe.prod_name} />}
                        </div>
                        <h2>{shoe.prod_name}</h2>
                        <p>{shoe.prod_description}</p>
                        <span>₱{shoe.price}</span>
                        <button onClick={handleButtonClick}>
                            <strong>Add to cart</strong>
                        </button>
                        <button onClick={handleButtonClick}>
                            <strong>Buy now</strong>
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleButtonClick}>
                <strong>Cart</strong>
            </button>
             <Link to="/LandingPage2" className="back-btn">Back</Link>
        </div>
        
    );
};

export default Product;
