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
	const runner = new ConfigamiRunner( projectWorkspace );
	runner.logConfig();
	runner.run();
}

//---------------------------------
//
//  Main function execution
//
//---------------------------------

cliBootstrap( path.resolve( process.cwd() ) );