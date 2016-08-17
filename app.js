var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./app/db');    
    geofences = require('./routes/geofences');    

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('public'));

app.get('/view', function(req, res) {
    res.sendFile(__dirname+  '/views/geofences/view.html')
});
app.get('/create', function(req, res) {
    res.sendFile(__dirname+  '/views/geofences/create.html')
});

app.use('/geofences', geofences);

var port = 9000;

app.listen(port, function () {
console.log("express has started on port: " + port);
});