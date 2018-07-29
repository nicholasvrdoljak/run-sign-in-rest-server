require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 1234
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.post('/checkName', 
    (req, res) => {
        // Check if the name exists. Respond exists/not_exists
        console.log(req.body);
    } 
);

server.post('/signIn',
    (req, res) => {
        // Check if the code is the same as the newest code
        console.log(req.body);
    }
);

server.post('/createQR',
    (req, res) => {
        // Generate random hash, create the QR code?
        console.log(req.body);
    }
);

server.listen(PORT, () => console.log('serving static files on port ', PORT));