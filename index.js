
const express = require('express')
const path = require('path')
const multer = require('multer')

/* 新規 */
const bodyParser = require('body-parser');

const database = require('./psql.js')

const app = express()
const port = 4000

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/home/i/up/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

app.use(express.static(path.join(__dirname, '.')))
app.use(bodyParser.json())

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './file-choice.html')))

app.get('/init', (req, res) => {
    let initdata = database.getFiles(req.body.dir, req.body.uid);
    return res.status(200).json(initdata);
});

app.get('/delete', (req, res) => {
    return database.delete File(req.body.name, res);
});

/*
app.get('/psql.js', (req, res) => {
  let init = InitClass("Server/Home/oasys2201", 1);
  res.send(init);
})

app.post('/upload', upload.single('file'), function (req, res, next) {
    console.log(req.file);
    res.send('ファイルのアップロードが完了しました。');
  });
*/
app.listen(port,function(){
	console.log(`Example app listening on port ${port}!`)
})
