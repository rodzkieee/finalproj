import React, { useEffect } from 'react'
import {useState} from 'react'
import axios from 'axios'
import {Link} from "react-router-dom"

const Shoes =()=>{

    const [shoes, setShoes]=useState([])

    useEffect(()=>{
        const fetchAllShoes= async()=>{
            try{
                const res= await axios.get("http://localhost:8800/shoes")
                setShoes(res.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchAllShoes()
    },[])
    
    return(
        <div>
            <h1>Marketplace</h1>
            <div className= 'shoes'></div>
                {shoes.map((shoe)=>(
                    <div className='shoe' key={shoe.id}>
                        {shoe.image && <img src={shoe.image} alt=""/>}
                        <h2> {shoe.prod_name}</h2>
                        <p> {shoe.prod_description}</p>
                        <span> {shoe.price}</span>
                    </div>

                ))}

        <button>
        <Link to= "/add"> Add new item</Link>
        </button>
        </div>
    )
}

export default Shoes