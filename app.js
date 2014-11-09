var express = require('express')
var bodyParser = require('body-parser')
var ms = require('mongoskin')
ms.Server({logger: console})
debugger
var db = ms.db('mongodb://localhost:27017/publisher', {server: { logger: console}})

var app = express()
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/publish', function (req, res) {
  var publishObject = req.body
  var metaData = publishObject._meta_data
  delete publishObject._meta_data
  console.log("Publishing to collection: " + metaData.type)
  // console.log("id: " + publishObject.id)
  // hexId = ms.helper.toObjectID(publishObject.id)
  // console.log("id: " + hexId)
  db.collection(metaData.type).ensureIndex( {id: 1}, {unique: true}, function(err, result) { console.log(result)} )
  db.collection(metaData.type).update( {id: publishObject.id}, publishObject, {upsert: true}, function(err, result) {
    if (err) throw err
    if (result) {
      console.log("Added to Mongo")
      console.log(JSON.stringify(result))
      db.collection(metaData.type).findOne( {id: publishObject.id}, function( err, result) {
        console.log(result)
      })
      res.send("Published at: " + JSON.stringify(metaData))
    }
  })
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Publisher listening at http://%s:%s', host, port)

})
