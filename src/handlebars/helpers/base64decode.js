/**
 * Convert the input string, from its base64 encoded form
 * For Examples:
 * 
 * template.yaml
 * ```
 * hello:
 *   {{#base64decode}}U29tZSBWYWx1ZSBUbyBFbmNvZGVk{{/base64decode}}
 * ```
 * 
 */

// The handlebar helper
module.exports = function() {
	// Get the arguments
	// note the last argument is the "handlebar context"
	const rawArgs = Array.prototype.slice.call(arguments);
	const args  = rawArgs.slice(0, -1);
	const hbCtx = rawArgs[ rawArgs.length - 1 ];

	// Get the data to decode
	let data = hbCtx.fn(this);

	// Lets convert that data into a buffer
	let bufferData = new Buffer(data, "base64");

	// And decode it up
	return bufferData.toString("utf8")
};
