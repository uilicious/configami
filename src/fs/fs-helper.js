// Get the based fs-extra
const fse = require("fs-extra");

// Build the FSH object
const fsh = {
	// The fs-helper module, with imports
	listFile: require("./listFile"),
	listSubDirectory: require("./listSubDirectory"),
	copyFile: require("./copyFile"),
	isFile: require("./isFile"),
	isDirectory: require("./isDirectory"),
	writeFile: require("./writeFile")
};

// Lets "inherit" fse functions
fsh.__proto__ = fse;

// Module export
module.exports = fsh;