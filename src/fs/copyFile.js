// Native node dependencies
const path       = require("path")
const fse        = require("fs-extra")

/**
 * Copy over the file, if there is no difference
 * 
 * @param {String} inPath 
 * @param {String} outPath 
 */
function copyFile( inPath, outPath ) {
	// @TODO - if no difference in files
	//         skip the copy step

	// Copy file in entirety
	fse.copySync( inPath, outPath );
}

// Actual module export
module.exports = copyFile;