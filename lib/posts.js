import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import emoji from 'remark-emoji'
import remarkParse from 'remark-parse'
import {unified} from "unified";



const postsDirectory = path.join(process.cwd(), 'posts');
// console.log("POSTS DIRECTORY", postsDirectory,process.cwd())

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });

  
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}


export function getAllPostIds(){
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    // console.log('fileName',fileName, type(fileName))
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}


export async function getPostData(id){
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  // console.log("FileContents",fileContents)
  // console.log('-------------------')
  const matterResult = matter(fileContents);
  // console.log("MatterResult",matterResult)

  const processedContent = await unified()
    .use(remarkParse)
    .use(emoji)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()


  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}