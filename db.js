var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
var thunky = require('thunky')

// TODO: autoReconnect
var url = 'mongodb://localhost:27017/publisher';
var connectDb = thunky( function(callback) {
  console.log('Connecting to MongoDb...')
  MongoClient.connect(url, function(err, db) { console.log('connected'); callback(err,db) })
})

function updateCollection(metaData, publishObj, callback) {
  connectDb(function(err, db) {
    // todo: handle error
    db.collection(metaData.collection).findOneAndUpdate({id: publishObj.id}, publishObj, {upsert: true}, function(err, result) {
      assert.equal(err, null)
      callback(err, result)
    })
  })
}

function get(collectionName, objId, callback) {
  connectDb(function(err, db) {
    db.collection(collectionName).findOne({id: objId}, function(err, result) {
      assert.equal(err, null)
      callback(err, result)
    })

  })
}

module.exports = {
  update: updateCollection,
  get: get
}
