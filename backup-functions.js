function getPostCode(postCode, ARR) {
    REQUEST(`https://api.postcodes.io/postcodes/${postCode}`, function(error, response, body) {
        let Obj = JSON.parse(body);
        let latitude = Obj.result.latitude;
        let longitude = Obj.result.longitude;

        TFLReq(latitude, longitude, ARR);
    })
}

function TFLReq(latitude, longitude, ARR) {
    REQUEST(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&app_id=6ff340b4&app_key=14b38e375e33e8ce0dc21677e41ff17b`, function (error, response, body) {
        let Obj = JSON.parse(body);
        ARR.push(Obj.stopPoints[0].naptanId);
        console.log(ARR[0]);
    })
}

function busReq(busStopCode) {
    REQUEST(`https://api.tfl.gov.uk/StopPoint/${busStopCode}/Arrivals?app_id=6ff340b4&app_key=14b38e375e33e8ce0dc21677e41ff17b`, function (error, response, body) {
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
    })
}