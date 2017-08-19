const Interface = require('./Interface');
const FileHandler = require('./FileHandler');
const inquirer = require('inquirer');
const chalk = require('chalk');

// 1. Open file from args, store in a variable
// 2. Load homonym dictionary and ask user to pick homonym to checks, store in a variable
// 3. Scan the file: output x words at a time, show
// inquirer prompt, replace or don't replace based
// on user response

const app = {
  runOnce: false,

  start() {
    if (!this.runOnce) {
      this.runOnce = true;
      this.runApp('input', process.argv[2]);
    } else {
      this.runApp('output', process.argv[2]);
    }
  },

  runApp(folder, fileName) {
    const IO = new Interface();
    const UserFile = new FileHandler();
    console.log(chalk `{green.bold ${'\n=================================='}}`);
    console.log(chalk `{green.bold ${'=== Welcome to Homonym Helper! ==='}}`);
    console.log(chalk `{green.bold ${'=================================='}}`);

    UserFile.getFile(folder, fileName, 'currentFileText')
    .then(data => console.log(chalk `{green ${'\nyour file output is below!\n\n\n\n'}}${data}`))
    .then(() => UserFile.getFile('ref', 'homonyms.txt', 'currentHomonyms'))
    .then(homonyms => IO.homonymList(homonyms))
    .then((chosenHomonyms) => {
      if (chosenHomonyms === null) {
        // Just want to exit Promise chain, not throw a real error.
        return Promise.reject('');
      }
      console.log('\n> Matches found. See below...\n');
      const cleanTextArr = UserFile.cleanText(UserFile.currentData.currentFileText);
      return IO.homonymReplacer(cleanTextArr);
    })
    // After showing new output to user (in homonymReplacer above), write to new file in output dir
    .then((data) => {
      UserFile.writeFile(process.argv[2], data);
      return data;
    })
    .then(() => inquirer.prompt({
      type: 'list',
      name: 'status',
      message: 'Do you want to run Homonym Helper on the same file again?',
      choices: [
        'Yes',
        'No',
      ],
    })
    .then((answer) => {
      if (answer.status === 'Yes') {
        this.start();
      } else {
        console.log(chalk `{green ${'\n> You have exited Homonym Helper. Goodbye!'}}`);
      }
    }))
    .catch(error => console.error(error));
  },
};

app.start();
