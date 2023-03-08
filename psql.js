const pool = require("./loginDB");

class Database {
    constructor() {
        this.pool = require("./loginDB.js");
        this.test = 1;
    };

    chNameFromSymToDir(name) {
        let sym = { code: 0 };
        let parCode;
        let dir = { name: "" };

        sym.code = getSymCode(name);
        parCode = getParCode(sym.code);
        dir.name = getDirName(parCode);
        return dir.name;
    };

    setHome(uid) {
        
    };

    getFiles(dir, uid, res) {
        let entries; // entries ⇔ files_tmp
        let infos;
        let ftype;
        let files;

        if (dir.type === 'SYM') {
            let symName = dir.name;
            data.name = chNameFromSymToDir(symName);
        };

        files_tmp = getEntry(dir.name);
            let i = 0;
            while (i < files_tmp.length) {
                let attr;
                const type = files_tmp[i].attr.slice(0, 3);
                const owner_attr = files_tmp[i].attr.slice(3, 7);
                const other_attr = files_tmp[i].attr.slice(7);

                if (files_tmp[i].oid == uid) {
                    attr = type + owner_attr;
                } else {
                    attr = type + other_attr;
                }
         
                infos = getInfo(attr);
                ftype = getType(type);

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
            file.name = file.name + '/% AND FNAME = ' + file.name;
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

    getSymCode(name) {
        return JSON.parse(JSON.stringfy(pool.query(
               "SELECT FCODE FROM FILES WHERE FNAME = $1",
               [name], (error, results) => {
                   if (error) throw error;
               }).rows));
    };

    getParCode(sym_code) {
        return JSON.parse(JSON.stringfy(pool.query(
               "SELECT FCODE FROM SYMLINKS WHERE SCODE = $1",
               [sym_code], (error, results) => {
                   if (error) throw error;
               }).rows));
    };

    getDirName(dcode) {
        returu JSON.parse(JSON.stringfy(pool.query(
               "SELECT FNAME FROM FILES WHERE FCODE = $1",
               [parCode], (error, results) => {
                   if (error) throw error;
               }).row));
    };

    getEntry(dname) {
        return JSON.parse(JSON.stringfy(pool.query(
               "SELECT FNAME AS name, OID AS oid, ATTR AS attr, (ATTR & B'11100000000') AS types FROM FILES WHERE FNAME LIKE $1 || '/%' AND FNAME NOT LIKE $1 || '/%/%';",
               [dname], (error, results) => {
        
                   if (error) throw error;
               }).rows));
    };

    getInfo(attr) {
        return JSON.parse(JSON.stringfy(pool.query(
               "SELECT ECODE AS command FROM EXECUTABLES WHERE (ATTR_CODE >> 4) = (B$1 >> 4) AND ((ATTR_CODE & B'0001111') & (B$1 & B'0001111') > B'0000000');", 
               [attr], (error, results) => {
                   if (error) throw error;
               }).rows));
    };

    getType(type) {
        return JSON.parse(JSON.stringfy(pool.query(
               "SELECT TNAME FROM FILE_TYPES WHERE TCODE = B$1", 
               [type + '00000000'], (error, results) => {
                   if (error) throw error;
               }).rows));
    }
};

const db = new Database();
module.exports = db;
