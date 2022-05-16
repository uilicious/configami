Examples
=====================================

**Simple Hello World Example**

In the /TEMPLATE directory let's create a new /hello_template folder. Then create world.txt containing whatever content you fancy.

Next step, in /WORKSPACE create a /hello_example folder, then let's indicate to configami 
that we want to apply a template to this folder: to do this we are going to create a plan.

Create a new plan.configami.json file with the following content:

json::

   {
	"template": "hello_template"
   }

Now execute the run script and include /hello_example from WORKSPACE as argument:
::

   ./run-configami.sh './hello_example/'

You should have an exact copy of your hello folder in /hello_example

**Simple input/output Example**

Let's push it further by adding variables:

In the /TEMPLATE directory create /input_template
Configami supports a lot of input format let's test those, create the following:

input.configami.json:

json::

    {
	    "a": 4
    }

input.configami.hjson:

hjson::

    {
	    "b": 0
    }

input.configami.js:

js::

    module.exports = function(cg, input) {
	input["c"] = 4;
    }

Now that we have some inputs from differents files we need to tell configami the output format.


Configami will try to replace anything between double curly brackets {{ }} if those are registered as input, whatever the output format.
A simple one would be a .txt file (but you could test a .yaml or .js file also), create a new output.txt containing the following:

::

    {{a}}{{b}}{{c}}{{d}}

Do note that we leave "d" undefined on purpose.

In /WORKSPACE create /input_example and another plan.configami.json as such:

json::

    {
	    "template": "02_input_template"
    }


Let's run configami and see the result of our work:

::

   ./run-configami.sh './input_example/'

You should now see a output.txt file into /input_example containing "404".

**Simple node server Example**

Following what we saw previously, let's make a basic node server.
In /TEMPLATE create a /simple_server_template folder with the following content:

simple-server.js

js::

    var http = require('http'); 

    var server = http.createServer(function (req, res) {   
   
        if (req.url == '{{path}}') { 
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: "{{message}}"}));  
                res.end();  
        }
    });

    server.listen({{port}});

    console.log('Node.js web server at port {{port}} is running..')

We will keep the url path, the port and whatever data we want as configami variables then write a dedicated input file.

input.configami.json:

json::

    {
	    "port": 5555,
        "path":"/",
        "message": "Configami sure is handy !"
    }

Finally in /WORKSPACE create a /simple_server_example folder with the following plan.configami.json:

json::

    {
	"template": "03_simple_server_template"
    }

Then run

::

   ./run-configami.sh './simple_server_example/'

And see the new server with filled variables showing up.