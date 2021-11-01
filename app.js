const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { port } = require("./src/config");
const routesUser = require('./src/routes/users');
const routesBills = require('./src/routes/bills');
const routesAccounts = require('./src/routes/accounts');
const exphbs = require('express-handlebars');

const app = express();

// Templating Engine
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(cors(), express.json(), cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/', routesUser);
app.use('/', routesBills);
app.use('/', routesAccounts);
app.use('/', (req,res) => {res.redirect('/login')});

app.all('*', (req,res) => {res.send('Something wrong..')});

app.listen(port, () => {
    console.log(
        `My app is running and listening to port http://localhost:${port}/`
    );
});