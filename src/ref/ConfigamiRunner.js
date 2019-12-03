//---------------------------------
//
//  Dependency loading
//
//---------------------------------

// Native node dependencies
const path       = require("path")

// Project depdencies
const PlanRoot      = require("./PlanRoot");
const TemplateRoot  = require("./TemplateRoot");

//---------------------------------
//
//  Static private functions
//  / variables
//
//---------------------------------

const fsh       = require("../fs/fs-helper");
const jsonParse = require("./util/jsonParse");

const nestedObjAssign = require("./util/nestedObjAssign");

//---------------------------------
//
//  Class implementation
//
//---------------------------------
class ConfigamiRunner {

	/**
	 * Setup configami with default sub path oruting
	 * 
	 * @param {String|path} inWorkingdir directory considering all other folder paths
	 */
	constructor( inWorkingdir ) {
		// Load the working dir, and the config
		this._workingdir = inWorkingdir;
		this.projectConfig();
	}

	/**
	 * @return project configuration JSON object
	 */
	projectConfig() {
		// Get the cached config
		if( this._projectConfig ) {
			return this._projectConfig;
		}

		// Config file paths to try
		const configPathJSON = path.resolve( this._workingdir, "configami.json" );
		const configPathJS   = path.resolve( this._workingdir, "configami.js" );

		// Get the working configuration
		let workingDirConfig = jsonParse.file( configPathJSON, {});
		if( fsh.isFile( configPathJS ) ) {
			workingDirConfig = nestedObjAssign(workingDirConfig, require(configPathJS))
		}
		
		// Build the config object
		let configObj = nestedObjAssign({}, require("./ConfigamiRunnerDefaults.js"), workingDirConfig);

		// Cache it, and return it
		this._projectConfig = configObj;
		return this._projectConfig;
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
			return this._workingdir;
		}

		// resolver cache key
		let cacheKey = "_projectPath_"+subpath;
		if( this[cacheKey] ) {
			return this[cacheKey];
		}

		// Return resolved dir from config - and cache it
		return this[cacheKey] = path.resolve( this._workingdir, this.projectConfig()[subpath.toLowerCase()+"_path"] );
	}

	/**
	 * @param subpath in the cache
	 * 
	 * @return the fully resolved cache path
	 */
	cachePath(subpath) {
		// quick configured cache, when null
		if( subpath == null ) {
			return this.projectPath("cache");
		}

		// resolver cache key
		let cacheKey = "_cachePath_"+subpath.toLowerCase();
		if( this[cacheKey] ) {
			return this[cacheKey];
		}

		// Resolve the dir - and cache it
		return this[cacheKey] = path.resolve( this.projectPath("cache"), subpath );
	}

	//---------------------------------
	//  Cache resets
	//---------------------------------

	/**
	 * Reset and clear the cache folder - if it exists, and reinitialize it
	 */
	resetProjectRootCache() {
		fsh.emptyDirSync( this.cachePath() )
	}

	/**
	 * Reset and setup the module cache
	 */
	resetCacheFolders() {
		// the various configami folders
		const folders = [ 
			// "workspace", // Workspace is not a cached folder
			// "resource", // @TODO implementation
			"plan", 
			"template"
		];

		// Lets iterate the folders
		for(const subpath of folders) {
			// Get the cache and project folders paths
			let cacheFolder = this.cachePath(subpath.toUpperCase());
			let projFolder = this.projectPath(subpath);

			// Reset the cache and sync the files (if any)
			fsh.emptyDirSync( cacheFolder )
			if( fsh.isDirectory( projFolder ) ) {
				fsh.copySync( projFolder, cacheFolder );
			}
		}
	}

	//---------------------------------
	//  Plan / Template Root
	//---------------------------------

	/**
	 * PlanRoot class object
	 */
	getPlanRoot() {
		if( this._planRoot ) {
			return this._planRoot;
		}
		return this._planRoot = new PlanRoot( this.cachePath("plan"), this.projectPath("workspace") )
	}

	/**
	 * TemplateRoot class object
	 */
	getTemplateRoot() {
		if( this._templateRoot ) {
			return this._templateRoot;
		}
		return this._templateRoot = new TemplateRoot( this.cachePath("template") )
	}

	//---------------------------------
	//  Run
	//---------------------------------

	/**
	 * Trigger the run sequence
	 */
	run() {
		// Reset the various caches
		this.resetProjectRootCache();
		this.resetCacheFolders();

		// Get and return the planRoot object
		this.getPlanRoot().applyPlan( this.getTemplateRoot() );
	}
}


//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = ConfigamiRunner;