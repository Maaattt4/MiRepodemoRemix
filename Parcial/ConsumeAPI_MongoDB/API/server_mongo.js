const express = require("express");
const { MongoClient } = requiere("mongodb");
const cors = require("cors");

const app=express();
app.use(cors());

const uri="mongodb+srv://xigocen126_db_user:contraseña@cluster0.9a7hluj.mongodb.net/?appName=Cluster0"
const client = new MongoClient(uri);

async function main(){
    await client.connect();
    const db=client.db("sample_mflix")
    const movies = db.collection("movies");

    app.get("/movies", async (req, res)=>{
        const data = await movies
        .find({},{projection:{poster:1, titulo:1, fullplot:1 }})
        .limit(60)
        .toArray();
        res.json(data);
    });

    app.listen(4000, ()=> console.log("Server running at http://localhost:4000"))
}

main().catch(console.error)