import Head from 'next/head';
import Date from '../../lib/general';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  const regexp = RegExp('<h[0-9]>.*</h[0-9]>', 'g');
  const str = postData.contentHtml;
  const matches = str.matchAll(regexp);
  let toc = [];
  for (const match of matches) {
    // console.log(match[0])
    // toc.push(match[0].replace(regex,'').replace(RegExp('</h[0-9]>', 'i'),''))
    toc.push(match[0]);
  }
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
          integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC"
          crossOrigin="anonymous"
        />
        {/* <link href="/theme/prism-lucario.css" rel="stylesheet"/> */}
        {/* <link href="/theme/prism-coldark-cold.css" rel="stylesheet"/> */}
        {/* <link href="/prism.css" rel="stylesheet" /> */}
        <script src="/prism.js" async />
      </Head>
      <div className={utilStyles.articlepage}>
        {/* <div className={utilStyles.toc}>
          {toc.map((match) => {
            return (
              <p key={match.replace(RegExp('<h[0-9]>', 'i'),'').replace(RegExp('</h[0-9]>', 'i'),'')}>
                {match.replace(RegExp('<h[0-9]>', 'i'),'').replace(RegExp('</h[0-9]>', 'i'),'')}
              </p>
            )
          })}
        </div> */}

        <article className={utilStyles.article}>
          <h1 className={utilStyles.headingX1}> {postData.title} </h1>
          <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
      </div>
    </Layout>
  );
}
