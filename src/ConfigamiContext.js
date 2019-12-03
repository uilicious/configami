/**
 * ConfigamiContext is the main reused public context, for various modules
 */
class ConfigamiContext {

	/**
	 * Setup configami context, that is passed forward to various user / template modules
	 */
	constructor() {
	}

	// /**
	//  * Given the output and src object, join its values recursively (object only)
	//  * 
	//  * @param {Object} output 
	//  * @param {Object} src 
	//  */
	// joinNestedObject(output, src) {
	// 	return nestedObjAssign(output, src);
	// }

	// /**
	//  * Given the template path, and its input, apply and return its output
	//  * 
	//  * @param {String} templatePath 
	//  * @param {Object} input 
	//  * @param {Object} output 
	//  */
	// applyTemplate( templatePath, input = {}, output = {}) {
	// 	// Intentionally loaded here to avoid circular dependency
	// 	const TemplateContext = require("./TemplateContext");
	// 	// Get teh template
	// 	const template = this._templateRoot.getTemplate( templatePath );
	// 	template( new TemplateContext(this._planRoot, this._templateRoot, input, output) );
	// 	return output;
	// }
}

// Module export
module.exports = ConfigamiContext;