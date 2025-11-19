#!/bin/bash

mkdir -p build

bun build --compile run-cli.js src/**/*.js package.json --target=bun-darwin-arm64 --outfile build/configami-darwin-arm64
bun build --compile run-cli.js src/**/*.js package.json --target=bun-windows-x64  --outfile build/configami-windows-x64.exe
bun build --compile run-cli.js src/**/*.js package.json --target=bun-linux-x64    --outfile build/configami-linux-x64
bun build --compile run-cli.js src/**/*.js package.json --target=bun-linux-arm64  --outfile build/configami-linux-arm64
