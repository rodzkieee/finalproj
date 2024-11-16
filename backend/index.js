import express from "express"
import mysql from "mysql"
import cors from 'cors'
const app= express()

const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ediwow09",
    database: "marketplace"

})

app.use(express.json())
app.use(cors())

app.get("/", (req, res)=>{
    res.json("hello, this is the backend")
})

app.get("/shoes", (req, res)=>{
    const q= "SELECT * FROM shoes"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}) 
app.post("/shoes", (req, res)=>{
    const q= "INSERT INTO shoes (`prod_name`, `prod_description`, `image`, `price`) VALUES(?)";
    const values = [

        req.body.prod_name,
        req.body.prod_description,
        req.body.image,
        req.body.price,
    ];
    db.query(q,[values], (err, data)=>{
        if(err) return res.json(err)
        return res.json("Successfuly executed")
    })
})


app.delete("/shoes/:id", (req, res)=>{
    const shoeId= req.params.id;
    const q= "DELETE FROM shoes WHERE id= ?"

    db.query(q,[shoeId], (err, data)=>{
        if(err) return res.json(err)
        return res.json("Successfuly deleted")
    })
})


app.put("/shoes/:id", (req, res)=>{
    const shoeId= req.params.id;
    const q= "UPDATE shoes SET `prod_name`=?, `prod_description`=?, `image`=?, `price`=? WHERE id=?"
    const values = [

        req.body.prod_name,
        req.body.prod_description,
        req.body.image,
        req.body.price,
    ];


    db.query(q,[...values, shoeId], (err, data)=>{
        if(err) return res.json(err)
        return res.json("The item has been sucessfuly updated!")
    })
})



app.listen(8800, ()=>{
    console.log("connected to backend")

})