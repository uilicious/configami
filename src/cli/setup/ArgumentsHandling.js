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
    // Template, and workspace argument
    //
    main.file("-t, --template   <template_path>", {
        hidden: true,
        description: "template  sub-directory path (default to `./TEMPLATE`)"
    })
    main.file("-w, --workspace  <workspace_path>", {
        hidden: true,
        description: "workspace sub-directory path (default to `./WORKSPACE`)"
    })
    
    //
    // Hidden aliases
    //
    main.string("--template_path <template_path>", {
        hidden: true
    })
    main.string("--workspace_path <workspace_path>", {
        hidden: true
    })
    
    //
    // Arguments and aliases normalization
    //
    main.layeredCheck((argv, context) => {
        argv.template  = argv.template_path  || argv.template  || argv.t || "";
        argv.workspace = argv.workspace_path || argv.workspace || argv.w || "";
    })

    //
    // Main command argument validation (check for valid paths)
    //
    main.positional('<project-path>', { paramsDesc: 'Project directory path, to run configami from' })
    main.layeredCheck((argv, context) => {

        // Current working dir
        const cwd = process.cwd();

        // Get the project pathing - and validate it
        const projectPath = path.resolve( cwd, argv.project || argv["project-path"] );
        if( !fsh.isDirectory(projectPath) ) {
            throw chalk.red(`ERROR - Missing project directory: '${projectPath}'`)+"\n"+chalk.dim("[Use -h for more help information]");
        }
        argv.final_projectPath   = projectPath;

        // Normalize the template path - and validate it
        if( argv.template.length > 0 ) {
            const templatePath  = path.resolve( projectPath, argv.template  );
            if( !fsh.isDirectory(templatePath) ) {
                throw chalk.red(`ERROR - Missing template directory: '${templatePath}'`)+"\n"+chalk.dim("[Use -h for more help information]");
            }
            argv.final_templatePath  = templatePath;
        } else {
            argv.final_templatePath  = "";
        }

        // Normalize the workspace path - and validate it
        if( argv.workspace.length > 0 ) {
            const workspacePath = path.resolve( projectPath, argv.workspace );
            if( !fsh.isDirectory(templatePath) ) {
                throw chalk.red(`ERROR - Missing workspace directory: '${workspacePath}'`)+"\n"+chalk.dim("[Use -h for more help information]");
            }
            argv.final_workspacePath  = workspacePath;
        } else {
            argv.final_workspacePath  = "";
        }
    });
}