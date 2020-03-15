import mongoose from 'mongoose';

export default (connectDB) => {
  let db;
  // Connect to the database before starting the application server.
  mongoose.connect("mongodb://localhost:27017/chat-api-cluster",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, database) => {
      if (err) {
        console.log('ERROR:: ', err);
      }
      // Save database object from the callback for reuse.
      db = database;
      console.log('Database connection ready');
      connectDB(db);
    });
};
