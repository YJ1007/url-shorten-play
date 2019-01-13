const PORT = 8082;
const express = require("express");
const app = express();
const mongo = require('./dal/mClient');
const db = new mongo.MClient();
const collName = "urls";

console.log("starting express...");

app.use(InputBody);

app.use((req, res, next) => {
  if(req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});

app.post('/shorten', function(req, res){
  if(!req.rawBody || !req.rawBody.url){
    console.log("missing body url");
    sendResponse(res, 400, "missing mandatory parameters");
    return;
  }

  var body = req.rawBody
  db.getDocument(collName, { query: {url: body.url}, projection: {_id: 0} }, (err, doc) => {
    if(err){
      console.log("server error while inserting");
      sendResponse(res, 500, "Server error");
    }
    else if(doc.length){
      console.log('entry found in db');
      sendResponse(res, 200, doc[0]);
    } else {
      console.log('entry NOT found in db, saving new');
      var sid = randomGen(5);
      db.insertDocument(collName, {url: body.url, sid: sid, cts: Date.now()/1000}, () => {
        if(err){
          console.log("server error while inserting");
          sendResponse(res, 500, "Server error");
        }
        else
          sendResponse(res, 200, {sid: sid});
      });
    }
  });
});

app.get('/:id', function(req, res){
  if(!req.params || !req.params.id){
    console.log("un-identified url");
    sendResponse(res, 400, "un-identified url");
    return;
  };

  var id = req.params.id.substring(1);
  db.getDocument(collName, { query: {sid: id}, projection: {_id: 0} }, (err, doc) => {
    if(err){
      console.log("server error while inserting");
      sendResponse(res, 500, "Server error");
    }
    else{
      if(doc.length)
        res.redirect(doc[0].url);
      else
        sendResponse(res, 404, "nothing to redirect");
    }
  });
});

function success(){
  app.listen(PORT, (err) => {
    if(err){
      console.log("error in express listen ", err);
      process.exit(1);
    }
    else{
      console.log("express listening on port ", PORT);
    }
  });
}

function failure(ex){
  console.log("mongo failure", ex);
  process.exit(1);
}

//utility
function InputBody(req, res, next) {
  if(req.method === "GET") {
    next();
    return;
  }
  if(req.headers['content-type'] && req.headers['content-type'].indexOf('multipart/form-data') >= 0){
    next();
    return;
  }

  var data = "";
  req.on("data", function(chunk) {
    data += chunk;
  });
  req.on("end", function() {
    try{
      req.rawBody = JSON.parse(data);
    }
    catch(e){
      console.log("input body parse error ", e);
    }
    next();
    return;
  });
}

function randomGen(len) {
  var rString = "";
  var characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++) {
    rString += characterSet.charAt(Math.floor(Math.random() * characterSet.length));
  }
  return rString;
}

function sendResponse(res, status, data) {
  var respStr = JSON.stringify({data});
  res.status(status).send(respStr);
}
//=====================>

db.Connect("mongodb://localhost:27017/mydb", success, failure);
