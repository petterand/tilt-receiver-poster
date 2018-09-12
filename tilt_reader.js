const request = require('request');
const BeaconReader = require('node-beacon-scanner');
const scanner = new BeaconReader();

const RED = "A495BB10C5B14B44B5121370F02D74DE";
const UPDATE_INTERVAL = 3600000; //1h

var updateTime = (new Date()).getTime() + UPDATE_INTERVAL;;

scanner.onadvertisement = (ad) => {
   if (ad.iBeacon && ad.iBeacon.uuid) {
      const formattedUUID = ad.iBeacon.uuid.replace(/-/g, '');
      if (formattedUUID === RED) {
         let resultObj = {
            "Temp": F2C(ad.iBeacon.major),
            "SG": ad.iBeacon.minor / 1000
         };
         if ((new Date()).getTime() > updateTime) {
            sendData(resultObj);
            updateTime += UPDATE_INTERVAL;
         }
      }
   }
}

scanner.startScan().then(() => {
   console.log('Scan Started');
}).catch(err => {
   console.log(err);
});


function F2C(F) {
   return (F - 32) * 5 / 9;
}

function sendData(data) {
   const config = {
      method: 'POST',
      url: '<url>',
      body: data,
      json: true,
      headers: {
         'Content-Type': 'application/json'
      }
   };
   request(config, (err) => {
      if (err) { console.error(err); }
   });
}