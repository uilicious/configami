/**
 * Given an string value, defined by a key path.
 * Fetch the nested value, in another key path.
 * 
 * For Examples:
 * 
 * input.json
 * ```
 * { "hello": { "world": "one", "two": "motto" }, "nested": { "key": "world", "deep": "hello.two" } }
 * ```
 * 
 * template.yaml
 * ```
 * {{#getValueByValue "nested.deep"}}{{/getValueByValue}}
 * {{#getValueByValue "hello" "nested.key"}}{{/getValueByValue}}
 * ```
 * 
 * output.yaml
 * ```
 * motto
 * one
 * ```
 */

// Dependency loading
const getNestedValue = require("../../struct/getNestedValue")

// The handlebar getValueByValue helper
module.exports = function() {
	// Get the arguments
	// note the last argument is the "handlebar context"
	const rawArgs = Array.prototype.slice.call(arguments);
	const args  = rawArgs.slice(0, -1);
	const hbCtx = rawArgs[ rawArgs.length - 1 ];

	// Side note:
	// this -> is equivalent to the hbCtx.data

	if( args.length < 1 ) {
		throw "getValueByValue requires at least 1 argument";
	}

	// Get the key string
	let keyPath = args[args.length - 1];
	if( keyPath == null || keyPath === "" ) {
		throw "getValueByValue requires a valid key path to lookup";
	}

	// Get the key to lookup
	let keyStr = getNestedValue( this, keyPath )
	if ( keyStr == null || keyStr === "" ) {
		throw "getValueByValue could not find a valid key to lookup at path: "+JSON.stringify(keyPath);
	}

	// object to extract value from (default to `this`)
	let fromObj = this;

	// If we have more than 1 argument, the first arg is the object to extract from
	if( args.length > 1 ) {
		let fromPath = args[0];
		fromObj = getNestedValue( this, fromPath );
		if( fromObj == null ) {
			throw "getValueByValue could not find a valid object to extract from at path: "+JSON.stringify(fromPath);
		}
	}
	
	// Fetch the value
	let value = getNestedValue( fromObj, keyStr );
	return value;
};
