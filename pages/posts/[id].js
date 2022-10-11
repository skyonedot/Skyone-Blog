import Date from '../../components/date'
import Layout from '../../components/layout'
import { getAllPostIds,getPostData } from '../../lib/posts'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'

export async function getStaticPaths(){
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}


export async function getStaticProps({params}){
    const postData = await getPostData(params.id);
    return {
        props:{
            postData
        }
    }
}

export default function Post({postData}){
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title> 
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossOrigin="anonymous"></link>
                {/* <link href="/theme/prism-lucario.css" rel="stylesheet"/> */}
                {/* <link href="/theme/prism-coldark-cold.css" rel="stylesheet"/> */}
                <link href="/prism.css" rel="stylesheet"/>
                <script src='/prism.js'></script>
            </Head>
            <article className={utilStyles.article}>
                <h1 className={utilStyles.headingX1}> {postData.title} </h1> 
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{__html: postData.contentHtml}} />
            </article>
        </Layout>
    )
}