import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Shoes.css';

const Shoes = () => {
    const [shoes, setShoes] = useState([]);
    const navigate = useNavigate();

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

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (!isConfirmed) return;

        try {
            await axios.delete(`http://localhost:8800/shoes/${id}`);
            setShoes((prevShoes) => prevShoes.filter((shoe) => shoe.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        // Remove admin data from local storage
        localStorage.removeItem('admin'); // Adjust 'admin' to the key used for storing admin data
        navigate('/');
    };

    return (
        <div>
            <div className="header">
                <h1>Admin Dashboard</h1>
                <div className="header-buttons">
                    <button className="add">
                        <Link to="/Add">Add New Item</Link>
                    </button>
                    <button className="logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <div className="shoes">
                {shoes.map((shoe) => (
                    <div className="shoe" key={shoe.id}>
                        <div className="container-shoes">
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
                        <button className="delete" onClick={() => handleDelete(shoe.id)}>
                            <strong>Delete</strong>
                        </button>
                        <button className="update">
                            <Link to={`/update/${shoe.id}`}>
                                <strong>Update</strong>
                            </Link>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shoes;
