const express        = require('express');
const session        = require('express-session');
const MongoStore     = require('connect-mongo')(session);
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const connect        = require('connect');
const mongoose       = require('mongoose');
const app            = express();
const http           = require('http');
const path           = require('path');
const config         = require('config');
const log            = require('log')(module);
const logger         = require('logger');
const router         = express.Router();
const assert         = require('assert');
var HttpError        = require('./error');
var cons             = require('consolidate');
var db               = require('db');
var fs               = require("fs");

const url = 'mongodb://localhost:27017';
const dbName = 'users';
db.connect();

var jsonParser = bodyParser.json();

mongoose.Promise = require('bluebird');

mongoose.connect("mongodb://127.0.0.1/armleo-test",{
  poolSize: 10,
  ssl: true,
  keepAlive: 300000,
  connectTimeoutMS: 30000,
  autoReconnect: true,
  reconnectTries: 300000,
  reconnectInterval: 5000,
  promiseLibrary: global.Promise
        // Поставим количество подключений в пуле
        // 10 рекомендуемое количество для моего проекта.
        // Вам возможно понадобится и то меньше...
    
});

mongoose.connection.on('error',(err)=>
{
    console.error("Database Connection Error: " + err);
    // Скажите админу пусть включит MongoDB сервер :)
    console.error('Админ сервер MongoDB Запусти!');
    process.exit(2);
});

mongoose.connection.on('connected',()=>
{
    // Подключение установлено
    console.info("Succesfully connected to MongoDB Database");
    // В дальнейшем здесь мы будем запускать сервер.
});

app.engine('dust', cons.dust);
app.set('views', __dirname+'/views');
app.set('view engine', 'dust');
app.use(express.static(__dirname + "/public"));
app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.set('port', config.get('port'));
app.listen(app.get('port'), () => {
  console.log('We are live on ' + app.get('port'));
  console.log(db.getPhrase("Run successful"));
});

app.post('/changeuser', jsonParser, function(req, res)
{
  delete req.session.sess1;
  delete req.session.sess2;
  delete req.session.sess3;
  delete req.session.sess4;
  if (req.body.aim==="newuser")
  {
    req.session.sess1, req.session.sess2, req.session.sess3, req.session.sess4 = "", "", "", "";
    req.session.aim=req.body.aim;
    res.statusCode = 200;
    res.end();
  }
  else if (req.body.aim === "register")
  {
    req.session.sess1, req.session.sess2, req.session.sess3, req.session.sess4 = "", "", "", "teacher";
    req.session.aim=req.body.aim;
    res.statusCode = 200;
    res.end();
  }
  else if (req.body.aim==="edituser")
  {
    var userName = req.body.username;
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db_ = client.db(dbName);
      collection = db_.collection(dbName);
      console.log(userName);
      collection.find({username: userName}).toArray(function(err, results){
        req.session.sess1, req.session.sess2, req.session.sess3, req.session.sess4 = userName, results[0].email, results[0].password, results[0].status;
        res.statusCode = 200;
        res.end();
        client.close();
      });
    });
  }
});

app.get('/changuser', function(req, res)
{
  res.render("user", {
    aimofform: req.session.aim,
    login: req.session.sess1,
    email: req.session.sess2,
    password: req.session.sess3,
    role: req.session.sess4
  })
});

app.post('/edituser', jsonParser, function(req, res){
  console.log('CHANGE!!!');
  MongoClient.connect(url, function(err, client){
    if(err) return console.log(err);
    const db_ = client.db(dbName);
    const col = db_.collection(dbName);
    col.findOneAndUpdate(
        {username: req.body.prevlogin,
        email: req.body.prevemail},              // критерий выборки
        { $set: {
          username: req.body.login,
          email: req.body.email,
          password: req.body.password,
          status: req.body.role}},     // параметр обновления
        {                           // доп. опции обновления
            returnOriginal: false
        },
        function(err, result){
            console.log(result);
            if (req.session.usern == req.body.prevlogin)
            {
              req.session.usern = req.body.login;
              req.session.email = req.body.email;
              req.session.statu = req.body.role;
            }
            res.statusCode = 200;
            client.close();
            res.end();
        }
    );
  });
});

app.post('/register', jsonParser, function(req, res){
  console.log("REGISTER!!!");
  MongoClient.connect(url, function(err, client){
    if(err) return console.log(err);
    const db_ = client.db(dbName);
    const col = db_.collection(dbName);
    let user = {username: req.body.login, email: req.body.email, password: req.body.password, role: req.body.role};
    col.insertOne(user, function(err, results){
      client.close();
    });
  });
});

app.get('/main', function(req, res)
{
  if (req.session.authorized)
  {
  var vis="none";
  if (req.session.statu == "admin")
  {
    vis="block";
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    var listOfUsers=[];
    console.log("Connected successfully to server");
    const db_ = client.db(dbName);
    var collection = db_.collection(dbName);
    collection.find({}).toArray(function(err, results){
      console.log(results);
      if (req.session.statu != "teacher")
      {
        for (i=0; i<results.length; i++)
        {
          listOfUsers.push({"username" : results[i].username, "status" : results[i].status});
        }
      }
      else
      {
        listOfUsers.push({"username" : req.session.usern, "status" : req.session.statu});
      }
      console.log(listOfUsers);
      
        res.render("main", {
        email: req.session.email,
        canAddUsers: vis,
        Users: listOfUsers});
    });
  });
  }
  else
  {
    res.redirect('try.html');
  }
});

app.post("/logout", function(req, res){
  delete req.session.username;
  delete req.session.authorized;
  delete req.session.email;
  delete req.session.statu;
  res.statusCode = 200;
  res.end();
});

app.post('/user', jsonParser, function(req, res) {
  var userName = req.body.username,
  passWord = req.body.password;
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db_ = client.db(dbName);
    collection = db_.collection(dbName);
    collection.find({username: userName, password : passWord}).toArray(function(err, results){
      console.log(results.length);
      if (results.length == 0){
        collection.find({email: userName, password: passWord}).toArray(function(err, results){
          if (results.length == 0)
          {
            console.log("Authentification is not valid");
            res.statusCode = 403;
            res.end();
          }
          else
          {
            console.log("Authentification is valid");
            req.session.usern = results[0].username;
            req.session.email = userName;
            req.session.statu = results[0].status;
            req.session.authorized = true;
            req.statusCode = 200;
            res.end();
          }
        });
      }
      else
      {
        console.log("Authentification is valid");
        req.session.usern = userName;
        req.session.email = results[0].email;
        req.session.statu = results[0].status;
        console.log(results[0]);
        req.session.authorized = true;
        res.statusCode = 200;
        res.end();
      }
      client.close();
    });
  });
});