// importing the dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// defining the Express app
const app = express();

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// enpoints
app.get("/ships", (req, res, next) => {
  res.send(["Homero","Lisa","Marge","Bart","Maggie"]);
 });

// starting the server
app.listen(3030, () => {
  console.log('listening on port 3030');
});