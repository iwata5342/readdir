// JavaScript source code
'use strict'
import { Database } from "./psql";
database = new Database();
const express = require("express");
const http = require("http");
const request = require("request");

const app = express();
const PORT = 5000;

let localaddr = "172.19.191.19:5000/";
let entries = document.getElementsByClassName("entries");
let colname = ["kisuu", "gusu"];
let uid;
let homedir = {
  name: "",
  entries: {}
}

let filesinfo = homedir.entries;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './login.html'))
});

app.get('/home', (req, res) => {
  homedir.name = req.on('homedir');
  uid = req.on('uid');
  filesinfo = homedir.entries = database.getFiles(uid, homedir.name);
  const options = {
    url: 'https://' + localaddr + "./file-choice.html",
    method: 'POST',
    files: filesinfo,
    json: true
  }

  request(options, function (err, response, body) {
    res.sendFile(path.join(__dirname, './file-choice.html'))
  })
})
/*
const $ = (id) => document.getElementById(id)
const selectedFiles = []

[
  {
    name: "カレントディレクトリ名",
    date: "modify_time",
    execs: [],
    type: "dir"
  },
  {
    name: "ファイル名",
    date: "modify_time",
    execs: [ "表示", " DL ", "削除" ],
    type: "text"
  },
  {
    name: "実行ファイル名",
    date: "modify_time",
    execs: [ "ダンプ", " DL ", "削除" ],
    type: "exec"
  },
  {
    name: "ディレクトリ名",
    date: "modify_time",
    execs: [ "移動" ],
    type: "dir"
  }
]

ファイル一覧作成
for (let i in filesinfo) {
  let bgcolor = document.createElement("div");
  bgcolor.setAttribute("class", "d-flex justify-content-between currentdir");

  let divs = [
      document.createElement("div"),
      document.createElement("div"),
      document.createElement("div")
  ];

  let text = document.createTextNode(filesinfo[i].name);
  divs[1].appendChild(text);

  for (let i in divs) {
    bgcolor.appendChild(divs[i]);
  };

  entries.appendChild(bgcolor);
}

/*
window.addEventListener('load', () => {
  $('uploadButton').addEventListener('click', (evt) => {
    evt.preventDefault()

    if (selectedFiles.length === 0) {
      console.log('No file is selected.')
      return
    }

    const fd = new FormData()
    selectedFiles.forEach((f) => fd.append('file1', f, f.name))

    const xhr = new XMLHttpRequest()

    xhr.open('POST', '/test1')

    // Basic Events
    xhr.addEventListener('load', (evt) => {
      console.log('** xhr: load')
      const response = JSON.parse(xhr.responseText)
      console.log(response)
    })

    xhr.addEventListener('progress', (evt) => {
      console.log('** xhr: progress')
    })

    xhr.addEventListener('error', (evt) => {
      console.log('** xhr: error')
    })

    // Upload Events
    xhr.upload.addEventListener('loadstart', (evt) => {
      console.log('++ xhr.upload: loadstart')
      setProgressBar(0)
    })

    xhr.upload.addEventListener('progress', (evt) => {
      const percent = ((evt.loaded / evt.total) * 100).toFixed(1)
      console.log(`++ xhr.upload: progress ${percent}%`)
      setProgressBar(percent)
    })

    xhr.upload.addEventListener('abort', (evt) => {
      console.log('++ xhr.upload: abort (Upload aborted)')
    })

    xhr.upload.addEventListener('error', (evt) => {
      console.log('++ xhr.upload: error (Upload failed)')
    })

    xhr.upload.addEventListener('load', (evt) => {
      console.log('++ xhr.upload: load (Upload Completed Successfully)')
    })

    xhr.upload.addEventListener('timeout', (evt) => {
      console.log('++ xhr.upload: timeout')
    })

    xhr.upload.addEventListener('loadend', (evt) => {
      console.log('++ xhr.upload: loadend (Upload Finished)')
      setTimeout(() => clear(), 1e3)
    })

    xhr.send(fd)
  })

  $('clearButton').addEventListener('click', (evt) => {
    evt.preventDefault()
    clear()
  })

  $('dropTarget').addEventListener('dragover', (event) => {
    event.preventDefault()
  })

  $('dropTarget').addEventListener('drop', (event) => {
    event.preventDefault()
    if(event.dataTransfer.items) {
      for(const item of event.dataTransfer.items){
        const { kind } = item
        if(kind === 'file'){
          const file = item.getAsFile()
          selectedFiles.push(file)
        }
      }
      updateFileList()
    }
  })
})

const setProgressBar = (percent) => {
  if (percent < 0) {
    showProgressBar(false)
  } else {
    showProgressBar(true)
    $('progressBar').style.width = `${percent}%`
  }
}

const showProgressBar = (show) => {
  const c = $('progressBarContainer')
  if (show) {
    removeClass(c, 'invisible')
    addClass(c, 'visible')
  } else {
    removeClass(c, 'visible')
    addClass(c, 'invisible')
    $('progressBar').style.width = '0%'
  }
}

const removeClass = (elm, cls) => {
  if (elm.classList.contains(cls)) {
    elm.classList.remove(cls)
  }
}

const addClass = (elm, cls) => {
  if (!elm.classList.contains(cls)) {
    elm.classList.add(cls)
  }
}

const clear = () => {
  showProgressBar(false)
  selectedFiles.length = 0
  updateFileList()
}

const updateFileList = () => {
  const fl = $('fileList')
  fl.innerHTML = '' // remove all children
  for (const f of selectedFiles) {
    const li = document.createElement('li')
    li.innerHTML = f.name
    li.className = 'list-group-item'
    fl.appendChild(li)
  }
}
*/