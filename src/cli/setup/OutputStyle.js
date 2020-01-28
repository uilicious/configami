//----------------------------------------------------
//
// Style overwrites
//
//----------------------------------------------------

// Chalk dependency
const chalk  = require("chalk")

/**
 * Extends the `sywac` instance with custom output style
 * 
 * @param {sywac} main 
 */
module.exports = function(main) {
    main.style({
        // Custom styling for flags / prefix
        flags: (str, type) => {
            let style = type.datatype === 'command' ? chalk.magenta : chalk.cyan
            // if (str.startsWith('-')) style = style.dim
            return style(str)
        },
        desc: (str) => { 
            // There is special notes handling
            let pos = str.indexOf("[")
            if( pos > 0 ) {
                let desc = str.substring(0, pos);
                let note = str.substring(pos);
                return chalk.green(desc)+chalk.dim(note)+chalk.reset(""); 
            } 
            return chalk.green(str)+chalk.reset(""); 
        },

        // This is the [placeholders] texts, which seems to caue annoying color bugs
        hints: (str) => {
            str = str.replace(/\[(string|boolean|number|file|commands\:.*|aliases\:.*)\]/gi,"")
            return chalk.dim(str.trim())
        },

        // Other styles
        usagePrefix: str => {
            return chalk.white(str.slice(0, 6)) + ' ' + chalk.magenta(str.slice(7))
        },
        usageOptionsPlaceholder: str => chalk.green.dim(str),
        usageCommandPlaceholder: str => chalk.magenta(str),
        usagePositionals: str => chalk.green(str),
        usageArgsPlaceholder: str => chalk.green(str),
        group: str => chalk.white(str),
        
        // use different style when a type is invalid
        groupError: str => chalk.red(str),
        flagsError: str => chalk.red(str),
        descError: str => chalk.yellow(str),
        hintsError: str => chalk.red(str),
        
        // style error messages
        messages: str => chalk.red(str)
    })
    main.outputSettings({
        maxWidth: Math.min(95, process.stdout.columns)
    })
};