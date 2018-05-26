var recursive = require("recursive-readdir");
var path = require('path');
var constants = require('./constants');
const PARSE_SUPPORTED_FILE_FORMATS = constants.PARSE_SUPPORTED_FILE_FORMATS;
const VALID_EBOOK_FILE_FORMATS = constants.VALID_EBOOK_FILE_FORMATS;

function getListOfBooks (rootPath) {
    var listPromise = function(resolve, reject) {
        recursive(rootPath, function (err, files) {
          var allBookList = [];
          files.forEach(function(file){
            if(file.indexOf('DS_Store') == -1) {
                var fileExtension = path.extname(file).split('.')[1];
                fileExtension = fileExtension || "";
                var fileName = path.basename(file, '.'+fileExtension);
                var bookInfo = {
                    bookPath: file,
                    fileName: fileName,
                    bookFormat: fileExtension.toLowerCase(),
                    PARSE_SUPPORTED_FORMAT: true,
                    SUPPORTED_EBOOK_FILE_FORMAT: false
                }
                if(PARSE_SUPPORTED_FILE_FORMATS.indexOf(bookInfo.bookFormat) === -1) {
                    bookInfo.PARSE_SUPPORTED_FORMAT = false;
                }
                if(VALID_EBOOK_FILE_FORMATS.indexOf(bookInfo.bookFormat) > -1) {
                    bookInfo.SUPPORTED_EBOOK_FILE_FORMAT = true;
                }
                allBookList.push(bookInfo);
            }
          });
          //allBookList.length = 100;
          resolve(allBookList);
        });
    }
    return new Promise(listPromise);
}

module.exports = getListOfBooks;