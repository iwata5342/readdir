this.pool = require("./db");

pool.query(
    "SELECT ;", 
    [attr], [dname], (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
});