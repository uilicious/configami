// Get the based fs-extra
const fse = require("fs-extra");

// The fs-helper module
const fsh = {};

// Lets "clone over" fse functions
fsh.__proto__ = fse;

// List of functions to import
const functionList = [
	"listFileDirectory",
	"listSubDirectory",
	"copyFile",
	"isFile",
	"writeFile"
];

// Importing the various functions
for(const name of functionList) {
	fsh[name] = require("./"+name);
}

// Module export
module.exports = fsh;