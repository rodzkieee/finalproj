import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './Shoes.css';


const Shoes = () => {
    const [shoes, setShoes] = useState([]);

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
        try {
            await axios.delete(`http://localhost:8800/shoes/${id}`);
            setShoes((prevShoes) => prevShoes.filter((shoe) => shoe.id !== id));
        } catch (err) {
            console.log(err);
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
                        <button className='delete' onClick={() => handleDelete(shoe.id)}>
                            <strong>Delete</strong>
                        </button>
                        <button className='update'>
                            <Link to={`/update/${shoe.id}`}>
                                <strong>Update</strong>
                            </Link>
                        </button>
                    </div>
                ))}
            </div>
            <button>
                <strong>
                    <Link to="/Add">Add new item</Link>
                </strong>
            </button>
        </div>
    );
};

export default Shoes;
