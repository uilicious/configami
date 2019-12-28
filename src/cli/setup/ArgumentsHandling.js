//----------------------------------------------------
//
//  Dependencies
//
//----------------------------------------------------

const path  = require("path")
const chalk = require("chalk")
const fsh   = require("../../fs/fs-helper");

//----------------------------------------------------
//
//  Arguments hanlding
//
//----------------------------------------------------

/**
 * Extends the `sywac` instance with arguments processing / normalization
 * 
 * @param {sywac} main 
 */
module.exports = function(main) {
    //
    // Template, and workspace argument and normalization
    //
    main.file("-t, --template   <template-path>", {
        description: "template  sub-directory path (default to `./TEMPLATE`)"
    })
    main.file("-w, --workspace  <workspace-path>", {
        description: "workspace sub-directory path (default to `./WORKSPACE`)"
    })
    main.layeredCheck((argv, context) => {
        argv.template  = argv.template  || argv.t || "./TEMPLATE";
        argv.workspace = argv.workspace || argv.w || "./WORKSPACE";
    })

    //
    // Main command argument validation
    //
    main.positional('<project-path>', { paramsDesc: 'Project directory path, to run configami from' })
    main.layeredCheck((argv, context) => {

        // Get the project pathing - and validate it
        const projectPath = path.resolve( argv.project || argv["project-path"] );
        if( !fsh.isDirectory(projectPath) ) {
            throw chalk.red(`ERROR - Missing project directory: '${projectPath}'`)+"\n"+chalk.dim("[Use -h for more help information]");
        }

        // Normalize the template path - and validate it
        const templatePath  = path.resolve( projectPath, argv.template  );
        if( !fsh.isDirectory(templatePath) ) {
            throw chalk.red(`ERROR - Missing template directory: '${templatePath}'`)+"\n"+chalk.dim("[Use -h for more help information]");
        }

        // Normalize the workspace path - and validate it
        const workspacePath = path.resolve( projectPath, argv.workspace );
        if( !fsh.isDirectory(templatePath) ) {
            throw chalk.red(`ERROR - Missing workspace directory: '${workspacePath}'`)+"\n"+chalk.dim("[Use -h for more help information]");
        }

        // Store the various validated paths
        argv.final_projectPath   = projectPath;
        argv.final_templatePath  = templatePath;
        argv.final_workspacePath = workspacePath;
    });
}