var parseMobiFile = require('./mobiParserChild');
var child_process = require("child_process");
var os = require("os");
var numCpus = os.cpus().length;
var cpList = [];
function parseMobi(allBookList) {
    return new Promise(function(resolve, reject){
        var mobiBookList = [];
        allBookList.forEach(function(book, index){
            var mobiBook = null;
            if(book.bookFormat === 'mobi') {
              console.log("Parsing mobi book at #"+index);
              book.bookIndex = index;
              mobiBookList.push(book);
              //allBookList[index]["META"] = parseMobiFile(book.bookPath);
            }
        });
        if(mobiBookList.length === 0) {
            resolve();
        }
        var numberOfChildProcessesRequired = numCpus < mobiBookList.length ? numCpus : mobiBookList.length;
        console.log("numberOfChildProcessesRequired "+numberOfChildProcessesRequired);
        console.log("mobiBookList length = "+mobiBookList.length);

        for(var i = 0; i<numberOfChildProcessesRequired; i++) {
            var cp = child_process.fork("./mobiParserChild");
            cp.coreIndex = i;
            cpList.push(cp);
        }

        for(var j = 0; j<cpList.length; j++) {
            cpList[j].on("message", function(m){
                var coreIndex = this.coreIndex;
                if(m.action == "parseComplete") {
                    var indexOfNextBookForCurrentProcess = m.bookIndex + numberOfChildProcessesRequired;
                    //console.log("Received parse complete "+m.bookMeta+" "+m.bookIndex);
                    //console.log("indexOfNextBookForCurrentProcess "+indexOfNextBookForCurrentProcess);
                    var bookMeta = m.bookMeta;
                    mobiBookList[m.bookIndex]["META"] = bookMeta;

                    if(indexOfNextBookForCurrentProcess < mobiBookList.length) {
                        this.send({
                            action: "parseFile",
                            bookPath: mobiBookList[indexOfNextBookForCurrentProcess].bookPath,
                            bookIndex: indexOfNextBookForCurrentProcess
                        });
                    } else {
                        // Kill current process and wait for other processes to finish
                        console.log("Killing process "+this.coreIndex);
                        this.kill();
                        for(var k = 0; k<numberOfChildProcessesRequired; k++) {
                            if(cpList[k].killed === false) {
                                // Some processes are still running. Wait.
                                console.log("Process "+k+" is still running. Not exiting");
                                return;
                            }
                        }
                        console.log("All process exited..");
                        // All processes have been killed. 
                        for(var l=0; l<mobiBookList.length;l++) {
                            allBookList[mobiBookList[l].bookIndex]["META"] = mobiBookList[l]["META"];
                        }
                        resolve();
                    }
                }
            });
            cpList[j].send({
                action: "parseFile",
                bookPath: mobiBookList[j].bookPath,
                bookIndex: j
            });
        }
    });
}

module.exports = parseMobi;
