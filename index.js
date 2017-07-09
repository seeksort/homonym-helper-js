const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');

// 1. Open file from args, store in a variable
// 2. Load homonym dictionary and ask user to pick homonym to checks, store in a variable
// 3. Scan the file: output x words at a time, show
// inquirer prompt, replace or don't replace based
// on user response

const app = {
  currentFileText: '',

  currentHomonyms: '',

  getFile: (fileName) => {
    fs.readFile(path.join(`${__dirname}/input/${fileName}`), 'utf8', (err, data) => {
      if (err) throw err;
      this.currentFileText = data;
    });
  },

  homonymList: () => {
    fs.readFile(path.join(`${__dirname}/ref/homonyms.txt`), 'utf8', (err, data) => {
      if (err) throw err;
      const choices = data.split('\n');
      inquirer.prompt({
        type: 'list',
        name: 'homonym',
        message: 'Please choose a set of homonyms to review:',
        choices: [...choices, 'Exit app'],
      }).then((answer) => {
        if (answer.homonym === 'Exit app') {
          console.log('\nYou have exited Homonym Helper.');
          return null;
        }
        this.currentHomonyms = answer.homonym.substring(1, answer.homonym.length - 1);
        console.log(this.currentFileText);
        console.log(this.currentHomonyms);
        const cleanTextArr = app.cleanText(this.currentFileText);
        app.showHomonymText(app.sentenceFragment(cleanTextArr));
      }).catch(error => console.error(error));
    });
  },

  cleanText: (text) => {
    const fullTextArrRaw = text.trim().split('\n').join(' ').split(' ');
    const fullTextArr = [];
    fullTextArrRaw.forEach((currentWord) => {
      if (currentWord !== '') {
        fullTextArr.push(currentWord);
      }
    });
    return fullTextArr;
  },

  sentenceFragment: (textArr) => {
    const outputArr = [];
    textArr.forEach((currentWord, index) => {
      let currWordArr;
      let currWordIndex;
      if (index < 3) {
        // Beginning of text
        currWordArr = textArr.slice(0, 7);
        currWordIndex = index;
      } else if (index > (textArr.length - 5)) {
        // Towards the end of text
        currWordArr = textArr.slice(textArr.length - 7, textArr.length);
        currWordIndex = currWordArr.length - (textArr.length - index);
      } else {
        currWordArr = textArr.slice(index - 3, index + 5);
        currWordIndex = 3;
      }
      outputArr.push([currWordArr, currWordIndex]);
    });
    return outputArr;
  },

  showHomonymText: (textArr) => {
    const homonyms = this.currentHomonyms.split(', ');
    textArr.forEach((currentArr) => {
      const currWordArr = currentArr[0];
      const currWordIndex = currentArr[1];
      homonyms.forEach((current) => {
        if (currWordArr[currWordIndex].toLowerCase().match(current) !== null) {
          console.log(chalk`${currWordArr.slice(0, currWordIndex).join(' ')}${currWordIndex !== 0 ? ' ' : ''}{green.bold ${currWordArr[currWordIndex]}} ${currWordArr.slice(currWordIndex + 1, currWordArr.length).join(' ')}`);
        }
      });
    });
  },
};

app.getFile(process.argv[2]);
app.homonymList();
