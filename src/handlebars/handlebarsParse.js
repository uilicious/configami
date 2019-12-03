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
// Custom helpers handling
//
handlebars.registerHelper('json2yaml', require("./helpers/json2yaml"));
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
function handlebarsParse(template, data) {
	// @TODO - in memory cache the templates ?
	let compiled = handlebars.compile(template);
	return compiled(data);
}

//--------------------------------------
//
// Varopis file command
//
//--------------------------------------

const hjsonParse = require("../conv/hjsonParse")
const isFile     = require("../fs/isFile")
const fse        = require("fs-extra")

/**
 * Given the filepath, get its string, perform handlebars parsing, and output its string
 * 
 * @param {*} filePath 
 * @param {*} data 
 * @param {*} fallback 
 */
function stringFile( filePath, data, fallback = null ) {
	// Valid object
	if( isFile(filePath) ) {
		// Parse the file string
		let fileStr = fse.readFileSync( filePath, { encoding:"utf8" } );
		return handlebarsParse( fileStr, data );
	}
	// No file fallback
	return fallback;
}
handlebarsParse.file = stringFile;

/**
 * Given the filepath, get its string, perform handlebars parsing, and output its JSON
 * 
 * @param {*} filePath 
 * @param {*} data 
 * @param {*} fallback 
 */
function hjsonFile( filePath, data, fallback = null ) {
	// Get valid file string
	let fileStr = stringFile( filePath, data, null );
	if( fileStr ) {
		return hjsonParse( fileStr, filePath );
	}
	
	// No file fallback
	return fallback;
}
handlebarsParse.hjsonFile = hjsonFile;

module.exports = handlebarsParse;
