.. Configami documentation master file, created by
   sphinx-quickstart on Tue May 10 13:55:37 2022.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to Configami's documentation!
=====================================

.. toctree::
   :maxdepth: 2
   :caption: Contents:

**Configami**  (Configuration Origami)
A configuration and templating CLI tool, designed specifically for the use case of config management. 
This is designed to be used in conjuncture of other tools such as bash, ansible, and terraform.
Allow the generation of extreamly large YAML files, from a few simple lines and a good template.  
`Access Configami Github repository <https://github.com/uilicious/configami/>`_ 

**Get Started**
Initial setup of configami can be down by creation a simple configami-setup.sh script in the root directory of your project as follow:
::

   #!/bin/bash
   #
   # Does the initial project setup - for dependency tools
   #
   # Clone the configami proj
   git clone https://github.com/uilicious/configami.git configami-prj || true
   # Do the node setup
   cd ./configami-prj;
   npm install
   cd ../;

Make sure you run it once to add configami to your project.

Let's then create a script to run configami, run-configami.sh
::

   #!/bin/bash
   #
   # Get the current prj directory
   #
   PRJ_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
   # Run the configami command
   node "$PRJ_DIR/configami-prj/run.js"

If everything goes smoothly you shall now be able to run the CLI by starting run-configami.sh


.. note::

   This project is under active development.

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
