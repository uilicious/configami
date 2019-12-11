/**
 * Does the filtering of inputs, and applying its various fallbacks
 */
module.exports = function(cg, input) {

	// // Fallback parameters support
	// input["fallback-container"] = input["fallback-container"] || input["container"];
	// input["fallback-scale"] = input["fallback-scale"] || input["scale"];
	// input["fallback-port"]  = input["fallback-port"]   || input["port"];
	
	// input["fallback-requests"] = input["fallback-requests"] || input["requests"];
	// input["fallback-limits"]   = input["fallback-limits"] || input["limits"];
	// input["fallback-simpleNodeAffinity"] = input["fallback-simpleNodeAffinity"] || input["simpleNodeAffinity"];

	// // Proxy parameters support
	// input["proxy-simpleNodeAffinity"] = input["proxy-simpleNodeAffinity"] || input["fallback-simpleNodeAffinity"];
	// input["proxy-scale"] = input["proxy-scale"] || input["fallback-scale"];

	// input["proxy-requests"] = input["proxy-requests"] || input["requests"];
	// input["proxy-limits"]   = input["proxy-limits"] || input["limits"];

	// Return the final input
	return input;
}