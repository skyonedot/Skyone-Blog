import React from 'react';
import { Line } from 'react-chartjs-2';
import chartStyles from '../styles/chart.module.css';
import { getFortaScoreFromLocal } from '../lib/posts';
import { getFortaScoreFromLocally } from '../lib/forta';

export async function getServerSideProps() {
  // let data = await getFortaScoreFromLocal();
  let { addressScore, timeStamp } = await getFortaScoreFromLocally();
  console.log('addressScore', addressScore);
  return {
    props: {
      addressScore,
      timeStamp,
    },
  };
}

export default function LineChart({ addressScore, timeStamp }) {
  // console.log( "AddressScoreKeys",addressScore.keys() )
  // console.log( "TimeStampe",timeStamp )
  // let label = data.fileContents.map((item, _) => {
  //   return item.scanner;
  // });
  // let labels = data.fileContents.map((item, _) => {
  //   return item.minute;
  // });
  // let score = data.fileContents.map((item, _) => {
  //   return item.score;
  // });
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
    ],
  };
  return (
    <div className={chartStyles.chart}>
      {/* {console.log('Labels', labels)}
      {console.log('Score', score)} */}
      {/* { getFortaScore() }  */}
      {/* {
        console.log("ItemList",itemList)
        
      } */}
      {/* { console.log("Data",data.fileContents) } */}
      <h2>Forta Score</h2>
      <Line data={testdata} width={300} height={300} />
    </div>
  );
}
