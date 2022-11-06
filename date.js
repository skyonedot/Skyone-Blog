let startDate = '2022-10-24T04:00:00Z'
let time_gap = (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24) / 7
//Date add seconds
function addSeconds(date, seconds) {
    var result = new Date(date);
    result.setSeconds(result.getSeconds() + seconds);
    return result;
}

let nowDate = addSeconds(new Date(startDate), time_gap * 7 * 24 * 60 * 60)
console.log(nowDate)
// let nowDate = new Date(startDate) + parseInt(time_gap) * 7 * 24 * 60 * 60 * 1000
// console.log(nowDate )

