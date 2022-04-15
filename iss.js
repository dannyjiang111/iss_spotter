const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    
    if (error) {
      callback(error, null);
      return;
    }
      
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
   
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when retrieving coordinates: ${body}`), null);
      return;
    }
   
    const { lat, lon } = JSON.parse(body);
    callback(null, { lat, lon });
  });
};

const fetchISSFlyOverTime = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when retrieving data: ${body}`, null));
      return;
    }
    const flyover = JSON.parse(body).response;
    callback(null, flyover);

  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        callback(error, null);
        return;
      }
      fetchISSFlyOverTime(loc, (error, nextPass) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, nextPass);
      });
    });
  });
};

// module.exports = { fetchMyIP };
// module.exports = { fetchCoordsByIP };
// module.exports = { fetchISSFlyOverTime };
module.exports = { nextISSTimesForMyLocation };