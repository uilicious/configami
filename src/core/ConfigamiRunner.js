//---------------------------------
//
//  Dependency loading
//
//---------------------------------

// Native node dependencies
const path = require("path")

// Project depdencies
const WorkspaceRoot   = require("../workspace/WorkspaceRoot");
const TemplateRoot    = require("../template/TemplateRoot");
const fsh             = require("../fs/fs-helper");
const hjsonParse      = require("../conv/hjsonParse");
const nestedObjAssign = require("../struct/nestedObjAssign");

//---------------------------------
//
//  Class implementation
//
//---------------------------------
class ConfigamiRunner {

	/**
	 * Setup configami with default sub path routing
	 * 
	 * @param {String|path} inProjDir directory considering all other folder paths
	 * @param {Object}      initOverwrite [optional] initial config settings overwrites
	 */
	constructor( inProjDir, initOverwrite ) {
		// Load the working dir, and the config
		this._projectDir = inProjDir;
		this.projectConfig( initOverwrite );
	}

	/**
	 * @param {Object}      initOverwrite [optional] initial config settings overwrites
	 * 
	 * @return project configuration JSON object
	 */
	projectConfig(initOverwrite) {
		// Get the cached config
		if( this._projectConfig ) {
			return this._projectConfig;
		}

		// Config file paths to try
		const configPathJSON = path.resolve( this._projectDir, "configami.json" );
		const configPathJS   = path.resolve( this._projectDir, "configami.js" );

		// Get the working configuration
		let workingDirConfig = hjsonParse.file( configPathJSON, {});
		if( fsh.isFile( configPathJS ) ) {
			workingDirConfig = nestedObjAssign(workingDirConfig, require(configPathJS))
		}
		
		// Build the config object
		let configObj = nestedObjAssign({}, require("./ConfigamiRunnerDefaults.js"));
		configObj = nestedObjAssign(configObj, workingDirConfig);

		// init setup overwrites
		if( initOverwrite ) {
			configObj = nestedObjAssign(configObj, initOverwrite);
		}

		// Cache it, and return it
		this._projectConfig = configObj;
		return this._projectConfig;
	}

	/**
	 * @return the workspace scan directory
	 */
	getWorkspaceScanDir() {
		// Get and normalize scan dir
		let scanDir = this.projectConfig()["workspace_scanDir"];
		if( scanDir != null ) {
			scanDir = path.normalize(scanDir);
		}
		if( scanDir == "." || scanDir == "" ) {
			scanDir = null
		}
		return scanDir;
	}

	/**
	 * Log out the basic summary of the configami config
	 */
	logConfig() {
		console.log("--------------------------------------------------------------------")
		console.log("|")
		console.log("|   Assuming the following configami project file path:")
		console.log("|   "+this._projectDir);
		console.log("|")
		console.log("|   template path  : "+this.projectConfig()["template_path"]);
		console.log("|   workspace path : "+this.projectConfig()["workspace_path"]);

		// Log the scan space if its used
		if( this.getWorkspaceScanDir() != null ) {
			console.log("|   workspace scan : "+this.getWorkspaceScanDir());
		}

		console.log("|")
		console.log("--------------------------------------------------------------------")
	}

	//---------------------------------
	//  Path lookups
	//---------------------------------

	/**
	 * @param {String} subpath [optional] subpath to resolve from the config
	 * 
	 * @return full project file pathing (as per project config)
	 */
	projectPath(subpath) {
		// quick working dir when null
		if( subpath == null ) {
			return this._projectDir;
		}

		// resolver cache key
		let cacheKey = "_projectPath_"+subpath;
		if( this[cacheKey] ) {
			return this[cacheKey];
		}

		// Return resolved dir from config - and cache it
		return this[cacheKey] = path.resolve( this._projectDir, this.projectConfig()[subpath.toLowerCase()+"_path"] );
	}

	//---------------------------------
	//  Workspace / Template Root
	//---------------------------------

	/**
	 * WorkspaceRoot class object
	 */
	getWorkspaceRoot() {
		if( this._workspaceRoot ) {
			return this._workspaceRoot;
		}
		return this._workspaceRoot = new WorkspaceRoot( this.projectPath("workspace"), this.projectPath("template") )
	}

	/**
	 * TemplateRoot class object
	 */
	getTemplateRoot() {
		return this.getWorkspaceRoot().templateRootObj;
	}

	//---------------------------------
	//  Run
	//---------------------------------

	/**
	 * Trigger the run sequence
	 */
	run() {
		// Get the workspace root - and apply it
		this.getWorkspaceRoot().applyPlan( this.getWorkspaceScanDir() );
	}
}


//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = ConfigamiRunner;