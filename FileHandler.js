const path = require('path');
const fs = require('fs');

let self;

function FileHandler() {
  this.currentData = {};
  self = this;
}

FileHandler.prototype.getFile = (dir, fileName, objProp) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(`${__dirname}/${dir}/${fileName}`), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      self.currentData[objProp] = data;
      resolve(data);
    });
  });
};

FileHandler.prototype.cleanText = (text) => {
  const fullTextArrRaw = text.trim().split('\n').join(' ').split(' ');
  return fullTextArrRaw.reduce((arr, currentWord) => {
    if (currentWord !== '') {
      arr.push(currentWord);
    }
    return arr;
  }, []);
};

FileHandler.prototype.writeFile = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(`${__dirname}/output/${fileName}`), data, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = FileHandler;
