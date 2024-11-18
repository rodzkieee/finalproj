import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const [shoe, setShoe] = useState({
        prod_name: "",
        prod_description: "",
        price: null,
        image: null, // Image will be a file
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            setShoe((prev) => ({ ...prev, [name]: files[0] })); // Handle file input
        } else {
            setShoe((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('prod_name', shoe.prod_name);
        formData.append('prod_description', shoe.prod_description);
        formData.append('price', shoe.price);
        formData.append('image', shoe.image); // Append the image file

        try {
            await axios.post("http://localhost:8800/shoes", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            });
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    console.log(shoe);

    return (
        <div className='form'>
            <h1>ADD NEW ITEM</h1>
            <input type="text" placeholder='name' onChange={handleChange} name="prod_name" />
            <input type="text" placeholder='description' onChange={handleChange} name="prod_description" />
            <label htmlFor="file-input">UPLOAD AN IMAGE: </label>
            <input type="file" id="file-input" onChange={handleChange} name="image" />
            <input type="number" placeholder='price' onChange={handleChange} name="price" />
            <button onClick={handleClick}>Add item</button>
        </div>
    );
};

export default Add;