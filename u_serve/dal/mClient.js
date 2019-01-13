var mongodb = require('mongodb').MongoClient;

function checkIfObject(obj) {
  var ret = true;

  if(obj instanceof Array) ret = false;
  else if(Object.keys(obj) <= 0) ret = false;

  return ret;
}

class MClient {
  constructor(){
    this.db = null
  }

  Connect(conn, onSuccess, onFailure){
    try {
      var self = this;
      mongodb.connect(conn, { poolSize: 1, useNewUrlParser: true }, (err, db) => {
        if(err){
          console.log("Mongo connection failed");
          onFailure();
        }
        else {
          console.log("Mongo connection successfull.");
          self.db = db.db("testDB_T");
          onSuccess();
        }
      });
    }
    catch(ex) {
      console.log("Error caught,", ex);
      onFailure(ex);
    }
  }

  getDocument(collName, args, cb){
    if(!args.query){
      console.log("No query passed");
      return;
    }

    this.db.collection(collName).find(args.query, args.projection ? args.projection : {}).toArray((err, item) => {
      if(err) console.log("Find error: ", err);
      cb(err, item);
    });
  }

  insertDocument(collName, doc, cb){
    try{
      if(!checkIfObject(doc)){
        console.log("Document for inserting is not an object");
        return;
      }

      this.db.collection(collName).insertOne(doc, (err, data) => {
        if(err) console.log("error inserting the document ", err);
        else console.log("inserted one document");
        cb(err, data);
      });
    }
    catch(e){
      console.log("exception while inserting", e);
      cb(e, null);
    }
  }
}

module.exports = {
  MClient,
};