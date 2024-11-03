const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database('./cookie.db');

// Database setup
db.serialize(() => {
    // Problem1 table (keeping your existing setup)
    db.run(`DROP TABLE IF EXISTS Problem1`);
    db.run(`CREATE TABLE Problem1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Cookie_id INTEGER,
        Quantity INTEGER
    )`);
    const problem1Data = [
        { id: 1, Cookie_id: 3, Quantity: 12 },
        { id: 2, Cookie_id: 4, Quantity: 12 },
        { id: 3, Cookie_id: 2, Quantity: 13 },
        { id: 4, Cookie_id: 1, Quantity: 22 }
    ];
    const insertProblem1 = db.prepare('INSERT INTO Problem1 (id, Cookie_id, Quantity) VALUES (?, ?, ?)');
    problem1Data.forEach(row => {
        insertProblem1.run(row.id, row.Cookie_id, row.Quantity);
    });
    insertProblem1.finalize();

    // Problem2 table - Ingredient stock information
    db.run(`DROP TABLE IF EXISTS Problem2`);
    db.run(`CREATE TABLE Problem2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Ingredient_name TEXT,
        Ingredient_stock INTEGER,
        total_used INTEGER,
        remaining_stock INTEGER,
        Recipe_unit TEXT
    )`);
    const problem2Data = [
        { name: "All Purpose Flour", stock: 6100, used: 1100, remaining: 5000, unit: "gram" },
        { name: "Baking Powder", stock: 300, used: 16, remaining: 284, unit: "gram" },
        { name: "Baking soda", stock: 100, used: 0, remaining: 100, unit: "NULL" },
        { name: "Brown Sugar", stock: 1000, used: 320, remaining: 680, unit: "gram" },
        { name: "Caster Sugar", stock: 3100, used: 510, remaining: 2590, unit: "gram" },
        { name: "Chocolate chips", stock: 1500, used: 200, remaining: 1300, unit: "gram" },
        { name: "Cold Salted Butter", stock: 500, used: 300, remaining: 200, unit: "gram" },
        { name: "Dark chocolate", stock: 1500, used: 550, remaining: 950, unit: "gram" },
        { name: "Eggs", stock: 50, used: 21, remaining: 29, unit: "leaves" }
    ];
    const insertProblem2 = db.prepare(`
        INSERT INTO Problem2 (Ingredient_name, Ingredient_stock, total_used, remaining_stock, Recipe_unit) 
        VALUES (?, ?, ?, ?, ?)
    `);
    problem2Data.forEach(row => {
        insertProblem2.run(row.name, row.stock, row.used, row.remaining, row.unit);
    });
    insertProblem2.finalize();

    // Create tables for Problem3 and Problem4 with the same structure
    // but they will be populated with different data as needed
db.run(`DROP TABLE IF EXISTS Problem3`);
    db.run(`CREATE TABLE Problem3 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Order_Date DATETIME NOT NULL,
        Quantity INTEGER,
        Total_sales INTEGER
    )`);

    const problem3Data = [
        { 
            id: 1, 
            Order_Date: '2024-10-02 16:50:00', 
            Quantity: 9, 
            Total_sales: 351
        }
    ];

    const insertProblem3 = db.prepare(`
        INSERT INTO Problem3 (id, Order_Date, Quantity, Total_sales) 
        VALUES (?, ?, ?, ?)
    `);

    problem3Data.forEach(row => {
        insertProblem3.run(row.id, row.Order_Date, row.Quantity, row.Total_sales);
    });

    insertProblem3.finalize();  // แก้ไขจาก insertProblem4 เป็น insertProblem3

    // Problem4 table setup
    db.run(`DROP TABLE IF EXISTS Problem4`);
    db.run(`CREATE TABLE Problem4 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Payment_methods TEXT,
        Total_payment INTEGER  
    )`);

    const problem4Data = [
        { 
            id: 1, 
            Payment_methods: 'เงินโอน', 
            Total_payment: 9 
        }
    ];

    const insertProblem4 = db.prepare(`
        INSERT INTO Problem4 (id, Payment_methods, Total_payment) 
        VALUES (?, ?, ?)
    `);

    problem4Data.forEach(row => {
        insertProblem4.run(row.id, row.Payment_methods, row.Total_payment);
    });

    insertProblem4.finalize();
});

// Update your existing routes to include the new tables
app.get('/all-data', (req, res) => {
    const tables = ['Cookie', 'Orders', 'OrderDetail', 'Stock', 'Ingredients', 'Recipes', 
                   'RecipesIngredients', 'Problem1', 'Problem2', 'Problem3', 'Problem4'];
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

// Add specific routes for Problem2, Problem3, and Problem4
app.get('/problem2-data', (req, res) => {
    const query = `SELECT * FROM Problem2 ORDER BY id`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/problem3-data', (req, res) => {
    const query = `SELECT * FROM Problem3 ORDER BY id`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/problem4-data', (req, res) => {
    const query = `SELECT * FROM Problem4 ORDER BY id`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});