const mkQuery = function (sql, pool) {
    return function (args) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err)
                    return reject(err);
                conn.query(sql, args || [],
                    (err, result) => {
                        conn.release();
                        if (err)
                            return reject(err);
                        resolve(result);
                    }
                )
            })
        })
    }
}

module.exports = { mkQuery };