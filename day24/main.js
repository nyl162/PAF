const express = require('express');
const path = require('path');
//const bp = require('body-parser')
const multer = require ('multer');
const mysql = require ('mysql');
const util = require ('./libs/mysql-utils');
const dbconfig = require('./libs/dbconfig');

const app = express();
const mp = multer()
const pool = mysql.createPool(dbconfig);

const SQL_INSERT_REPLY = "INSERT INTO reply (Rname,email,phone,attending) values (?,?,?,?)"
const insertReply = util.mkQuery(SQL_INSERT_REPLY,pool);

app.post('/reply',mp.single(),(req,res)=>{
    //console.log(req.body);
    
    //console.log(req.body._name);
    insertReply([req.body._name,req.body._email,req.body._phone,req.body._attending])
        .then(result=>{
      //      console.log(result)
            res.status(200).json(result);
        })
        .catch(err=>{
        //    console.log(err)
            res.status(404).json({message:err})
        })
})

app.use(express.static(path.join(__dirname,"public")));

app.listen(3000,()=>{
    console.info(`Application started on port 3000 at ${new Date()}`)
})