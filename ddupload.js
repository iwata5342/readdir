// JavaScript source code
'use strict'

const $ = (id) => document.getElementById(id)
const selectedFiles = []

window.onload = function() {
  let colname = ["kisuu", "gusu"];
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

  let i = 0;
  let bgcolor = document.createElement("div");

  bgcolor.setAttribute("class", "d-flex");
  bgcolor.setAttribute("class", "justify-content-between");
  bgcolor.setAttribute("class", "currentdir");

  let divs = [
      document.createElement("div"),
      document.createElement("div"),
      document.createElement("div")
  ];

  let text = filesinfo[i].name;
  i++;
  divs[0].innerHTML = text;

  let j = 0;
  while (j < divs.length) {
    bgcolor.appendChild(divs[j]);
    j++;
  };

  let currdir = document.getElementById('currdir');
  currdir.appendChild(bgcolor);


  let entries = document.getElementById('entries');

  while (i < filesinfo.length) {
    let bgcolor = document.createElement("div");
    bgcolor.setAttribute("class", "d-flex");
    bgcolor.setAttribute("class", "justify-content-between");
    if (i%2==1) {
      bgcolor.setAttribute("class", "kisuu");
    } else {
      bgcolor.setAttribute("class", "gusu");
    }

    divs = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div")
    ];

    let text = filesinfo[i].name;
    divs[1].innerHTML = text;

    j = 0;
    while (j < divs.length) {
      bgcolor.appendChild(divs[j]);
      j++;
    };

    entries.appendChild(bgcolor);
    i++;
  }
}

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

// ドラッグ&ドロップエリアの取得
var fileArea = document.getElementById('dropArea');

// input[type=file]の取得
var fileInput = document.getElementById('uploadFile');

// ドラッグオーバー時の処理
fileArea.addEventListener('dragover', function(e){
    e.preventDefault();
    fileArea.classList.add('dragover');
});

// ドラッグアウト時の処理
fileArea.addEventListener('dragleave', function(e){
    e.preventDefault();
    fileArea.classList.remove('dragover');
});

// ドロップ時の処理
fileArea.addEventListener('drop', function(e){
    e.preventDefault();
    fileArea.classList.remove('dragover');

    // ドロップしたファイルの取得
    var files = e.dataTransfer.files;

    // 取得したファイルをinput[type=file]へ
    fileInput.files = files;
    
    if(typeof files[0] !== 'undefined') {
        //ファイルが正常に受け取れた際の処理
    } else {
        //ファイルが受け取れなかった際の処理
    }
});

// input[type=file]に変更があれば実行
// もちろんドロップ以外でも発火します
fileInput.addEventListener('change', function(e){
    var file = e.target.files[0];
    
    if(typeof e.target.files[0] !== 'undefined') {
        // ファイルが正常に受け取れた際の処理
    } else {
        // ファイルが受け取れなかった際の処理
    }
}, false);