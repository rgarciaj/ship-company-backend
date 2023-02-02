// importing the dependencies
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const morgan = require('morgan');

let db = new sqlite3.Database('db/ships.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the ships database.');
  initDB(db);
});

// defining the Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// starting the server
app.listen(3030, () => {
  console.log('Listening on port 3030');
});

function initDB(db) {
  db.run("CREATE TABLE IF NOT EXISTS ships (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, latIni REAL, lngIni REAL, latDest REAL, lngDest REAL, direction TEXT);");
  console.log("Table ships created");
}

///////////////////////////////
// ENDPOINTS
///////////////////////////////

// GET /ships 
app.get("/ships", (req, res) => {
  console.log("GET /ships");
  let sql = "select * from ships order by id desc";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    if(!rows) {
      res.send("There is no ships", 404);
      return;
    }
    res.send(rows);
  })
});

// GET /ships/:id
app.get('/ships/:id', function(req, res) {
  console.log("GET /ships/:id");
  let sql = "select * from ships where id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.send(err.message, 500);
      return console.error(err.message);
    }
    if(!row) {
      res.send("Ship not found", 404);
      return;
    }
    res.send(row);
  });  
});

// POST /ships 
app.post("/ships", (req, res) => {
  console.log("POST /ships");
  console.log(req.body);
  let sql = "insert into ships (name, description, latIni, lngIni, latDest, lngDest, direction) values (?,?,?,?,?,?,?)";
  db.run(sql, Object.values(req.body), function (err) {
    if (err) {
      res.send(err.message, 500);
      return console.error(err.message);
    }
    let response = `The ship '${req.body.name}' has been inserted with rowid ${this.lastID}`;
    console.log(response);
    res.send(response);
  });
});

// PUT /ships/:id
app.put('/ships/:id', function(req, res) {
  console.log("PUT /ships/:id");
  console.log(req.body);
  let sql = "update ships set name = ?, description = ?, latIni = ?, lngIni = ?, latDest = ?, lngDest = ?, direction = ? where id = ?";
  let updArray = Object.values(req.body);
  updArray.push(req.params.id);
  db.run(sql, updArray, function (err) {
    if (err) {
      res.send(err.message, 500);
      return console.error(err.message);
    }
    if(this.changes === 0) {
      res.send("Ship not found", 404);
      return;
    }
    let response = `The ship '${req.body.name}' has been updated`;
    console.log(response);
    res.send(response);
  });
});

// DELETE /ships/:id
app.delete('/ships/:id', function(req, res) {
  console.log("DELETE /ships/:id");
  let sql = "delete from ships where id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.send(err.message, 500);
      return console.error(err.message);
    }
    if(this.changes === 0) {
      res.send("Ship not found", 404);
      return;
    }
    let response = `The ship '${req.params.id}' has been deleted`;
    console.log(response);
    res.send(response);
  });
});