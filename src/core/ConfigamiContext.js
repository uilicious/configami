//------------------------------------------
// Dependencies
//------------------------------------------
const path = require("path");
const ConfigamiContextUtils = require("./ConfigamiContextUtils");

//------------------------------------------
// Class implementation
//------------------------------------------

/**
 * ConfigamiContext is the main reused public context, for various modules
 */
class ConfigamiContext {

	/**
	 * Setup configami context, that is passed forward to various user / template modules
	 */
	constructor() {
		// Lets load and expose the util librarie
		this.util = ConfigamiContextUtils;
	}

	/**
	 * Given the output and src object, join its values recursively (object only)
	 * 
	 * @param {Object} output 
	 * @param {Object} src 
	 */
	joinNestedObject(output, src) {
		return require("../struct/nestedObjAssign")(output, src);
	}

	/**
	 * Given the template path, and its input, apply and return its output
	 * 
	 * @param {String} templatePath 
	 * @param {Object} input 
	 * @param {Object} output 
	 */
	applyTemplate( templatePath, input = {}, output = {} ) {
		// Intentionally loaded here to avoid circular dependency
		const TemplateContext = require("../template/TemplateContext");

		// Initialize the ConfigamiContext
		let newCtx = new ConfigamiContext();

		// Configure its various options
		newCtx.cgType           = "template";
		newCtx.templatePath     = templatePath;
		newCtx.templateRootDir  = this.templateRootDir;
		newCtx.workspaceRootDir = this.workspaceRootDir;

		// Teplate path directory
		newCtx.templatePathDir  = path.join(this.templateRootDir, templatePath);

		// Get the template
		let tCtx = new TemplateContext( newCtx );
		return tCtx.applyTemplate(input, output);
	}
}

// Module export
module.exports = ConfigamiContext;