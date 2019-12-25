const con = require('./db');
module.exports = 
    {
        add : (data) => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            INSERT events(status_id,title,link,date,place,participants,footing) 
                            VALUES (?,?,?,?,?,?,?);
                        `;
                        query(con, q, Object.values(data)).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
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
                            SELECT * FROM events WHERE id = ${id}
                            JOIN status ON (events.status_id=status.id)
                        `;
                        query(con, q).then(
                            result => resolve(result[0]),
                            err => reject(err) 
                        );
                    },
                    err => reject(err) 
                )
            });   
        },

        getAll : () => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT * FROM events 
                            JOIN status ON (events.status_id=status.id)
                        `;
                        query(con, q).then(
                            result => resolve(result),
                            err => reject(err) 
                        );
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
                            SELECT * FROM events 
                            JOIN status ON (events.status_id=status.id)
                            WHERE YEAR(date) = ${year}
                        `;
                        query(con, q).then(
                            result => resolve(result),
                            err => reject(err) 
                        );
                    },
                    err => reject(err) 
                )
            }); 
        },

        getYears : () => { return new Promise(
            (resolve, reject) => {
                connection(config).then(
                    con => {
                        let q = `
                            SELECT DISTINCT YEAR(date)
                            FROM events
                        `;
                        query(con, q).then(
                            result => resolve(result),
                            err => reject(err) 
                        );
                    },
                    err => reject(err) 
                )
            }); 
        },

        getByStatusId : (status_id) => { return new Promise(
            function(resolve, reject){
                let query = `
                    SELECT * FROM events 
                    JOIN status ON (events.status_id=status.id)
                    WHERE status_id = ${status_id}
                `;
                con.query(query, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        },

        getStatus : () => { return new Promise(
            function(resolve, reject){
                let query = `
                    SELECT * FROM status
                `;
                con.query(query, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        },

        update : (id, data) => { return new Promise(
            function(resolve, reject){
                let query = `
                    UPDATE events
                    SET

                    status_id = ?,
                    title = ?,
                    link = ?,
                    date = ?,
                    place = ?,
                    participants = ?,
                    footing = ?,
                    responsible = ?

                    WHERE id = ${id}
                `;
                con.query(query, Object.values(data), (err, result) => {
                    if (err) reject(err);
                    resolve(result[0]);
                });
            });
        },

        delete : (id) => { return new Promise(
            function(resolve, reject){
                let query = `
                    DELETE FROM events
                    WHERE id = ${id}
                `;
                con.query(query, (err, result) => {
                    if (err) reject(err);
                    resolve(result[0]);
                });
            });
        },
    }

