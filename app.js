var Db = require('./db.js')

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

app.get('/:obj/:id', function (req, res) {
  Db.get(req.params.obj, req.params.id, function(err, result) {
    res.send(JSON.stringify(result))
  })
})

app.post('/publish', function (req, res) {
  var publishObject = req.body
  console.log(publishObject)
  var metaData = publishObject.metadata
  delete publishObject.metadata
  console.log("Publishing to collection: " + metaData.collection)
  Db.update(metaData, publishObject, function(err, result) {
    console.log(result)
    res.send("OK")
  })
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Publisher listening at http://%s:%s', host, port)

})
