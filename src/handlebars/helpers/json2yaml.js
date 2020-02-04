/**
 * Given a JSON object, stringify it into a yaml format.
 * This is designed to be used in a larger yaml template
 * 
 * For Examples:
 * 
 * input.json
 * ```
 * {
 * 	"hello": {
 * 		"world": [1,2]
 * 	}
 * }
 * ```
 * 
 * template.yaml
 * ```
 * hello:
 *   {{#json2yaml "hello.world"}}{{/json2yaml}}
 * ```
 * 
 * output.yaml
 * ```
 * hello:
 *   - 1
 *   - 2
 * ```
 */

// Dependency loading
const getNestedValue = require("../../struct/getNestedValue")
const json2yaml = require("json2yaml");

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
	} else {
		jsonObj = getNestedValue( this, inputPath );
	}
	
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
};
