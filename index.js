const Interface = require('./Interface');
const FileHandler = require('./FileHandler');
const inquirer = require('inquirer');

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

    UserFile.getFile(folder, fileName, 'currentFileText')
    .then(data => console.log(`\n=== your file output is below ===\n\n${data}`))
    .then(() => UserFile.getFile('ref', 'homonyms.txt', 'currentHomonyms'))
    .then(homonyms => IO.homonymList(homonyms))
    .then((chosenHomonyms) => {
      if (chosenHomonyms === null) {
        // Just want to exit Promise chain, not throw a real error.
        return Promise.reject('');
      }
      console.log('\n> Matches found. See below...\n');
      const currentHomonyms = chosenHomonyms.substring(1, chosenHomonyms.length - 1);
      const cleanTextArr = UserFile.cleanText(UserFile.currentData.currentFileText);
      return IO.showHomonymText(currentHomonyms, IO.sentenceFragment(cleanTextArr), cleanTextArr);
    })
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
        console.log('\n> You have exited Homonym Helper. Goodbye!');
      }
    }))
    .catch(error => console.error(error));
  },
};

app.start();
