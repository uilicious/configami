/**
 * Does the filtering of inputs, and applying its various fallbacks
 */
module.exports = function(cg, input) {
	//
	// Custom handling of enviornment variables
	//
	if( input.env ) {
		// Get the various input
		const eObj = input.env;
		const eKeys = Object.keys( eObj )
		const _enviornmentArr = [];

		// For each key remap it
		for(const key of eKeys) {
			_enviornmentArr.push({
				name: key,
				value: eObj[key]
			})
		}

		// Write the json obj (for use in template)
		if(_enviornmentArr.length > 0) {
			input._enviornmentJSON = { env:_enviornmentArr };
		}
	}

	// Return the final input
	return input;
}