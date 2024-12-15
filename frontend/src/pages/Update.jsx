import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Update = () => {
    const [shoe, setShoe] = useState({
        prod_name: "",
        prod_description: "",
        price: null,
        image: null,
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
        if (shoe.image instanceof File) {
            formData.append("image", shoe.image); // Only append if new image is selected
        }

        try {
            await axios.put(`http://localhost:8800/shoes/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
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
            <label htmlFor="file-input">Upload a New Image (Optional):</label>
            <input type="file" onChange={handleChange} name="image" />
            <button onClick={handleClick}>Update</button>
        </div>
    );
};

export default Update;