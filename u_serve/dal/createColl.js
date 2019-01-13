// run using mongo
var database = "testDB_T";
db = db.getSiblingDB(database);

print("Using database: " + database);

var collNameArr = [
  { name: "urls"},
];

var created_count = 0, create_err_count = 0, exists_count = 0;

collNameArr.forEach((collection) => {
  var ret = db.createCollection(collection.name);
  if(ret.ok == 0 && ret.errmsg.indexOf("already exists") == -1){
    print("Error: Could not create collection : " + collection.name);
    create_err_count++;
  }
  else {
    if(ret.ok == 1){
      print("Created collection : " + collection.name);
      created_count++;
    }
    else
      exists_count++;
  }
});

print("---------------------------------------------------------------");
if(create_err_count)
  print("Error: Could not create some collections.");

print("total collections           : " + collNameArr.length);
print("collections created         : " + created_count);
print("collections already exists. : " + exists_count);
print("error in collections create : " + create_err_count);
