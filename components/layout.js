import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
// import TwitteerIcon from '/images/twitter.svg';
// import GithubIcon from '/images/github.svg';

const name = 'Skyone';
export const siteTitle = 'Skyone Secret Home';

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/images/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@skyonedot" />
        <meta name="twitter:title" content="SECRET HOME" />
        <meta name="twitter:description" content="WELCOME TO THE 7DAYNFT SECRET HOME" />
        <meta name="twitter:image" content="https://raw.githubusercontent.com/skyonedot/picture-host/68494123e403ec54f099e488ad862298b4c6acb9/2100A2229945AE8B33CD53EDB72BD825.png"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <Image
              priority
              src="/images/profile.jpeg"
              className={utilStyles.borderCircle}
              height={122}
              width={82}
              alt="SkyOne Profile JPG"
            />
          </>
        ) : (
          <>
            <Image
              priority
              src="/images/profile.jpeg"
              className={utilStyles.borderCircle}
              height={108}
              width={73}
              alt="SkyOne Profile JPG"
            />
          </>
        )}
        <div className={styles.icon}>
          <a
            href="https://twitter.com/skyonedot"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            <Image alt='Twitter Logo' src="/images/twitter.svg" height={30} width={30} />{' '}
          </a>
          <a
            href="https://github.com/skyonedot"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            <Image alt="Github Logo" src="/images/github.svg" height={30} width={30} />{' '}
          </a>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
