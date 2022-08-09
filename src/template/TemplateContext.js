//---------------------------------
//
//  Dependency
//
//---------------------------------

const path = require("path");
const fsh  = require("./../fs/fs-helper");

const ConfigamiContext      = require("./../core/ConfigamiContext");
const getFolderContextInput = require("./../util/getFolderContextInput");
const jsonObjectClone       = require("./../conv/jsonObjectClone");
const handlebarsParse       = require("./../handlebars/handlebarsParse");
const strReplaceAll         = require("./../conv/strReplaceAll");
const processOutputRemap    = require("./../util/processOutputRemap");
const nestedObjAssign       = require("./../struct/nestedObjAssign");

//---------------------------------
//
//  Class implementation
//
//  NOTE: Actual apply template recursion is implemented below
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
		this._fullPath = path.join( this._cgCtx.templateRootDir, this._cgCtx.templatePath );
		if( !fsh.isDirectory(this._fullPath) ) {
			throw "[FATAL ERROR] - TemplatePath is not a valid directory : "+this._cgCtx.templatePath;
		}
	}

	/**
	 * Apply template into the output object
	 * 
	 * @param {Object} baseInput to initialize with
	 * @param {Object} output to populate
	 * 
	 * @return {Object} with the output
	 */
	applyTemplate( baseInput = {}, output = {} ) {
		return applyTemplate_recursive( this._fullPath, this._cgCtx, baseInput, output );
	}
}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = TemplateContext;

//---------------------------------
//
//  Recursive template setup
//
//---------------------------------

/**
 * Apply template into the output object - recursively
 * 
 * @param {String} fullPath to scan for
 * @param {ConfigamiContext} cgCtx to use
 * @param {Object} baseInput to initialize with
 * @param {Object} output to populate
 * 
 * @return {Object} for the formatted output
 */
function applyTemplate_recursive( fullPath, cgCtx, baseInput, output ) {
	//
	// Get the current folder context input
	//
	let inputObj = getFolderContextInput(cgCtx, fullPath, baseInput, function(input) { 
		// The configami context currently does not store a copyu of the input 
		// - in the future we may add it in
		return cgCtx;
	});

	//
	// Apply the template (without recursion)
	//
	applyTemplate_noRecursive( fullPath, cgCtx, jsonObjectClone(inputObj), output );

	//
	// Scan for folders - to do recursion
	//
	const dirList = fsh.listSubDirectory( fullPath );
	for( const dirName of dirList ) {
		// If file has ".configami" - skip
		if( dirName.indexOf(".configami") >= 0 ) {
			continue;
		}

		// normalize output
		output[dirName] = output[dirName] || {};

		// and recursively resolve it
		applyTemplate_recursive( path.resolve(fullPath, dirName), cgCtx, inputObj, output[dirName] );
	}

	//
	// Return the final output
	//
	return output;
}

/**
 * Apply template into the output object - no recursion
 * 
 * @param {String} fullPath to scan for
 * @param {ConfigamiContext} cgCtx to use
 * @param {Object} inputObj to use with (already scanned directory)
 * @param {Object} output to populate
 * 
 * @return {Object} for the formatted output
 */
function applyTemplate_noRecursive( fullPath, cgCtx, inputObj, output ) {

	//
	// Scan for template files
	//
	let fileList = fsh.listFile( fullPath );

	//
	// Inner function - used to remove a fileName from the fileList
	//
	// Note this is dropped, as array manipulation is thought to be more cpu consuming
	// then the optimizing of iteration with if/else
	//
	// ---
	//
	// function removeFileName( fileName ) {
	// 	const idx = fileList.indexOf(fileName);
	// 	if( idx > -1 ) {
	// 		fileList.splice( idx, 1 );
	// 	}
	// }

	//
	// 1. Apply the static files
	//
	for( const fileName of fileList ) {
		// Ignore hidden ".x" file, specifically the ".DS_STORE"
		if( fileName.startsWith(".") ) {
			continue;
		}

		// If file has ".configami" - skip
		if( fileName.indexOf(".configami") >= 0 ) {
			continue;
		}
		// Full template file path
		const templateFilePath = path.join( fullPath, fileName );

		// The final output name (after relabeling - if needed)
		let fileOutputName = fileName;
		let fileVal = null; // file value to use

		// Apply template substitution if needed
		// Skips this if block, if .notemplate is detected
		if( fileName.indexOf(".notemplate") < 0 ) {
			// Get the file value (with handlebars)
			fileVal = handlebarsParse.file( templateFilePath, inputObj );
		} else {
			// Normalize the output without the ".notemplate" label
			fileOutputName = strReplaceAll(fileName, ".notemplate", "");
			fileVal = fsh.readFileSync( templateFilePath, { encoding:"utf8"} );
		}

		// Output the value
		output[fileOutputName] = fileVal;
	}
	
	//
	// Inner function - used to apply a single template JSON obj
	//
	function applyTemplateObj( tObj, outputRemapFallback = null ) {
		// If its an array iterate it
		if( Array.isArray( tObj ) ) {
			// iterate!
			for( subObj of tObj ) {
				applyTemplateObj( subObj, outputRemapFallback );
			}
			return;
		} 

		// template path - does nothing if empty
		if( tObj.template == null || tObj.template.length <= 0 ) {
			return;
		}

		// Input object remapping
		// This uses the following 
		//
		// - template.input_base 
		// - merged with template.input OR parent input object
		// - merged with template.input_merge (if present)
		// - overwrite with template.input_overwrite (if present)

		// Get the base template input
		let templateInput = jsonObjectClone( tObj.input_base || {} );
		
		// Merge in with either the "input" object or the parent input
		templateInput = nestedObjAssign( templateInput, tObj.input || inputObj || {} );
		
		// Perform input_merge/overwrite when needed
		if( tObj.input_merge ) {
			nestedObjAssign( templateInput, tObj.input_merge );
		}
		if( tObj.input_overwrite ) {
			Object.assign( templateInput, tObj.input_overwrite );
		}

		// Output remapping support
		let outputRemap = tObj.outputRemap || outputRemapFallback;
		if( outputRemap ) {
			// Generate the output
			let templateOutput = cgCtx.applyTemplate( tObj.template, templateInput, {} );
			processOutputRemap( output, templateOutput, outputRemap );
		} else {
			// Apply the template directly
			cgCtx.applyTemplate( tObj.template, templateInput, output );
		}
	}

	//
	// 2. Apply the dynamic `.configami-template` files
	//
	for( const fileName of fileList ) {
		// Ignore hidden ".x" file, specifically the ".DS_STORE"
		if( fileName.startsWith(".") ) {
			continue;
		}
		
		// If missing ".configami-template" - skip
		if( fileName.indexOf(".configami-template") < 0 ) {
			continue;
		}
		// Full template file path
		const templateFilePath = path.join( fullPath, fileName );

		// The final output name (after relabeling)
		const fileOutputName = strReplaceAll(fileName, ".configami-template", "");

		// The templateJSON object, skip if null
		const templateJSON = handlebarsParse.hjsonFile( templateFilePath, inputObj, null );
		if( templateJSON ) {
			applyTemplateObj( templateJSON, fileOutputName );
		}
	}

	//
	// 3. Apply the dynamic `template.configami.[h]json` files
	//
	const templateFileNames = [ "template.configami.json", "template.configami.hjson", "template.configami.jsonc" ];
	for( const fileName of templateFileNames ) {
		// Full template file path
		const templateFilePath = path.join( fullPath, fileName );

		// The templateJSON object, skip if null
		const templateJSON =  handlebarsParse.hjsonFile( templateFilePath, inputObj, null );
		if( templateJSON ) {
			applyTemplateObj( templateJSON );
		}
	}

	//
	// 4. Apply the dynamic `template.configami.js` module (if it exists)
	//
	const templateFuncPath = path.resolve( fullPath, "template.configami.js" );
	if( fsh.isFile( templateFuncPath ) ) {
		// Load the template function
		const templateFunc = require( templateFuncPath );
		if( templateFunc == null ) {
			throw "[FATAL ERROR] - Missing `module.exports = function` in template function : "+templateFuncPath
		}

		// Merge the output together, note that nothing happens if they are identical (which they should be)
		output = nestedObjAssign( output, templateFunc( cgCtx, inputObj, output ) );
	}

	//
	// Return the final output
	//
	return output;
}
