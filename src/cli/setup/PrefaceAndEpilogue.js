//----------------------------------------------------
//
// Setup Preface / Epilogue bling
//
//----------------------------------------------------

// Chalk dependency
const chalk  = require("chalk")

//
// Preface string to use
// generate using : http://patorjk.com/software/taag/#p=display&h=0&f=ANSI%20Shadow&t=Configami
//
// ANSCII art is from : https://www.asciiart.eu/animals/rabbits
//
// @TODO : Change rabbit to an origami ascii rabbit
//
// Note that the string needs to be fixed with "\" escape
//
const preface_str = (`
                      /|      __
*             +      / |   ,-~ /             +
     .              Y :|  //  /                .         *
         .          | jj /( .^     *
               *    >-"~"-v"              .        *        .
*                  /       Y
   .     .        jo  o    |     .            +
                 ( ~T~     j                     +     .
      +           >._-' _./         +
               /| ;-"~ _  l
  .           / l/ ,-"~    \\     +
              \\//\\/      .- \\
       +       Y        /    Y
               l       I     !
               ]\\      _\\    /"\\
              (" ~----( ~   Y.  )
          ~~~~~~~~~~~~~~~~~~~~~~~~~~
██████╗ ██████╗  ███╗   ██╗███████╗██╗ ██████╗  █████╗ ███╗   ███╗██╗
██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ ██╔══██╗████╗ ████║██║
██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗███████║██╔████╔██║██║
██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║██╔══██║██║╚██╔╝██║██║
╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝██║  ██║██║ ╚═╝ ██║██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝
`).slice(1);

/**
 * Extends the `sywac` instance with the preface / epilogue text for various commands
 * 
 * @param {sywac} main 
 */
module.exports = function(main) {
    // Load the preface
    main.preface(
        chalk.green(preface_str),
        chalk.green(" ~ Configuration File Origami ~")
    );
    main.epilogue( "\n"+chalk.dim("PS: if you are seeing this in response to a command - it was probably an invalid command") );
}
