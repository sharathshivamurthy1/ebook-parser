var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/bookList";
var bookListJson = require('./bookData.json');

function createNewDb () {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      console.log("Database created!");
      db.createCollection("myBooks", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.collection("myBooks").insertMany(bookListJson, function(err, res) {
            if (err) throw err;
            db.collection("myBooks").count(function(err, result) {
                if (err) throw err;
                console.log("Count after creation"+result);
                db.close();
            });
        });
      });
    });
}

function updateBooks () {
    MongoClient.connect(url, function(err, db) {
        db.collection('myBooks').count(function(err, count){
            console.log("Count before "+count);
        });
        db.collection("myBooks").insertMany(bookListJson, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.collection("myBooks").count(function(err, result) {
                if (err) throw err;
                console.log("Count after "+result);
                db.close();
            });
        });
    });
}
createNewDb();