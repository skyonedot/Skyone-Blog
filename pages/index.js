import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Date from '../components/date';
import utilStyles from '../styles/utils.module.css';
import Layout, { siteTitle } from '../components/layout';
import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <div>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8R6QKXZXYE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8R6QKXZXYE');
          `}
        </Script>
      </div>

      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>

              <p className={utilStyles.lightText}>
                <Date dateString={date} />
              </p>
            </li>
          ))}
        </ul>
      </section>

            
      <section>
        <Link href={`/line`}>
          <a>Forta Chart</a>
        </Link>
        
      </section>  
      {/* <Line /> */}

    </Layout>
  );
}
