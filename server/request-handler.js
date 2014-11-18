var url = require('url');
var exports = module.exports = {};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var messages = {
  results: []
};


var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/json";

  var address = url.parse(request.url, true);
  var classes = address.pathname.split("/")[1];
  var room = address.pathname.split("/")[2];
  var query = address.query;
  console.log('classes: ' + classes +
              '\nroom: ' + room +
              '\nquery: ' + JSON.stringify(query)
  );

  // GET
  if (request.method === "GET" && classes === "classes" ) {
    response.writeHead(200, headers);
    response.end(JSON.stringify(messages));
  }
  // POST
  else if (request.method === "POST" && classes === "classes") {
    response.writeHead(201, headers);
    var body = "";
    request.on('data', function (chunk) {
      body += chunk;
    });
    request.on('end', function(){
      messages.results.push(JSON.parse(body));
    });
    response.end(JSON.stringify(messages.results));
  }
  // OPTIONS
  else if (request.method === "OPTIONS"){
    response.writeHead(200, headers);
    response.end(JSON.stringify(messages));
  } else {
    response.writeHead(404, headers)
    response.end("404, not noice :(")
  }

};


exports.requestHandler = requestHandler;
