///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="DefinitelyTyped/moment/moment.d.ts" />
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
        if (!target || !dimension || !chart || !grouping) {
            throw new Error("Unable to initialize class. ");
        }
        this.targetName = target;
        // Get target stem
        this.targetStem = TimelineScheduler.getStem(target);
        // Chart & Groups
        this.chart = chart;
        this.grouping = grouping;
        // Timeline scheduler dimension settings
        this.aDimension = dimension;
        // Begin to initialize root frame
        var innerRoot = this.aTargetInner = this.initGParent(target);
        // Data
        this.initData(data, innerRoot);
    }
    /**
     * Get stem of the target name, dispatch its front property such as . or #
     * @param targetName
     * @returns {string}
     */
    TimelineScheduler.getStem = function (targetName) {
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
    /**
     * Convert data based on a groupBy key.
     * @param data
     * @param groupBy
     * @param order
     * @returns {Dictionary<T[]>|Dictionary<TValue[]>|_.Dictionary<T[]>}
     */
    TimelineScheduler.processData = function (data, groupBy, order) {
        if (order === void 0) { order = "asc"; }
        var groupedData = _.groupBy(data, groupBy), sortedPersons, persons;
        for (var i in groupedData) {
            persons = groupedData[i];
            // Sort in ascending order.
            // zIndex at 2 is on top of 1, on top of 0, etc.
            sortedPersons = _.sortBy(persons, function (d) {
                if (order === "asc") {
                    return d.type.zIndex;
                }
                return -d.type.zIndex;
            });
            groupedData[i] = sortedPersons;
        }
        return groupedData;
    };
    /**
     * Initialize G parent.
     * @param target
     */
    TimelineScheduler.prototype.initGParent = function (target) {
        this.aTarget = d3.select(target);
        this.aTarget.attr("class", TimelineScheduler.scheduleModuleClass).attr("style", "width: " + this.dimension().width() + (+this.dimension().width() >= 0 ? "px" : "") + "; " + "height: " + this.dimension().height() + (+this.dimension().height() >= 0 ? "px" : "") + ";");
        var aTargetInner = this.aTarget.append("div");
        aTargetInner.attr("class", TimelineScheduler.scheduleInnerClass);
        return aTargetInner;
    };
    TimelineScheduler.prototype.initData = function (data, aTargetInner) {
        this.aData = data;
        if (!aTargetInner) {
            aTargetInner = this.aTargetInner;
        }
        // Draw them out!
        this.grouping.init(this.targetStem, aTargetInner, this.aData);
        this.chart.init(this.targetStem, aTargetInner, this.aData, this.grouping.dimension().width());
        // Scrolling
        $("." + TimelineChart.scrollableTimelineClass, this.targetName).on("scroll", function () {
            $("." + TimelineScheduler.listModuleClass, this.targetName).scrollTop($(this).scrollTop());
            $("." + TimelineScheduler.chartTimelineClass, this.targetName).scrollLeft($(this).scrollLeft());
        });
    };
    /**
     * Shortcut to set data for both grouping and chart.
     * @param data
     */
    TimelineScheduler.prototype.setData = function (data) {
        this.chart.setData(data);
        this.grouping.setData(data);
    };
    /**
     * Clear method
     */
    TimelineScheduler.prototype.clear = function () {
        this.chart.clearNodes();
        this.chart.clearTimeline();
        this.chart.clearGrid();
        this.chart.clearDateModule();
        this.grouping.clearNodes();
    };
    /**
     * Main render method
     */
    TimelineScheduler.prototype.render = function () {
        this.grouping.drawData();
        this.chart.draw();
    };
    /**
     * Render method
     * Same as render, but does a little bit, clear chart first then render
     */
    TimelineScheduler.prototype.reRender = function () {
        this.clear();
        this.render();
    };
    /**
     * Soft render method
     * Differ to render / reRender method which wipe the whole thing out,
     * instead update the changed portion only.
     *
     * - Allow less resource to redraw changes
     * - Allow animation aid
     *
     * TODO: not implemented.
     */
    TimelineScheduler.prototype.softRender = function () {
        // Find out changes
        // Pick by its identifier(id)
        // Move it to the correct position
        // Update its g data-x, data-y
        // Update its identifier(id)
    };
    TimelineScheduler.scheduleModuleClass = "scheduler-module";
    TimelineScheduler.scheduleInnerClass = "scheduler-inner";
    TimelineScheduler.listModuleClass = "list-module";
    TimelineScheduler.chartTimelineClass = "chart-timeline";
    TimelineScheduler.currentDateModuleClass = "chart-date";
    return TimelineScheduler;
})();
