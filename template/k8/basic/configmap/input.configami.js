/**
 * Does the filtering of inputs, and applying its various fallbacks
 */
module.exports = function(cg, input) {
	//
	// Custom handling of data wrapping
	//
	input._dataWrap = { data:input.data }

	// Return the final input
	return input;
}