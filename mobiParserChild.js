var Mobi = require('mobi');

function parseMobiFile(mobiFile) {
    var meta = {};
    try {
      mobiBook = new Mobi(mobiFile);
      meta = {
        mobiHeader: mobiBook.mobiHeader,
        name: mobiBook.name,
        title: mobiBook.title
      };
    } catch (ex) {
      meta = {
          "EXCEPTION_WHILE_PARSING": ex
      }
    }
    return meta;
}

process.on("message", function(m){
    if(m.action === "parseFile") {
        console.log("Parsing file path "+m.bookIndex);
        var bookPath = m.bookPath;
        var meta = parseMobiFile(bookPath);
        var bookIndex = m.bookIndex;
        process.send({
            action: "parseComplete",
            bookMeta: meta,
            bookIndex: bookIndex
        });
    }
});

module.exports = parseMobiFile;