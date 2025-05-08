const express =require('express');
const app=express();
const migration=require('./migration/index.js');
migration();
const routes=require('./routes/index.js');
const cors = require('cors'); // Import CORS middleware
app.use(cors()); // Use CORS middleware
app.use(express.json()); // Parse JSON request bodies


app.get('/', (req,res)=>{
    res.send(`
        <style>
        body{
            margin:0;
            padding:0;
            height: 100vh;
            background-color: #161123;
            display: flex;
            align-items: center;
            justify-content: center;
            }
            div {
                display: flex;
                flex-flow: column wrap;
                align-items: center;
                justify-content: center;
            width: 500px;
            border: 1px solid #ccc;
            font-family: Arial, sans-serif;
            color: #fff;
            padding: 20px;
        }
        </style>
        <div>
        <h1>API para a biblioteca</h1>
        <p>Api Desenvolidade por <strong>DjeyTQ</strong></p>
        <p>Front-End desenvolvido por <strong>Denilson</strong> e <strong>David</strong>
        <h2>Desenvolvida em 2025</h2>
        </div>
        `);
})
app.use(routes);

app.listen(8081, ()=>{
    console.log("API is running!");
})