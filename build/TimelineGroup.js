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
        domInstance.attr("style", "width: " + this.dimension().width() + (+this.dimension().width() >= 0 ? "px" : "") + "; " + "height: " + (this.dimension().height() - TimelineChart.timelineHeight) + "px; " + "margin-top: " + TimelineChart.timelineHeight + "px;");
        // Create SVG element inside this DOM.
        // TODO: height is using pre-defined number.
        var svgInstance = domInstance.append("svg");
        svgInstance.attr("width", this.dimension().width()).attr("height", theoreticalHeight);
        // Assignment
        this.domInstance = domInstance;
        this.svgInstance = svgInstance;
    };
    TimelineGroup.prototype.drawData = function (data) {
        // Allow data to override original value.
        if (!data) {
            data = this.aData;
        }
        var svg = this.svgInstance;
        var baseG = svg.append("g").attr("transform", "translate(0, 0)");
        var rowHeight = this.rowHeight;
        var g = baseG.selectAll("g").data(d3.values(data));
        var gEnter = g.enter().append("g").attr("transform", function (d, i) {
            return "translate(0, " + rowHeight * i + ")";
        });
        gEnter.append("rect").attr("height", rowHeight).attr("width", this.dimension().width()).attr("class", function (d, i) {
            return i % 2 === 0 ? "even" : "odd";
        });
        gEnter.append("text").text(function (d) {
            return d[0].worker;
        }).attr("dominant-baseline", "central").attr("x", function (d, i) {
            return 5;
        }).attr("dy", function (d, i) {
            return rowHeight / 2;
        }).attr("text-anchor", "start");
    };
    TimelineGroup.prototype.clearNodes = function () {
        this.svgInstance.selectAll("g").remove();
    };
    TimelineGroup.leftPadding = 5;
    return TimelineGroup;
})();
