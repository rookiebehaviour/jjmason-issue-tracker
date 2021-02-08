const mongoose = require('mongoose');

const db = mongoose.connect(process.env.DB, {
useUnifiedTopology: true,
useNewUrlParser: true,
}, function(err) {
  if (err) console.log(err);
  console.log('connection successful');
});

module.exports = db
