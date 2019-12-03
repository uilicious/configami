//---------------------------------
//
//  Dependency
//
//---------------------------------

const path = require("path");
const fsh  = require("./../fs/fs-helper");

const TemplateRoot          = require("./../template/TemplateRoot");
const ConfigamiContext      = require("./../ConfigamiContext");
const getFolderContextInput = require("./../util/getFolderContextInput");
const jsonObjectClone       = require("./../conv/jsonObjectClone");
const processOutputRemap    = require("./../util/processOutputRemap");

//---------------------------------
//
//  Class implementation
//
//---------------------------------

/**
 * WorkspaceRoot, used to recursively interface with the various input / plans within a workspace
 */
class WorkspaceRoot {

	/**
	 * Initialize the workspace root 
	 * 
	 * @param {String} inWorkspaceDir 
	 * @param {String} inTemplateDir 
	 */
	constructor( inWorkspaceDir, inTemplateDir ) {
		if( !isDirectory(inWorkspaceDir) ) {
			throw "[FATAL ERROR] Setup of WorkspaceRoot is with an invalid directory "+inWorkspaceDir;
		}
		this.workspaceRootDir = inWorkspaceDir;
		this.templateRootDir  = inTemplateDir;
		this.templateRootObj  = new TemplateRoot( inTemplateDir, inWorkspaceDir );
	}

	/**
	 * Given the template path, issue a ConfigamiContext
	 * 
	 * @param {String} workspacePath 
	 * 
	 * @return {ConfigamiContext}
	 */
	issueConfigamiContext_forWorkspacePlanContext( workspacePath ) {
		// Initialize the ConfigamiContext
		let ret = new ConfigamiContext();

		// Configure its various options
		ret.cgType           = "plan";
		ret.workspacePath    = workspacePath;
		ret.workspaceRootDir = this.workspaceRootDir;
		ret.templateRootDir  = this.templateRootDir;

		// Return it
		return ret;
	}
	
	/**
	 * Scan the workspace, and apply the respective plans and get the output file
	 */
	applyPlan_toOutputObj() {
		return applyWorkspacePlan_recursive(  )
	}
}

//---------------------------------
//
//  Module export
//
//---------------------------------
module.exports = WorkspaceRoot;

//---------------------------------
//
//  Recursive plans setup
//
//---------------------------------

/**
 * Apply workspace plans into the output object - recursively
 * 
 * @param {String} fullPath to scan for
 * @param {ConfigamiContext} cgCtx to use
 * @param {Object} baseInput to initialize with
 * @param {Object} output to populate
 * 
 * @return {Object} for the formatted output
 */
function applyWorkspacePlan_recursive( fullPath, cgCtx, baseInput, output ) {
	//
	// Get the current folder context input
	//
	let inputObj = getFolderContextInput(fullPath, baseInput, function(input) { 
		// The configami context currently does not store a copy of the input 
		// - in the future we may add it in
		return cgCtx;
	}, true); // final true, is for workspace mode

	//
	// Apply the workspace plans (without recursion)
	//
	applyWorkspacePlan_noRecursive( fullPath, cgCtx, jsonObjectClone(inputObj), output );

	//
	// Scan for folders - to do recursion
	//
	const dirList = fsh.listSubDirectory( fullPath );
	for( const dirName of dirList ) {
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
 * Apply workspace plans into the output object - no recursion
 * 
 * @param {String} fullPath to scan for
 * @param {ConfigamiContext} cgCtx to use
 * @param {Object} inputObj to use with (already scanned directory)
 * @param {Object} output to populate
 * 
 * @return {Object} for the formatted output
 */
function applyWorkspacePlan_noRecursive( fullPath, cgCtx, inputObj, output ) {

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

		// Output remapping support
		let outputRemap = tObj.outputRemap || outputRemapFallback;
		if( outputRemap ) {
			// Generate the output
			let templateOutput = cgCtx.applyTemplate( tObj.template, tObj.input || inputObj, {} );
			processOutputRemap( output, templateOutput, outputRemap );
		} else {
			// Apply the template directly
			cgCtx.applyTemplate( tObj.template, tObj.input || inputObj, output );
		}
	}

	//
	// 1. Apply the dynamic `plan.configami.[h]json` files (if it exists)
	//
	const planFileNames = [ "plan.configami.json", "plan.configami.hjson" ];
	for( const fileName of planFileNames ) {
		// Full template file path
		const planFilePath = path.join( fullPath, fileName );

		// The planJSON object, skip if null
		const planJSON =  handlebarsParse.hjsonFile( planFilePath, inputObj, null );
		if( planJSON ) {
			applyTemplateObj( planJSON );
		}
	}

	//
	// 2. Apply the dynamic `plan.configami.js` module (if it exists)
	//
	const planFuncPath = path.resolve( fullPath, "plan.configami.js" );
	if( fsh.isFile( planFuncPath ) ) {
		// Load the template function
		const planFunc = require( planFuncPath );
		if( planFunc == null ) {
			throw "[FATAL ERROR] - Missing `module.exports = function` in plan function : "+planFuncPath
		}

		// Merge the output together, note that nothing happens if they are identical (which they should be)
		output = nestedObjectAssign( output, planFunc( cgCtx, inputObj, output ) );
	}

	//
	// Return the final output
	//
	return output;
}