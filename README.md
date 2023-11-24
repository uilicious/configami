# WIP WARNING (THIS IS INCOMPLETE, AND NOT PROPERLY DOCUMENTED - YOU BEEN WARNED)

---

# Configami

- Configuration
- Origami

A Configuration and templating CLI tool, designed specifically for the use case of config management.
This is designed to be used in conjuncture of other tools such as bash, ansible, and terraform.

Allow the generation of extreamly large YAML files, from a few simple lines and a good template.

![Example image of configami in action](./example-for-configami-with-arrow.png)

The name is a shorten form of "Configuration Origami"

---

# Getting started

To install configami via npm use

```
npm install -g configami
```

---

# Workspace folder structure

A `Configami` workspace would consist of the following sub folders.

- TEMPLATE : Where templates would be searched and used
- WORKSPACE : Where your generated working files would be (eg. terraform/yaml/bash files)

This folder will also be the context where the project is executed from,
as such `package.json` and `node_modules` in here will be used as well.

In addition temporary caching folders may be generated under

- .configami_cache

# Primary use case

Its main goal is to tackle the problem of large 1000+ lines of configuration files,
needing to be managed in a "modern" cloud setup (ie: kubernetes, terraform). With a very small team.

This works by templatising the config file generation process. 

---

### plan.configami.jsonc

At the heart of every configami workspace folder, or template. Would be the `plan.configami.jsonc`.
This is a comment-friendly varient json file, which is used to define what other `templates` you intend to use.

So take the following as an example

```
[
	// Template to use (inside the template folder)
	{
		"template": "K8/basic/namespace",
		"input": {
			"NAMESPACE": "example"
		},
		"outputRemap": "01-namespace.yaml"
	},
	// Deploying the daemonset
	{
		"template": "K8/basic/daemonset",
		"input": {
			"NAMESPACE": "example",
			"NAME": "{{name}}",
			"IMAGE": "{{image}}"
		},
		"outputRemap": {
			"02-daemonset.yaml": "daemonset.yaml"
		}
	}
]
```

This helps run two seperate templates, and generate 2 seperate output files.
Variables can be substituted via handle bars from the input files, for example `{{name}}`.

Additionally keys are case insensitive.

More complicated operations is possible as well with handlebars expressions and operators:
https://handlebarsjs.com/guide/#simple-expressions

In addition additional handlebars expression / operators have been included via `handlebar-helpers`:
https://github.com/helpers/handlebars-helpers

Once the JSONC plan is built via handle bars, we will process it as a JSON array of objects, which have the following parameters

**template**
Path within the template folder, to use to build the output files

**input**
If not given, it will use the existing input chain values as it is, and merge it with the template.
Otherwise this will replace the existing input chain instead.

**inputMerge / inputOverwrite**
Instead of replacing the current input chain, merge or overwrite it. The difference between the two, will depend on how nested objects are structured. Merge has the tendancy to merge together objects and arrays. While overwrite replaces them.

For more complicated operations, consider using the `.js` files instead

**outputRemap**
If not set, the template is output directly into the folder, as it is.

If set as a string, it will merge all output files, into a single filename as provided. In alphabetical order.

If set as an object, for each key (representing output file), it will use the template output (values). If this is an array, merges across multiple files occur.

### plan.configami.js

More advance logic, used when templates are insufficient.

Expect a function to be exported by the file, as a module like : `module.exports = function planFunc( cgCtx, inputObj, output )`

Where the context object is provided, with the current input chain values, and the output object. Output here being the array of objects to be processed as templates.

Expects the output object to be returned

### input.configami.jsonc

Input json file object. The key however, is that they are merged recursively.
This means the parent folder (up to the root workspace folder), values are used first, before being merged / overwritten by the current folder being generated.

This allows for common values to be "moved into parent folders" and shared across multiple folders.

This process is refered to as an "input chain"

### input.configami.js

Expect a function to be exported by the file, as a module like : `module.exports = function planFunc( cgCtx, inputObj )`

This allow custom manipulation of the input object.

Expects the input object to be returned.

### <filename>.<tiletype>.configami-template

Can only be used in template folders.

Does handlebars process of the various files, with the "input chain" as value.

Outputs without the `.configami-template` suffix

---

# Example templates

https://github.com/uilicious/configami-k8-template

# Limitations

**This assumes a secure environment**

If you want complex user permission schema to individual config files, it is not a current goal of this project.

**This is not a frontend templating engine**

While it is possible to generate static sites using this CLI, this is not what it was designed for.
That being said, nothing stops you from doing so (lol)
