const database = require('./psql.js')

init = database.getFiles('Server/Home/oasys2201', 12023001);

module.exports = init;