var getListOfBooks = require('./listBooks');
var parseBookList = require('./bookParser');
var fs = require('fs');
const args = process.argv;
const rootEbookFolder = args[2];
if(args.length > 2) {
    fs.lstat(rootEbookFolder, function(err, stats){
        if(err) {
            console.log('Error in fetching stats '+err);
            process.exit(1);
        }
        if(!stats.isDirectory()) {
            console.log('Rootpath is not a directory..');
            process.exit(1);
        }

        getListOfBooks(rootEbookFolder).then(function(allBookList){
            parseBookList(allBookList);
        }, function(){}).catch(function(){});

    });
} else {
    console.log('Usage : node index.js <rootPathOfEbooks>');
}
