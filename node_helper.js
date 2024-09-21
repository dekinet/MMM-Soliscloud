const Log = require("logger");
const NodeHelper = require("node_helper");
const https = require("node:https");
const base64 = require("base-64");
const crypto = require("crypto");
const Gpio = require("onoff").Gpio;
const { Buffer } = require("node:buffer");

const stationList = '/v1/api/userStationList';
const stationListPayload = '{"pageNo":1,"pageSize":10}';
const alarmList = '/v1/api/alarmList';
const alarmListPayload = '{"pageNo":1,"pageSize":20}';
let gpio_out = null;

const setGpio = (active, config) => {
  if (!config.gpioOnAlarm) return;
  if (!gpio_out) gpio_out = new Gpio(config.gpioOnAlarm, 'out');
  let writeState = 0;
  if (config.gpioOnAlarmState == "high") {
    if (active) writeState = 1;
  } else {
    if (!active) writeState = 1;
  }
  gpio_out.write(writeState)
    .then(Log.log(`MMM-Soliscloud: Setting GPIO ${config.gpioOnAlarm} to ${writeState}`))
    .catch(err => { Log.log(err); throw(err);});
}

const MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_};

function hex2bin (s) {
  //  discuss at: http://locutus.io/php/hex2bin/
  var ret = []
  var i = 0
  var l

  s += ''

  for (l = s.length; i < l; i += 2) {
    var c = parseInt(s.substr(i, 1), 16)
    var k = parseInt(s.substr(i + 1, 1), 16)
    if (isNaN(c) || isNaN(k)) return false
    ret.push((c << 4) | k)
  }

  return String.fromCharCode.apply(String, ret)
}

const digest = (str) => {
  return base64.encode(hex2bin(MD5(str)))
}

const makeAuthorization = (key, secret, contentmd5, date, resource) => {
  let hmac = crypto.createHmac("sha1", secret);
  const content = "POST\n" +
                  contentmd5 + "\n" +
                  "application/json\n" +
                  date + "\n" +
                  resource;
  hmac.update(content);
  return "API " +
         Buffer.from(key, 'utf-8').toString() +
         ":" +
         base64.encode(hex2bin(hmac.digest("hex")));
};

const makeHeader = (path, body, apiKey, apiSecret) => {
  const contentmd5 = digest(body);
  const date = new Date().toUTCString();
  return {
    host: 'www.soliscloud.com',
    port: 13333,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      'Authorization': makeAuthorization(
        apiKey,
        apiSecret,
        contentmd5,
        date,
        path),
      'Content-MD5': contentmd5,
      'Date': date,
    },
  };
};



module.exports = NodeHelper.create({
  start: function() {
    Log.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function(notification, payload) {
    var self = this;
    Log.log("Notification: " + notification + " Payload: " + JSON.stringify(payload));

    var api = null;
    var sendPayload = null;
    var sendNotification = null;

    if (notification === "MMM_SOLISCLOUD_GET_DATA") {
      api = stationList;
      sendPayload = stationListPayload;
      sendNotification = "MMM_SOLISCLOUD_GOT_DATA";
    } else if (notification == "MMM_SOLISCLOUD_GET_ALARMS") {
      api = alarmList;
      sendPayload = alarmListPayload;
      sendNotification = "MMM_SOLISCLOUD_GOT_ALARMS";
    } else if (notification === "MMM_SOLISCLOUD_CONFIG") {
      setGpio(false, payload.config);
    }

    if (api && sendPayload && sendNotification) {
      const req = https.request(makeHeader(api,
                                           sendPayload,
                                           payload.config.apiKey,
                                           payload.config.apiSecret), function(res) {
        let body = '';

        res.on('data', chunk => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (!json.success || (json.code != 0)) throw({message: json.msg});
            var sendData = null;
            if (notification == "MMM_SOLISCLOUD_GET_DATA") {
              if (json.data.page.records.length > 0) {
                sendData = json.data.page.records[0];
              }
            } else if (notification == "MMM_SOLISCLOUD_GET_ALARMS") {
              // It looks like the most recent alarm is returned first.
              sendData = json.data.records[0];
              setGpio(sendData.state == 3, payload.config);
            }
            if (sendData) {
              self.sendSocketNotification(
                sendNotification,
                {
                  payload: sendData
                }
              );
            }
          } catch (error) {
            self.sendSocketNotification(
              "MMM_SOLISCLOUD_ERROR",
              {
                payload: error.message
              }
            )
            Log.error(error.message);
          }
        });
      });

      req.on('error', (e) => {
        Log.error(e);
      });
      req.write(stationListPayload);
      req.end();
    }
  }
});
