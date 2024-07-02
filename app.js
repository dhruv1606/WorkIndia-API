const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dhruv@1606',
    database: 'mydatabase',
    authPlugin: 'mysql_native_password'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.get('/api/data', (req, res) => {
    let sql = 'SELECT * FROM credentials';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        res.json(results);
    });
});

app.post('/api/data', (req, res) => {
    const { name, email } = req.body;
    let sql = 'INSERT INTO credentials (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        res.send('Data inserted successfully');
    });
});

app.get('/login', (req, res) => {
    const { username, password } = req.body;
    let sql = 'SELECT * FROM credentials WHERE username=? AND password=?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(401).json({
                message: 'Login Failed'
            });
            return;
        } else {
            res.status(200).json({
                message: 'Login Successful',
                jwtoken: token
            });
        }
    });
})

app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;
    let sql = 'INSERT INTO credentials (username, password, email) VALUES (?, ?, ?)';
    let userid = 1;
    db.query(sql, [username, password, email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        let y = JSON.parse(result);
        userid = y.userid;
    });

    res.send(userid);
    // sql = 'SELECT * FROM credentials WHERE username=? AND password=?';
    // db.query(sql, [username, password], (err, result) => {
    //     if (err) {
    //         res.status(401).json({
    //             message: 'Login Failed'
    //         });
    //         return;
    //     } else {
    //         res.status(200).json(result);    
    //     }
    // });

    // try {
    //     const token = jwt.sign({ email: email, id: userid }, "test", {
    //       expiresIn: "1h",
    //     });
    //     console.log(token)
    //     res.status(201).json({ result: newUser, token });
    //   } catch (error) {
    //       res.status(409).json({ message: error.message });
    //   }
})

app.post('/newfeed', (req, res) => {
    const { category, title, author, publish_date, content, actual_content_link, image, upvote, downvote } = req.body;
    let sql = 'INSERT INTO feed (category, title, author, publish_date, content, actual_content_link, image, upvote, downvote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [category, title, author, publish_date, content, actual_content_link, image, upvote, downvote], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        res.send('Data inserted successfully');
    });
});

app.get('/feed', (req, res) => {
    let sql = 'SELECT * FROM feed';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        res.json(results);
    });
});

app.post('/categoryfeed', (req, res) => {
    const {category} = req.body;
    let sql = 'SELECT * FROM feed WHERE category=?';
    db.query(sql, [category], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        res.json(results);
    });
});

app.post('/upvotesfeed', (req, res) => {
    const { upvote } = req.body;
    let sql = 'SELECT * FROM feed WHERE upvote>?';
    db.query(sql, [upvote], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        res.json(results);
    });
});

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});
