const { database } = require("pg/lib/defaults");

class Database {
    constructor() {
        this.pool = require("./loginDB");
    }

    chNameFromSymToDir(name) {
        let sym = {
            code: 0
        };
        let parCode;

        pool.query(
            "SELECT FCODE FROM FILES WHERE FNAME = $1",
            [name], (error, results) => {
              if (error) throw error;
              sym.code = results.rows;
        });

        pool.query(
            "SELECT FCODE FROM SYMLINKS WHERE SCODE = $1",
            [sym.code], (error, results) => {
              if (error) throw error;
              parCode = results.rows;
        });

        pool.query(
            "SELECT FNAME FROM FILES WHERE FCODE = $1",
            [parCode], (error, results) => {
              if (error) throw error;
              return results.rows;
        });
    }

    setHome(uid) {
        
    }

    getFiles(data) {
        let files_tmp = new Array();
        let infos;
        let ftype;
        let files = new Array();

        if (data.type === 'SYM') {
            let symName = data.name;
            data.name = chNameFromSymToDir (symName);
        }

        this.pool.query(
          "SELECT FNAME AS name, OID AS oid, ATTR AS attr, (ATTR & B'11100000000') AS types FROM FILES WHERE FNAME LIKE $1 || '/%' AND FNAME NOT LIKE $1 || '/%/%';",
          [data.name], (error, results) => {
            if (error) throw error;
            files_tmp = results.rows;
        });
        let i = 0;
        while (i < files_tmp.length) {
            let type_mask = 1792;
            let attr = files_tmp[i].attr & type_mask;

            if (files_tmp[i].oid === data.uid) {
                files_tmp[i].attr >>= 4;
            } else {
                let tmp = files_tmp[i].attr & 15;
                files_tmp[i].attr = (files_tmp[i].attr >> 4) | tmp;
            }
            pool.query(
              "SELECT ENAME AS command FROM EXCUTABLES WHERE ATTR_CODE = B$1", 
              [files_tmp[i].attr], (error, results) => {
                if (error) throw error;
                infos = results.rows;
            });

            pool.query(
                "SELECT TNAME FROM FILE_TYPES WHERE TCODE = B$1", 
                [attr], (error, results) => {
                  if (error) throw error;
                  ftype = results.rows;
            });

            files.add({
                name: files_tmp[i].name,
                cmds: infos,
                type: ftype
            });
        i++;
        }
        return files;
    };

    deleteFile(file) {
        if (file.type === 'DIR') {
            file.name += '%';
        } else if (file.type === 'SYM') {
            pool.query(
                "DELETE FROM SYMLINKS WHERE SNAME = $1"
                , [file.name], (error, results) => {
                if (error) throw error;
            })
        }
        pool.query(
            "DELETE FROM FILES WHERE FNAME = $1"
            , [file.name], (error, results) => {
            if (error) throw error;
            return res.status(200).send(file.name + " を削除しました");
        });
    };

    createDir(uid, name) {
        pool.query(
            "INSERT INTO FILES VALUES($1, $2, 11111111111);"
            , [name], [uid], (error, results) => {
            if (error) throw error;
            return res.status(200).send(file.name + " を作成しました");
        });
    };
}

const db = new Database()
module.exports = db;