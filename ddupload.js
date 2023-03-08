// JavaScript source code
let current;
let currinfo;
let homedir;
let homeent;
let currtext;
let uid = 92023000;
let uname = "root";
let colname = ["kisuu", "gusu"];
let cmdset = setCmdSet();//['移動', 'DP', '表示', '差分', ' UP ', ' DL ', ' CL ', '削除']

'use strict'

const $ = (id) => document.getElementById(id)
const selectedFiles = []

window.onload = function(filesinfo) {
  //setUname(uid);
  if(homeent == null) {
    current = {
      name : "Server/Home", 
      time : "modify_time", 
      exec : [], 
      type : "DIR" 
    }
  }
  initDir(current, uid);
}

window.addEventListener('load', () => {
  $('uploadButton').addEventListener('click', (evt) => {
    evt.preventDefault()

    if (selectedFiles.length === 0) {
      console.log('No file is selected.')
      return
    }

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

function setCmdSet() {
  const xhr = new XMLHttpRequest();
	// リクエスト
	xhr.open("GET", '/init_cmd_list');
	//リクエスト送信
	xhr.send();
	// 自動的に呼ばれる関数
	xhr.onreadystatechange = function () {
	  // readyState XMLHttpRequest の状態 4: リクエストが終了して準備が完了
    // status httpステータス
    if (xhr.readyState == 4 && xhr.status == 200) {
        // jsonをオブジェクトに変更
        return JSON.parse(xhr.responseText);
    }
  }
}

function initDir(currdir, uid) {
  const xhr = new XMLHttpRequest();
  // リクエスト
  xhr.open("PUT", '/init');
  //リクエスト送信
  xhr.setRequestHeader('Content-Type', 'application/json')
  let json_src = {
    "dir": currdir,
    "uid": uid
  }
  let json_text = JSON.stringify(json_src)
  console.log(json_text)
  xhr.send(json_text)
  // 自動的に呼ばれる関数
  xhr.onreadystatechange = function () {
    // readyState XMLHttpRequest の状態 4: リクエストが終了して準備が完了
    // status httpステータス
    if (xhr.readyState == 4 && xhr.status == 200) {
      // jsonをオブジェクトに変更
      const jsonObj = JSON.parse(xhr.responseText);
      let filesinfo = jsonObj;
      console.log(filesinfo);
      let c = 0;
      while (c < filesinfo) {
        console.log(filesinfo[c++]);
      }
      if (homedir == null) {
        homedir = filesinfo
      }
      currinfo = filesinfo[0];

      let i = 0;
      let bgcolor = document.createElement("div");

      bgcolor.setAttribute("class", "d-flex justify-content-between currentdir bg-gradient d-block bg-success bg-opacity-50 text-dark");
      let divs = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div")
      ];
      let text = filesinfo[i].name;
      i++;
      divs[1].innerHTML = text;

      let j = 0;
      while (j < divs.length) {
        bgcolor.appendChild(divs[j]);
        j++;
      }
      let currdir = document.getElementById('currdir');
      let diffmenu = document.getElementById('diffmenu');
      while (currdir.firstChild) {
        currdir.removeChild(currdir.firstChild);
      }
      currdir.appendChild(bgcolor);

      while (i < filesinfo.length) {
        let bgcolor = document.createElement("div");
        bgcolor.setAttribute("class", "d-flex justify-content-between");
        if (i%2==1) {
          bgcolor.setAttribute("class", "bg-gradient d-block bg-secondary text-success bg-opacity-10");
        } else {
          bgcolor.setAttribute("class", "bg-gradient d-block bg-success bg-opacity-25 text-seccess");
        }

        divs = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div")
        ];

        let text = filesinfo[i].name;
        divs[1].innerHTML = text;
        
        let textFiles = new Array();
        for (let file in filesinfo[i].exec) {
          if (file.exec === '差分') {
            textFiles.push(filesinfo[i].name);
            continue;
          }
          let element = document.createElement("div");
          let cnt = 0
          while(cnt < cmdset.length && cmdset[cnt].cmdname !== file) cnt++;
          console.log(cmdset[cnt].cmdname)
          element.setAttribute('id', (cnt+1));
          element.innerHTML(cmd);
          divs[2].appendChild(element);
        }

        j = 0;
        while (j < divs.length) {
          bgcolor.appendChild(divs[j]);
          j++;
        };

        if (filesinfo[i].type === 'TXT' || filesinfo[i].type === 'C' || filesinfo[i].type === 'CPP') {
          let option = document.createElement("option");
          option.innerHTML = filesinfo[i].name;
          diffmenu.appendChild(option);
        }
        currdir.appendChild(bgcolor);
        i++;
      }
    }
  }
}

function chIdToCmd(fno, cmdId) {
  const xhr = new XMLHttpRequest();
  // リクエスト
  xhr.open("GET", '/command');


  //リクエスト送信
  let json_text
  if (fno.length == 1) {
    json_text = {
      file: current[fno],
      cmdId: cmdId
    }
  } else if (fno.length == 2) {
    json_text = {
      before: current[fno[1]],
      after: current[fno[2]],
      cmdId: cmdId
    }
  } else if (fno.length == 0) {
    json_text = cmdId
  }
  xhr.send(json_text);

  // 自動的に呼ばれる関数
  xhr.onreadystatechange = function () {
  // readyState XMLHttpRequest の状態 4: リクエストが終了して準備が完了
    // status httpステータス
    if (xhr.readyState == 4 && xhr.status == 200) {
        // jsonをオブジェクトに変更
        const rettext = xhr.responseText;
        let textnox = document.getElementById('textbox')
        textbox.innerHTML = rettext;
        return textbox
    }
    const rettext = xhr.responseText;
    let textnox = document.getElementById('textbox')
    textbox.innerHTML = 'UDD'
    return textbox
  }
}

function download (fno) {
  const xhr = new XMLHttpRequest();

  // リクエスト
  xhr.open("POST", 'download.js');

  //リクエスト送信
  if (fno.length == 1) xhr.send(current[fno], cmdId);
  else if (fno.length == 2) xhr.send(current[fno[1]], current[fno[2]], cmdId);

  // 自動的に呼ばれる関数
  xhr.onreadystatechange = function () {
    // readyState XMLHttpRequest の状態 4: リクエストが終了して準備が完了
    // status httpステータス
    if (xhr.readyState == 4 && xhr.status == 200) {
    }
  }
}

function remove(fno) {
  const xhr = new XMLHttpRequest();

  // リクエスト
  xhr.open("POST", 'remove.js');

  //リクエスト送信
  xhr.send(current[fno]);

  // 自動的に呼ばれる関数
  xhr.onreadystatechange = function () {
    // readyState XMLHttpRequest の状態 4: リクエストが終了して準備が完了
    // status httpステータス
    if (xhr.readyState == 4 && xhr.status == 200) {
        const rettext = xhr.responseText;
        let textnox = document.getElementById('textbox')
        textbox.innerHTML = rettext;
    }
  }
}

function moveFile(fno) {
}