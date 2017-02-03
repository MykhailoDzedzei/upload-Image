var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

var images = require('./api/controller/imageController');
mongoose.connect('mongodb://localhost:27017/images');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', images);

var port = process.env.port || 3000;

app.listen(port, function () {
    console.log('Server works at localhost:', +port);
});



