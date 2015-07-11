var chart = new TimelineChart(new Dimension(450, 400));
var grouping = new TimelineGroup(new Dimension(250, 400));
var dimension = new Dimension(700, 400);
var data = [
  { starting_time: new Date("2015-07-08 12:00:00").getTime(), ending_time: new Date("2015-07-08 14:00:00").getTime(), therapist: "Person A"},
  { starting_time: new Date("2015-07-08 19:00:00").getTime(), ending_time: new Date("2015-07-08 20:00:00").getTime(), therapist: "Person A"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"},
  { starting_time: new Date("2015-07-08 15:00:00").getTime(), ending_time: new Date("2015-07-08 16:30:00").getTime(), therapist: "Person B"}
];
var scheduler = new TimelineScheduler("#scheduler", dimension, data, chart, grouping);
scheduler.render();







//var testData = [
//  {label: "person a", times: [
//    {"starting_time": 1355752800000, "ending_time": 1355759900000},
//    {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
//  {label: "person b", times: [
//    {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
//  {label: "person c", times: [
//    {"starting_time": 1355761910000, "ending_time": 1355763910000}]},
//];
//
//
//var chart = d3.timeline()
//    .beginning(1355752800000) // we can optionally add beginning and ending times to speed up rendering a little
//    .ending(1355774400000)
//    .showTimeAxisTick() // toggles tick marks
//    .stack() // toggles graph stacking
//  ;
//var svg = d3.select("#timeline1").append("svg").attr("width", 500)
//  .datum(testData).call(chart);