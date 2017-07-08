const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

// 1. Open file from args, store in a variable
// 2. Load homonym dictionary and ask user to pick homonym to checks, store in a variable
// 3. Scan the file

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
        this.currentHomonyms = answer;
        console.log(this.currentFileText);
        console.log(this.currentHomonyms);
      }).catch(error => console.error(error));
    });
  },
};

app.getFile(process.argv[2]);
app.homonymList();
