// Configuration
var rowHeight = 40;

// Types of Bar, order matters. [2] is on top of [1] and is on top of [0].
var types = [
  {
    id: "availability",
    name: "Availabilities",
    backgroundColor: "#eeffee",
    foregroundColor: "#447744",
    opacity: 0.9,
    height: rowHeight
  },
  {
    id: "work",
    name: "Working Schedule",
    backgroundColor: "#ffeeee",
    foregroundColor: "#774444",
    opacity: 0.7,
    height: rowHeight - 4
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
      type: types[Math.floor(Math.random() * workers.length)]
    });
  }
  return data;
};
var testData = generateRandomTimeData("2015-07-15", 10, workers);
var data = TimelineScheduler.processData(testData, "worker");

// TimelineChart
var chart = new TimelineChart(new TwoDimensionalShape(600, 400));
chart.setRowHeight(rowHeight);


// Timeline Group
var grouping = new TimelineGroup(new TwoDimensionalShape(100, 400));
grouping.setRowHeight(rowHeight);


// Render
var scheduler = new TimelineScheduler("#scheduler", dimension, data, chart, grouping);
scheduler.render();