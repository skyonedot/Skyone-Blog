import React from 'react';
import Head from 'next/head';
import { Line } from 'react-chartjs-2';
import chartStyles from '../styles/chart.module.css';
import { getFortaScoreFromLocally } from '../lib/forta';

export async function getServerSideProps() {
  let { addressScore, timeStamp } = await getFortaScoreFromLocally();
  console.log('addressScore', addressScore, addressScore['0x1A9df072db4b9A21F889fFf0Dcb7dF122ffE5A1c'].length, addressScore['0xa67c8ddd816a13b9f4c1b7aa46769d7d5768e646'].length);
  console.log("TimeStamp",timeStamp, timeStamp.length);
  return {
    props: {
      addressScore,
      timeStamp,
    },
  };
}

export default function LineChart({ addressScore, timeStamp }) {
  let testdata = {
    labels: timeStamp,
    datasets: [
      {
        label: Object.keys(addressScore)[0],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        data: addressScore[Object.keys(addressScore)[0]],
      },
      {
        label: Object.keys(addressScore)[1],
        fill: false,
        borderColor: 'rgba(0,0,0,1)',
        data: addressScore[Object.keys(addressScore)[1]],
      },
      {
        label: Object.keys(addressScore)[2],
        fill: false,
        borderColor: 'red',
        data: addressScore[Object.keys(addressScore)[2]],
      },
    ],
  };
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className={chartStyles.chart}>
        <h2>Forta Score</h2>
        <Line data={testdata}  />
      </div>
    </>
  );
}
