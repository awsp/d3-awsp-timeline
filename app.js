// Configuration
var rowHeight = 50;

// Types of Bar
var types = [
  {
    id: "availability",
    name: "Availabilities",
    backgroundColor: "#ccffcc",
    foregroundColor: "#447744",
    opacity: 0.4,
    height: rowHeight,
    hasLabel: false,
    zIndex: 0
  },
  {
    id: "busy",
    name: "Busy",
    backgroundColor: "#ffcccc",
    foregroundColor: "#774444",
    opacity: 0.4,
    height: rowHeight,
    hasLabel: false,
    zIndex: 1
  },
  {
    id: "work",
    name: "Working Schedule",
    backgroundColor: "#4D82CC",
    foregroundColor: "#fff",
    opacity: 0.72,
    height: 24,
    stroke: "#4D82CC",
    strokeWidth: 3,
    round: 3,
    hasLabel: true,
    fontSize: 11,
    zIndex: 2
  }
];

// Scheduler
var dimension = new TwoDimensionalShape("100%", 400);
var workers = [
  {
    id: "ながいながいながい名",
    firstName: "A",
    lastName: "Person"
  },
  {
    id: "person-b",
    firstName: "B",
    lastName: "Person"
  },
  {
    id: "person-c",
    firstName: "C",
    lastName: "Person"
  },
  {
    id: "person-d",
    firstName: "D",
    lastName: "Person"
  },
  {
    id: "person-e",
    firstName: "E",
    lastName: "Person"
  },
  {
    id: "person-f",
    firstName: "F",
    lastName: "Person"
  },
  {
    id: "person-g",
    firstName: "G",
    lastName: "Person"
  },
  {
    id: "person-h",
    firstName: "H",
    lastName: "Person"
  },
  {
    id: "person-i",
    firstName: "I",
    lastName: "Person"
  },
  {
    id: "person-j",
    firstName: "I",
    lastName: "Person"
  },
  {
    id: "person-k",
    firstName: "K",
    lastName: "Person"
  },
  {
    id: "person-l",
    firstName: "L",
    lastName: "Person"
  },
  {
    id: "person-m",
    firstName: "M",
    lastName: "Person"
  },
  {
    id: "person-n",
    firstName: "N",
    lastName: "Person"
  }
];
// Generate some random data to display
var generateRandomTimeData = function (date, n, workers) {
  var data = [];
  var maximum = 4, minimum = 1;
  var randomNumber, sTimeFactor, startingTime, eTimeFactor, endingTime;

  for (var i = 0; i < n; i++) {
    randomNumber = Math.floor((Math.random() * (maximum - minimum + 1) ) << 0) + minimum;
    sTimeFactor = +((Math.random() * 18).toFixed(0)); // set latest possibility to 18
    startingTime = new Date(date + " " + sTimeFactor + ":00:00");
    eTimeFactor = sTimeFactor + (+(randomNumber));
    endingTime = new Date(date + " " + eTimeFactor + ":00:00");

    data.push({
      starting_time: startingTime.getTime(),
      ending_time: endingTime.getTime(),
      worker: workers[Math.floor(Math.random() * workers.length)].id,
      place: "Working Place " + (Math.random() * 10).toFixed(0),
      type: types[Math.floor(Math.random() * types.length)]
    });
  }
  return data;
};
var testData = generateRandomTimeData("2015-07-14", 150, workers);
var data = TimelineScheduler.processData(testData, "worker");


// TimelineChart
var chart = new TimelineChart(new TwoDimensionalShape(800, 400));
chart.setRowHeight(rowHeight);
chart.setBusinessHours(new Date("2015-07-14 00:00:00"), new Date("2015-07-15 03:59:59"));
chart.onMouseOver = function (self, data, i) {
  if (data.type.id === "work") {
    if (! d3.select(self).classed("selected")) {
      d3.select(self).select("rect")
        .transition()
        .duration(300)
        .attr({
          "fill": "#5390E0",
          "stroke": "#5390E0"
        })
      ;
    }
  }
};
chart.onMouseOut = function (self, data, i) {
  if (data.type.id === "work") {
    if (! d3.select(self).classed("selected")) {
      d3.select(self).select("rect")
        .transition()
        .duration(150)
        .attr({
          "fill": "#4D82CC",
          "stroke": "#4D82CC"
        })
      ;
    }
  }
};
chart.titleOnHover = function (self, instance) {
  var label = self.attr("class", "block-label");
  label.append("tspan")
    .text(function (d) {
      return d.place;
    })
  ;
};
chart.labeling = function (data, i) {
  return data.place;
};

var me;
chart.onClick = function (instance, data, i) {
  if (data.type.id === "work") {
    // Show its tooltip
    me = this;
    this.showTooltip(instance).html(function () {
      var html = '';
      html += '<p>' + data.place + '</p>';
      html += '<p>' + new Date(data.starting_time).toString() + '</p>';
      html += '<a href="#" id="close-tooltip">☓</a>'
      return html;
    });

    d3.select(instance).attr("class", function () {
      if (d3.select(instance).classed("selected")) {
        return d3.select(this).attr("class").replace(/selected/, "");
      }
      return d3.select(this).attr("class") + " selected";
    });
    d3.select(instance).select("rect")
      .transition()
      .duration(150)
    ;
  }
};



// Timeline Group
var grouping = new TimelineGroup(new TwoDimensionalShape(100, 400));
grouping.setRowHeight(rowHeight);


// Render Scheduler
var scheduler = new TimelineScheduler("#scheduler", dimension, data, chart, grouping);
scheduler.render();


// Keyboard Capture
d3.select("body").on("keydown", function () {
  if (d3.event.keyCode === 27) {
    d3.select("#scheduler").selectAll(".selected").classed("selected", "");
  }
});


// Button Controls
(function ($, scheduler, workers) {
  $(function () {
    $("body").on("click", "#close-tooltip", function (e) {
      e.preventDefault();
      me.hideTooltip();
    });

    $("#clear").on("click", function () {
      scheduler.clear();
    });

    $("#change-data").on("click", function () {
      var newTestData = TimelineScheduler.processData(generateRandomTimeData("2015-07-16", 150, workers), "worker");
      scheduler.chart.setBusinessHours(new Date("2015-07-16 04:00:00"), new Date("2015-07-17 14:00:00"));
      scheduler.setData(newTestData);
      console.log("data and date range changed. ");
    });

    $("#change-workers").on("click", function () {
      var newWorkers = [
        {
          id: "person-d",
          firstName: "DDD",
          lastName: "NewPerson"
        },
        {
          id: "person-b",
          firstName: "BBB",
          lastName: "NewPerson"
        }
      ];
      var newTestData = TimelineScheduler.processData(generateRandomTimeData("2015-07-16", 30, newWorkers), "worker");
      scheduler.chart.setDate("2015-07-16");
      scheduler.setData(newTestData);
      console.log("data and date changed. ");
    });

    $("#draw").on("click", function () {
      scheduler.render();
    });
  });
})(jQuery, scheduler, workers);