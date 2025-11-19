//----------------------------------------------------------
// Dependencies
//----------------------------------------------------------

// Library to test
const handlebarsParse = require("../../src/handlebars/handlebarsParse");

// Load up chai functions
// const should = require("chai").should() // actually call the function
// const expect = require("chai").expect
const assert = require("chai").assert

//----------------------------------------------------------
// Actual tests
//----------------------------------------------------------

//
// Test handle bars features, and helpers
//
describe("handlebarsParse", () => {

	//-------------------------------------------------
	//
	// Test the native features (sanity checks)
	//
	//-------------------------------------------------

	describe("sanity check of native features", () => {
		it("simple variable substitution", () => {
			// lets parse a hello world
			assert.equal( 
				handlebarsParse("{{hello}}", { hello:"world" }),
				"world"
			);
		});
	});

	//-------------------------------------------------
	//
	// Helpers testings
	//
	//-------------------------------------------------

	describe("json2yaml", () => {
		it("with nested array", () => {

			// Input object to use
			let input = {
				"hello": {
					"world": [1,2]
				}
			};

			// The template to use
			let template = [
				"hello:",
				`  {{#json2yaml "hello.world"}}{{/json2yaml}}`
			].join("\n");

			// The expected output
			let expectedOutput = [
				"hello:",
				"  - 1",
				"  - 2"
			].join("\n");

			// Parse and test
			assert.equal(
				handlebarsParse(template, input),
				expectedOutput
			);
		});
	});

	describe("slashEscapeDoubleQuotes", () => {
		it("simple quote testing", () => {

			// Input object to use
			let input = {};

			// The template to use
			let template = `hello: {{#slashEscapeDoubleQuotes}}"world"{{/slashEscapeDoubleQuotes}}`;

			// The expected output
			let expectedOutput = `hello: \\"world\\"`;

			// Parse and test
			assert.equal(
				handlebarsParse(template, input),
				expectedOutput
			);
		});
	});

	describe("base64encode/decode", () => {
		it("should encode and decode base64 correctly", () => {
			// Input object to use
			let input = {};

			// Test Encode
			// --------------------------

			// The template to use
			let templateEncode = `{{#base64encode}}Hello World{{/base64encode}}`;
			// The expected output (base64 of "Hello World")
			let expectedOutputEncode = `SGVsbG8gV29ybGQ=`;

			// Parse and test
			assert.equal(
				handlebarsParse(templateEncode, input),
				expectedOutputEncode
			);

			// Test Decode
			// --------------------------

			// The template to use
			let templateDecode = `{{#base64decode}}${expectedOutputEncode}{{/base64decode}}`;
			// The expected output
			let expectedOutputDecode = `Hello World`;

			// Parse and test
			assert.equal(
				handlebarsParse(templateDecode, input),
				expectedOutputDecode
			);
		});
	});

	describe("getValueByValue", () => {
		it("should retrieve value using another value as key", () => {
			// Input object to use
			// matches example in getValueByValue.js
			let input = { 
				"hello": { 
					"world": "one", 
					"two": "motto" 
				}, 
				"nested": { 
					"key": "world", 
					"deep": "hello.two" 
				} 
			};

			// Test 1: Simple lookup using nested value as key
			// nested.deep = "hello.two"
			// lookup "hello.two" -> "motto"
			let template1 = `{{#getValueByValue "nested.deep"}}{{/getValueByValue}}`;
			assert.equal(handlebarsParse(template1, input), "motto");

			// Test 2: Lookup in specific object
			// nested.key = "world"
			// lookup "world" in "hello" object -> "one"
			let template2 = `{{#getValueByValue "hello" "nested.key"}}{{/getValueByValue}}`;
			assert.equal(handlebarsParse(template2, input), "one");
		});
	});


});
