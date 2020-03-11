const mongoose = require('mongoose');

const connectDB = (callback) => {
  let db;
  // Connect to the database before starting the application server.
  mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, database) => {
      if (err) {
        console.log("ERRRR:: ", err);
      }
      // Save database object from the callback for reuse.
      db = database;
      console.log('Database connection ready');
      callback(db);
    });
};

module.exports = {
  connectDB,
};
