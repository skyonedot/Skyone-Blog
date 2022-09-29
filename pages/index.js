
import Head from 'next/head'
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
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`} >
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({id, date, title}) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
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
  )
}
