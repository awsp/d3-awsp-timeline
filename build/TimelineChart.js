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
        this.svgInstance = null;
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
        var theoreticalWidth = 2000; // TODO: temp value for width: 2000
        var theoreticalHeight = this.aHeight = data.length * this.rowHeight;
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
        // Timeline Scrollable Div
        var chartScrollableDom = chartInnerDom.append("div");
        var remainingWidth = this.dimension().height() - TimelineChart.timelineHeight;
        chartScrollableDom.attr("class", TimelineChart.scrollableTimelineClass);
        chartScrollableDom.attr("style", "width: " + this.dimension().width() + "; height: " + remainingWidth + "px");
        // Timeline SVG
        var svgInstance = chartScrollableDom.append("svg");
        svgInstance = svgInstance.attr("width", theoreticalWidth).attr("height", theoreticalHeight);
        this.chartModuleDom = chartModuleDom;
        this.svgInstance = svgInstance;
    };
    // Timeline CSS Class Name, used to do some jQuery stuff.
    TimelineChart.scrollableTimelineClass = "timeline-asdf";
    // Timeline Div Height
    TimelineChart.timelineHeight = 21;
    return TimelineChart;
})();
