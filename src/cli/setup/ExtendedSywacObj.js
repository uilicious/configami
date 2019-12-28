//----------------------------------------------------
//
//  Dependencies
//
//----------------------------------------------------

const sywac  = require("sywac")
const chalk  = require("chalk")
const LoggerWithLevels = require("../../util/LoggerWithLevels")
const version = require("../../ConfigamiVersion")

//----------------------------------------------------
//
//  Setup main CLI function
//
//----------------------------------------------------

// Lets do the basic setup
let main = sywac
	.help("-h, --help")
	.version("-v, --version", {
		version: version
	})
	.showHelpByDefault()

//----------------------------------------------------
//
// Extendable configuration checking,
// 
// This extends the sywac main ".check" function,
// with a custom "layeredCheck" function which can
// be incrementally extended with multiple 
// check functions. 
//
// Useful for implementing checks in modules.
// and working around the "single check function"
// limitation of sywac
//
//----------------------------------------------------

// Array of checking function to use and and populate
let checkFunctions = [];
// Main checking function logic
main.check(async function(argv, context) {
	// Skip validation - if help command is used
	if(argv.help || argv._[1] == "help") {
		return;
	}
	
	// Iterate various validations
	for(let i=0; i<checkFunctions.length; ++i) {
		await checkFunctions[i](argv, context);
	}
});
// Lets null it out (to force an error if anyone uses)
main.check = null;

/**
 * Allow support for multiple layers of check's
 * 
 * ```
 * main.layeredCheck((argv, context) => {
 *     // Do stuff A
 * })
 * main.layeredCheck((argv, context) => {
 *     // Do stuff B
 *     // (after stuff A)
 * })
 * ```
 * 
 * @param {Function} handler to use as a checking function
 * 
 * @return {Sywac} the main instance
 **/
main.layeredCheck = function(handler) {
	checkFunctions.push(handler);
	return main;
}

//----------------------------------------------------
//
//  Additional flags (for noisy)
//
//----------------------------------------------------

main.boolean("--trace", {
	description: "Extremely verbose logging (used for dev-debugging)"
})
main.layeredCheck((argv, context) => {
	if( argv.trace ) {
		LoggerWithLevels.setAsTrace();
	}
});

//----------------------------------------------------
//
//  Lets register some helper functions
//
//----------------------------------------------------

main.chalk  = chalk;
main.logger = LoggerWithLevels; 

/**
 * Initialized `sywac` object, with the following extension
 * and preloaded "ConfigamiVersion" numbering
 * 
 * ```
 * .layeredCheck(handler)
 * .chalk.x
 * .logger.x
 * ```
 */
module.exports = main;

