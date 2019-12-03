//----------------------------------------------------------
// Dependencies
//----------------------------------------------------------

// Library to test
const TemplateRoot = require("../../src/template/TemplateRoot");

// Dependency stuff
const path = require("path")
const TemplateRoot_testDir = path.resolve(__dirname, "./../../test-files/TemplateRoot") 

// Load up chai functions
// const should = require("chai").should() // actually call the function
// const expect = require("chai").expect
const assert = require("chai").assert

//----------------------------------------------------------
// Actual tests
//----------------------------------------------------------

//
// TemplateRoot basic functionality checks
//
describe("template/TemplateRoot", () => {
	describe("basic setup", () => {
		it("basic class setup", () => {
			// Setup and assert not null
			assert.ok( new TemplateRoot(TemplateRoot_testDir) );
		});

		it("invalid dir path setup", () => {
			// This passes when an error is throw (for dir not exists)
			assert.throws(function() {
				let r = new TemplateRoot( path.resolve(TemplateRoot_testDir, "this-dir-does-not-exists") );
			})
		});
	});
});

//
// TemplateContext functionality checks
//
describe("template/TemplateContext (using TemplateRoot)", () => {

	// Setup template root
	const root = new TemplateRoot(TemplateRoot_testDir);

	// Sanity check
	describe("basic setup", () => {
		it("root object initialized (sanity check)", () => {
			assert.ok( root );
		});
	});
});