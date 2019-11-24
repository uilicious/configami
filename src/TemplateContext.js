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

/**
 * Scans the template path, for applicable template files
 * and copies them into output
 * 
 * @param {Object} input 
 * @param {Object} output 
 * @param {String} templatePath 
 */
function scanAndApplyFileTemplates( input, output, templatePath ) {
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
		let fileVal = fsh.readFileSync( path.resolve( templatePath, fileName), { encoding:"utf8"} );
		let fileOutputName = fileName;

		// Apply template substitution if needed
		// Skips this if block, if .notemplate is detected
		if( fileName.indexOf(".notemplate") < 0 ) {
			// Setup a new input object, with additional fields
			// used to managed "cg.x" functions in futrue
			const inputContext = nestedObjAssign({
				input: input // self refrence (if needed)
			}, input);

			// Apply the template
			fileVal = processHandlebars( fileVal, inputContext );
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
	 * @param {Object} inputObj 
	 * @param {Object} outputObj 
	 */
	constructor( inputObj, outputObj ) {
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
			ret = inputMod( ret, this );
		}

		// Final return
		return ret;
	}

	/**
	 * Apply the template into the output
	 */
	applyTemplate() {
		let combinedInput = this.getCombinedInput();
		scanAndApplyFileTemplates( combinedInput, this.output, this.templatePath );
	}

}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = TemplateContext;