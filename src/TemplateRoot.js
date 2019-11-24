//---------------------------------
//
//  Dependency loading
//
//---------------------------------

// Native node dependencies
const path       = require("path");
const fse        = require("fs-extra");

//---------------------------------
//
//  Utility functions
//
//---------------------------------

const isFile    = require("./fs/isFile");

//---------------------------------
//
//  Reuse variables
//
//---------------------------------

// Template function string
const _templateFunctionStr = fse.readFileSync(
	path.resolve(__dirname, "./boilerplate/_templateFunction.configami.js"), 
	{ encoding:"utf8" }
);

//---------------------------------
//
//  Class implementation
//
//---------------------------------
class TemplateRoot {

	/**
	 * Initialize the module root 
	 * @param {String} inTemplateDir 
	 */
	constructor( inTemplateDir ) {
		this._templateDir = inTemplateDir;
	}

	getTemplate( subpath ) {
		// Derive the module path
		const templatePath = path.resolve( this._templateDir, subpath );

		// // Check for "module.configami.js"
		// if( !isFile( path.resolve(templatePath, "module.configami.js") ) ) {
		// 	throw `[FATAL ERROR] Unable to process module '${subpath}' - missing 'module.configami.js' file`
		// }

		// Prepare the internal _templateFunction file
		const templateFunctionPath = path.resolve( templatePath, "_templateFunction.configami.js" );
		fse.writeFileSync( templateFunctionPath, _templateFunctionStr, { encoding:"utf8" });

		// Load the templateFunction module 
		const templateFunctionModule = require( templateFunctionPath );

		// Pass forward the context - with templatePath
		return function( context ) {
			context.templatePath = templatePath;
			return templateFunctionModule( context );
		};
	}
}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = TemplateRoot;