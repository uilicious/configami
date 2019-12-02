//--------------------------------------
//
// Handlebar setup
//
//--------------------------------------

//
// Load handlebars, with handlebars-helpers
//
const handlebars = require("handlebars");
const helpers = require('handlebars-helpers')({
	handlebars: handlebars
});

//
// Util functions
//
const getNested = require("../util/getNested")

//
// Custom json2yaml handling
//
const json2yaml = require("json2yaml");
handlebars.registerHelper('json2yaml', function() {
	// Get the arguments
	// note the last argument is the "handlebar context"
	const rawArgs = Array.prototype.slice.call(arguments);
	const args  = rawArgs.slice(0, -1);
	const hbCtx = rawArgs[ rawArgs.length - 1 ];

	// Side note:
	// this -> is equivalent to the hbCtx.data
	
	// Get the input path (to process)
	let inputPath = args[0] || hbCtx.fn(this);

	// Fetch the json object
	let jsonObj = getNested( this, inputPath );
	if( jsonObj == null ) {
		throw "Unexpected blank json for json2yaml - path: "+inputPath;
	}

	//----------------------------------------------
	// Get the yaml str
	//----------------------------------------------

	let yamlRawStr = json2yaml.stringify(jsonObj);

	//----------------------------------------------
	// Lets do some processing on the yaml string
	//----------------------------------------------

	// white space indenting prep
	let whitespaceCount = hbCtx.loc.start.column;
	let whitespaceStr = "";
	for(let i=0; i<whitespaceCount; ++i) {
		whitespaceStr += " ";
	}

	// Split the resulting yaml
	let yamlStrArr = yamlRawStr.split("\n").slice(1, -1);
	let finalYamlStrArr = [];

	// And process each line
	for(let i=0; i<yamlStrArr.length; ++i) {
		// Skip additional whitespace for first line
		if( i == 0 ) {
			finalYamlStrArr[i] = yamlStrArr[i].slice(2);
		} else {
			finalYamlStrArr[i] = whitespaceStr + yamlStrArr[i].slice(2);
		}
	}

	// Lets join it up - and return the value
	return finalYamlStrArr.join("\n");
});

//
// Custom double quote escaping
//
handlebars.registerHelper('slashEscapeDoubleQuotes', function(ctx) {
	return ctx.fn(this).replace(/\"/g, '\\"')
});

//--------------------------------------
//
// Handlebar Run commands
//
//--------------------------------------

/**
 * Given the handlebar template, and data - get the result string
 * 
 * @param {String} template 
 * @param {Object} data 
 * 
 * @return formatted string
 */
function processHandlebars(template, data) {
	// @TODO - in memory cache the templates ?
	let compiled = handlebars.compile(template);
	return compiled(data);
}
module.exports = processHandlebars;
