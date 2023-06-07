Module.register("MMM-Soliscloud", {
  // Default configs
  defaults: {
    intervalSecs: 300,
    // plantName: false,
    // lastUpdated: true,
    // currentPower: true,
    // dayTotalGenerated: true,
    // monthTotalGenerated: false,
    // totalGenerated: false,
  },

  start: function () {
    Log.log('Starting module: ' + this.name);
    soliscloud = this;
    this.soliscloudData = null;

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
      this.updateDom();
    }
  },

  // Override the DOM generator
  getDom: function () {
    let wrapper = document.createElement('div');
    // wrapper.setAttribute('class', 'growatt-data');
    // wrapper.innerText = 'Growatt';
    // let table = document.createElement('table');
    // table.setAttribute('class', 'growatt-table');
    // wrapper.appendChild(table);

    // let tr = document.createElement('tr');
    // tr.setAttribute('class', 'growatt-row');

    // if (this.result) {
    //   const mydata = this.result.payload[0].data.devicesData[0].data;

    //   let td;

    //   if (this.config.plantName) {
    //     tr = document.createElement('tr');
    //     tr.setAttribute('class', 'growatt-row');
    //     addCellsToRow(tr, 'Plant:', mydata.deviceData.plantName);
    //     table.appendChild(tr);
    //   }

    //   if (this.config.lastUpdated) {
    //     tr = document.createElement('tr');
    //     td = document.createElement('td');
    //     td.setAttribute('class', 'growatt-cell');
    //     td.innerText = 'Updated:';
    //     tr.appendChild(td);

    //     td = document.createElement('td');
    //     td.setAttribute('class', 'growatt-cell');
    //     if (this.result.payload) {
    //       td.innerText = mydata.deviceData.lastUpdateTime.split(' ')[1];
    //     } else {
    //       td.innerText = 'Pending';
    //     }
    //     tr.appendChild(td);
    //     table.appendChild(tr);
    //   }

    //   if (this.config.currentPower) {
    //     tr = document.createElement('tr');
    //     tr.setAttribute('class', 'growatt-row');
    //     addCellsToRow(tr, 'Current:', mydata.deviceData.pac + ' W');
    //     table.appendChild(tr);
    //   }

    //   if (this.config.dayTotalGenerated) {
    //     tr = document.createElement('tr');
    //     tr.setAttribute('class', 'growatt-row');
    //     addCellsToRow(tr, 'Today:',  mydata.totalData.eToday + ' kWh');
    //     table.appendChild(tr);
    //   }

    //   if (this.config.monthTotalGenerated) {
    //     tr = document.createElement('tr');
    //     tr.setAttribute('class', 'growatt-row');
    //     addCellsToRow(tr, 'Month: ', mydata.deviceData.eMonth + ' kWh');
    //     table.appendChild(tr);
    //   }

    //   if (this.config.totalGenerated) {
    //     tr = document.createElement('tr');
    //     tr.setAttribute('class', 'growatt-row');
    //     addCellsToRow(tr, 'Total: ', mydata.deviceData.eTotal + ' kWh');
    //     table.appendChild(tr);
    //   }
    // } else {
    //   let td = document.createElement('td');
    //   td.setAttribute('class', 'growatt-cell');
    //   td.innerText = 'Pending...';
    //   tr.appendChild(td);
    //   table.appendChild(tr);
    // }

    return wrapper;
  },
});

