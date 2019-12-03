//
// Constant dependencies
//
const jsonParse       = requrie("./../conv/jsonParse");
const jsonObjectClone = requrie("./../conv/jsonObjectClone");

/**
 * Scans the given folder path for input settings, and return it combined with the baseInput
 * 
 * @param {String} folderPath to scan for various input settings
 * @param {Object} baseInput to combined with (note this is not modified)
 * 
 * @return {Object} final input object
 */
module.exports = function getCombinedInput( folderPath, baseInput ) {

	// Prepare the base return object
	let ret = jsonObjectClone( baseInput || {} );

	// Lets scan 
}