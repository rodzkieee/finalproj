import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link, useNavigate, useParams } from "react-router-dom";
import './Update.css';

const Update = () => {
    const [shoe, setShoe] = useState({
        prod_name: "",
        prod_description: "",
        price: null,
        image: null,
        quantity: null,
    });

    const { id } = useParams(); // Retrieve shoe ID from URL params
    const navigate = useNavigate();

    // Fetch existing shoe details
    useEffect(() => {
        const fetchShoe = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/shoes/${id}`);
                setShoe({
                    prod_name: res.data.prod_name,
                    prod_description: res.data.prod_description,
                    price: res.data.price,
                    image: res.data.image, // Keep the current image path
                    quantity: res.data.quantity,
                });
            } catch (err) {
                console.log(err);
            }
        };
        fetchShoe();
    }, [id]);

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
    
        const formData = new FormData();
        formData.append("prod_name", shoe.prod_name);
        formData.append("prod_description", shoe.prod_description);
        formData.append("price", shoe.price);
        formData.append("quantity", shoe.quantity);
    
        // Only append the image if a new image is selected
        if (shoe.image instanceof File) {
            formData.append("image", shoe.image);
        }
    
        try {
            await axios.put(`http://localhost:8800/shoes/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/Shoes");
        } catch (err) {
            console.error(err);
        }
    };
    

    return (
        <div>
        <div className='header4'>
        <h1>Admin Dashboard</h1>
        <Link to="/Shoes" className="back-btn">Back</Link>
        </div>

        <div className="form">
            <h1>Update Item</h1>
            <input
                type="text"
                placeholder="name"
                value={shoe.prod_name}
                onChange={handleChange}
                name="prod_name"
            />
            <input
                type="text"
                placeholder="description"
                value={shoe.prod_description}
                onChange={handleChange}
                name="prod_description"
            />
            <input
                type="number"
                placeholder="price"
                value={shoe.price || ""}
                onChange={handleChange}
                name="price"
            />
             <input
                type="number"
                placeholder="quantity"
                value={shoe.quantity || ""}
                onChange={handleChange}
                name="quantity"
            />
            <label htmlFor="file-input">Upload a New Image (Optional):</label>
            <input type="file" onChange={handleChange} name="image" />
            <button onClick={handleClick}>Update</button>
        </div>
        </div>
    );
};

export default Update;