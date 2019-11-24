// dependencies
const hjson   = require("hjson")
const fse     = require("fs-extra")
const isFile  = require("../fs/isFile")

/**
 * Takes in a json string, and parses it into an object
 * 
 * @param {String} json 
 * 
 * @return {*} parsed json
 */
function jsonParse( json ) {
	return hjson.parse( json );
}

/**
 * File varient of json parse
 */
function jsonParseFile( path ) {
	// Valid object
	if( isFile(path) ) {
		let fileStr = fse.readFileSync( path, { encoding:"utf8" } );
		return jsonParse( fileStr );
	}
	// No file
	return null;
}
jsonParse.file = jsonParseFile;

// Actual module export
module.exports = jsonParse;