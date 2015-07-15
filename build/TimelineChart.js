///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineGroup.ts" />
/**
 * Represent chart part of scheduler
 */
var TimelineChart = (function () {
    function TimelineChart(dimension) {
        // Root DOM
        this.chartModuleDom = null;
        // Chart SVG, pointer to the actual SVG element.
        this.chartSvg = null;
        // Storing Row Height, injectable from method.
        this.rowHeight = 21;
        if (!dimension) {
            throw new Error("Dimension is not set. ");
        }
        this.aDimension = dimension;
    }
    TimelineChart.prototype.dimension = function () {
        return this.aDimension;
    };
    TimelineChart.prototype.setRowHeight = function (height) {
        this.rowHeight = height;
    };
    TimelineChart.prototype.height = function () {
        var defaultHeight = +this.dimension().height();
        return this.aHeight > defaultHeight ? this.aHeight : defaultHeight;
    };
    TimelineChart.prototype.width = function () {
        return this.dimension().width();
    };
    TimelineChart.prototype.init = function (moduleName, gParent, data, marginLeft) {
        this.gParent = gParent;
        this.moduleName = moduleName;
        var theoreticalWidth = 2400; // TODO: temp value for width: 2400
        var theoreticalHeight = this.aHeight = Object.keys(data).length * this.rowHeight;
        // `chart-module` DOM
        var chartModuleDom = this.gParent.append("div");
        chartModuleDom.attr("id", this.moduleName + "-chart").attr("class", "chart-module");
        chartModuleDom.attr("style", "width: " + this.dimension().width() + "; height: " + this.dimension().height() + "; margin-left: " + marginLeft + "px;");
        // `chart-inner` DOM
        var chartInnerDom = chartModuleDom.append("div");
        chartInnerDom.attr("class", "chart-inner");
        // Timeline DOM
        var chartTimelineDom = chartInnerDom.append("div");
        chartTimelineDom.attr("class", "chart-timeline").attr("style", "height: " + TimelineChart.timelineHeight + "px; ");
        // Timeline SVG
        var timelineSvg = chartTimelineDom.append("svg");
        timelineSvg.attr("width", theoreticalWidth).attr("height", TimelineChart.timelineHeight);
        // Timeline SVG timeline
        var start = new Date("2015-07-14 00:00:00").getTime();
        var end = new Date("2015-07-14 23:59:59").getTime();
        var xScale = d3.time.scale().domain([start, end]).range([0, theoreticalWidth]);
        var xAxis = d3.svg.axis().scale(xScale).orient("top").ticks(d3.time.minutes, 30).tickSize(6).tickFormat(d3.time.format("%I:%M"));
        timelineSvg.append("g").attr("class", "axis").attr("transform", "translate(0, " + (TimelineChart.timelineHeight - 1) + ")").call(xAxis);
        // Timeline Scrollable Div
        var chartScrollableDom = chartInnerDom.append("div");
        var remainingWidth = this.dimension().height() - TimelineChart.timelineHeight;
        chartScrollableDom.attr("class", TimelineChart.scrollableTimelineClass);
        chartScrollableDom.attr("style", "width: " + this.dimension().width() + "; height: " + remainingWidth + "px");
        // Timeline Chart SVG
        var chartSvg = chartScrollableDom.append("svg");
        chartSvg.attr("width", theoreticalWidth).attr("height", theoreticalHeight);
        // Timeline Chart Grid
        var ticks = 48;
        var xGridScale = d3.scale.linear().domain([0, theoreticalWidth]).range([0, theoreticalWidth]);
        var xGrid = d3.svg.axis().scale(xGridScale).orient("bottom").ticks(ticks).tickFormat("").tickSize(-theoreticalWidth, 0);
        chartSvg.append("g").attr("class", "grid").attr("transform", "translate(0," + theoreticalWidth + ")").call(xGrid);
        var yGridScale = d3.scale.linear().domain([0, theoreticalWidth]).range([0, theoreticalWidth]);
        var yGrid = d3.svg.axis().scale(yGridScale).orient("left").ticks(ticks).tickFormat("").tickSize(-theoreticalWidth, 0);
        chartSvg.append("g").attr("class", "grid").attr("transform", "translate(0," + theoreticalWidth + ")").call(yGrid);
        this.chartModuleDom = chartModuleDom;
        this.chartSvg = chartSvg;
    };
    TimelineChart.prototype.drawData = function () {
    };
    // Timeline CSS Class Name, used to do some jQuery stuff.
    TimelineChart.scrollableTimelineClass = "timeline-asdf";
    // Timeline Div Height
    TimelineChart.timelineHeight = 21;
    return TimelineChart;
})();
