//---------------------------------
//
//  Dependency loading
//
//---------------------------------

// Native node dependencies
const path       = require("path");

//---------------------------------
//
//  Utility functions
//
//---------------------------------

const fsh                 = require("./fs/fs-helper");
const processHandlebars   = require("./handlebar/processHandlebars");
const strReplaceAll       = require("./util/strReplaceAll");
const jsonParse           = require("./util/jsonParse");
const nestedObjAssign     = require("./util/nestedObjAssign");
const ConfigamiContext    = require("./ConfigamiContext");

/**
 * Given the input object, return the "data" object to be used by handlebars
 */
function handlebarDataContext(input) {
	// Setup a new input object, with additional fields
	// used to managed "cg.x" functions in futrue
	return nestedObjAssign({
		input: input // self refrence (if needed)
	}, input);
}

/**
 * Scans the template path, for applicable template files
 * and copies them into output
 * 
 * @param {Object} input 
 * @param {Object} output 
 * @param {String} templatePath 
 * @param {ConfigamiContext} cgCtx
 */
function scanAndApplyFileTemplates( input, output, templatePath, cgCtx ) {
	//
	// Scan for files - pipe them to output
	//
	const fileList = fsh.listFileDirectory( templatePath );
	for( const fileName of fileList ) {
		// If file is ".configami" - skip
		if( fileName.indexOf(".configami") >= 0 ) {
			continue;
		}

		// Get the file content
		let fileVal = fsh.readFileSync( path.resolve( templatePath, fileName ), { encoding:"utf8"} );
		let fileOutputName = fileName;

		// Apply template substitution if needed
		// Skips this if block, if .notemplate is detected
		if( fileName.indexOf(".notemplate") < 0 ) {
			// Apply the template
			fileVal = processHandlebars( fileVal, handlebarDataContext(input) );
		} else {
			// Normalize the output without the ".notemplate" label
			fileOutputName = strReplaceAll(fileName, ".notemplate", "");
		}

		// Output the value
		output[fileOutputName] = fileVal;
	}

	//
	// Scan for folders - to do recursion
	//
	const dirList = fsh.listSubDirectory( templatePath );
	for( const dirName of dirList ) {
		// normalize output
		output[dirName] = output[dirName] || {};

		// and recursively resolve it
		scanAndApplyFileTemplates( input, output[dirName], path.resolve(templatePath, dirName), cgCtx);
	}
}

/**
 * Apply the template function json config, if provided
 * 
 * @param {Object} input 
 * @param {Object} output 
 * @param {String} templatePath 
 * @param {ConfigamiContext} cgCtx
 */
function applyTemplateJSON_noRecursion( input, output, templatePath, cgCtx ) {
	// If file does not exist - early return
	const templateJSONPath = path.resolve( templatePath, "template.configami.json" );
	if( !fsh.isFile(templateJSONPath) ) {
		return;
	}

	// Get the raw string - skip if empty
	const templateJSONRaw = fsh.readFileSync( templateJSONPath, { encoding:"utf8"} );
	if(templateJSONRaw == null || templateJSONRaw.trim().length <= 0) {
		return;
	}

	// Apply the template - skip if empty
	let templateJSONStr = processHandlebars( templateJSONRaw, handlebarDataContext(input) );
	if(templateJSONStr == null || templateJSONStr.trim().length <= 0) {
		return;
	}
	
	// Convert it to string
	const templateJSON = jsonParse(templateJSONStr);
	if( templateJSON == null ) {
		return;
	}

	// Apply a single template JSON obj
	function applyTemplateObj( tObj ) {
		// template path
		if( tObj.template == null || tObj.template.length <= 0 ) {
			return;
		}

		// Apply the template
		cgCtx.applyTemplate( tObj.template, tObj.input, output );
	}

	// If its an array iterate it
	if( Array.isArray( templateJSON ) ) {
		// iterate!
		for( templateObj of templateJSON ) {
			applyTemplateObj( templateObj );
		}
	} else {
		// apply directly
		applyTemplateObj( templateJSON );
	}
}

/**
 * Apply the template function json config, if provided
 * 
 * @param {Object} input 
 * @param {Object} output 
 * @param {String} templatePath 
 * @param {ConfigamiContext} cgCtx
 */
function applyTemplateJSON( input, output, templatePath, cgCtx ) {
	//
	// No recursion call
	//
	applyTemplateJSON_noRecursion( input, output, templatePath, cgCtx );

	//
	// Scan for folders - to do recursion
	//
	const dirList = fsh.listSubDirectory( templatePath );
	for( const dirName of dirList ) {
		// normalize output
		output[dirName] = output[dirName] || {};

		// and recursively resolve it
		applyTemplateJSON( input, output[dirName], path.resolve(templatePath, dirName), cgCtx);
	}
}

/**
 * Apply the template function module, if provided
 * 
 * @param {Object} input 
 * @param {Object} output 
 * @param {String} templatePath 
 * @param {ConfigamiContext} cgCtx
 */
function applyTemplateFunction_noRecursion( input, output, templatePath, cgCtx ) {
	// Check if template function exists - skip if not exists
	const templateFuncPath = path.resolve( templatePath, "template.configami.js" );
	if( !fsh.isFile( templateFuncPath ) ) {
		return;
	}

	// Load the template function
	const templateFunc = require( templateFuncPath );
	templateFunc( cgCtx, input, output );
}

/**
 * Apply the template function module, if provided
 * 
 * @param {Object} input 
 * @param {Object} output 
 * @param {String} templatePath 
 * @param {ConfigamiContext} cgCtx
 */
function applyTemplateFunction( input, output, templatePath, cgCtx ) {
	//
	// No recursion call
	//
	applyTemplateFunction_noRecursion( input, output, templatePath, cgCtx );

	//
	// Scan for folders - to do recursion
	//
	const dirList = fsh.listSubDirectory( templatePath );
	for( const dirName of dirList ) {
		// normalize output
		output[dirName] = output[dirName] || {};

		// and recursively resolve it
		applyTemplateFunction( input, output[dirName], path.resolve(templatePath, dirName), cgCtx);
	}
}

//---------------------------------
//
//  Class implementation
//
//---------------------------------
class TemplateContext {

	/**
	 * Initialize the module root 
	 * 
	 * @param {PlanRoot}      planRoot
	 * @param {TemplateRoot}  templateRoot
	 * @param {Object}        inputObj 
	 * @param {Object}        outputObj 
	 */
	constructor( planRoot, templateRoot, inputObj, outputObj ) {

		this.planRoot = planRoot;
		this.templateRoot = templateRoot;

		this.input  = inputObj;
		this.output = outputObj;

		// fsHelper module
		this.fsHelper = fsh;

		// templatePath
		// this.templatePath
	}

	/**
	 * Get the template normalized input
	 * consisting of both template default, and provided inputs
	 */
	getCombinedInput() {
		// Initialize the input, with the default input.json
		let ret = jsonParse.file( path.resolve( this.templatePath, "input.configami.json" ), {} );

		// Joined with provided input overwrites
		ret = nestedObjAssign(ret, this.input);

		// Process the input with the input function (if needed)
		const inputJSPath = path.resolve( this.templatePath, "input.configami.js" );
		if( fsh.isFile( inputJSPath ) ) {
			const inputMod = require( inputJSPath );
			const cgCtx = this.getConfigamiContext(ret);
			ret = inputMod( cgCtx, ret ) || ret;
			cgCtx.input = ret;
		}

		// Final return
		return JSON.parse( JSON.stringify(ret) );
	}

	getConfigamiContext( inputObj = null) {
		if( this._cgCtx != null ) {
			return this._cgCtx;
		}

		let ret           = new ConfigamiContext();
		ret.output        = this.output;
		ret.templatePath  = this.templatePath;
		ret.cgType        = "template";

		// Special input handling
		if( inputObj == null ) {
			ret.input = this.getCombinedInput();
		} else {
			ret.input = inputObj;
		}

		ret._planRoot      = this.planRoot;
		ret._templateRoot  = this.templateRoot;

		return this._cgCtx = ret;
	}

	/**
	 * Apply the template into the output
	 */
	applyTemplate() {
		const configamiCtx  = this.getConfigamiContext();
		const combinedInput = configamiCtx.input;

		scanAndApplyFileTemplates( combinedInput, this.output, this.templatePath, configamiCtx );
		applyTemplateJSON( combinedInput, this.output, this.templatePath, configamiCtx );
		applyTemplateFunction( combinedInput, this.output, this.templatePath, configamiCtx );
	}

}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = TemplateContext;