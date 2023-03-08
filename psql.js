const pool = require("./loginDB");

class Database {
    constructor() {
        this.pool = require("./loginDB.js");
        this.test = 1;
    };

    chNameFromSymToDir(name) {
        let sym = {
            code: 0
        };
        let parCode;

        sym.code = pool.query(
            "SELECT FCODE FROM FILES WHERE FNAME = $1",
            [name], (error, results) => {
              if (error) throw error;
        }).rows;

        parCode = pool.query(
            "SELECT FCODE FROM SYMLINKS WHERE SCODE = $1",
            [sym.code], (error, results) => {
              if (error) throw error;
        }).rows;

        return pool.query(
            "SELECT FNAME FROM FILES WHERE FCODE = $1",
            [parCode], (error, results) => {
              if (error) throw error;
        }).row;
    };

    setHome(uid) {
        
    };

    getFiles(dir, uid, res) {
        let files_tmp;
        let infos;
        let ftype;
        let files = new Array();

        if (dir.type === 'SYM') {
            let symName = dir.name;
            data.name = chNameFromSymToDir (symName);
        };

        pool.query(
          "SELECT FNAME AS name, OID AS oid, ATTR AS attr, (ATTR & B'11100000000') AS types FROM FILES WHERE FNAME LIKE $1 || '/%' AND FNAME NOT LIKE $1 || '/%/%';",
          [dir.name], (error, results) => {
            if (error) throw error;
            files_tmp = (results.rows).concat();

            /* ※attrには文字列が格納されている! 文字列=>bit, bit=>文字列 の変換関数が必要 */
            let i = 0;
            while (i < files_tmp.length) {
                let type_mask = 1792;
                let attr = files_tmp[i].attr & type_mask;

                if (files_tmp[i].oid == uid) {
                    files_tmp[i].attr >>= 4;
                } else {
                    let tmp = files_tmp[i].attr & 15;
                    files_tmp[i].attr = (attr >> 4)  | tmp;
                };
                
                /* query 外では値はundefinedとなるのでコードの更新必要。 initDirに新たなメソッド追加して外でも使えるようにした。*/
                pool.query(
                "SELECT ECODE AS command FROM EXECUTABLES WHERE (ATTR_CODE >> 4) = ($1 >> 4) AND ((ATTR_CODE & B'0001111') & ($1 & B'0001111') > B'000000');", 
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

                files.push({
                    name: files_tmp[i].name,
                    cmds: infos,
                    type: ftype
                });
            i++;
            };
            return res.status(200).json(files);
        });
    };

    deleteFile(file, res) {
        if (file.type === 'DIR') {
            file.name += '%';
        } else if (file.type === 'SYM') {
            pool.query(
                "DELETE FROM SYMLINKS WHERE SNAME = $1"
                , [file.name], (error, results) => {
                if (error) throw error;
            });
        };
        pool.query(
            "DELETE FROM FILES WHERE FNAME = $1"
            , [file.name], (error, results) => {
            if (error) throw error;
            return res.status(200).send(file.name + " を削除しました");
        });
    };

    createDir(uid, name, res) {
        pool.query(
            "INSERT INTO FILES VALUES($1, $2, 11111111111);"
            , [name], [uid], (error, results) => {
            if (error) throw error;
            return res.status(200).send(file.name + " を作成しました");
        });
    };
};

const db = new Database();
module.exports = db;
