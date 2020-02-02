var mongoose = require('mongoose');

exports.connectDB = function(dbName, port) {
  dbUrl = 'mongodb://madori3Dev:madori3Dev@localhost:' + port + '/' + dbName;
  mongoose.Promice = global.Promise;
  const conn = mongoose.connect(dbUrl, {useNewUrlParser: true });
  
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log(dbUrl + ' connected ... ');
  });
  //return db;
  return conn;
}

exports.disConnectDB = function(db) {
	 db.close();
}
