//----------------------------------------------------
//
// Examples !!!
//
//----------------------------------------------------

/**
 * Extends the `sywac` instance with example commands
 * 
 * @param {sywac} main 
 */
module.exports = function(main) {
    // Run within the current directory
    main.example("$0 .", {
        desc: "Runs within the current directory (using `./TEMPLATE` and `./WORKSPACE`)"
    });

    // Run within the current directory
    main.example("$0 ./awesome-project/", {
        desc: "Runs within a custom project directory (using `./TEMPLATE` and `./WORKSPACE`)"
    });

    // // Run within current directory with custom templates
    // main.example("$0 --template './custom-templates' --workspace './wrkspace' './awesome-proj/' ", {
    //     desc: "Runs with custom template, workspace, and project pathing"
    // });   
}