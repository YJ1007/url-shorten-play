//run using mongo
var database = "testDB_T";
db = db.getSiblingDB(database);

print("Using database: " + database);

var collsToIndex = [
  {
    collection: "urls",
    indexes: [
      { field: "sid", "value": 1, options: { unique : true, name: "sid_1" } },
      { field: "url", "value": 1, options: { unique : true, name: "url_1" } },
      { field: "cts", "value": 1, options: { name: "cts_1" } }
    ]
  }
];

var success = 0, failed = 0, total = 0;
collsToIndex.forEach((element) => {
  print("Indexing " + element.collection);
  element.indexes.forEach((index) => {
    total++;
    var indexObj = {};
    indexObj[index.field] = index.value;

    if(!index.options) index.options = {};
    index.options.background = true;

    var ret = db[element.collection].createIndex(indexObj, index.options);
    if(ret.ok == 0){
      failed++;
      print(JSON.stringify(ret));
      print("  Error: Could not create index for index name " + index.options.name);
    }
    else{
      success++;
      print("  Created index of collection field: " + index.field);
    }
  });
});

print("---------------------------------------------------------------");
if(!failed) print("Successfull: Created all the indexes.");
else print("Error: Could not create some indexes.");
print("Total indexes       : " + total);
print("Indexes successfull : " + success);
print("Indexes failed      : " + failed);
