///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineChart.ts" />
/**
 * Represent scheduler group part
 */
var TimelineGroup = (function () {
    function TimelineGroup(dimension) {
        // DOM root element
        this.domInstance = null;
        // SVG root element
        this.svgInstance = null;
        // Row's height, default to 21
        this.rowHeight = 21;
        // Overall height
        this.aHeight = 0;
        // Text width, used to calcalate truncate position
        this.textFactorBase = 9;
        if (!dimension) {
            throw new Error("Dimension is not set. ");
        }
        this.aDimension = dimension;
    }
    TimelineGroup.prototype.dimension = function () {
        return this.aDimension;
    };
    TimelineGroup.prototype.height = function () {
        return Object.keys(this.aData).length * this.rowHeight;
    };
    TimelineGroup.prototype.setRowHeight = function (height) {
        this.rowHeight = height;
    };
    TimelineGroup.prototype.getRowHeight = function () {
        return this.rowHeight;
    };
    /**
     * Initialize the base dom and svg elements.
     * @param moduleName
     * @param gParent
     * @param data
     */
    TimelineGroup.prototype.init = function (moduleName, gParent, data) {
        this.gParent = gParent;
        this.moduleName = moduleName;
        this.aData = data;
        var theoreticalHeight = this.aHeight = this.height();
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
    /**
     * Draw the data out based on given data.
     * @param data
     */
    TimelineGroup.prototype.drawData = function (data) {
        var _this = this;
        // Allow data to override original value.
        if (!data) {
            data = this.aData;
        }
        var svg = this.svgInstance;
        var baseG = svg.append("g").attr("transform", "translate(0, 0)");
        var rowHeight = this.rowHeight;
        svg.attr("height", this.height());
        var g = baseG.selectAll("g").data(d3.values(data));
        var gEnter = g.enter().append("g").attr("transform", function (d, i) {
            return "translate(0, " + rowHeight * i + ")";
        });
        gEnter.append("rect").attr("height", rowHeight).attr("width", this.dimension().width()).attr("class", function (d, i) {
            return i % 2 === 0 ? "even" : "odd";
        });
        gEnter.append("text").text(function (d) {
            var factor = _this.getTextFactor(d[0].worker);
            if (d[0].worker.length > factor) {
                return d[0].worker.substring(0, factor) + "...";
            }
            return d[0].worker;
        }).attr("dominant-baseline", "central").attr("x", function (d, i) {
            return 5;
        }).attr("dy", function (d, i) {
            return rowHeight / 2;
        }).attr("text-anchor", "start");
    };
    /**
     * Get factor of a text string
     * @param text
     * @returns {number}
     */
    TimelineGroup.prototype.getTextFactor = function (text) {
        var factor;
        factor = this.dimension().width() / this.textFactorBase;
        if (TimelineGroup.containsNonLatinCodepoints(text)) {
            factor /= 2;
        }
        return factor;
    };
    TimelineGroup.prototype.clearNodes = function () {
        this.svgInstance.selectAll("g").remove();
    };
    TimelineGroup.prototype.setData = function (data) {
        this.aData = data;
    };
    /**
     * Test if a string contains non-latin characters
     * Reference:
     *   http://stackoverflow.com/questions/147824/how-to-find-whether-a-particular-string-has-unicode-characters-esp-double-byte
     * @param text
     * @returns {boolean}
     */
    TimelineGroup.containsNonLatinCodepoints = function (text) {
        return /[^\u0000-\u00ff]/.test(text);
    };
    // Left padding of text
    TimelineGroup.leftPadding = 5;
    return TimelineGroup;
})();
