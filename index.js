const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3334;

const pods = require('./routes/pods');

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/pods', pods);

app.listen(port, () => {
  console.log('Listening on port: ', port);
});