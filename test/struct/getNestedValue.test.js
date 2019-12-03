//----------------------------------------------------------
// Dependencies
//----------------------------------------------------------

// Library to test
const getNestedValue = require("../../src/struct/getNestedValue");

// Load up chai functions
// const should = require("chai").should() // actually call the function
// const expect = require("chai").expect
const assert = require("chai").assert

//----------------------------------------------------------
// Actual tests
//----------------------------------------------------------

//
// Module functionality testing
//
describe("struct/getNestedValue", () => {


	describe("basic functionality", () => {
		it("get nested value", () => {
			// Input object to fetch from
			let input = {
				"hello": {
					"world": [1,2]
				}
			};

			// Expected output
			let expectedOutput = [1,2];
			
			// assert and test
			assert.deepEqual( getNestedValue(input, "hello.world"), expectedOutput );
		});
	});

});