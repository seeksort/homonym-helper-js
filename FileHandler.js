const path = require('path');
const fs = require('fs');

function FileHandler() {
  this.dir = '';
  this.fileName = '';
  this.objProp = '';
  this.currentData = {};
}

FileHandler.prototype.getFile = function (dir, fileName, objProp) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(`${__dirname}/${dir}/${fileName}`), 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      this.currentData[objProp] = data;
      resolve(data);
    }.bind(this));
  }.bind(this));
};

FileHandler.prototype.cleanText = (text) => {
  const fullTextArrRaw = text.trim().split('\n').join(' ').split(' ');
  const fullTextArr = [];
  fullTextArrRaw.forEach((currentWord) => {
    if (currentWord !== '') {
      fullTextArr.push(currentWord);
    }
  });
  return fullTextArr;
};

module.exports = FileHandler;
