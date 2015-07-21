///<reference path="DefinitelyTyped/d3/d3.d.ts" />
var TwoDimensionalShape = (function () {
    function TwoDimensionalShape(width, height) {
        this.aHeight = height;
        this.aWidth = width;
    }
    /**
     * Getter / Setter of `width`
     * @param w
     * @returns {d3.Primitive}
     */
    TwoDimensionalShape.prototype.width = function (w) {
        // TODO: this part is not called.
        if (w) {
            if (+w > 0) {
                this.aWidth = w;
            }
            else if (w.toString().match(/\%/).length >= 0) {
            }
            else {
                throw new Error("Width must be a number and greater than 0. ");
            }
        }
        return this.aWidth;
    };
    /**
     * Getter / Setter of `height`
     * @param h
     * @returns {d3.Primitive}
     */
    TwoDimensionalShape.prototype.height = function (h) {
        if (h) {
            if (+h > 0) {
                this.aHeight = h;
            }
            else {
                throw new Error("Height must be a number and greater than 0. ");
            }
        }
        return this.aHeight;
    };
    return TwoDimensionalShape;
})();
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
        domInstance.attr("style", "width: " + this.dimension().width() + (+this.dimension().width() >= 0 ? "px" : "") + "; " +
            "height: " + (this.dimension().height() - TimelineChart.timelineHeight) + "px; " +
            "margin-top: " + TimelineChart.timelineHeight + "px;");
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
        gEnter.append("rect")
            .attr("height", rowHeight).attr("width", this.dimension().width())
            .attr("class", function (d, i) {
            return i % 2 === 0 ? "even" : "odd";
        });
        gEnter.append("text")
            .text(function (d) {
            return d[0].worker;
        })
            .attr("dominant-baseline", "central")
            .attr("x", function (d, i) {
            return 5;
        })
            .attr("dy", function (d, i) {
            return rowHeight / 2;
        })
            .attr("text-anchor", "start");
    };
    TimelineGroup.prototype.clearNodes = function () {
        this.svgInstance.selectAll("g").remove();
    };
    TimelineGroup.leftPadding = 5;
    return TimelineGroup;
})();
///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineGroup.ts" />
/**
 * Represent chart part of scheduler
 */
var TimelineChart = (function () {
    function TimelineChart(dimension) {
        // Root DOM
        this.chartModuleDom = null;
        // Chart SVG, pointer to the actual SVG element.
        this.chartSvg = null;
        // Storing Row Height, injectable from method.
        this.rowHeight = 21;
        // Chart output range, default to 2400
        this.chartRange = 2400;
        // Business hours
        this.chartStart = null;
        this.chartEnd = null;
        // X Axis Format
        this.axisFormat = "%I:%M";
        if (!dimension) {
            throw new Error("Dimension is not set. ");
        }
        this.aDimension = dimension;
        var date = new Date();
        var today = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        var start = new Date(today + " 00:00:00");
        var end = new Date(today + " 23:59:59");
        this.setBusinessHours(start, end);
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
    TimelineChart.prototype.setData = function (data) {
        this.aData = data;
    };
    /**
     * Set up chart, timeline
     * @param moduleName
     * @param gParent
     * @param data
     * @param marginLeft
     */
    TimelineChart.prototype.init = function (moduleName, gParent, data, marginLeft) {
        this.gParent = gParent;
        this.moduleName = moduleName;
        this.aData = data;
        var theoreticalWidth = this.chartRange;
        var theoreticalHeight = this.aHeight = Object.keys(data).length * this.rowHeight;
        // `chart-module` DOM
        var chartModuleDom = this.gParent.append("div");
        chartModuleDom.attr("id", this.moduleName + "-chart").attr("class", "chart-module");
        chartModuleDom.attr("style", "height: " + this.dimension().height() + "px; margin-left: " + (marginLeft + 1) + "px;");
        // `chart-inner` DOM
        var chartInnerDom = chartModuleDom.append("div");
        chartInnerDom.attr("class", "chart-inner");
        // Timeline DOM
        var chartTimelineDom = chartInnerDom.append("div");
        chartTimelineDom.attr("class", "chart-timeline").attr("style", "height: " + TimelineChart.timelineHeight + "px; ");
        // Timeline SVG
        var timelineSvg = chartTimelineDom.append("svg");
        timelineSvg.attr("width", theoreticalWidth).attr("height", TimelineChart.timelineHeight);
        // Timeline SVG timeline
        var start = this.chartStart.getTime();
        var end = this.chartEnd.getTime();
        var xScale = d3.time.scale().domain([start, end]).range([0, theoreticalWidth]);
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .ticks(d3.time.minutes, 30)
            .tickSize(6)
            .tickFormat(d3.time.format(this.axisFormat));
        timelineSvg.append("g").attr("class", "axis").attr("transform", "translate(0, " + (TimelineChart.timelineHeight - 1) + ")").call(xAxis);
        this.xScale = xScale;
        // Timeline Scrollable Div
        var chartScrollableDom = chartInnerDom.append("div");
        var remainingWidth = this.dimension().height() - TimelineChart.timelineHeight;
        chartScrollableDom.attr("class", TimelineChart.scrollableTimelineClass);
        chartScrollableDom.attr("style", "height: " + remainingWidth + "px");
        // Timeline Chart SVG
        var chartSvg = chartScrollableDom.append("svg");
        chartSvg.attr("width", theoreticalWidth).attr("height", theoreticalHeight);
        // Timeline Chart Grid
        var ticks = 24 * 2;
        var xGridScale = d3.scale.linear().domain([0, theoreticalWidth]).range([0, theoreticalWidth]);
        var xGrid = d3.svg.axis().scale(xGridScale).orient("bottom").ticks(ticks).tickFormat("").tickSize(-theoreticalWidth, 0);
        chartSvg.append("g").attr("class", "grid").attr("transform", "translate(0," + theoreticalWidth + ")").call(xGrid);
        this.chartModuleDom = chartModuleDom;
        this.chartSvg = chartSvg;
    };
    TimelineChart.prototype.onMouseOver = function (svg, data, i) { };
    TimelineChart.prototype.onMouseOut = function (svg, data, i) { };
    TimelineChart.prototype.titleOnHover = function (svg) { };
    /**
     * Draw actual data onto the chart!
     */
    TimelineChart.prototype.drawData = function () {
        var _this = this;
        var that = this;
        var baseG = this.chartSvg.append("g").attr("transform", "translate(0, 0)").attr("class", "node-chart");
        var g = baseG.selectAll("g").data(d3.values(this.aData));
        var rowHeight = this.rowHeight;
        var defFilter = baseG.append("defs").append("filter")
            .attr({
            x: 0,
            y: 0,
            width: "200%",
            height: "200%",
            id: "f1"
        });
        defFilter.append("feOffset")
            .attr({
            result: "offOut",
            "in": "SourceGraphic",
            dx: 2,
            dy: 7
        });
        defFilter.append("feGaussianBlur")
            .attr({
            result: "blurOut",
            "in": "matrixOut",
            stdDeviation: 10
        });
        defFilter.append("feBlend")
            .attr({
            "in": "SourceGraphic",
            in2: "blurOut",
            mode: "normal"
        });
        var gEnter = g.enter().append("g").attr("class", "chart-row").attr("transform", function (d, i) {
            return "translate(0, " + rowHeight * i + ")";
        });
        var blockG = gEnter.selectAll("g").data(function (d, i) {
            return d;
        }).enter()
            .append("g")
            .attr("transform", function (d) {
            return "translate(" + _this.xScale(d.starting_time) + ", 0)";
        })
            .attr("class", "block")
            .on("mouseover", function (d, i) {
            that.onMouseOver(this, d, i);
        })
            .on("mouseout", function (d, i) {
            that.onMouseOut(this, d, i);
        });
        blockG.append("rect")
            .attr("fill", function (d) {
            return d.type.backgroundColor;
        })
            .attr("height", function (d) {
            return d.type.height;
        })
            .attr("width", function (d) {
            return _this.xScale(new Date(d.ending_time)) - _this.xScale(new Date(d.starting_time));
        })
            .attr("stroke-width", function (d) {
            return d.type.hasOwnProperty("strokeWidth") ? d.type.strokeWidth : 0;
        })
            .attr("stroke", function (d) {
            return d.type.hasOwnProperty("stroke") ? d.type.stroke : 0;
        })
            .attr("rx", function (d) {
            return d.type.hasOwnProperty("round") ? d.type.round : 0;
        })
            .attr("style", function (d) {
            var style = "";
            style += "stroke-opacity: " + (d.type.opacity / 2) + ";";
            style += "fill-opacity: " + d.type.opacity + ";";
            if (d.type.hasLabel) {
                style += "filter: url(#f1);";
            }
            return style;
        })
            .attr("y", function (d) {
            if (d.type.height < rowHeight) {
                return (rowHeight - d.type.height) / 2;
            }
        });
        var titleDesc = blockG.filter(function (d) {
            return !!(d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true);
        }).append("svg:title");
        this.titleOnHover(titleDesc);
        blockG.filter(function (d) {
            return !!(d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true);
        }).append("text")
            .text(that.labeling)
            .attr("dx", function (d) {
            return d.type.hasOwnProperty("round") ? d.type.round + 3 : 3;
        })
            .attr("dy", function () {
            return rowHeight / 2;
        })
            .attr("style", function (d) {
            return "fill: " + d.type.foregroundColor + "; font-size: " + (d.type.hasOwnProperty("fontSize") ? d.type.fontSize : 12) + "px";
        })
            .attr("dominant-baseline", "central");
    };
    TimelineChart.prototype.clearAll = function () {
        this.chartSvg.selectAll("*").remove();
    };
    TimelineChart.prototype.clearNodes = function () {
        this.chartSvg.selectAll(".node-chart").remove();
    };
    TimelineChart.prototype.labeling = function (d, i) {
        return d.place;
    };
    /**
     * Short form / Alias for setting daily business hours
     * @param date
     */
    TimelineChart.prototype.setDate = function (date) {
        var startTime = "00:00:00", endTime = "23:59:59";
        this.setBusinessHours(new Date(date + " " + startTime), new Date(date + " " + endTime));
    };
    /**
     * Set domain for business hours to display in chart
     * @param start
     * @param end
     */
    TimelineChart.prototype.setBusinessHours = function (start, end) {
        this.chartStart = start;
        this.chartEnd = end;
    };
    // Timeline CSS Class Name, used to do some jQuery stuff.
    TimelineChart.scrollableTimelineClass = "timeline-scrollable";
    // Timeline Div Height
    TimelineChart.timelineHeight = 21;
    return TimelineChart;
})();
///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
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
     *
     * TODO: sorting worker's name.
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
        this.aTarget.attr("class", TimelineScheduler.scheduleModuleClass)
            .attr("style", "width: " + this.dimension().width() + (+this.dimension().width() >= 0 ? "px" : "") + "; " +
            "height: " + this.dimension().height() + (+this.dimension().height() >= 0 ? "px" : "") + ";");
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
            console.log('here');
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
    };
    TimelineScheduler.prototype.clear = function () {
        this.chart.clearNodes();
        this.grouping.clearNodes();
    };
    /**
     * Main renderer
     */
    TimelineScheduler.prototype.render = function () {
        this.grouping.drawData();
        this.chart.drawData();
    };
    TimelineScheduler.scheduleModuleClass = "scheduler-module";
    TimelineScheduler.scheduleInnerClass = "scheduler-inner";
    TimelineScheduler.listModuleClass = "list-module";
    TimelineScheduler.chartTimelineClass = "chart-timeline";
    return TimelineScheduler;
})();
