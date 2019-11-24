// Native node dependencies
const path       = require("path")
const fse        = require("fs-extra")

/**
 * Syncronous function, returns true if path is a file
 * 
 * @param {String} filePath 
 * 
 * @return {Boolean} true if file exists, else false
 */
function isFile( filePath ) {
	try {
		return fse.lstatSync( filePath ).isFile();
	} catch(e) {
		// Error occur if path does not exists, surpress it
		return false;
	}
}

// Actual module export
module.exports = isFile;