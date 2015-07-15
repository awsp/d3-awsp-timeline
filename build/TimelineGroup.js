///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineChart.ts" />
/**
 * Represent scheduler group part
 */
var TimelineGroup = (function () {
    function TimelineGroup(dimension) {
        this.domInstance = null; // DOM root element
        this.svgInstance = null; // SVG root element
        this.rowHeight = 21;
        this.aHeight = 0; // Overall height
        if (!dimension) {
            throw new Error("Dimension is not set. ");
        }
        this.aDimension = dimension;
    }
    TimelineGroup.prototype.dimension = function () {
        return this.aDimension;
    };
    TimelineGroup.prototype.height = function () {
        var defaultHeight = +this.dimension().height();
        return this.aHeight > defaultHeight ? this.aHeight : defaultHeight;
    };
    TimelineGroup.prototype.setRowHeight = function (height) {
        this.rowHeight = height;
    };
    TimelineGroup.prototype.getRowHeight = function () {
        return this.rowHeight;
    };
    TimelineGroup.prototype.init = function (moduleName, gParent, data) {
        this.gParent = gParent;
        this.moduleName = moduleName;
        this.aData = data;
        var theoreticalHeight = this.aHeight = Object.keys(data).length * this.rowHeight;
        // Create a HTML element with attributes like width and height
        var domInstance = this.gParent.append("div");
        domInstance.attr("id", this.moduleName + "-grouping").attr("class", "list-module");
        domInstance.attr("style", "width: " + this.dimension().width() + "px; " + "height: " + (this.dimension().height() - TimelineChart.timelineHeight) + "px; " + "margin-top: " + TimelineChart.timelineHeight + "px;");
        // Create SVG element inside this DOM.
        // TODO: height is using pre-defined number.
        var svgInstance = domInstance.append("svg");
        svgInstance.attr("width", this.dimension().width()).attr("height", theoreticalHeight);
        // Assignment
        this.domInstance = domInstance;
        this.svgInstance = svgInstance;
    };
    TimelineGroup.prototype.drawData = function (data) {
        if (!data) {
            data = this.aData;
        }
        var svg = this.svgInstance;
        var baseG = svg.append("g").attr("transform", "translate(0, " + TimelineChart.timelineHeight + ")");
        var rowHeight = this.rowHeight;
        baseG.selectAll("rect").data(d3.values(data)).enter().append("text").text(function (d) {
            return d[0].therapist;
        }).attr("y", function (d, i) {
            return rowHeight * i;
        }).attr("x", TimelineGroup.leftPadding);
    };
    TimelineGroup.leftPadding = 5;
    return TimelineGroup;
})();
