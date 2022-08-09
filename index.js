
const express = require('express');
const app = express();
const port = 6000;
const con = require('./Database/db')
var jwt = require('jsonwebtoken');
const multer = require('multer')
const cors = require('cors');
app.use(cors());
require("dotenv").config();
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// user api

app.post("/user", (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    console.log(salt);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(hash);
    con.query("select * from user where mobile_no   = ?", [req.body.mobile_no], (err, result) => {
      
      if (err) throw err;
      if (result[0] == null) {
       
            con.query("INSERT INTO `user`(`name`,`mobile_no`,`password`,`status`) VALUES (?,?,?,?)", [req.body.name,  req.body.mobile_no, hash, "Y"], (err, result) => {
              if (err) throw err;
              else {
                res.status(200).send(true)
              }
            })
          } else {
            res.send("mobile_no is aLREADY EXIST");
          }
        })
    })

  
  
  
      
  



app.listen(port, () => {
    console.log("Database Connected")
    console.log('port : ' + port);
  })