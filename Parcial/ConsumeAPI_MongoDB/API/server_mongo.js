const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app=express();
app.use(cors());

const uri="mongodb://mifejev840_db_user:contrasena@ac-4ft5kg0-shard-00-00.o8taslz.mongodb.net:27017,ac-4ft5kg0-shard-00-01.o8taslz.mongodb.net:27017,ac-4ft5kg0-shard-00-02.o8taslz.mongodb.net:27017/?ssl=true&replicaSet=atlas-lp2qvq-shard-0&authSource=admin&appName=Cluster0"
const client = new MongoClient(uri);

async function main(){
    await client.connect();
    const db=client.db("sample_mflix")
    const movies = db.collection("movies");

    app.get("/movies", async (req, res) => {
    const data = await movies
        .find({}) 
        .limit(60)
        .toArray();
    res.json(data);
    });

    app.listen(4000, '0.0.0.0', () => console.log("Server running on port 4000"));
}

main().catch(console.error)