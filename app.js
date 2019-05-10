const REQUEST = require('request');
const readLineSync = require('readline-sync');
const _ = require('lodash');


let getPC = readLineSync.question('Enter postcode: ');

let lonArr = [];
let latArr = [];

let PCRequest = REQUEST(`https://api.postcodes.io/postcodes/${getPC}`, function(error, response, body) {
  let obj = JSON.parse(body);

  lonArr.push(obj.result.longitude);
  latArr.push(obj.result.latitude);
  console.log(latArr[0], lonArr[0]);

});


let pageRequest = REQUEST('https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals?app_id=6ff340b4&app_key=14b38e375e33e8ce0dc21677e41ff17b', function (error, response, body) {
  let obj = JSON.parse(body);
  let sortedArr = _.sortBy(obj, ['timeToStation']);

  for (let i = 0; i < sortedArr.length; i++) {

    console.log('\n');
    let lineName = sortedArr[i].lineName;
    let stationName = sortedArr[i].stationName;
    let destinationName = sortedArr[i].destinationName;
    let timeToStation = sortedArr[i].timeToStation;
    let expectedArrival = sortedArr[i].expectedArrival;

    let timeConverted = timeConversion(timeToStation);

    let minuteEnd = timeConverted + 'm';

    if (timeConverted < 1) {
      timeConverted = 'Now'
    } else {
      timeConverted = minuteEnd;
    }

    console.log('\nLine Name: ' + lineName,
                '\nLeaving from: ' + stationName,
                '\nDestination: ' + destinationName,
                '\nTime to arrival: ' + timeConverted,
                '\nExpected arrival: ' + getTime(expectedArrival));
  }
});


function timeToNow(time) {
  if (time < 1) {
    time = 'Now'
  } else {
    time = time + 'm';
  }
}


function busSelect(object, number) {
  let objIndex = object[number];
  return (objIndex);
}

function getTime(time) {
  let myTime = new Date(time);
  let hour = myTime.getHours();
  let minute = myTime.getMinutes();

  return (hour + ':' + minute);
}

function timeConversion(number) {
  let conversion = Math.floor(number / 60);
  return conversion;
}













// Stop code 490008660N