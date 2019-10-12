var http = require("http");
var finalhandler = require("finalhandler");
var serveStatic = require("serve-static");

var serve = serveStatic("./");

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  // res.write("Is working!"); //write a response to the client
  // res.end(); //end the response
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(port, function() {
  console.log("Our app is running on http://localhost:" + port);
});
