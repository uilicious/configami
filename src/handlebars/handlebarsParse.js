//--------------------------------------
//
// Handlebar setup
//
//--------------------------------------

//
// Load handlebars, with handlebars-helpers
//
const handlebars = require("handlebars");
const helpers = require('handlebars-helpers')({
	handlebars: handlebars
});

//
// Custom helpers handling
//
handlebars.registerHelper('json2yaml', require("./helpers/json2yaml"));
handlebars.registerHelper('slashEscapeDoubleQuotes', function(ctx) {
	return ctx.fn(this).replace(/\"/g, '\\"')
});

//--------------------------------------
//
// Handlebar Run commands
//
//--------------------------------------

/**
 * Given the handlebar template, and data - get the result string
 * 
 * @param {String} template 
 * @param {Object} data 
 * 
 * @return formatted string
 */
function handlebarsParse(template, data) {
	// @TODO - in memory cache the templates ?
	let compiled = handlebars.compile(template);
	return compiled(data);
}
module.exports = handlebarsParse;
