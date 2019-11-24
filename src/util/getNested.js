/**
 * Get and return a nested value in an obj,
 * 
 * @param {Object}   obj        to get value from
 * @param {String[]} pathArr    path with dot annotation to use
 * @param {Boolean}  initialize if true, object is initialized and returned
 */
function getNestedArr(obj, pathArr, initialize = false) {
	// No path arr - return itself
	if( pathArr.length <= 0 ) {
		return null;
	}

	// Get subpath
	const subpath = pathArr[0];
	const remainderArr = pathArr.slice(1);

	// Get from object the value
	let subObj = obj[subpath];
	if( initialize == true && subObj == null ) {
		subObj = obj[subpath] = {};
	}

	// Null handling
	if( subObj == null ) {
		return null;
	}

	// End of recursion
	if( remainderArr.length <= 0 ) {
		return subObj;
	}

	// Recursion
	getNestedArr( subObj, remainderArr, initialize );
}

/**
 * Get and return a nested value in an obj,
 * 
 * @param {Object}  obj        to get value from
 * @param {String}  path       path with dot annotation to use
 * @param {Boolean} initialize if true, object is initialized and returned
 */
function getNested(obj, path, initialize = false) {
	// null / blank check
	if( path == null || path.length <= 0 ) {
		return null;
	}

	// split path, and fetch nested
	return getNestedArr(obj, path.split("."), initialize);
}

// Module export
module.exports = getNested;