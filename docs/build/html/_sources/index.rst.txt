.. Configami documentation master file, created by
   sphinx-quickstart on Tue May 10 13:55:37 2022.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to Configami's documentation!
=====================================

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   quickstart
   examples

**Configami**  (Configuration Origami)
A configuration and templating CLI tool, designed specifically for the use case of config management. 
This is designed to be used in conjuncture of other tools such as bash, ansible, and terraform.
Allow the generation of extreamly large YAML files, from a few simple lines and a good template.  
`Access Configami Github repository <https://github.com/uilicious/configami/>`_ 

HELP: 
::

   #Usage: run <project-path> [options]

   #Arguments:
      #<project-path>  Project directory path, to run configami from [required]

   #Options:
      #-h, --help                                   Show help
      #-v, --version                                Show version number
      #    --trace                                  Extremely verbose logging (used for dev-debugging)
      #-t, --template   <template_path>             template  sub-directory path (default to `./TEMPLATE`)
      #-w, --workspace  <workspace_path>            workspace sub-directory path (default to `./WORKSPACE`)
      #-s, --workspaceScanDir  <workspace_scanDir>  workspace sub-directory to scan for plans (default to ``)

   #Examples:
      #Runs within the current directory (using `./TEMPLATE` and `./WORKSPACE`)
      #$ run .

      #Runs within a custom project directory (using `./TEMPLATE` and `./WORKSPACE`)
      #$ run ./awesome-project/

.. note::

   This project is under active development.

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
