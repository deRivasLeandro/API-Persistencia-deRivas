const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const keys = require('./settings/keys');

app.set('key', keys.key);

dotenv.config();

function verificacion (req,res,next) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if(!token){
    res.status(401).send(
      {error:'Es necesario ingresar un token de autenticación'}
      )
  }
  if(token.startsWith('Bearer ')){
    token = token.slice(7, token.length);
  }
  console.log(token);
  if(token){
    jwt.verify(token, app.get('key'), (error, decoded)=>{
    if(error){
        return res.json({
        message:'El token no es válido'
      });
    }else{
      req.decoded = decoded;
      next();
      }
    })
  }
};

module.exports = verificacion;