var chart = new TimelineChart(new TwoDimensionalShape(450, 400));
var grouping = new TimelineGroup(new TwoDimensionalShape(250, 400));
var dimension = new TwoDimensionalShape(700, 400);
var testData = [
  {
    starting_time: new Date("2015-07-08 12:00:00").getTime(),
    ending_time: new Date("2015-07-08 14:00:00").getTime(),
    therapist: "Person A",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 19:00:00").getTime(),
    ending_time: new Date("2015-07-08 20:00:00").getTime(),
    therapist: "Person AA",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person B",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person BB",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person C",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person CC",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person D",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person DD",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person E",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person EE",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person F",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person FF",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person G",
    hotel: "Testing Hotel"
  },
  {
    starting_time: new Date("2015-07-08 15:00:00").getTime(),
    ending_time: new Date("2015-07-08 16:30:00").getTime(),
    therapist: "Person GG",
    hotel: "Testing Hotel"
  }
];
var scheduler = new TimelineScheduler("#scheduler", dimension, testData, chart, grouping);
scheduler.render();