const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
const setupRoutes = require("./Routes/index")


let app = express();
const port = process.env.PORT || 8080;
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cors());

setupRoutes(app)
mongoose.connect(process.env.URL).then((res) => {
    console.log('Database connected successfully!');
}).catch((error) => {
    console.log("Error occured while connecting",error);
})

app.listen(port,()=>{
console.log("Server running on port no :- ", port);
});