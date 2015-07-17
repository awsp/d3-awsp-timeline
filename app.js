// Configuration
var rowHeight = 42;

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
    zIndex: 1
  }
];

// Scheduler
var dimension = new TwoDimensionalShape(700, 400);
var workers = [
  {
    id: "person-a",
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
  }
]
var generateRandomTimeData = function (date, n, workers) {
  var data = [];

  for (var i = 0; i < n; i++) {
    var sTimeFactor = +((Math.random() * 18).toFixed(0)); // set latest possibility to 18
    var startingTime = new Date(date + " " + sTimeFactor + ":00:00");
    var eTimeFactor = sTimeFactor + (+((Math.random() * 4).toFixed(0)));
    var endingTime = new Date(date + " " + eTimeFactor + ":00:00");

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
var testData = generateRandomTimeData("2015-07-14", 10, workers);
var data = TimelineScheduler.processData(testData, "worker");


// TimelineChart
var chart = new TimelineChart(new TwoDimensionalShape(600, 400));
chart.setRowHeight(rowHeight);
chart.setBusinessHours(new Date("2015-07-14 00:00:00"), new Date("2015-07-14 23:59:59"));
chart.onMouseOver = function (self, data, i) {
  if (data.type.id === "work") {
    d3.select(self).select("rect")
      .transition()
      .duration(300)
      .attr({
        "fill": "#5390E0",
        "stroke": "#5390E0"
      })
    ;
  }
};
chart.onMouseOut = function (self, data, i) {
  if (data.type.id === "work") {
    d3.select(self).select("rect")
      .transition()
      .duration(150)
      .attr({
        "fill": "#4D82CC",
        "stroke": "#4D82CC"
      })
    ;
  }
};
chart.titleOnHover = function (self) {
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


// Timeline Group
var grouping = new TimelineGroup(new TwoDimensionalShape(100, 400));
grouping.setRowHeight(rowHeight);


// Render
var scheduler = new TimelineScheduler("#scheduler", dimension, data, chart, grouping);
scheduler.render();