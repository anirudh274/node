/*
primary rule for the API
*/

//Dependencies
var http = require('http');
var url =  require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// the server should  repsond to all requests with a string
var server = http.createServer(function(req, res){

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
            res.writeHead(statuscode);  // we using built-in righthead function taht comes on every response object received by the HTTP server to right the status code
            res.end(payloadstring);

            //log the request path
            console.log('Returning this response: ',statuscode,payloadstring);



        });


    });


});


// start the server, and have it listen on port 3000
server.listen(3000, function(){
console.log("the server listening at port 3000");

}
);

//Define handlers
var handlers = {};

//sample handler
handlers.sample = function(data, callback){
    // Callback a http status code, and a payload and payload should be object(Cuz we want our API to work with JSON)
    callback(406,{'name': 'my name is sample handler'});

};

//Not found handler
handlers.notfound = function(data,callback){
    callback(404); //no need of payload because we can are just ending wiht 404 error

};

//Define a request router
var router  ={
    'sample' : handlers.sample //handler should get called
};
