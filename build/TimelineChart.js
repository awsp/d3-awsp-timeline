///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="Dimension.ts" />
/**
 * Represent chart part of scheduler
 */
var TimelineChart = (function () {
    function TimelineChart(dimension) {
        this.domInstance = null; // DOM root element
        this.svgInstance = null; // SVG root element
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
        var theoreticalWidth = 2000;
        var theoreticalHeight = this.aHeight = data.length * this.rowHeight;
        var domInstance = this.gParent.append("div");
        domInstance.attr("id", this.moduleName + "-chart").attr("class", "chart-module");
        domInstance.attr("style", "width: " + this.dimension().width() + "; height: " + this.height() + "; margin-left: " + marginLeft + "px;");
        var domInnerInstance = domInstance.append("div");
        domInnerInstance.attr("class", "chart-inner").attr("style", "width: " + theoreticalWidth + "px;");
        // TODO: temp value for width: 2000
        var svgInstance = domInnerInstance.append("svg");
        svgInstance = svgInstance.attr("width", theoreticalWidth).attr("height", this.height());
        this.domInstance = domInstance;
        this.svgInstance = svgInstance;
    };
    return TimelineChart;
})();
