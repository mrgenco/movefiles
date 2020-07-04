const fs = require( 'fs' );
const path = require( 'path' );
const prompt = require('prompt-sync')({sigint: true});

const moveFrom = prompt('Enter a source directory : ');
const moveTo = prompt('Enter a destination directory : '); 

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
                await fs.promises.mkdir(newTarget);
                // copy files recursively
                await copyFiles(fromPath, newTarget);
            }
            console.log( "Moved '%s' successfully", path.basename(fromPath));
        }
    }
    catch( e ) {
        console.error( "An Error occured!", e );
    }
} 