///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
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
        this.aData = data;
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
        this.chartModuleDom = chartModuleDom;
        this.chartSvg = chartSvg;
    };
    TimelineChart.prototype.onMouseOver = function (svg, data, i) {
    };
    TimelineChart.prototype.onMouseOut = function (svg, data, i) {
    };
    TimelineChart.prototype.titleOnHover = function (svg) {
    };
    TimelineChart.prototype.drawData = function () {
        var baseG = this.chartSvg.append("g").attr("transform", "translate(0, 0)");
        var g = baseG.selectAll("g").data(d3.values(this.aData));
        var rowHeight = this.rowHeight;
        var gEnter = g.enter().append("g").attr("class", "chart-row").attr("transform", function (d, i) {
            return "translate(0, " + rowHeight * i + ")";
        });
        var blockG = gEnter.selectAll("g").data(function (d, i) {
            return d;
        }).enter().append("g").attr("transform", function (d) {
            return "translate(" + Math.floor(Math.random() * 2000) + ", 0)";
        }).attr("class", "block").on("mouseover", function (d, i) {
            _this.onMouseOver(this, d, i);
        }).on("mouseout", function (d, i) {
            _this.onMouseOut(this, d, i);
        });
        var _this = this;
        blockG.append("rect").attr("fill", function (d) {
            return d.type.backgroundColor;
        }).attr("height", function (d) {
            return d.type.height;
        }).attr("width", function (d) {
            // TODO: use time to calculate, hardcoded for now
            return 100;
        }).attr("stroke-width", function (d) {
            return d.type.hasOwnProperty("strokeWidth") ? d.type.strokeWidth : 0;
        }).attr("stroke", function (d) {
            return d.type.hasOwnProperty("stroke") ? d.type.stroke : 0;
        }).attr("rx", function (d) {
            return d.type.hasOwnProperty("round") ? d.type.round : 0;
        }).attr("fill-opacity", function (d) {
            return d.type.opacity;
        }).attr("stroke-opacity", function (d) {
            return d.type.opacity;
        }).attr("y", function (d) {
            if (d.type.height < rowHeight) {
                return (rowHeight - d.type.height) / 2;
            }
        });
        var titleDesc = blockG.filter(function (d) {
            if (d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true) {
                return true;
            }
            return false;
        }).append("svg:title");
        this.titleOnHover(titleDesc);
        blockG.filter(function (d) {
            if (d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true) {
                return true;
            }
            return false;
        }).append("text").text(function (d) {
            if (d.type.hasLabel) {
                return d.place;
            }
            return "";
        }).attr("dx", function (d) {
            return d.type.hasOwnProperty("round") ? d.type.round + 3 : 3;
        }).attr("dy", function (d) {
            return rowHeight / 2;
        }).attr("style", function (d) {
            return "fill: " + d.type.foregroundColor + "; font-size: " + (d.type.hasOwnProperty("fontSize") ? d.type.fontSize : 12) + "px";
        }).attr("dominant-baseline", "central");
    };
    // Timeline CSS Class Name, used to do some jQuery stuff.
    TimelineChart.scrollableTimelineClass = "timeline-asdf";
    // Timeline Div Height
    TimelineChart.timelineHeight = 21;
    return TimelineChart;
})();
