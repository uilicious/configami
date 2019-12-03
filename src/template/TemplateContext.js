//---------------------------------
//
//  Dependency
//
//---------------------------------

const path             = require("path");
const isDirectory      = require("./../fs/isDirectory");

const ConfigamiContext = require("./../ConfigamiContext");

//---------------------------------
//
//  Class implementation
//
//---------------------------------

/**
 * TemplateContext is used to represent a single template folder
 * which can then be "applied" on
 */
class TemplateContext {

	/**
	 * Initialize the TemplateContext
	 * 
	 * @param {ConfigamiContext} inConfigamiContext 
	 */
	constructor( inConfigamiContext ) {
		// Required param
		if( inConfigamiContext == null ) {
			throw "[FATAL ERROR] - Missing ConfigamiContext object when initializing TemplateContext";
		}

		// Get the configami context
		this._cgCtx = inConfigamiContext;

		// Get the full template path (used internally)
		// and validate if its a directory
		this._fullTemplatePath = path.join( this._cgCtx.templateRootDir, this._cgCtx.templatePath );
		if( !isDirectory(this._fullTemplatePath) ) {
			throw "[FATAL ERROR] - TemplatePath is not a valid directory : "+this._cgCtx.templatePath;
		}
	}

	
}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = TemplateContext;