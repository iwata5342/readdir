const pool = require("./loginDB");

class CmdSrarcher {
    getCmmandList(res) {
        pool.query(
            "SELECT CMDNAME FROM CMDLIST ORDER BY CMDID ASC;", 
            (error, results) => {
            if (error) throw error;
            return res.status(200).json(results.rows);
        })
    }
}

module.exports = new CmdSrarcher()