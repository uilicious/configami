// Native node dependencies
const path = require("path")
const fse  = require("fs-extra")

// Related dependencies
const isDirectory = require("./isDirectory")

/**
 * Scan a given directory, for sub folders.
 * 
 * @param {String} dirPath to scan
 * @return {String[]} list of directory names
 */
function listSubDirectory( dirPath ) {
	// The return array
	let ret = [];

	// The listing
	let list = fse.readdirSync( dirPath, { encoding:"utf8" } );
	for(let i=0; i<list.length; ++i) {
		let filename = list[i];
		if( isDirectory( path.resolve(dirPath, filename) ) ) {
			ret.push( filename );
		}
	}

	// Filtered value
	return ret;
}

// Actual module export
module.exports = listSubDirectory;