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

	// Hello world testing
	describe("`hello` template (hello/world.txt)", () => {
		let tCtx = root.getTemplateContext("hello");
		it("valid `getTemplateContext`", () => {
			assert.ok( tCtx );
		});
		it("validate template output", () => {
			let output = tCtx.applyTemplate();
			assert.ok( output );
			assert.equal( output["world.txt"], "its ok!" );
		});
	});

	// nested-hello testing
	describe("`nested-hello` template", () => {
		let tCtx = root.getTemplateContext("nested-hello");
		it("valid `getTemplateContext`", () => {
			assert.ok( tCtx );
		});
		it("validate template output", () => {
			let output = tCtx.applyTemplate();
			assert.ok( output );
			assert.ok( output.world );
			assert.equal( output.world["is-ok.txt"], "yes" );
		});
	});

	// nested-hello/world testing
	describe("`nested-hello/world` template", () => {
		let tCtx = root.getTemplateContext("nested-hello/world");
		it("valid `getTemplateContext`", () => {
			assert.ok( tCtx );
		});
		it("validate template output", () => {
			let output = tCtx.applyTemplate();
			assert.ok( output );
			assert.equal( output["is-ok.txt"], "yes" );
		});
	});

	// input-output testing
	describe("`test/input-output` template", () => {
		let tCtx = root.getTemplateContext("test/input-output");
		it("valid `getTemplateContext`", () => {
			assert.ok( tCtx );
		});
		it("validate template output", () => {
			let output = tCtx.applyTemplate( { d:"k" });
			assert.ok( output );
			assert.equal( output["output.txt"], "404k" );
		});
		it("validate input overwrite output", () => {
			let output = tCtx.applyTemplate( { a:5, b:4, d:"k" });
			assert.ok( output );
			assert.equal( output["output.txt"], "544k" );
		});
	});

	// template-file testing
	describe("`test/template-file` template", () => {
		let tCtx = root.getTemplateContext("test/template-file");
		it("valid `getTemplateContext`", () => {
			assert.ok( tCtx );
		});
		it("validate template output", () => {
			let output = tCtx.applyTemplate( { d:"k" });
			assert.ok( output );
			assert.equal( output["output.txt"], "- 1\n- 2\n- 3" );
		});
	});
});