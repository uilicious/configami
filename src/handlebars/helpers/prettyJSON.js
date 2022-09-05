/**
 * Given a JSON object, stringify it as a pretty json format
 * This is designed to be used in a larger yaml template
 * 
 * For Examples:
 * 
 * input.json
 * ```
 * { "hello": { "world": [1,2] } }
 * ```
 * 
 * template.yaml
 * ```
 * {{#prettyJson "hello"}}{{/prettyJson}}
 * ```
 * 
 * output.yaml
 * ```
 * {
 * 	"hello": {
 * 		"world": [1,2]
 * 	}
 * }
 * ```
 */

// Dependency loading
const getNestedValue = require("../../struct/getNestedValue")

// The handlebar json2yaml helper
module.exports = function() {
	// Get the arguments
	// note the last argument is the "handlebar context"
	const rawArgs = Array.prototype.slice.call(arguments);
	const args  = rawArgs.slice(0, -1);
	const hbCtx = rawArgs[ rawArgs.length - 1 ];

	// Side note:
	// this -> is equivalent to the hbCtx.data
	
	// Get the input path (to process)
	let inputPath = args[0] || hbCtx.fn(this);

	// Fetch the json object (with `this` support)
	let jsonObj = null; 
	if( inputPath == "this" ) {
		jsonObj = this;
	} if (typeof inputPath === 'string' || inputPath instanceof String) {
		jsonObj = getNestedValue( this, inputPath );
	} else {
		// its already an obj, use it
		jsonObj = inputPath;
	}

	// Null check
	if( jsonObj == null ) {
		throw "Unexpected blank json for prettyJson - path: "+JSON.stringify(inputPath);
	}

	//----------------------------------------------
	// Get the yaml str
	//----------------------------------------------

	let jsonStr = JSON.stringify(jsonObj, null, 2);

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
	let strArr = jsonStr.split("\n");
	let finalStrArr = [];

	// And process each line
	for(let i=0; i<strArr.length; ++i) {
		// Skip additional whitespace for first line
		if( i == 0 ) {
			finalStrArr[i] = strArr[i];
		} else {
			finalStrArr[i] = whitespaceStr + strArr[i];
		}
	}

	// Lets join it up - and return the value
	return finalStrArr.join("\n");
};
