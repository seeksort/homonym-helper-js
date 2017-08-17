const inquirer = require('inquirer');
const chalk = require('chalk');

let self;

function Interface() {
  this.currentHomonyms = '';
  self = this;
}

Interface.prototype.homonymList = (homonyms) => {
  const choices = homonyms.split('\n');
  return inquirer.prompt({
    type: 'list',
    name: 'homonym',
    message: 'Please choose a set of homonyms to review:',
    choices: [...choices, 'Exit app'],
  }).then((answer) => {
    if (answer.homonym === 'Exit app') {
      console.log('\n> You have exited Homonym Helper. Goodbye!');
      return null;
    }
    this.currentHomonyms = answer.homonym.substring(1, answer.homonym.length - 1).split(', ');
    return this.currentHomonyms;
  });
};

// create an array that stores 8 word fragments of the text file for display,
// with indices referencing word to be highlighted and placement in original text array
// ex: [['find out if there going to open the', '3', '36']]
Interface.prototype.sentenceFragment = (textArr) => {
  return textArr.reduce((arr, currentWord, index) => {
    let currWordArr;
    let currWordIndex;
    const fullTextArrIndex = index;
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
    arr.push([currWordArr, currWordIndex, fullTextArrIndex]);
    return arr;
  }, []);
};

Interface.prototype.wordCaseMatcher = (origWord, homonyms) => {
  const origWordArr = origWord.split('');
  const formattedHomonyms = homonyms;
  if (origWordArr[0] === origWordArr[0].toUpperCase()) {
    homonyms.forEach((homonym, index) => {
      const homonymArr = homonym.split('');
      homonymArr[0] = homonymArr[0].toUpperCase();
      formattedHomonyms[index] = homonymArr.join('');
    });
  } else {
    homonyms.forEach((homonym, index) => {
      formattedHomonyms[index] = homonym.toLowerCase();
    });
  }
  return formattedHomonyms;
};

Interface.prototype.questionsList = (currentHomonyms, textFragments) => {
  const questions = [];
  textFragments.forEach((currentArr) => {
    let formattedHomonyms = currentHomonyms;
    const currWordArr = currentArr[0];
    const currWordIndex = currentArr[1];
    currentHomonyms.forEach((current) => {
      if (currWordArr[currWordIndex].toLowerCase().match(current.toLowerCase()) !== null) {
        // functions in loops are funny; use an IIFE for proper output
        formattedHomonyms = () => self.wordCaseMatcher(currWordArr[currWordIndex], currentHomonyms); 
        const questionObj = {
          type: 'list',
          name: `${currentArr[2]}`,
          message: chalk `Please select replacement homonym: {yellow ${currWordArr.slice(0, currWordIndex).join(' ')}}${currWordIndex !== 0 ? ' ' : ''}{green.bold ${currWordArr[currWordIndex]}} {yellow ${currWordArr.slice(currWordIndex + 1, currWordArr.length).join(' ')}}`,
          choices: formattedHomonyms,
        };
        questions.push(questionObj);
      }
      formattedHomonyms = currentHomonyms;
    });
  });
  return questions;
};

Interface.prototype.homonymReplacer = (fullTextArr) => {
  const textFragments = self.sentenceFragment(fullTextArr);
  const questions = self.questionsList(this.currentHomonyms, textFragments);
  return inquirer.prompt(questions).then((res) => {
    console.log('\n> Revisions complete! See below. A new file with your revisions was also created in the output folder.\n');
    const arrToJoin = fullTextArr;
    Object.keys(res).forEach((key) => {
      arrToJoin[key] = res[key];
    });
    const joined = arrToJoin.join(' ');
    console.log(`${joined}\n`);
    return joined;
  });
};

module.exports = Interface;
