const http = require("http");
const PORT_HTML = 8080;
/*const PORT_FILE = 4000;*/
const html = require("fs").readFileSync("file-choice.html");
/*
let express = require('formidable');
const mmdb = require("mime-db");
const ff = require("fs")
*/

const html_server = http.createServer((req, res) => {
    //when access from browser
    if (req.method == "GET") {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    } else if (req.method == "POST") {
      req.on('data', function(chunk) {
        data.push(chunk);
      }) .on('end', function() {
        let events = Buffer.concat(data);
        let r = JSON.parse(events);
        console.log(r);
      })
    }
}).listen(PORT_HTML);
/*
const server_file = http.createServer((req,res) => {

    if(req.method === 'GET') {
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.write(upload);
        res.end();
    } else if(req.method === 'POST') {
        let data = '';

        req.on('data', function(chunk) {data += chunk})
           .on('end', function() {
            res.write(data);
            console.log(data);
            res.end();
           })
    }
}).listen(PORT_FILE);

var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.filepath;
      var newpath = '/home/i/up/' + files.filetoupload.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(5000);
*/