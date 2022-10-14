import React from 'react';
import { Line } from 'react-chartjs-2';
import chartStyles from '../styles/chart.module.css';
// import { getFortaScore,getFortaScoreFromLocal } from '../lib/forta';
import { getFortaScoreFromLocal } from '../lib/posts';

export async function getServerSideProps() {
  // const data = await getFortaScore();
  let data = await getFortaScoreFromLocal()
  console.log({
    props: {
      data
    }
  })
  return {
    props: {
      data,
    },
  };
}


export default function LineChart({ data }) {
  let label = data.fileContents.map((item, _) => {
    return item.scanner
  })
  let labels = data.fileContents.map((item, _) => {
    return item.minute
  })
  let score = data.fileContents.map((item, _) => {
    return item.score
  })
  let testdata = {
    labels: labels,
    datasets: [
      {
        label: label[0],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        data: score
      },
    ]
  };
  return (
    <div className={chartStyles.chart}>
      {
        console.log("Labels", labels)
      }
      {
        console.log("Score", score)
      }
      {/* { getFortaScore() }  */}
      {/* {
        console.log("ItemList",itemList)
        
      } */}
      {/* { console.log("Data",data.fileContents) } */}
      <h2>Forta Score</h2>
      <Line
        data={testdata}
        width={300}
        height={300}
      />
    </div>
  )
}
