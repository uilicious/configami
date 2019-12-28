#!/usr/bin/env node

//----------------------------------------------------
// Setup main CLI object (with ConfigamiVersion)
//----------------------------------------------------
let main = require("./setup/ExtendedSywacObj");

//----------------------------------------------------
// CLI arguments handling
//----------------------------------------------------
require("./setup/ArgumentsHandling")(main);

//----------------------------------------------------
// Help examples, and output styling
//----------------------------------------------------

// Setup example text
require("./setup/ExampleCLI")(main);

// Output style overwrite
require("./setup/OutputStyle")(main);

// Preface / Epilogue bling
require("./setup/PrefaceAndEpilogue")(main);

//----------------------------------------------------
//
// Time to let the CLI run!
//
//----------------------------------------------------

// Parse and exit
main.parseAndExit().then(argv => {
	// Load the configami runner
	const ConfigamiRunner = require("../core/ConfigamiRunner");

	// Setup the initialization obj
	let initObj = {};
	if( argv.final_workspacePath.length > 0 ) {
		initObj.workspace_path = final_workspacePath;
	}
	if( argv.final_templatePath.length > 0 ) {
		initObj.template_path = final_templatePath;
	}

	// Initialize the configami runner
	const runner = new ConfigamiRunner(argv.final_projectPath, initObj);

	// Log the run params
	runner.logConfig();

	// And run!
	runner.run();
});