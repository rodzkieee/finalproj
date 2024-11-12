import axios from 'axios';
import React from 'react'
import {useState} from "react"
import { useNavigate } from 'react-router-dom';

const Add =()=>{
    const [shoe, setShoe] = useState({
        prod_name:"",
        prod_description:"",
        price: null,
        image: "",
    });
const navigate= useNavigate()


const handleChange=(e)=>{
    setShoe((prev)=>({...prev, [e.target.name]: e.target.value}))
};
const handleClick= async e=>{
    e.preventDefault()
    try{
        await axios.post("http://localhost:8800/shoes", shoe)
        navigate("/")
    }catch(err){
        console.log(err)

    }
}







console.log(shoe)
    return(
        <div className= 'form'> 
        <h1> Add New Item</h1>
        <input type= "text" placeholder='name' onChange={handleChange} name="prod_name"/>
        <input type= "text" placeholder='prod_description' onChange={handleChange} name="prod_description"/>
        <input type= "number" placeholder='price' onChange={handleChange} name="price"/>
        <input type= "text" placeholder='image' onChange={handleChange} name="image"/>
        
        
        <button onClick={handleClick}>Add</button>
        </div>
    )
}

export default Add