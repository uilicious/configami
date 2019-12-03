// //----------------------------------------------------------
// // Dependencies
// //----------------------------------------------------------

// // Library to test
// const handlebarsParse = require("../../src/handlebars/handlebarsParse");

// // Load up chai functions
// // const should = require("chai").should() // actually call the function
// // const expect = require("chai").expect
// const assert = require("chai").assert

// //----------------------------------------------------------
// // Actual tests
// //----------------------------------------------------------

// //
// // Test handle bars features, and helpers
// //
// describe("handlebarsParse", () => {

// 	//-------------------------------------------------
// 	//
// 	// Test the native features (sanity checks)
// 	//
// 	//-------------------------------------------------

// 	describe("(sanity check) native features", () => {
// 		it("simple variable substitution", () => {
// 			// lets parse a hello world
// 			assert.equal( 
// 				handlebarsParse("{{hello}}", { hello:"world" }),
// 				"world"
// 			);
// 		});
// 	});

// 	//-------------------------------------------------
// 	//
// 	// Helpers testings
// 	//
// 	//-------------------------------------------------

// 	describe("json2yaml", () => {
// 		it("with nested array", () => {

// 			// Input object to use
// 			let input = {
// 				"hello": {
// 					"world": [1,2]
// 				}
// 			};

// 			// The template to use
// 			let template = [
// 				"hello:",
// 				`  {{#json2yaml "hello.world"}}{{/json2yaml}}`
// 			].join("\n");

// 			// The expected output
// 			let expectedOutput = [
// 				"hello:",
// 				"  - 1",
// 				"  - 2"
// 			].join("\n");

// 			// Parse and test
// 			assert.equal(
// 				handlebarsParse(template, input),
// 				expectedOutput
// 			);
// 		});
// 	});
// });