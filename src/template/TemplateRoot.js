//---------------------------------
//
//  Dependency
//
//---------------------------------

const ConfigamiContext = require("./../ConfigamiContext");
const TemplateContext  = require("./TemplateContext");
const isDirectory      = require("./../fs/isDirectory");

//---------------------------------
//
//  Class implementation
//
//---------------------------------

/**
 * TemplateRoot is mainly used as a state object,
 * and to bootstrap the various `TemplateContext` and `ConfigamiContext` object for a single `plan`
 * 
 * It typically represents a folder of various templates in sub folders
 */
class TemplateRoot {

	/**
	 * Initialize the module root 
	 * 
	 * @param {String} inTemplateDir 
	 * @param {String} inWorkspaceDir [optional] workspace dir pathing 
	 */
	constructor( inTemplateDir, inWorkspaceDir = null ) {
		if( !isDirectory(inTemplateDir) ) {
			throw "[FATAL ERROR] Setup of TemplateRoot is with an invalid directory "+inTemplateDir;
		}
		this.templateRootDir  = inTemplateDir;
		this.workspaceRootDir = inWorkspaceDir;
	}

	/**
	 * Given the template path, issue a ConfigamiContext
	 * 
	 * @param {String} templatePath 
	 * 
	 * @return {ConfigamiContext}
	 */
	issueConfigamiContext_forTemplateContext( templatePath ) {
		// Initialize the ConfigamiContext
		let ret = new ConfigamiContext();

		// Configure its various options
		ret.cgType           = "template";
		ret.templatePath     = templatePath;
		ret.templateRootDir  = this.templateRootDir;
		ret.workspaceRootDir = this.workspaceRootDir;

		// Return it
		return ret;
	}
	
	/**
	 * Get and issue a TemplateContext
	 * 
	 * @param {String} templatePath 
	 */
	getTemplateContext( templatePath ) {
		return new TemplateContext( this.issueConfigamiContext_forTemplateContext( templatePath ) );
	}
}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = TemplateRoot;