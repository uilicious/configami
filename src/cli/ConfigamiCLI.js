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
	// console.log(argv._);
});