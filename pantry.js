var express = require("express")
var bodyparser = require("body-parser")
var app = express()
var client = require("mongodb").MongoClient
var ObjectId = require('mongodb').ObjectID;

var collection
client.connect("mongodb://localhost:27017/pantry", function(err, db){
    collection = db.collection("items")
})

app.set("view engine", "hbs")
app.use(express.static("public"))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.get("/items/:id", function(req, res){
    var id = new ObjectId(req.params.id)
    collection.findOne({ _id: id }, function(err, data){
        res.render("edit", data)
    })
})

app.get("/yourpantry", function(req, res){
    collection.find({}).toArray(function(err, itemsFromDb) {
        res.render("main", { items: itemsFromDb })
    })
})

app.get("/stockpantry", function(req, res){
    res.render("newpantry")
})

app.get("/additem/:itemName", function(req, res){
    collection.insert({ name: req.params.itemName, have: 1, need: 1 }, function(err, data) {
        res.redirect("/yourpantry")
    })
})

app.put("/pantry/:id", function(req, res){
    var id = new ObjectId(req.params.id)
    collection.update({ _id: id },{ $set: req.body }, function(err, data){
        res.json(data)
    })
})

app.delete("/pantry/:id", function(req, res){
    var id = new ObjectId(req.params.id)
    collection.deleteOne({ _id: id }, function(err, data){
        res.json(data)
    })
})

app.post("/pantry", function(req, res){
    collection.insert(req.body, function(err, data){
        res.redirect("/yourpantry")
    })
})

var port = 4444
app.listen(port)
console.log("listening on", port)
