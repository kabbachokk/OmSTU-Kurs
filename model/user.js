const 
    query       = require('../helpers/query'),
    connection  = require('../helpers/connection'),
    config      = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB
    };

module.exports = 
    {
        findById : (id) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `SELECT * FROM users WHERE id = ${id}`;
                        query(con, q).then(
                            result => resolve(result[0]),
                            err =>  reject(err) 
                        );
                        con.end();
                    },
                    err =>  reject(err) 
                )
            });
        },
    
        findByUsername : (username) => { return new Promise(
            (resolve, reject) => {  
                connection(config).then(
                    con => {
                        let q = `SELECT * FROM users WHERE username = ? `;
                        query(con, q, [username]).then(
                            result => resolve(result[0]),
                            err =>  reject(err) 
                        );
                        con.end();
                    },
                    err =>  reject(err) 
                )
            });
        },
    }

