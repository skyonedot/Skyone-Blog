import fs from 'fs';
import path from 'path';
const postsDirectory = path.join(process.cwd(), 'data');

export function getFortaScoreFromLocally() {
  let fileContents = fs.readFileSync(postsDirectory + '/data.txt', 'utf8');
  let data = fileContents.split('\n');
  data = data.slice(0, data.length - 1);
  let addressScore_ = {};
  let timeStamp = [];
  for (let i of data) {
    // console.log(i)
    if (i.split(',')[0] in addressScore_) {
      if (
        addressScore_[i.split(',')[0]].findIndex(
          (f) => f.key === i.split(',')[1]
        ) === -1
      ) {
        addressScore_[i.split(',')[0]].push({
          key: i.split(',')[1],
          value: i.split(',')[2],
        });
      }
    } else {
      addressScore_[i.split(',')[0]] = [
        { key: i.split(',')[1], value: i.split(',')[2] },
      ];
    }
    if (!timeStamp.includes(i.split(',')[1])) {
      timeStamp.push(i.split(',')[1]);
    }
  }
  let addressScore = {};
  for (let i in addressScore_) {
    for (let j of addressScore_[i]) {
      if (i in addressScore) {
        addressScore[i].push(j.value);
      } else {
        addressScore[i] = [j.value];
      }
    }
  }
  // console.log("AddressScore",addressScore)

  return { addressScore, timeStamp };
}
