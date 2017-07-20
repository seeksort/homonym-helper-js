const Interface = require('./Interface');
const FileHandler = require('./FileHandler');

// 1. Open file from args, store in a variable
// 2. Load homonym dictionary and ask user to pick homonym to checks, store in a variable
// 3. Scan the file: output x words at a time, show
// inquirer prompt, replace or don't replace based
// on user response

const app = {
  currentFileText: '',

  currentHomonyms: '',
// APP
  runApp: () => {
    const IO = new Interface();
    const UserFile = new FileHandler();

    UserFile.getFile('input', process.argv[2], 'currentFileText')
    .then(data => console.log(`\n=== your file output is below ===\n\n${data}`))
    .then(() => UserFile.getFile('ref', 'homonyms.txt', 'currentHomonyms'))
    .then(homonyms => IO.homonymList(homonyms))
    .then((chosenHomonyms) => {
      if (chosenHomonyms !== null) {
        console.log('\n> Matches found. See below...\n');
        const currentHomonyms = chosenHomonyms.substring(1, chosenHomonyms.length - 1);
        const cleanTextArr = UserFile.cleanText(UserFile.currentData.currentFileText);
        IO.showHomonymText(currentHomonyms, IO.sentenceFragment(cleanTextArr), cleanTextArr)
        .then(data => UserFile.writeFile(process.argv[2], data));
        return null;
      }
      return null;
    })
    .catch(error => console.error(error));
  },
};


app.runApp();
