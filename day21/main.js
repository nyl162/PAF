
require('dotenv').config()
const express = require ('express');
const path = require ('path');
const mysql = require ('mysql');
const bP = require ('body-parser');

app = express();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONLIMIT
    //,debug: true
})

var makeQuery = (sql, pool)=>{
    //console.log(sql);
    
    return  (args)=>{
        let queryPromsie = new Promise((resolve, reject)=>{
            pool.getConnection((err, connection)=>{
                if(err){
                    reject(err);
                    return;
                }
                //console.log(args);
                
                connection.query(sql, args || [], (err, results)=>{
                    connection.release();
                    if(err){
                        reject(err);
                        return;
                    }
                   // console.log(">>> "+ results);
                    resolve(results); 
                })
            });
        });
        return queryPromsie;
    }
}

sqlAllRSVP = "SELECT * FROM rsvp"
AllRSVP = makeQuery(sqlAllRSVP,pool);
sqlAddRSVP = "insert into rsvp (first_name,last_name,attending,registration_date) values (?,?,?,NOW())"
AddRSVP = makeQuery(sqlAddRSVP,pool);

app.get('/rsvps',(req,res)=>{
        AllRSVP().then((results)=>{
            res.status(201).json({result:"success",results});
        }).catch((error)=>{
            console.error(error);
        })
});

app.post('/rsvp',bP.urlencoded({ extended: false }),(req,res)=>{
    console.log([...Object.keys(req.body),...Object.values(req.body)]);
    let insVal = [
        req.body.first_name,
        req.body.last_name,
        req.body.attending
    ]
    //let insVal=[...Object.keys(req.body),...Object.values(req.body)]
    //console.log(insVal);
    //res.json({result:insVal});
    AddRSVP(insVal).then((results)=>{
        res.status(201).json({result:"success",results});
    }).catch((error)=>{
        console.error(error);
        res.status(404).json({error})
    })
});





const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000


    pool.getConnection((err,conn)=>{
        if(err){
            console.log('connection Error ---->', err)
            process.exit(-1);
        }

        conn.ping((err)=>{

            if(err){
                console.log('ping Error ---->',err );
                process.exit(-1);
            }
            //console.info(`DB result`, results);
            conn.release();
            app.listen(PORT,()=>{
                console.info(`Application started at port ${PORT} on ${new Date()}`);
            });
        })
    })
