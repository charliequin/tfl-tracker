const EXPRESS = require('express');
const HTTP = require('http');
const PATH = require('path');
const APP = EXPRESS();
const REQUEST = require('request');
const readLineSync = require('readline-sync');
const _ = require('lodash');


let server = HTTP.createServer(APP);
let port = process.env.PORT | 8080;
APP.listen(port);

APP.set('views', __dirname + '/views');
APP.engine('html', require('ejs').__express);
APP.set('view engine', 'html');

APP.use(EXPRESS.static(PATH.join(__dirname, '/public')));
APP.use(EXPRESS.urlencoded());

APP.get('/', function(req, res) {
    res.render('index');
});

APP.post('/logs', function(req, res) {
    let postCode = stringUpper(req.body.postcode);

    let busModel = [];

    let PCRequest = REQUEST(`https://api.postcodes.io/postcodes/${postCode}`, function(error, response, body) {
        let Obj = JSON.parse(body);

        let latitude = Obj.result.latitude;
        let longitude = Obj.result.longitude;


        let tflRequest = REQUEST(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=${latitude}&lon=${longitude}&app_id=6ff340b4&app_key=14b38e375e33e8ce0dc21677e41ff17b`, function (error, response, body) {
            let Obj = JSON.parse(body);
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
                    let dateConverted = getTime(expectedArrival);

                    let minuteEnd = timeConverted + 'm';

                    if (timeConverted < 1) {
                        timeConverted = 'Now'
                    } else {
                        timeConverted = minuteEnd;
                    }

                    busModel.push({
                        lineName: lineName,
                        stationName: stationName,
                        destinationName: destinationName,
                        timeToStation: timeToStation,
                        dateConverted: dateConverted,
                        timeConverted: timeConverted 
                    });
                }

                for (let i = 0; i < busModel.length; i++) {
                    console.log('\n');
                    console.log(busModel[i]);
                }

                let model = {
                    busModel: busModel
                }
                res.render('logs', model);
            });
        });
    });
})


console.log(`Server initialised on https://localhost:${port}`);


function stringUpper(string) {
    let styledString = (string).toUpperCase();
    return styledString;
  }

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

