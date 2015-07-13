///<reference path="Dimension.ts" />
/**
 * Represent scheduler group part
 */
var TimelineGroup = (function () {
    function TimelineGroup(dimension) {
        this.domInstance = null; // DOM root element
        this.svgInstance = null; // SVG root element
        if (!dimension) {
            throw new Error("Dimension is not set. ");
        }
        this.aDimension = dimension;
    }
    TimelineGroup.prototype.dimension = function () {
        return this.aDimension;
    };
    TimelineGroup.prototype.init = function (moduleName, gParent, data) {
        this.gParent = gParent;
        this.moduleName = moduleName;
        this.aData = data;
        var theoreticalHeight = 1000;
        // Create a HTML element with attributes like width and height
        var domInstance = this.gParent.append("div");
        domInstance.attr("id", this.moduleName + "-grouping").attr("class", "list-module");
        domInstance.attr("style", "width: " + this.dimension().width() + "px; height: " + this.dimension().height() + "px;");
        // Create SVG element inside this DOM.
        // TODO: height is using pre-definied number.
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
        var baseG = svg.append("g");
        baseG.selectAll("rect").data(data).enter().append("text").text(function (d) {
            return d.therapist;
        }).attr("y", function (d, i) {
            return TimelineGroup.rowHeight * i;
        }).attr("x", TimelineGroup.leftPadding);
    };
    TimelineGroup.rowHeight = 24;
    TimelineGroup.leftPadding = 5;
    return TimelineGroup;
})();
