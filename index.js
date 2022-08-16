
const express = require('express');
const app = express();
const port = 6000;
const con = require('./Database/db')
var jwt = require('jsonwebtoken');
``
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
      console.log(result);
      if (err) throw err;
      if (result[0] == null) {
       
            con.query("INSERT INTO `user`(`name`,`mobile_no`,`password`,`status`) VALUES (?,?,?,?)", [req.body.name,  req.body.mobile_no, hash, "Y"], (err, result) => {
              if (err) throw err;
              else {
                res.status(200).send(true)
              }
            })
          } else {
            res.send("MOBILE_NO IS  ALREADY EXIST");
          }
        })
    })
    
 app.post("/user-login", (req, res) => {
  
      con.query("select * from user where mobile_no = ?", [req.body.mobile_no], (err, result) => {
        if (err) throw err;
        if (result[0] != null) {
          const match = bcrypt.compareSync(req.body.password, result[0].password)
          console.log(match);
          if (match) {
            jwt.sign({ mobile_no: req.body.mobile_no}, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
              if (err) throw err;
              else
                res.status(200).json({
                  status: true,
              mobile_no: result[0].mobile_no,
                  token,
                });
            }
            )}else{
              res.send("password not matched")

            }
          } else {
            res.send("mobile_no is not exist");
          }
        
                
        }
              
      )
          })
        
    
  


// register api
app.post("/register", (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  
  
  con.query("select * from login where user_name = ?", [req.body.user_name], (err, result) => {
    if (err) throw err;
    if (result[0] == null) {
      con.query("INSERT INTO `login`(`user_name`, `password`,`admin_name`,`status`) VALUES (?,?,?,?)", [req.body.user_name, hash,req.body.admin_name,"y"], (err, result) => {
        if (err) throw err;
        else {
          res.status(200).send(true)
        }
      })
    } else {
      res.send("Username is already exist");
    }
  })
})

    // login api
   
    
    app.post("/login", (req, res) => {
      con.query("select * from login where user_name = ?", [req.body.user_name], (err, result) => {
        if (err) throw err;
        if (result[0] != null) {
          const match = bcrypt.compareSync(req.body.password, result[0].password)
          console.log(match);
          if (match) {
            jwt.sign({ user_name: req.body.user_name}, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
              if (err) throw err;
              else
                res.status(200).json({
                  status: true,
                admin_name: result[0].admin_name,
                  token,
                });
            }
            )};
          } else {
            res.send("user_name is not exist");
          }
        
                
        }
              
      )
          })
        
    
  
  
  
      
  



app.listen(port, () => {
   
    console.log('port : ' + port);
  })