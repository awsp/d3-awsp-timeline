///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="Dimension.ts" />
/**
 * Represent chart part of scheduler
 */
var TimelineChart = (function () {
    function TimelineChart(dimension) {
        this.domInstance = null; // DOM root element
        this.svgInstance = null; // SVG root element
        if (!dimension) {
            throw new Error("Dimension is not set. ");
        }
        this.aDimension = dimension;
    }
    TimelineChart.prototype.dimension = function () {
        return this.aDimension;
    };
    TimelineChart.prototype.height = function () {
        // TODO: Check data source and calculate height. If greater than provided height, use calculated height instead.
        return this.dimension().height();
    };
    TimelineChart.prototype.width = function () {
        return this.dimension().width();
    };
    TimelineChart.prototype.init = function (moduleName, gParent, marginLeft) {
        this.gParent = gParent;
        this.moduleName = moduleName;
        var theoreticalWidth = 2000;
        var domInstance = this.gParent.append("div");
        domInstance.attr("id", this.moduleName + "-grouping").attr("class", "chart-module");
        domInstance.attr("style", "width: " + this.dimension().width() + "; height: " + this.dimension().height() + "; margin-left: " + marginLeft + "px;");
        var domInnerInstance = domInstance.append("div");
        domInnerInstance.attr("class", "chart-inner").attr("style", "width: " + theoreticalWidth + "px;");
        // TODO: temp value for width: 2000
        var svgInstance = domInnerInstance.append("svg");
        svgInstance = svgInstance.attr("width", theoreticalWidth).attr("height", this.dimension().height());
        this.domInstance = domInstance;
        this.svgInstance = svgInstance;
    };
    return TimelineChart;
})();
