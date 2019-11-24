// Native node dependencies
const path = require("path")
const fse  = require("fs-extra")

/**
 * Write over the file, if there is no difference
 * 
 * @param {String} inPath 
 * @param {String} fileContent 
 */
function writeFile( inPath, fileContent ) {
	// @TODO - if no difference in files
	//         skip the copy step

	// Copy file in entirety
	fse.ensureFileSync( inPath );
	fse.writeFileSync( inPath, fileContent );
}

// Actual module export
module.exports = writeFile;