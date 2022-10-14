import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';

const name = 'Skyone';
export const siteTitle = 'Skyone Secret Home';

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={122}
              width={122}
              alt="SkyOne Profile JPG"
            />
          </>
        ) : (
          <>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={108}
              width={108}
              alt="SkyOne Profile JPG"
            />
          </>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
