# Configami

- Configuration
- Origami

A Configuration and templating CLI utility, designed specifically for the use case of config management.
This is designed to be used in conjuncture of other tools such as bash, ansible, and terraform.

The name is a shorten form of "Configuration Origami"

# Primary use case

Its main goal is to tackle the problem of large 1000+ lines of configuration files,
needing to be managed in a "modern" cloud setup (ie: kubernetes, terraform). With a very small team.

This works by templatising the config file generation process. 

# This assumes a secure environment

This makes the assumption that the tool is executed in a secure environment.

If you want complex user permission schema to individual config files, it is not a current goal of this project.

# Workspace folder structure

A `Configami` workspace consist of 3 major folders (for now)

- PLAN
- TEMPLATE
- WORKSPACE

This folder will also be the context where the project is executed from,
as such `package.json` and `node_modules` in here will be used as well.

In addition temporary caching folders will be generated under

- .configami_cache

## Resource 

Represents a collection of either 

- static config file
- dynamic config files, with the suffix (.dynamic.js)

## Template 

Reserved for resuable components

## Plan

Template represents a collection of files, to map over to `workdir`.
Files with the `.configami.fileext` suffix will be parsed using the configuration tool.
