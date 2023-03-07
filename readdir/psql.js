export class Database {
    constructor() {
        this.pool = require("./db");
    }

    getAttr(fname, uname) {
        pool.query(
            "SELECT ATTR_CODE, OWNER FROM FILES WHERE FNAME = $1;", 
            [fname], (error, results) => {
            if (error) throw error;
            let info = res.status(200).json(result.rows)
            if (info.owner === uname) {
                return info.attr_code & 11110000;
            } else {
                return info.attr_code & 1111;
            }
        });

    getFiles(dname, uname) {
        let attr_org = 0;
        let attr = 0;
        let files = new Array();
        
        /* ファイルのコード、名前、権限、
        pool.query(
            "SELECT FCODE, FNAME, ATTR_CODE, OWNER FROM FILES WHERE FNAME = $1;", 
            [fname], (error, results) => {
            if (error) throw error;

        /* SQL文の訂正必要 */
        pool.query(
            "SELECT DIRS.FCODE, FNAME, PROCESS_NAME FROM DIRS JOIN FILES ON DIRS.FCODE = FILES.FCODE LEFT OUTER JOIN EXECUTABLES ON FILES.TYPE_CODE = EXECUTABLES.TYPE_CODE AND EXECUTABLES.ATTR_CODE = $1 WHERE DCODE IN (SELECT FCODE FROM FILES WHERE FNAME = $2);", 
            [attr], [dname], (error, results) => {
            if (error) throw error;
            return res.status(200).json(results.rows);
        });
    };

    deleteFile(fname) {
        pool.query(
            "DELETE FROM FILES WHERE FNAME = $1"
            , [fname], (error, results) => {
            if (error) throw error;
            return res.status(200).send(fname + " を削除しました");
        });
    };

    getParentDir(fcode) {
        pool.query(
            "SELECT PNAME FROM DIR WHERE PCODE = (SELECT PCODE FROM FILES WHERE FCODE = $1)"
            , [fcode], (error, results) => {
            if (error) throw error;
            if (res.rows.length > 1) {
                return res.status(200).send("Error : SQLError");
            } else {
                return res.status(200).json(results.rows);
            }
        });
    }

}
