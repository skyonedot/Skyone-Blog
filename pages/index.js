
import Head from 'next/head'
import Link from 'next/link'

import Date from '../components/date'
import utilStyles from '../styles/utils.module.css'
import Layout, {siteTitle} from '../components/layout'
import { getSortedPostsData } from '../lib/posts'


export async function getStaticProps(){
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({allPostsData}) {
  // console.log("Allpostdata",allPostsData)
  return (
    
    <Layout home>
    {/* <Html> */}

      <Head>
        <title>{siteTitle}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous"></link>
      </Head>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`} >
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({id, date, title}) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}> 
                <a>{title}--{id}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>

          ))}
        </ul>

      </section>

      {/* <section className={utilStyles.headingMd}> 
        <p>[Your Self Introduction]</p>
        <p>
          Hello man
        </p>
       </section> */}
    </Layout>
    // </Html>
  )
}

