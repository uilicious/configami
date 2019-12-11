#!/bin/bash

# Get the current prj directory
PRJ_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Run the configami command
cd ./STACK
node "$PRJ_DIR/configami-prj/run.js"