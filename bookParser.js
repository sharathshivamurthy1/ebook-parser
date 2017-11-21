var parseMobi = require('./mobiParser');
var EPub = require('epub');
var fs = require('fs');

function getNextIndexOfEpub(list, currentIndex) {
    for(var i=currentIndex; i < list.length; i++) {
        var book = list[i]
        if(book.bookFormat === 'epub') {
            return i;
        }
    }
    return -1;
}

function parseNextEpub (allBookList, index) {
    console.log("parseNextEpub: Index "+index);
    var nextIndexOfEpub = getNextIndexOfEpub(allBookList, index+1);
    console.log("parseNextEpub: nextIndexOfEpub "+nextIndexOfEpub);
    if(nextIndexOfEpub > -1) {
        parseEpub(allBookList, nextIndexOfEpub);
    } else {
        fs.writeFileSync('bookData.json', JSON.stringify(allBookList));
        console.log('Finished');
    }
}

function parseEpub(allBookList, index) {
    var epubLocation = allBookList[index].bookPath;
    var epub = new EPub(epubLocation, '', '');
    console.log('Parsing epub book at '+index);
    allBookList[index]["META"] = {};
    epub.on("end", function(){
        allBookList[index]["META"] = epub.metadata;
        parseNextEpub(allBookList, index);
    });
    try {
        epub.parse();
    } catch(ex) {
        allBookList[index]["META"] = {
            "EXCEPTION_WHILE_PARSING": ex
        };
        parseNextEpub(allBookList, index);
    }
}

function parseBookList (allBookList, index) {
    // Parse mobi first since it is a syncnchronous op.
    parseMobi(allBookList);
    parseNextEpub(allBookList, -1);
}


module.exports = parseBookList;