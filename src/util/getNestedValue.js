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
 * @param {String}  pathStr    path with dot annotation to use
 * @param {Boolean} initialize if true, object is initialized and returned
 */
function getNested(obj, pathStr, initialize = false) {
	// null / blank check
	if( pathStr == null || pathStr.length <= 0 ) {
		return null;
	}

	// split path, and fetch nested
	pathStr = pathStr+"";
	return getNestedArr(obj, pathStr.split("."), initialize);
}

// Module export
module.exports = getNested;