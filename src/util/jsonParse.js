// dependencies
const hjson   = require("hjson")
const fse     = require("fs-extra")
const isFile  = require("../fs/isFile")

/**
 * Takes in a json string, and parses it into an object
 * 
 * @param {String} json 
 * @param {String} filePath optional filepath used for debugging
 * 
 * @return {*} parsed json
 */
function jsonParse( json, filePath = null ) {
	try {
		return hjson.parse( json );
	} catch( e ) {
		// Rethrow error from here - surpress hjson error (for better trace)
		let errStr = (
			(filePath?"["+filePath+"] ":"")+
			e.toString()
		);
		throw errStr;
	}
}

/**
 * File varient of json parse
 */
function jsonParseFile( path, fallback = null ) {
	// Valid object
	if( isFile(path) ) {
		let fileStr = fse.readFileSync( path, { encoding:"utf8" } );
		return jsonParse( fileStr, path );
	}
	// No file
	return fallback;
}
jsonParse.file = jsonParseFile;

// Actual module export
module.exports = jsonParse;