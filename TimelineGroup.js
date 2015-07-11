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
    TimelineGroup.prototype.init = function (moduleName, gParent) {
        this.gParent = gParent;
        this.moduleName = moduleName;
        var theoreticalHeight = 1000;
        // Create a HTML element with attributes like widdth and height
        var domInstance = this.gParent.append("div");
        domInstance.attr("id", this.moduleName + "-grouping").attr("class", "list-module");
        domInstance.attr("style", "width: " + this.dimension().width() + "px; height: " + this.dimension().height() + "px;");
        // Create SVG element inside this DOM.
        // TODO: height is using predefinied number.
        var svgInstance = domInstance.append("svg").attr("width", this.dimension().width()).attr("height", theoreticalHeight);
        // Background
        var gradientDef = svgInstance.append("defs").append("linearGradient").attr("id", "bg").attr("x1", "0%").attr("x2", "0%").attr("y1", "0%").attr("y2", "100%").attr("gradientTransform", "rotate(10)").attr("spreadMethod", "pad");
        svgInstance.append("rect").attr("width", this.dimension().width()).attr("height", theoreticalHeight).attr("style", "fill: url(#bg); ");
        gradientDef.append("stop").attr("offset", "0%").attr("stop-color", "#f5f3f5").attr("stop-opacity", 1);
        gradientDef.append("stop").attr("offset", "100%").attr("stop-color", "#cfcfcf").attr("stop-opacity", 1);
        // Assignment
        this.domInstance = domInstance;
        this.svgInstance = svgInstance;
    };
    return TimelineGroup;
})();
//# sourceMappingURL=TimelineGroup.js.map