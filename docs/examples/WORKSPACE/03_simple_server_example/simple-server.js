var http = require('http'); 

var server = http.createServer(function (req, res) {   
   
    if (req.url = '{{path}}' ) { 
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: '{{message}}'}));  
            res.end();  
    }
});

server.listen({{port}});

console.log('Node.js web server at port 5555 is running..')