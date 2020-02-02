//---------------------------------
//
//  Dependency
//
//---------------------------------

const path = require("path");
const fsh  = require("./../fs/fs-helper");

const TemplateRoot          = require("./../template/TemplateRoot");
const ConfigamiContext      = require("./../core/ConfigamiContext");
const getFolderContextInput = require("./../util/getFolderContextInput");
const jsonObjectClone       = require("./../conv/jsonObjectClone");
const handlebarsParse       = require("./../handlebars/handlebarsParse");
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
		if( !fsh.isDirectory(inWorkspaceDir) ) {
			throw "[FATAL ERROR] Setup of WorkspaceRoot - invalid directory : "+inWorkspaceDir;
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
	 * Given a workspacePath, get the full absolute path equivalent
	 * 
	 * @param {String} workspacePath 
	 * 
	 * @return {String} full absolute workspace path
	 */
	getFullWorkspacePath( workspacePath ) {
		if( workspacePath != null && workspacePath.length > 0 ) {
			return path.join( this.workspaceRootDir, workspacePath );
		}
		return this.workspaceRootDir;
	}

	/**
	 * Scan the workspace, and apply the respective plans and get the output object
	 * 
	 * @param {String} workspaceScanDir to scan for plans to apply
	 * 
	 * @return {*} output object (for testing?)
	 */
	applyPlan_toOutputObj( workspaceScanDir = null ) {
		return applyWorkspacePlan_recursive(this, "", {}, {}, workspaceScanDir);
	}

	/**
	 * Scan the workspace, and apply the respective plans and get the output file
	 * 
	 * @param {String} workspaceScanDir to scan for plans to apply
	 */
	applyPlan( workspaceScanDir = null ) {
		let outputObj = this.applyPlan_toOutputObj();
		applyOutputObjectIntoWorkDir( outputObj, this.workspaceRootDir, workspaceScanDir );
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
//  Utility function
//
//---------------------------------

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
			fsh.writeFile( path.resolve(wrkDir, key), val );
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
//  Recursive plans setup
//
//---------------------------------

/**
 * Apply workspace plans into the output object - recursively
 * 
 * @param {WorkspaceRoot} wRoot workspace root to use
 * @param {String}   workspacePath to scan within wRoot
 * @param {Object}   baseInput to initialize with
 * @param {Object}   output to populate
 * @param {String}   scanDir dir paths to reduce the scope of "plan" scanning within
 * 
 * @return {Object} for the formatted output
 */
function applyWorkspacePlan_recursive( wRoot, workspacePath, baseInput, output, scanDir = null ) {
	//
	// Get the fullPath and cgCtx first
	//
	const fullPath = wRoot.getFullWorkspacePath( workspacePath );
	const cgCtx = wRoot.issueConfigamiContext_forWorkspacePlanContext( workspacePath );
	
	// console.log("==", workspacePath, output);

	//
	// Get the current folder context input
	//
	let inputObj = getFolderContextInput(cgCtx, fullPath, baseInput, function(input) { 
		// The configami context currently does not store a copy of the input 
		// - in the future we may add it in
		return cgCtx;
	}, true); // final true, is for workspace mode

	//
	// Apply the workspace plans (without recursion)
	// if there is no `scanDirArray` filter
	//
	// And apply the full recursion
	//
	if( scanDir == null ) {
		// Apply workspace plans (if needed)
		applyWorkspacePlan_noRecursive( fullPath, cgCtx, jsonObjectClone(inputObj), output );

		// Scan for folders - to do recursion
		const dirList = fsh.listSubDirectory( fullPath );
		for( const dirName of dirList ) {
			// normalize output
			output[dirName] = output[dirName] || {};

			// Derive the new path
			let nxtWorkspacePath = "";
			if( workspacePath == "" ) {
				nxtWorkspacePath = dirName;
			} else {
				nxtWorkspacePath = path.join(workspacePath, dirName);
			}

			// and recursively resolve it
			applyWorkspacePlan_recursive( wRoot, nxtWorkspacePath, inputObj, output[dirName], null );
		}
	} 
	
	//
	// Else, lets Prepare the "next" scanDir
	//
	if( scanDir != null ) {
		//
		// Prepare the "next" scanDir
		//
		let scanDirArr = scanDir.split("/")
		let subDir = scanDirArr[0]
		let nextScanDir = scanDir.slice(1).join("/")
	
		// Derive the new path
		let nxtWorkspacePath = "";
		if( workspacePath == "" ) {
			nxtWorkspacePath = subDir;
		} else {
			nxtWorkspacePath = path.join(workspacePath, subDir);
		}

		// and recursively resolve it
		applyWorkspacePlan_recursive( wRoot, nxtWorkspacePath, inputObj, output[dirName], nextScanDir );
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

		// Input object remapping
		// This uses the following 
		//
		// - template.input OR parent input object
		// - merged with template.input_merge (if present)
		// - overwrite with template.input_overwrite (if present)
		let templateInput = jsonObjectClone( tObj.input || inputObj || {} );
		if( tObj.input_merge ) {
			nestedObjectAssign( templateInput, input_merge );
		}
		if( tObj.input_overwrite ) {
			Object.assign( templateInput, tObj.input_overwrite );
		}

		// Output remapping support
		let outputRemap = tObj.outputRemap || outputRemapFallback;
		if( outputRemap ) {
			// Generate the output
			let templateOutput = cgCtx.applyTemplate( tObj.template, templateInputj, {} );
			processOutputRemap( output, templateOutput, outputRemap );
		} else {
			// Apply the template directly
			cgCtx.applyTemplate( tObj.template, templateInput, output );
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