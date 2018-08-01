require('dotenv').config();
const db = require('./db/index.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const PORT = process.env.PORT || 1234
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.post('/checkName', 
    (req, res) => {
        // Check if the name exists. Respond exists/not_exists
        console.log(req.body.params);
        res.send({message: 'new_user'});
        db.query(`  SELECT * 
                    FROM users 
                    WHERE firstname = ?
                    AND lastname = ? 
                    AND dob = ?`, 
                    [req.body.params.f, req.body.params.l, req.body.params.d],
                    (err, data) => {
                        console.log(err, data);
                    });
    } 
);

server.post('/signIn',
    (req, res) => {
        // Check if the code is the same as the newest code
        console.log(req.body);
    }
);

server.get('/login', (req, res) => res.sendFile(path.resolve(__dirname, './client/login/index.html')));

/** Below is for the admin dashboard */
server.get('/login_user', (req, res) => {
    // uncomment to create a new admin user
    // bcrypt.hash(process.env.ADMIN_PASS, null, null,
    //     (err, hash) => {
    //         console.log('hashed', err, hash);
    //         db.query(`INSERT INTO administrator (username, password) VALUES (?, ?) `,
    //         [process.env.ADMIN_USER, hash],
    //         (err, response) => {
    //             console.log(err, response);
    //         })
    //     }
    // );
    
    // check for a username
    if (req.query.u && req.query.u.length > 0) {
        db.query('SELECT * FROM administrator WHERE username = ?', [req.query.u], 
            (err, data) => {
                if (data && data.length > 1 || data.length < 1) {
                    // no data was found for the username
                    res.send('no_username_found')
                } else {
                    if (bcrypt.compareSync(req.query.p, data[0].password)) {
                        // if good, send a token and redirect to dashboard
                        const user = { username: data[0].username };
                        jwt.sign({ user }, process.env.JWT_SECRET, (err, token) => {
                            res.json(token);
                        });
                    } else {
                        // wrong password
                        res.send('bad_password');
                    }
                }
            }
        );
    } else {
        // enter a username
        res.send('no_username_sent');
    }
});

server.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './client/login/index.html')));

server.use((req, res, next) => {
    console.log(req.headers.cookie);
    if (typeof req.headers.cookie !== 'undefined') {
        req.token = req.headers.cookie.split('; ')
        if (req.token.length === 1) {
            req.token = req.token[0].slice(1, -1);
        } else {
            req.token = req.token[2].slice(1, -1);
        }
        next();
    } else {
        res.sendStatus(403);
    }
});

server.use((req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.sendStatus(403);
        } else {
            req.username = decoded.user.username;
            next();
        }
    });
})

server.post('/createQR',
    (req, res) => {
        // Generate random hash, create the QR code?
        db.query(`SELECT * FROM runs WHERE date_of_run = ?`, [req.query.d], (err, data) => {
            if (err) console.log(err);
            if (data.length === 0) {
                db.query(`INSERT INTO runs (hash, date_of_run) VALUES (?, ?)`,  [req.query.h, req.query.d], (err, data) => {
                    if (err) console.log(err);
                    res.send({
                        message: 'created_qr_code',
                        hash: req.query.h
                    });
                });
            } else {
                res.send({
                    message: 'duplicate_date',
                    hash: data[0].hash
                });
            }
        });
    }
);

server.get('*', (req, res) => res.sendFile(path.resolve(__dirname, './client/dashboard/index.html')));

server.listen(PORT, () => console.log('serving static files on port ', PORT));