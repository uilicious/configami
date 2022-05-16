var http = require('http'); 

var server = http.createServer(function (req, res) {   
   
    if (req.url = output["path"] ) { 
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: output["message"]}));  
            res.end();  
    }
});

server.listen(output["port"]);

console.log('Node.js web server at port {{port}} is running..')