const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/img', express.static('img'));

const db = new sqlite3.Database('./cookie.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the Cookie database.');
    }
});


// Routes
app.get('/all-data', (req, res) => {
    const tables = ['Problem1', 'Problem2', 'Problem3', 'Problem4'];
    const data = {};
    let completedQueries = 0;

    tables.forEach((table) => {
        const query = `SELECT * FROM ${table}`;
        db.all(query, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            data[table] = rows;
            completedQueries++;
            if (completedQueries === tables.length) {
                res.json(data);
            }
        });
    });
});

app.get('/cookie', (req, res) => {
    db.all('SELECT * FROM cookie', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/cookie', (req, res) => {
    const { cookie_name, Description, price } = req.body;
    const query = `INSERT INTO cookie (cookie_name, Description, price) VALUES (?, ?, ?)`;
    db.run(query, [cookie_name, Description, price], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, cookie_name, Description, price });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
