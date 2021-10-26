const db = require('./databaseConfig')
const userDB = {
    addUser: (userid, star = 0, rep = 0, exp = 0, callback) => {
        const conn = db.getConnection()
        conn.connect((error) => {
            if (error) { console.log(error); return callback(error, null) }
            const sql = "INSERT INTO users(userid, star, rep, exp) VALUES(?, ?, ?, ?)"
            conn.query(sql, [userid, stars, rep, exp], (error, result) => {
                return error ? callback(error, null) : callback(null, result)
            })
        })
    },
    getUser: (userid = null, callback) => {
        const conn = db.getConnection()
        conn.connect((error) => {
            if (error) { console.log(error); return callback(error, null) }
            const sql = `SELECT userid, star, rep, exp FROM users ${userid ? 'WHERE userid = ?' : ''}`
            conn.query(sql, [userid], (error, result) => {
                return error ? callback(error, null) : callback(null, result)
            })
        })
    },
}
module.exports = userDB