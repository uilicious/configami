/**
 * Perform a deep clone of the given input object,
 * 
 * > Future minor side notes
 * >
 * > As of now it uses JSON.parse/stringify, in the future this could be changed
 * > to reuse strings/int refrences to save on memory heap space (does it???)
 * 
 * @param {*} input to clone
 * @return {*} clone of input 
 */
function jsonObjectClone(input) {
	return JSON.parse( JSON.stringify(input) );
}