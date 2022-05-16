Get Started
=====================================

**Initial setup**

Initial setup of configami can be done by creating a simple configami-setup.sh script in the root directory of your project as follow:

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

You shall now be able to see  CLI output by running ./run.js with node, this should output the help documentation.

**Setting up template and workspace**

Configami works with a pair of directory called template and workspace, the simplest way to set it up is to create two empty folders named
TEMPLATE and WORKSPACE. Template will host our project templates and input data while workspace will be the where we expect our output according to configami plans.

**Run configami easily with a script**

Let's then create a script to run configami in a more comfy manner, create a run-configami.sh
For this script we assume WORKSPACE and TEMPLATE are in your project root directory.

::

   #!/bin/bash

   # Get the current prj directory
   PRJ_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

   # Run the configami command
   # cd to the folder containing the TEMPLATE / WORKSPACE folder duo, change if needed
   cd .

   # Configami is not setup
   if [[ ! -f "$PRJ_DIR/configami-prj/run.js" ]]; then
       echo "!!! Missing configami setup - installing locally"
       ./setup-configami.sh
   fi

   # Detected a subdir to filter by
   if [[ ! -z $1 ]]; then
       # Run with workspace subdir
       node "$PRJ_DIR/configami-prj/run.js" --workspaceScanDir "$1" .
   else
       # Run across everything
       # node "$PRJ_DIR/configami-prj/run.js" .

       # Add a note
       echo "!!! PS: You must indicate run-configami workspace directory using: ./run-configami.sh 'PROD/example-dir-to-apply' [./optional-command-to-execute-in-dir.sh]"
       exit;
   fi

   # Enable execution recursively (avoid merge issues)
   chmod -R +x ./

   # Detected a followup command
   if [[ ! -z $2 ]]; then
      cd ./WORKSPACE
      cd "$1"

       # Followup command
      echo "|   Detected followup command: "
      echo "|   ${@:2}"
      echo "--------------------------------------------------------------------"
      ${@:2}
   fi

See the examples page for some basic ideas of how to use configami.