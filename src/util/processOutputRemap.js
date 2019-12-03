/**
 * Given the configured output for template, remap it accordingly to final output
 * 
 * @param {Object} output 
 * @param {Object} templateOutput 
 * @param {*} outputRemap 
 */
function processOutputRemap( output, templateOutput, outputRemap ) {
	//
	// Inner function used to join an output, if already exists
	//
	function joinOutput(key, value) {
		if( output[key] && output[key].toString().trim().length > 0 ) {
			output[key] = output[key]+"\n"+value
		} else {
			output[key] = value;
		}
	}

	//
	// Collapse output, into a single string - if configured
	//
	if( typeof outputRemap == "string" ) {
		// Prepare the final output str
		let outputStrArr = [];

		// By joining the various key values
		let keys = Object.keys(templateOutput).sort();
		for( subKey of keys ) {
			outputStrArr.push( templateOutput[subKey] );
		}

		// And set the output
		joinOutput( outputRemap, outputStrArr.join("\n") );
		return;
	}

	//
	// Assumes an object otherwise, and map the keys to array/keys
	//
	for( outputKey of Object.keys(outputRemap).sort() ) {
		// Get the output setting
		let outputSet = outputRemap[outputKey];

		// For the string set, do a direct remap
		if( typeof outputSet == "string" ) {
			joinOutput( outputRemap, templateOutput[ outputSet ] );
			continue;
		}

		// For the array, iterate and join them
		if( Array.isArray( outputSet ) ) {
			let outputStrArr = [];
			for( subKey of outputSet ) {
				outputStrArr.push( templateOutput[subKey] );
			}
			joinOutput( outputRemap, outputStrArr.join("\n") );
			continue;
		}

		// Unknown output setting type
		throw "[FATAL ERROR]: Unknown outputRemap setting : "+JSON.stringify(outputRemap);
	}

	// return processed output
	return output;
}
module.exports = processOutputRemap;