/**
 * Varient of object assign, in which nested objects are resolved recursively
 */
function nestedObjAssign( out, src, nxtSrc ) {
	// Recurssion detection
	if( nxtSrc != null ) {
		let args = Array.from(arguments);
		out = nestedObjAssign( out, src );
		return nestedObjAssign.apply( this, [out].concat( args.slice(2) ) );
	}

	// Skip if src is blank
	if( src == null ) {
		return out;
	}

	// Skip if src and output is identical objects 
	// (nothing to copy over)
	if( src === out ) {
		return out;
	}

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
}
module.exports = nestedObjAssign;