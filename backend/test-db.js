const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin_ubs:825425Bill12%2A%2A%23@saudeubs.dhpdnra.mongodb.net/?retryWrites=true&w=majority&appName=SaudeUBS';

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILED TO CONNECT");
    console.error(err);
    process.exit(1);
  });
