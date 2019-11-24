/**
 * Varient of object assign, in which nested objects are resolved recursively
 */
function nestedObjAssign( out, src ) {
	// Iterate each property
	for( let key in src ) {
		// Get value
		let val = src[key];

		// skip if null
		if( val == null ) {
			continue;
		}

		// if val is an object
		if( typeof(val) == "object" ) {
			// either copy it over 
			if( out[key] == null ) {
				out[key] = val
			} else {
				// or recursively merge it
				nestedObjAssign( out[key], val );
			}
		} else {
			// copy value direct
			out[key] = val
		}
	}

	// Return back output
	return out;

	// return Object.assign(out, src)
}
module.exports = nestedObjAssign;