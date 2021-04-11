/**
 * Convert the input string, into its base64 encoded form
 * For Examples:
 * 
 * template.yaml
 * ```
 * hello:
 *   {{#base64encode}}Some Value To Encoded{{/base64encode}}
 * ```
 * 
 */

// The handlebar json2yaml helper
module.exports = function() {
	// Get the arguments
	// note the last argument is the "handlebar context"
	const rawArgs = Array.prototype.slice.call(arguments);
	const args  = rawArgs.slice(0, -1);
	const hbCtx = rawArgs[ rawArgs.length - 1 ];

	// Get the data to encode
	let data = hbCtx.fn(this);

	// Lets convert that data into a buffer
	let bufferData = new Buffer(data);

	// And encode it up
	return bufferData.toString("base64")
};
