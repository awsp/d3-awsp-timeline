///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="TimelineChart.ts" />
///<reference path="TimelineGroup.ts" />
///<reference path="Dimension.ts" />
/**
 * Main class to draw schdeuler
 */
var TimelineScheduler = (function () {
    function TimelineScheduler(target, dimension, data, chart, grouping) {
        if (!target || !dimension || !chart || !grouping) {
            throw new Error("Unable to initialize class. ");
        }
        this.chart = chart;
        this.grouping = grouping;
        this.aData = data;
        this.aDimension = dimension;
        this.initGParent(target);
    }
    TimelineScheduler.prototype.dimension = function () {
        return this.aDimension;
    };
    /**
     * Return selected target.
     * @returns {any}
     */
    TimelineScheduler.prototype.target = function () {
        return this.aTarget;
    };
    TimelineScheduler.prototype.initGParent = function (target) {
        this.aTarget = d3.select(target);
        // Make div
        var stem = target.replace("#", "").replace(".", "");
        this.aTarget.append("div").attr("id", stem + "-grouping").attr("class", "fl overflow-y").attr("style", "width: " + this.grouping.dimension().width() + "; height: " + this.grouping.dimension().height());
        this.aTarget.append("div").attr("id", stem + "-grouping").attr("class", "fr overflowing");
        //.attr("style", "width: " + this.chart.dimension().width() + "; height: " + this.chart.dimension().height());
        this.aTarget.append("div").attr("class", "clear");
        return;
        this.gParent = this.target().append("svg");
        this.gParent.attr("width", this.dimension().width()).attr("height", this.dimension().height());
        // Background
        var gradientDef = this.gParent.append("defs").append("linearGradient").attr("id", "bg").attr("x1", "0%").attr("x2", "0%").attr("y1", "0%").attr("y2", "100%").attr("gradientTransform", "rotate(10)").attr("spreadMethod", "pad");
        gradientDef.append("stop").attr("offset", "0%").attr("stop-color", "#f5f3f5").attr("stop-opacity", 1);
        gradientDef.append("stop").attr("offset", "100%").attr("stop-color", "#cfcfcf").attr("stop-opacity", 1);
        this.gParent.append("rect").attr("width", this.dimension().width()).attr("height", this.dimension().height()).attr("style", "fill: url(#bg); stroke: #ccc; stroke-width: 1");
        this.grouping.init(this.gParent, this.aData);
    };
    TimelineScheduler.prototype.render = function () {
    };
    return TimelineScheduler;
})();
//# sourceMappingURL=TimelineScheduler.js.map