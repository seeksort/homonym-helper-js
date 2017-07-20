const inquirer = require('inquirer');
const chalk = require('chalk');

function Interface() {
  this.text = '';
  this.homonyms = '';
  this.currentHomonyms = '';
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
      console.log('\nYou have exited Homonym Helper.');
      return null;
    }
    return answer.homonym;
  });
};

Interface.prototype.sentenceFragment = (textArr) => {
  const outputArr = [];
  textArr.forEach((currentWord, index) => {
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
    outputArr.push([currWordArr, currWordIndex, fullTextArrIndex]);
  });
  return outputArr;
};

Interface.prototype.showHomonymText = (currentHomonyms, textArr, fullTextArr) => {
  const homonyms = currentHomonyms.split(', ');
  // console.log(textArr);
  const matches = [];
  const questions = [];
  textArr.forEach((currentArr, index) => {
    const currWordArr = currentArr[0];
    const currWordIndex = currentArr[1];
    homonyms.forEach((current) => {
      if (currWordArr[currWordIndex].toLowerCase().match(current) !== null) {
        const questionObj = {
          type: 'list',
          name: `${index}`,
          message: chalk `Please select replacement homonym: {yellow ${currWordArr.slice(0, currWordIndex).join(' ')}}${currWordIndex !== 0 ? ' ' : ''}{green.bold ${currWordArr[currWordIndex]}} {yellow ${currWordArr.slice(currWordIndex + 1, currWordArr.length).join(' ')}}`,
          choices: homonyms,
        };
        matches.push(index);
        questions.push(questionObj);
      }
    });
  });
  return inquirer.prompt(questions).then((res) => {
    console.log('\n> Revisions complete! See below. A new file with your revisions was also created in the output folder.\n');
    const arrToJoin = fullTextArr;
    Object.keys(res).forEach((key) => {
      arrToJoin[key] = res[key];
    });
    const joined = arrToJoin.join(' ');
    console.log(joined);
    return joined;
  });
};

module.exports = Interface;
