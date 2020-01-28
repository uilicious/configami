//----------------------------------------------------------
// Dependencies
//----------------------------------------------------------

// Library to test
const WorkspaceRoot = require("../../src/workspace/WorkspaceRoot");

// Dependency stuff
const path = require("path")
const TemplateRoot_testDir = path.resolve(__dirname, "./../../test-files/TemplateRoot") 
const WorkspaceRoot_testDir = path.resolve(__dirname, "./../../test-files/WorkspaceRoot") 

// Load up chai functions
// const should = require("chai").should() // actually call the function
// const expect = require("chai").expect
const assert = require("chai").assert

//----------------------------------------------------------
// Actual tests
//----------------------------------------------------------

//
// WorkspaceRoot basic constructor checks
//
describe("workspace/WorkspaceRoot - basic constructor test", () => {
	describe("basic setup", () => {
		it("basic class setup", () => {
			// Setup and assert not null
			assert.ok( new WorkspaceRoot( 
				path.join(WorkspaceRoot_testDir, "hello"),
				TemplateRoot_testDir
			) );
		});

		it("invalid dir path setup", () => {
			// This passes when an error is throw (for dir not exists)
			assert.throws(function() {
				let r = new WorkspaceRoot( 
					path.resolve(WorkspaceRoot_testDir, "this-dir-does-not-exists"), 
					TemplateRoot_testDir 
				);
			})
		});
	});
});

//
// WorkspaceRoot basic functionality checks
//
describe("workspace/WorkspaceRoot - functionality test", () => {

	// Sanity check
	describe("`hello` project", () => {
		// Setup template root
		const root = new WorkspaceRoot(
			path.join(WorkspaceRoot_testDir, "hello"),
			TemplateRoot_testDir
		);
		
		it("root object initialized (sanity check)", () => {
			assert.ok( root );
		});

		it("validate plan object output", () => {
			let output = root.applyPlan_toOutputObj();
			assert.ok( output );
			assert.equal( output["world.txt"], "its ok!" );
		});
	});


});