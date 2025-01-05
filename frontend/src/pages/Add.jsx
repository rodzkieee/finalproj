    import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Add.css';

const Add = () => {
    const [shoe, setShoe] = useState({
        prod_name: "",
        prod_description: "",
        price: null,
        image: null,
        quantity: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            setShoe((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setShoe((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();

        // Show a confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to add this item?");
        if (!isConfirmed) return;

        const formData = new FormData();
        formData.append('prod_name', shoe.prod_name);
        formData.append('prod_description', shoe.prod_description);
        formData.append('price', shoe.price);
        formData.append('image', shoe.image);
        formData.append('quantity', shoe.quantity);

        try {
            await axios.post("http://localhost:8800/shoes", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate("/shoes");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
        <div className='header4'>
        <h1>Admin Dashboard</h1>
        <Link to="/Shoes" className="back-btn">Back</Link>
        </div>
        <div className="add-header">
            <div className="form">
                <h1>ADD NEW ITEM</h1>
                <input type="text" placeholder="Name" onChange={handleChange} name="prod_name" />
                <input type="text" placeholder="Description" onChange={handleChange} name="prod_description" />
                <input type="number" placeholder="Price" onChange={handleChange} name="price" />
                <input type="number" placeholder="Quantity" onChange={handleChange} name="quantity" />
                <label htmlFor="file-input">UPLOAD AN IMAGE: </label>
                <input type="file" id="file-input" onChange={handleChange} name="image" />
                <button onClick={handleClick}>Add item</button>
            </div>
        </div>

        </div>
    );
};

export default Add;
