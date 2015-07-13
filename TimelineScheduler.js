///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="TimelineChart.ts" />
///<reference path="TimelineGroup.ts" />
///<reference path="Dimension.ts" />
/**
 * Timeline Scheduler
 *
 * @author Anthony S. Wu <anthony@ssetp.com>
 */
var TimelineScheduler = (function () {
    function TimelineScheduler(target, dimension, data, chart, grouping) {
        this.scheduleModuleClass = "scheduler-module";
        this.scheduleInnerClass = "scheduler-inner";
        if (!target || !dimension || !chart || !grouping) {
            throw new Error("Unable to initialize class. ");
        }
        // Get target stem
        this.targetStem = this.getStem(target);
        // Chart & Groups
        this.chart = chart;
        this.grouping = grouping;
        // Data
        this.aData = data;
        // Timeline scheuler dimension settings
        this.aDimension = dimension;
        // Begin to initialize root frame
        this.initGParent(target);
    }
    /**
     * Get stem of the target name, dispatch its front property such as . or #
     * @param targetName
     * @returns {string}
     */
    TimelineScheduler.prototype.getStem = function (targetName) {
        return targetName.replace("#", "").replace(".", "");
    };
    /**
     * Get dimension
     * @returns {Dimension}
     */
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
        this.aTarget.attr("class", this.scheduleModuleClass).attr("style", "width: " + this.dimension().width() + "px; height: " + this.dimension().height() + "px;");
        var aTargetInner = this.aTarget.append("div");
        aTargetInner.attr("class", this.scheduleInnerClass);
        // Draw them out!
        this.grouping.init(this.targetStem, aTargetInner, this.aData);
        this.chart.init(this.targetStem, aTargetInner, this.grouping.dimension().width());
    };
    TimelineScheduler.prototype.render = function () {
        this.grouping.drawData();
    };
    return TimelineScheduler;
})();
//# sourceMappingURL=TimelineScheduler.js.map