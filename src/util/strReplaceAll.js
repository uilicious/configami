/**
 * This safely escapes the given string for regex operations
 * 
 * @param {String} str 
 * @return regex safe formatted string
 */
function escapeRegExp(str) {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Safely replace all instances of given string
 * 
 * @param {String} str 
 * @param {String} find 
 * @param {String} replace 
 */
function strReplaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
module.exports = strReplaceAll;