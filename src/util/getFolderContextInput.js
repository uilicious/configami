//
// Constant dependencies
//
const path            = require("path");
const fsh             = require("./../fs/fs-helper");
const hjsonParse      = require("./../conv/hjsonParse")
const handlebarsParse = require("./../handlebars/handlebarsParse")
const jsonObjectClone = require("./../conv/jsonObjectClone")
const nestedObjAssign = require("./../struct/nestedObjAssign")

/**
 * Scans the given folder path for input settings, and return it combined with the baseInput
 * 
 * @param {String}   folderPath to scan for various input settings
 * @param {Object}   baseInput  to combined with (note this is not modified)
 * @param {Function} cgCtxFunc  to setup, and return configami context, given the current input
 * 
 * @return {Object} final input object
 */
function getFolderContextInput( folderPath, baseInput, cgCtxFunc ) {

	// Prepare the base return object
	let ret = jsonObjectClone( baseInput || {} );

	// HJSON input files to support (if valid)
	const hjsonInputList = [ "input.configami.json", "input.configami.hjson" ]

	// Lets scan and process various handlebars json
	for( const fileName of hjsonInputList ) {
		const filePath = path.join( folderPath, fileName );
		ret = nestedObjAssign(ret, handlebarsParse.hjsonFile(filePath, ret));
	}

	// Lets parse the handlebars js file
	const jsFilePath = path.join( folderPath, "input.configami.js" );
	if( fsh.isFile( jsFilePath ) ) {
		// Load the js module
		const inputMod = require( jsFilePath );
		if( inputMod ) {
			// Get the configami context
			const cgCtx = cgCtxFunc(ret);

			// Executed the js module
			ret = inputMod( cgCtx, ret ) || ret;
			cgCtx.input = ret;
		}
	}

	// Final return object
	return ret;
}
module.exports = getFolderContextInput;