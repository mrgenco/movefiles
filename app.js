const fs = require( 'fs' );
const path = require( 'path' );

// TODO : get source and destination directory from user 
const moveFrom = ""; 
const moveTo = ""; 

copyFiles(moveFrom, moveTo);

async function copyFiles(moveFrom, moveTo){
    try {
        // Get the files as an array
        const files = await fs.promises.readdir( moveFrom );

        // Loop them all
        for( const file of files ) {
            // Get the full paths
            const fromPath = path.join( moveFrom, file );
            const toPath = path.join( moveTo, file );
            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat( fromPath );

            if( stat.isFile() ){
                // Now move file async
                await fs.promises.copyFile(fromPath, toPath);      
            }
            else if( stat.isDirectory() ){   
                var newTarget = moveTo + "/" +path.basename(fromPath);
                // create a new directory with the same name in the target folder
                await fs.promises.mkdir( newTarget, { recursive: true }, (err) => {
                    if (err)  console.log( "Error occured while creating a directory." + err );
                });
                // copy files recursively
                await copyFiles(fromPath, newTarget, (err) => {
                    if (err)  console.log( "Error occured while copying files." + err );
                });
            }
            console.log( "Moved '%s' successfully", path.basename(fromPath));
        }
    }
    catch( e ) {
        console.error( "An Error occured!", e );
    }
} 