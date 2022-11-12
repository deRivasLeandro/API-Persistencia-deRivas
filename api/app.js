var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var carrerasRouter = require('./routes/carreras');
var materiasRouter = require('./routes/materias');
var profesoresRouter = require('./routes/profesores');
var alumnosRouter = require('./routes/alumnos');
const dotenv = require('dotenv');
const keys = require('./settings/keys');
var app = express();
const jwt = require('jsonwebtoken');

app.set('key', keys.key);

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.post('/login', (req, res) => {
  console.log("Realizando autenticación");
  if(req.body.usuario == 'admin' && req.body.pass=='12345'){
    const payload = {
      check:true
    };
    const token = jwt.sign(payload, app.get('key'), {
      expiresIn:'10d'
    })
    console.log("Autenticación completada correctamente")
    res.send(token);
  }else{
    console.log("Autenticación no completada");
    res.json({message:'Autenticación no completada.'})
  }
});

// Set up Global configuration access
dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/car', carrerasRouter);
app.use('/mat', materiasRouter);
app.use('/prof', profesoresRouter);
app.use('/alum', alumnosRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const verificiacion = express.Router();

verificiacion.use((req,res,next)=>{
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
      next;
    }
  })
}
});

module.exports = app;