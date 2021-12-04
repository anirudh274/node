/*
primary rule for the API
*/

//Dependencies
var http = require('http');
var https = require('https');
var url =  require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config.js');
var fs = require('fs');

// Instantiating the http server
var httpServer = http.createServer(function(req, res){
  unifiedServer(req,res);
});

// start the HTTP server, and from config.js file it will decide what should be showcased as per the user preference as it has port keys in config.js (staging, Production)
httpServer.listen(config.httpPort, function(){
console.log("the server listening at port "+config.httpPort); //the "context" says the port name, and the port key

}
);

// Instantiating HTTPS server
httpServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem'),
}; //key and certificate are crux for HTTPS and we need to declare it here with OPENSSL
var httpsServer = https.createServer(httpServerOptions,function(req, res){
  unifiedServer(req,res);
});

// Start HTTPS server
httpsServer.listen(config.httpsPort, function(){
console.log("the server listening at port "+config.httpsPort); //the "context" says the port name, and the port key

}
);


//All the server logic for both the http and https createServer
var unifiedServer = function(req,res){

      //get the url and parse it
      var parsedUrl = url.parse(req.url, true);

      //get path from the url
      var path = parsedUrl.pathname;
      var trimmedpath = path.replace(/^\/+|\/+$/g,'');

      //get the query string as an object
      var querystringobject = parsedUrl.query;

      //get the http
      var method = req.method.toLowerCase();

      //get the headers as an object
      var headers = req.headers;

      //get the payload if any
      var decoder = new StringDecoder('utf-8');
      var buffer = '';
      req.on('data', function(data){
          buffer += decoder.write(data);
      });
      req.on('end', function(){
          buffer += decoder.end();

          //choose the handler this request should go to.If one is not found then use the Notfound handler
          var choosenHandler = typeof(router[trimmedpath]) != 'undefined' ? router[trimmedpath] : handlers.notfound;

          //construct the data object to send to the handler
          var data = {

              'trimmedpath' : trimmedpath,
              'querystringobject' : querystringobject,
              'method' : method,
              'headers' : headers,
              'payload' : buffer
          };

          //route the  request to the handler specified in the router
          choosenHandler(data, function(statuscode,payload){

              //use the status code called back by the handler, or default to 200
              statuscode = typeof(statuscode) == 'number' ? statuscode : 200; //terniary operator

              //use the payload called back by the handler, or default to an empty object
              payload = typeof(payload) == 'object' ?  payload : {};

              //convert teh payload to a string
              var payloadstring = JSON.stringify(payload);

              // Return the response
              res.setHeader('content-type','application/json'); //we are sending json and it should parse the response as if its json
              res.writeHead(statuscode);  // we using built-in righthead function that comes on every response object received by the HTTP server to right the status code
              res.end(payloadstring);

              //log the request path
              console.log('Returning this response: ',statuscode,payloadstring);



          });


      });

};

//Define handlers
var handlers = {};

// ping handlers
handlers.ping = function(data, callback){
  callback(200);

};

//Not found handler
handlers.notfound = function(data,callback){
    callback(404); //no need of payload because we can are just ending wiht 404 error

};

//Define a request router
var router  ={
    'ping' : handlers.ping //handler should get called
};
