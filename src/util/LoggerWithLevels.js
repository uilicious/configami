//-----------------------------------------------------
//
// Dependency
//
//-----------------------------------------------------

const chalk = require('chalk')

//-----------------------------------------------------
//
// Implementation "config"
//
//-----------------------------------------------------

// This is intentionally here, to be configured "globally"
// default to 3 - warn
//
// 0 - silent
// 1 - fatal 
// 2 - errors
// 3 - warnings
// 4 - info
// 5 - debug
// 6 - trace
let logLevel = 4;

//-----------------------------------------------------
//
// Configguring log level
//
//-----------------------------------------------------

/**
 * Configure the log level as trace
 */
function setAsTrace() {
	logLevel = 6;
	trace("Enabling TRACE logging - this can be extreamly noisy")
}

//-----------------------------------------------------
//
// Getting log level
//
//-----------------------------------------------------

/**
 * @return true, if is configured at trace level
 */
function isTrace() {
	return logLevel >= 6;
}

/**
 * @return true, if is configured at trace level
 */
function isDebug() {
	return logLevel >= 5;
}

/**
 * @return true, if is configured at trace level
 */
function isInfo() {
	return logLevel >= 4;
}

/**
 * @return true, if is configured at trace level
 */
function isWarn() {
	return logLevel >= 3;
}

/**
 * @return true, if is configured at trace level
 */
function isError() {
	return logLevel >= 2;
}

//-----------------------------------------------------
//
// Logging functions
//
//-----------------------------------------------------

/**
 * Output an error level logging
 * @param {String}  str 
 * @param {Boolean} noFormatting 
 */
function error(str, noFormatting = false) {
	if(!isError()) {
		return;
	}

	if(noFormatting) {
		console.log(str);
	}
	console.error( chalk.red(str) );
}

/**
 * Noisly log the output (only if configured)
 * @param {String}  str 
 * @param {Boolean} noFormatting 
 */
function trace(str, noFormatting = false) {
	if(!isTrace()) {
		return;
	}

	if(noFormatting) {
		console.log(str);
	}
	console.log( chalk.dim(str) );
}

/**
 * Noisly log the output (only if configured)
 * @param {String}  str 
 * @param {Boolean} noFormatting 
 */
function debug(str, noFormatting = false) {
	if(!isDebug()) {
		return;
	}

	if(noFormatting) {
		console.log(str);
	}
	console.log( chalk.dim(str) );
}

/**
 * Noisly log the output (only if configured)
 * @param {String}  str 
 * @param {Boolean} noFormatting 
 */
function info(str, noFormatting = false) {
	if(!isInfo()) {
		return;
	}

	if(noFormatting) {
		console.log(str);
	}
	console.log( chalk.dim(str) );
}

/**
 * Noisly log the output (only if configured)
 * @param {String}  str 
 * @param {Boolean} noFormatting 
 */
function info_green(str, noFormatting = false) {
	if(!isInfo()) {
		return;
	}

	if(noFormatting) {
		console.log(str);
	}
	console.log( chalk.green(str) );
}

/**
 * Noisly log the output (only if configured)
 * @param {String}  str 
 * @param {Boolean} noFormatting 
 */
function warn(str, noFormatting = false) {
	if(!isWarn()) {
		return;
	}

	if(noFormatting) {
		console.log(str);
	}
	console.warn( chalk.red.dim(str) );
}

//-----------------------------------------------------
//
// Export
//
//-----------------------------------------------------

module.exports = {
	setAsTrace,

	isTrace,
	isError,
	isInfo,
	isWarn,
	isDebug,

	trace,
	error,
	info,
	info_green,
	warn,
	debug
}