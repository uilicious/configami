> The following are notes on intentional technical decisions made in developing configami

# Single threaded syncronous > async callback > multi threaded

The current iteration of configami, is designed to be implemented with minimal complexity.
This allows faster iteration of the design of how the command line tool will interact with the various systems.

v2.0 rewrite will possibly then be implemented with await+proises

Hence all the various `readFileSync` are intentional

