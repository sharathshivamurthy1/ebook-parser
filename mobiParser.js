var Mobi = require('mobi');

function parseMobi(allBookList) {
    allBookList.forEach(function(book, index){
        var mobiBook = null;
        if(book.bookFormat === 'mobi') {
          console.log("Parsing mobi book at #"+index);
          allBookList[index]["META"] = {};
          try {
            mobiBook = new Mobi(book.bookPath);
            allBookList[index]["META"] = {
              mobiHeader: mobiBook.mobiHeader,
              name: mobiBook.name,
              title: mobiBook.title
            }
          } catch (ex) {
            allBookList[index]["META"] = {
                "EXCEPTION_WHILE_PARSING": ex
            }
          }
        }
    });
}

module.exports = parseMobi;