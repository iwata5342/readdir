const express = require('express');
const path = require('path');
const http = require('http');
const multer = require('multer');
var fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '.')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './file-choice.html')));

app.listen(port,function(){
	console.log(`Example app listening on port ${port}!`);
});