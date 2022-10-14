import fs from 'fs';
import path from 'path';
const postsDirectory = path.join(process.cwd(), 'data');

export function getFortaScoreFromLocally() {
  let fileContents = fs.readFileSync(postsDirectory + '/data.txt', 'utf8');
  let data = fileContents.split('\n');
  data = data.slice(0, data.length - 1);
  let addressScore = {};
  let timeStamp = [];
  for (let i of data) {
    // console.log(i)
    if (i.split(',')[0] in addressScore) {
      addressScore[i.split(',')[0]].push(i.split(',')[2]);
    } else {
      addressScore[i.split(',')[0]] = [i.split(',')[2]];
    }

    if (!timeStamp.includes(i.split(',')[1])) {
      timeStamp.push(i.split(',')[1]);
    }
  }

  return { addressScore, timeStamp };
}
