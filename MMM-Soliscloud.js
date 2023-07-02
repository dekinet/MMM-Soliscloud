const state_alarm = 3;

function addCellsToRow(tr, leftText, rightText) {
  let td = document.createElement('td');
  td.setAttribute('class', 'soliscloud-cell');
  td.innerText = leftText;
  tr.appendChild(td);

  td = document.createElement('td');
  td.setAttribute('class', 'soliscloud-cell');
  td.innerText = rightText;
  tr.appendChild(td);
}

Module.register("MMM-Soliscloud", {
  // Default configs
  defaults: {
    intervalSecs: 300,
    lastUpdated: true,
    currentPower: true,
    dayTotalGenerated: true,
    monthTotalGenerated: false,
    yearTotalGenerated: false,
    totalGenerated: false,
    dailyIncome: false,
    allIncome: false,
    price: false,
    displayAlarms: true,
  },

  start: function () {
    Log.log('Starting module: ' + this.name);
    soliscloud = this;
    this.soliscloudData = null;
    this.soliscloudAlarms = null;

    soliscloud.getData();

    setInterval(function() {
      soliscloud.getData(soliscloud);
    }, soliscloud.config.intervalSecs * 1000);
  },

  getData: function (soliscloud = this) {
    Log.info(soliscloud.name + ': Getting data');
    soliscloud.sendSocketNotification("MMM_SOLISCLOUD_GET_DATA", {
      config: soliscloud.config,
    });
  },

  getStyles: function () {
    return [
      this.file('styles.css'),
    ];
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "MMM_SOLISCLOUD_GOT_DATA") {
      Log.info('MMM_SOLISCLOUD_GOT_DATA: ' + JSON.stringify(payload));
      this.soliscloudData = { payload: payload };
      if ((payload.payload.state == state_alarm) && (soliscloud.config.displayAlarms)) {
        soliscloud.sendSocketNotification("MMM_SOLISCLOUD_GET_ALARMS", {
          config: soliscloud.config,
        });
      } else {
        this.soliscloudAlarms = null;
      }
      this.updateDom();
    } else if (notification == "MMM_SOLISCLOUD_GOT_ALARMS") {
      Log.info('MMM_SOLISCLOUD_GOT_ALARMS: ' + JSON.stringify(payload));
      this.soliscloudAlarms = { payload: payload };
      this.updateDom();
    }
  },

  // Override the DOM generator
  getDom: function () {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'soliscloud-data');
    wrapper.innerText = 'Soliscloud';
    let table = document.createElement('table');
    table.setAttribute('class', 'soliscloud-table');
    wrapper.appendChild(table);

    let tr = document.createElement('tr');
    tr.setAttribute('class', 'soliscloud-row');

    if (this.soliscloudData) {
      const mydata = this.soliscloudData.payload.payload;

      let td;

      if (this.config.lastUpdated) {
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.setAttribute('class', 'soliscloud-cell');
        td.innerText = 'Updated:';
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'soliscloud-cell');
        if (mydata.dataTimestampStr) {
          td.innerText = mydata.dataTimestampStr.split(' ')[1];
        } else {
          td.innerText = 'Pending';
        }
        tr.appendChild(td);
        table.appendChild(tr);
      }

      if (this.config.currentPower) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'soliscloud-row');
        addCellsToRow(tr, 'Current:', mydata.power + ' ' + mydata.powerStr);
        table.appendChild(tr);
      }

      if (this.config.dayTotalGenerated) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'soliscloud-row');
        addCellsToRow(tr, 'Today:',  mydata.dayEnergy + ' ' + mydata.dayEnergyStr);
        table.appendChild(tr);
      }

      if (this.config.monthTotalGenerated) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'soliscloud-row');
        addCellsToRow(tr, 'Month: ', mydata.monthEnergy + ' ' + mydata.monthEnergyStr);
        table.appendChild(tr);
      }

      if (this.config.yearTotalGenerated) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'soliscloud-row');
        addCellsToRow(tr, 'Year: ', mydata.yearEnergy + ' ' + mydata.yearEnergyStr);
        table.appendChild(tr);
      }

      if (this.config.totalGenerated) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'soliscloud-row');
        addCellsToRow(tr, 'Total: ', mydata.allEnergy + ' ' + mydata.allEnergyStr);
        table.appendChild(tr);
      }

      if (this.config.price) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'soliscloud-row');
        addCellsToRow(tr, 'Price: ', mydata.money + mydata.price);
        table.appendChild(tr);
      }

      if (this.config.dailyIncome) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'soliscloud-row');
        addCellsToRow(tr, 'Daily Income: ', mydata.money + mydata.dayIncome);
        table.appendChild(tr);
      }

      if (this.config.allIncome) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'soliscloud-row');
        addCellsToRow(tr, 'All Income: ', mydata.money + mydata.allIncome);
        table.appendChild(tr);
      }

      if (mydata.state == state_alarm) {   // Alarm
        tr = document.createElement('tr');
        tr.setAttribute('class', 'solisloud-row soliscloud-alarm');
        const detail = (this.soliscloudAlarms ? this.soliscloudAlarms.payload.payload.alarmMsg : "Pending...");
        addCellsToRow(tr, "ALARM:", detail);
        table.appendChild(tr);
      }
    } else {
      let td = document.createElement('td');
      td.setAttribute('class', 'soliscloud-cell');
      td.innerText = 'Pending...';
      tr.appendChild(td);
      table.appendChild(tr);
    }

    return wrapper;
  },
});

