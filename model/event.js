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
        add : (data) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            INSERT events(statusid,title,link,date,place,participants,footing,responsible) 
                            VALUES (?,?,?,?,?,?,?,?);
                        `;
                        query(con, q, Object.values(data)).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            });
        },

        getById : (id) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT events.id, status.name as status_name, statusid, title, link, DATE_FORMAT(date, "%Y-%m-%d") AS date, place, participants, footing, responsible 
                            FROM events 
                            JOIN status ON (events.statusid=status.id)
                            WHERE events.id = ${id}
                            
                        `;
                        query(con, q).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            });   
        },

        getByYear : (year) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT MONTH(date) as date_m, DAY(date) as date_d, id FROM events 
                            WHERE YEAR(date) = ${year}
                            ORDER BY date
                        `;
                        //JOIN status ON (events.status_id=status.id), DATE_FORMAT(date, "%m") AS date
                        query(con, q).then(
                            result => resolve(result),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            }); 
        },

        getStatus : () => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT * FROM status
                        `;
                        query(con, q).then(
                            result => resolve(result),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            }); 
        },

        update : (id, data) => { return new Promise( 
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            UPDATE events
                            SET
    
                            statusid = ?,
                            title = ?,
                            link = ?,
                            date = ?,
                            place = ?,
                            participants = ?,
                            footing = ?,
                            responsible = ?
    
                            WHERE id = ${id}
                        `;
                        query(con, q, Object.values(data)).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            });
        },

        delete : (id) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            DELETE FROM events
                            WHERE id = ${id}
                        `;
                        query(con, q).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                        con.end();
                    },
                    err => reject(err) 
                )
            }); 
        },
    }

