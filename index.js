const express = require('express');
const app = express()
const dotenv = require('dotenv')
dotenv.config();
const bodyParser = require('body-parser')
require('./Models/Config')
const routes = require('./Routers/MainRouter')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes)


app.listen(process.env.PORT, function (req, res) {
    console.log(`server is running on port : ${process.env.PORT}`);
  });

  
