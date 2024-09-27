const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');



const app = express();

//Middleware

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
dotenv.config();

app.use(session({
    secret:'hftrvh4573gv',
    resave:false,
    saveUninitialized: false
}));



//Create connection
const connection = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
});


///Check connection //Connect to database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database successfully!');
});


//Create database
connection.query('CREATE DATABASE if not exists corrupt', (err, result) => {
    if (err) throw (err)
    console.log('Database created successfully');
});


//Access database
connection.query('USE corrupt', (err, result) => {
    if(err) throw (err)
        console.log('Database accessed successfully');
});

//Create Table
/*const report = `CREATE TABLE report (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    accused VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description VARCHAR(1500) NOT NULL,
    location_incidence VARCHAR(255) NOT NULL,
    date DATE NOT NULL
)`; 


connection.query(report, (err, result) => {
    if (err) {
        console.error('Error creating Tracker Table:', err);
        return;
    }
    console.log('Report Table created successfully');
});
*/



//Display routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
  


//Create Report Route
app.post('/', (req, res) => { 
    const {accused, position, description, location_incidence, date } = req.body;    

    // Ensure all required fields are available
    if (!accused || !position || !description || !location_incidence || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO report (`accused`, `position`, `description`, `location_incidence`, `date`) VALUES (?, ?, ?, ?, ?)';
    console.log('SQL Query:', query);
    console.log('Values:', [accused, position, description, location_incidence, date]);

    connection.query(query, [accused, position, description, location_incidence, date], (err, result) => {
        if (err) {    
            return res.status(500).json({ error: err.message });    
        }
         res.redirect('/');
    });
});


app.listen(4300, () => {
    console.log('Server running at port 4300')
});