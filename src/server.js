const express = require('express');
const route = require('./route');
const path = require('path');
const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(route);

app.use((req, res) => res.render('index', {page:'erro404', title: 'Erro404'}));

app.listen(3000, () => console.log("Server running"));