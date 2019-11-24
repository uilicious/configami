//---------------------------------
//
//  Dependency loading
//
//---------------------------------

const path = require("path");
const ConfigamiRunner = require("./src/ConfigamiRunner");

//---------------------------------
//
//  Main function
//
//---------------------------------

/**
 * Main logical function, called by the command line interface
 * 
 * @param {path} projectWorkspace where all other compoments would be loaded from
 */
function cliBootstrap(projectWorkspace) {
	console.log("--------------------------------------------------------------------")
	console.log("|")
	console.log("|   Assuming the following configami project:")
	console.log("|   "+projectWorkspace);
	console.log("|")
	console.log("--------------------------------------------------------------------")

	const runner = new ConfigamiRunner( projectWorkspace );
	runner.run();
}

//---------------------------------
//
//  Main function execution
//
//---------------------------------

cliBootstrap( path.resolve( process.cwd() ) );