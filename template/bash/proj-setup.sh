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