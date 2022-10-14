import fs from 'fs';
import path from 'path';
const postsDirectory = path.join(process.cwd(), 'json');

export async function getFortaScore() {
  let data = await (
    await fetch(
      'https://api.forta.network/stats/sla/scanner/0xa67c8ddd816a13b9f4c1b7aa46769d7d5768e646'
    )
  ).json();
  // console.log("FortaData", data)
  return data;
}

export function getFortaScoreFromLocal() {
  let fileContents = fs.readFileSync(postsDirectory + '/data.json', 'utf8');
  fileContents = JSON.parse(fileContents);
  console.log('PostsDirectory', postsDirectory);
  console.log('FileContents', fileContents);
  return { fileContents };
  // const { data, error } = useSWR('../pages/api/staticdata', fetcher);
  // // let data = await (await fetch('./data.json')).json()
  // console.log("FortaData Local", data)
  // return data
}
