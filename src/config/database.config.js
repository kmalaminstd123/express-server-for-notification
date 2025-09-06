const mysql = require("mysql")

const db = mysql.createConnection({
    host:     "host",
    user:     "username",
    password: "password",
    database: "db_name"
})



module.exports = {
    db
}