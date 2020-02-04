// Native node dependencies
const path = require("path")
const fse  = require("fs-extra")

// Related dependencies
const isFile = require("./isFile")

/**
 * Scan a given directory, for files.
 * 
 * @param {String} dirPath to scan
 * @return {String[]} list of file names
 */
function listFile( dirPath ) {
	// The return array
	let ret = [];

	// The listing
	let list = fse.readdirSync( dirPath, { encoding:"utf8" } );
	for(let i=0; i<list.length; ++i) {
		let filename = list[i];
		if( isFile( path.resolve(dirPath, filename) ) ) {
			ret.push( filename );
		}
	}

	// Filtered value
	return ret;
}

// Actual module export
module.exports = listFile;