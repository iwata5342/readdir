// JavaScript source code
'use strict'

const $ = (id) => document.getElementById(id)
const selectedFiles = []

let entries = document.getElementsByClassName("entries");
let count = 0;
let colname = ["kisuu", "gusu"];

let filename = "";
let filesinfo = [
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

let outpts = new Array();


let bgcolor = document.createElement("div");
bgcolor.setAttribute("class", "d-flex justify-content-between currentdir");

let divs = [
    document.createElement("div"),
    document.createElement("div"),
    document.createElement("div")
];

let text = document.createTextNode(fileinfo[0].name);
divs[1].appendChild(text);
let i = 0;
while (i < divs.length) {
  bgcolor.insertBefore(divs[i], bgcolor.firstChild);
};

entries.insertBefore(bgcolor, entries.firstChild);
count++;

/* SQL
while (SQL) {
  code.add();
}
*/

i = 0;
while (i < fileinfo.length) {
  bgcolor = document.createElement("div");
  bgcolor.setAttribute("class", colname[count%2] + "d-flex justify-content-between currentdir");

divs = [
    document.createElement("div"),
    document.createElement("div"),
    document.createElement("div")
];

text = document.createTextNode(fileinfo[count].name);
divs[0].appendChild(text);
let i = 0;
while (i < divs.length) {
  bgcolor.insertBefore(divs[i], bgcolor.firstChild);
};

entries.insertBefore(bgcolor, entries.firstChild);
count++;
}


let entry = document.createElement("div");
text = document.createTextNode(filesinfo[count].name);
entries.appendChild(text);
entries.setAttribute("class", colname[count%2] + "d-flex justify-content-between");


let codediv = document.createElement("div");
let codetext = document.createTextNode(code.name);
codediv.appendChild(codetext);
codediv.setAttribute()





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