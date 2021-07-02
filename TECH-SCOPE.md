# This is not meant for real-time server systems

> This is meant for a single process use CLI

As such acceptable compromises of "performance" for better code readability is done, such as (but not limited to)

- Syncronous Functions
- Using handlebars without preinit compilation
- "Unoptimized code" (such as JS object cloning using JSON - everywhere)

# Will we optimize the above

> Maybe? In the future - once the project is fully featured and stable, that can be a v2 rewrite.

# @TODO 

- Recursion protection, for templates including templates, 
	- we do not actually need to block, just need to properly trace and report the error?