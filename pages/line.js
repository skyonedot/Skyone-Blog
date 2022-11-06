import React from 'react';
import Head from 'next/head';
import { Line } from 'react-chartjs-2';
import chartStyles from '../styles/chart.module.css';
import { getFortaScoreFromLocally } from '../lib/forta';

function addSeconds(date, seconds) {
  var result = new Date(date);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
}

function getDate(){
  let startDate = '2022-10-24T04:00:00Z'
  let time_gap = (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24) / 7
  let nowDate = addSeconds(new Date(startDate), parseInt(time_gap) * 7 * 24 * 60 * 60)
  return nowDate
}

export async function getServerSideProps() {
  let { addressScore, timeStamp } = await getFortaScoreFromLocally();
  return {
    props: {
      addressScore,
      timeStamp,
    },
  };
}

function calculate(timeStamp, addressScore) {
  //Compare Two date
  let startDate = getDate();
  let indexArray = timeStamp.map((item, index) => {
    if (new Date(item) > startDate) {
      return index;
    } else {
      return null;
    }
  });
  indexArray = indexArray.filter((el) => el);

  let addr = Object.keys(addressScore);
  let addrS = {};
  addr.forEach((item, _) => {
    addrS[item] = addressScore[item].filter((itemsmall, index) => {
      if (indexArray.includes(index)) {
        return itemsmall;
      }
    });
  });

  return [indexArray, addrS];
}

export default function LineChart({ addressScore, timeStamp }) {
  let addr = Object.keys(addressScore);
  let [_, needScore] = calculate(timeStamp, addressScore);
  let needinfo = {};
  Object.keys(needScore).forEach((item, _) => {
    needinfo[item] = {
      average:
        needScore[item].reduce((a, b) => parseFloat(a) + parseFloat(b), 0) /
        needScore[item].length,
      biggerNinty: needScore[item].filter(function (item) {
        return parseFloat(item) >= 0.9;
      }).length,
      biggerSeventy: needScore[item].filter(function (item) {
        return parseFloat(item) > 0.7 && parseFloat(item) < 0.9;
      }).length,
      wrong: needScore[item].filter(function (item) {
        return parseFloat(item) == 0.7;
      }).length,
      all: needScore[item].length,
    };
  });
  // console.log("NEEDScore",needScore)
  let gap = 3 * 24;
  let testdata = {
    labels: timeStamp.slice(
      Math.round(timeStamp.length - gap),
      timeStamp.length
    ),
    datasets: [
      {
        label: addr[0],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        data: addressScore[addr[0]].slice(
          Math.round(addressScore[addr[0]].length - gap),
          addressScore[addr[0]].length
        ),
      },
      {
        label: addr[1],
        fill: false,
        borderColor: 'rgba(0,0,0,1)',
        data: addressScore[addr[1]].slice(
          Math.round(addressScore[addr[1]].length - gap),
          addressScore[addr[1]].length
        ),
      },
      {
        label: addr[2],
        fill: false,
        borderColor: 'red',
        data: addressScore[addr[2]].slice(
          Math.round(addressScore[addr[2]].length - gap),
          addressScore[addr[2]].length
        ),
      },
    ],
  };
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <div className={`${chartStyles.content}`}>
        Score Distribution
        <table>
          <tr>
            <th>Addr</th>
            <th>Average</th>
            <th>Bigger Than 90</th>
            <th>Bigger Than 75</th>
            <th>Wrong</th>
            <th>Count</th>
          </tr>
          {Object.keys(needinfo).map((item, _) => {
            return (
              <tr key={_}>
                {' '}
                <th> {item} </th>
                <th> {needinfo[item].average.toFixed(3)} </th>
                <th> {needinfo[item].biggerNinty} </th>
                <th> {needinfo[item].biggerSeventy} </th>
                <th> {needinfo[item].wrong} </th>
                <th> {needinfo[item].all} </th>
              </tr>
            );
          })}
        </table>
      </div>
      <div className={chartStyles.chart}>
        <h2>Forta Score</h2>
        <Line data={testdata} />
      </div>
    </>
  );
}
