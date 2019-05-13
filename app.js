const REQUEST = require('request');
const readLineSync = require('readline-sync');
const _ = require('lodash');


let postCode = readLineSync.question('Enter postcode: ');

let PCRequest = REQUEST(`https://api.postcodes.io/postcodes/${postCode}`, function(error, response, body) {
  let Obj = JSON.parse(body);

  let latitude = Obj.result.latitude;
  let longitude = Obj.result.longitude;


  let tflRequest = REQUEST(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&app_id=6ff340b4&app_key=14b38e375e33e8ce0dc21677e41ff17b`, function (error, response, body) {
    let Obj = JSON.parse(body);
    console.log(Obj);
    let busStopCode = Obj.stopPoints[0].naptanId;


    let busRequest = REQUEST(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals?app_id=6ff340b4&app_key=14b38e375e33e8ce0dc21677e41ff17b`, function (error, response, body) {
      let Obj = JSON.parse(body);
      let sortedArr = _.sortBy(Obj, ['timeToStation']);

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
  });
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