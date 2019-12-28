#!/usr/bin/env node

//----------------------------------------------------
// Setup main CLI object (with ConfigamiVersion)
//----------------------------------------------------
let main = require("./setup/ExtendedSywacObj");

//----------------------------------------------------
// CLI arguments handling
//----------------------------------------------------

main.file("-t, --template   <template-path>", {
	description: "template  sub-directory path (default to `./TEMPLATE`)"
})
main.file("-w, --workspace  <workspace-path>", {
	description: "workspace sub-directory path (default to `./WORKSPACE`)"
})
main.layeredCheck((argv, context) => {
	argv.template  = argv.template  || argv.t || "./TEMPLATE";
	argv.workspace = argv.workspace || argv.w || "./WORKSPACE";
})

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