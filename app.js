'use strict';

var express = require('express');

if (!process.env.MEETUP_KEY) {
    console.log('API key not found');
    process.exit(1);
}

var app = express();
var home = require('./src/home.js');
var PORT = 21126;

app.use('/', express.static(__dirname + '/public'));
app.get('/languages', home.getLanguages);

app.listen(PORT, function () {
    console.log(new Date() + ': Server listening on port ' + PORT);
});