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
const handlebarsParse   = require("./handlebars/handlebarsParse");
const strReplaceAll       = require("./util/strReplaceAll");
const jsonParse           = require("./conv/hjsonParse");
const nestedObjAssign     = require("./struct/nestedObjAssign");
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
			fileVal = handlebarsParse( fileVal, handlebarDataContext(input) );
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
 * Given the configured output, remap it accordingly
 * 
 * @param {Object} output 
 * @param {Object} templateOutput 
 * @param {*} outputRemap 
 */
function processOutputRemap( output, templateOutput, outputRemap ) {
	//
	// Collapse output, into a single string - if configured
	//
	if( typeof outputRemap == "string" ) {
		// Prepare the final output str
		let outputStrArr = [];

		// By joining the various key values
		let keys = Object.keys(templateOutput).sort();
		for( subKey of keys ) {
			outputStrArr.push( templateOutput[subKey] );
		}

		// And set the output
		output[outputRemap] = outputStrArr.join("\n");
		return;
	}

	//
	// Assumes an object otherwise, and map the keys to array/keys
	//
	for( outputKey of Object.keys(outputRemap).sort() ) {
		// Get the output setting
		let outputSet = outputRemap[outputKey];

		// For the string set, do a direct remap
		if( typeof outputSet == "string" ) {
			output[ outputKey ] = templateOutput[ outputSet ];
			continue;
		}

		// For the array, iterate and join them
		if( Array.isArray( outputSet ) ) {
			let outputStrArr = [];
			for( subKey of outputSet ) {
				outputStrArr.push( templateOutput[subKey] );
			}
			output[ outputKey ] = outputStrArr.join("\n");
			continue;
		}

		// Unknown output setting type
		throw "[FATAL ERROR]: Unknown outputRemap setting : "+JSON.stringify(outputRemap);
	}

	// rreturn processed output
	return output;
}

/**
 * Given the filepath, fetch the template json - with input substitution (if needed)
 * 
 * @param {String} filePath 
 * @param {Object} input 
 * 
 * @return {*} JSON object if valid - else null
 */
function getTemplateJSON( filePath, input ) {
	// return null - if no file
	if( !fsh.isFile(filePath) ) {
		return null;
	}

	// Get the raw string - skip if empty
	const templateJSONRaw = fsh.readFileSync( filePath, { encoding:"utf8"} );
	if(templateJSONRaw == null || templateJSONRaw.trim().length <= 0) {
		return null;
	}

	// Apply the template - skip if empty
	let templateJSONStr = handlebarsParse( templateJSONRaw, handlebarDataContext(input) );
	if(templateJSONStr == null || templateJSONStr.trim().length <= 0) {
		return null;
	}
	
	// Convert it to string
	const templateJSON = jsonParse(templateJSONStr, filePath);
	if( templateJSON == null ) {
		return null;
	}

	// Return the json object (if valid)
	return templateJSON;
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

	//
	// Inner function - used to apply a single template JSON obj
	//
	function applyTemplateObj( tObj, outputRemapFallback = null ) {
		// template path
		if( tObj.template == null || tObj.template.length <= 0 ) {
			return;
		}

		// Output remapping support
		let outputRemap = tObj.outputRemap || outputRemapFallback;
		if( outputRemap ) {
			// Generate the output
			let templateOutput = cgCtx.applyTemplate( tObj.template, tObj.input, {} );
			processOutputRemap( output, templateOutput, outputRemap );
		} else {
			// Apply the template directly
			cgCtx.applyTemplate( tObj.template, tObj.input, output );
		}
	}

	//
	// Scan for files - and pipe out the "x.configami-template.z"
	// into "x.z" files
	//
	const fileList = fsh.listFileDirectory( templatePath );
	for( const fileName of fileList ) {
		// If file is not a ".configami-template" - skip
		if( fileName.indexOf(".configami-template") < 0 ) {
			continue;
		}

		// Get teh template json
		let innerFileName = strReplaceAll(fileName, ".configami-template", "");
		let innerTemplate = getTemplateJSON( path.resolve(templatePath, fileName) );

		// If it has no value - skip
		if( !innerTemplate ) {
			continue;
		}
		
		// Apply the template, and output the value
		applyTemplateObj( innerTemplate, innerFileName );
	}

	//
	// Scan and process for "template.configami.json"
	//
	const templateJSON = getTemplateJSON( path.resolve( templatePath, "template.configami.json" ) );
	if( templateJSON == null ) {
		return;
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