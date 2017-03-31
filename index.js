var express = require("express");
var app = express();
var port = 8081;
var path = require('path')

app.get("/", function(req, res){
	res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.listen(port);
console.log("listening on port: " + port);
