//---------------------------------
//
//  Dependency loading
//
//---------------------------------

// Native node dependencies
const path = require("path");
const fse  = require("fs-extra");

//---------------------------------
//
//  Utility functions
//
//---------------------------------

const listFileDirectory  = require("./fs/listFileDirectory");
const listSubDirectory   = require("./fs/listSubDirectory");
const copyFile           = require("./fs/copyFile");
const isFile             = require("./fs/isFile");
const writeFile          = require("./fs/writeFile");
const jsonParse          = require("./util/jsonParse");
const TemplateContext    = require("./TemplateContext");

//---------------------------------
//
//  Internal functions / vars
//
//---------------------------------

/**
 * Scan the various `plan` folders recursively - and apply to output
 * binary copies of files to be copied over.
 * 
 * @param {String} planDir 
 * @param {String} outputDir 
 */
function scanPlanAndPerformBinaryCopies( planDir, outputDir ) {
	// Ensure output dir exists
	fse.ensureDirSync( outputDir );

	//
	// Scan the various files - to be copied
	//
	const fileList = listFileDirectory( planDir )
	for( const fileName of fileList ) {
		// Skip reserved files (with .configami.x)
		if( fileName.indexOf(".configami") >= 0 ) {
			continue;
		}

		// Perform copies when needed
		copyFile(
			path.resolve( planDir,   fileName ),
			path.resolve( outputDir, fileName )
		);
	}

	//
	// Scan for directories (recursive!)
	//
	const dirList = listSubDirectory( planDir );
	for( const dirName of dirList ) {
		// Recursive triggers
		scanPlanAndPerformBinaryCopies(
			path.resolve( planDir,   dirName ),
			path.resolve( outputDir, dirName )
		);
	}
}

/**
 * Given the plan object, apply it to the output
 * @param {TemplateRoot} templateRootObj 
 * @param {Object}       planObj 
 * @param {String}       planDir 
 * @param {Object}       outputObj 
 */
function applyPlanObject( templateRootObj, planObj, planDir, outputObj ) {
	// Special handling for an array of templates
	if( Array.isArray(planObj) ) {
		for( const planItem of planObj ) {
			applyPlanObject( templateRootObj, planItem, planDir, outputObj );
		}
		return;
	}

	// Skip / ignore object without templates
	const templatePath = planObj.template;
	if( templatePath == null ) {
		return;
	}

	// Given the plan, get the template, and apply it
	const inputObj = planObj.input || {};
	const template = templateRootObj.getTemplate( templatePath );
	template( new TemplateContext(this, templateRootObj, inputObj, outputObj) );
}

/**
 * Scan the plan recursively, and output the populated object
 * 
 * @param {TemplateRoot}  templateRootObj 
 * @param {String}        planDir
 * @param {String}        outputDir
 * @param {Object}        outputObj
 * 
 * @return {Object} output obj
 */
function scanPlanAndPopulateOutputObject( templateRootObj, planDir, outputObj = {} ) {
	
	//
	// Scan the various files
	//

	// get the plan json (null if file is not set)
	let planJsonObj = jsonParse.file( path.resolve(planDir, "plan.configami.json") );
	if( planJsonObj ) {
		applyPlanObject( templateRootObj, planJsonObj, planDir, outputObj )
	}

	//
	// Scan for directories (recursive!)
	//
	const dirList = listSubDirectory( planDir );
	for( const dirName of dirList ) {
		// Ensure outputobj recursion
		if( !outputObj[dirName] ) {
			outputObj[dirName] = {};
		}

		// Recursive triggers
		scanPlanAndPopulateOutputObject(
			templateRootObj,
			path.resolve( planDir, dirName ),
			outputObj[dirName]
		);
	}

	// return 
	return outputObj;
}

/**
 * Scan the output recursively, and writes it into the work dir
 * 
 * @param {Object} output  object to scan and output to wrkDir
 * @param {String} wrkDir  path to output into
 */
function applyOutputObjectIntoWorkDir( output, wrkDir ) {
	// Iterate for each key and value
	for(const key of Object.keys(output)) {
		const val = output[key];

		// Write file content (if its a string)
		if (typeof val === 'string' || val instanceof String) {
			writeFile( path.resolve(wrkDir, key), val );
			continue;
		}

		// Recusively resolve output
		if( !output[key] ) {
			output[key] = {};
		}
		applyOutputObjectIntoWorkDir( output[key], path.resolve( wrkDir, key ) );
	}
}

//---------------------------------
//
//  Class implementation
//
//---------------------------------
class PlanRoot {

	/**
	 * Initialize the plan directory 
	 * 
	 * @param {String} inPlanDir 
	 * @param {String} inWrkDir
	 **/
	constructor( inPlanDir, inWrkDir ) {
		this._planDir = inPlanDir;
		this._wrkDir = inWrkDir;
	}

	/**
	 * Apply and output the plan into the workspace directory
	 */
	applyPlan( templateRootObj ) {
		scanPlanAndPerformBinaryCopies( this._planDir, this._wrkDir );
		let output = scanPlanAndPopulateOutputObject( templateRootObj, this._planDir );
		applyOutputObjectIntoWorkDir( output, this._wrkDir );
	}
}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = PlanRoot;