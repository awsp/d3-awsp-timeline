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
        var defaultHeight = +this.dimension().height();
        return this.aHeight > defaultHeight ? this.aHeight : defaultHeight;
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
            var factor = _this.getTextFactor(d[0].worker);
            if (d[0].worker.length > factor) {
                return d[0].worker.substring(0, factor) + "...";
            }
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
///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineGroup.ts" />
/**
 * Represent chart part of scheduler
 */
var TimelineChart = (function () {
    /**
     * Constructor
     * @param dimension
     */
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
        this.axisFormat = "%H:%M";
        this.tooltipClass = "tooltip";
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
    TimelineChart.prototype.setXAxisFormat = function (format) {
        this.axisFormat = format;
    };
    TimelineChart.prototype.drawTimeline = function (timelineSvg) {
        if (!timelineSvg) {
            timelineSvg = this.timelineSvg;
        }
        var xScale = this.xScale = this.updateXAxis();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .ticks(d3.time.minutes, 30)
            .tickSize(6)
            .tickFormat(d3.time.format(this.axisFormat));
        timelineSvg.attr("width", this.chartRange).attr("class", "changed").append("g").attr("class", "axis").attr("transform", "translate(0, " + (TimelineChart.timelineHeight - 1) + ")").call(xAxis);
    };
    TimelineChart.prototype.drawGrid = function (chartSvg) {
        if (!chartSvg) {
            chartSvg = this.chartSvg;
        }
        var ticks = 24 * 2;
        var xGridScale = d3.scale.linear().domain([0, this.chartRange]).range([0, this.chartRange]);
        var xGrid = d3.svg.axis().scale(xGridScale).orient("bottom").ticks(ticks).tickFormat("").tickSize(-this.chartRange, 0);
        chartSvg.append("g").attr("class", "grid").attr("transform", "translate(0," + this.chartRange + ")").call(xGrid);
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
        timelineSvg.attr("height", TimelineChart.timelineHeight);
        this.timelineSvg = timelineSvg;
        // Timeline Scrollable Div
        var chartScrollableDom = chartInnerDom.append("div");
        var remainingWidth = this.dimension().height() - TimelineChart.timelineHeight;
        chartScrollableDom.attr("class", TimelineChart.scrollableTimelineClass);
        chartScrollableDom.attr("style", "height: " + remainingWidth + "px");
        // Timeline Chart SVG
        var chartSvg = chartScrollableDom.append("svg");
        chartSvg.attr("width", theoreticalWidth).attr("height", theoreticalHeight);
        // Tooltip
        this.tooltip = chartScrollableDom.append("div").attr("class", this.tooltipClass).style("opacity", 0);
        this.tooltipInner = this.tooltip.append("foreignObject").append("div").attr("class", "inner");
        this.chartModuleDom = chartModuleDom;
        this.chartSvg = chartSvg;
    };
    /**
     * This will re-calculate and update the current x axis scaling.
     * Shall be called, after changing business hours, or chart width.
     * @returns {d3.time.Scale<any, number>}
     */
    TimelineChart.prototype.updateXAxis = function () {
        var start = this.chartStart.getTime();
        var end = this.chartEnd.getTime();
        this.chartRange = (end - start) / 36000;
        this.xScale = d3.time.scale().domain([start, end]).range([0, this.chartRange]);
        return this.xScale;
    };
    TimelineChart.prototype.onMouseOver = function (svg, data, i) {
    };
    TimelineChart.prototype.onMouseOut = function (svg, data, i) {
    };
    TimelineChart.prototype.onClick = function (svg, data, i) {
    };
    TimelineChart.prototype.titleOnHover = function (svg, instance) {
    };
    /**
     * Determine and mark overlaps if type has a property `markOverlap` to true
     * @param blockG
     */
    TimelineChart.prototype.determineOverlaps = function (blockG) {
        // Hold temporary overlapped blocks
        var overlapBlockHolder = {};
        blockG.filter(function (d) {
            return d.type.markOverlap;
        }).select("rect").attr("class", function (d, i) {
            if (i === 0) {
                overlapBlockHolder[d.worker] = [];
            }
            for (var i in overlapBlockHolder[d.worker]) {
                var range = overlapBlockHolder[d.worker][i];
                var start = range.start;
                var end = range.end;
                if (d3.max([start, d.starting_time]) < d3.min([end, d.ending_time])) {
                    // No need to save reference since we have marked the first block that might overlap
                    return d.type.overlapClass;
                }
            }
            // Save range for later calculation.
            overlapBlockHolder[d.worker].push({
                start: d.starting_time,
                end: d.ending_time,
                marked: false
            });
            return '';
        });
    };
    /**
     * Draw all blocks on given chart element.
     * @param blockG
     */
    TimelineChart.prototype.drawBlocks = function (blockG) {
        var _this = this;
        var rowHeight = this.rowHeight;
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
    };
    /**
     * Append SVG gradient definitions
     * @param baseG
     * @returns {any}
     */
    TimelineChart.appendDefinitions = function (baseG) {
        // Gradient Definitions
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
        return defFilter;
    };
    TimelineChart.prototype.drawLabels = function (blockG) {
        var rowHeight = this.rowHeight;
        blockG.filter(function (d) {
            return !!(d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true);
        }).append("text")
            .text(this.labeling)
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
    /**
     * Draw actual data onto the chart!
     */
    TimelineChart.prototype.draw = function () {
        var _this = this;
        // Timeline SVG timeline
        this.drawTimeline();
        // Update length
        this.chartSvg.attr("width", this.chartRange);
        // Timeline Grid
        this.drawGrid();
        // Save class reference
        var that = this;
        // Base G
        var baseG = this.chartSvg.append("g").attr("transform", "translate(0, 0)").attr("class", "node-chart");
        var g = baseG.selectAll("g").data(d3.values(this.aData));
        // Row Height
        var rowHeight = this.rowHeight;
        // Gradient Definitions
        TimelineChart.appendDefinitions(baseG);
        var gEnter = g.enter().append("g").attr("class", "chart-row").attr("transform", function (d, i) {
            return "translate(0, " + rowHeight * i + ")";
        }).attr("data-y", function (d, i) {
            return rowHeight * i;
        });
        var blockG = gEnter.selectAll("g").data(function (d, i) {
            return d;
        }).enter()
            .append("g")
            .attr("transform", function (d) {
            return "translate(" + _this.xScale(d.starting_time) + ", 0)";
        })
            .attr("class", "block")
            .attr("id", function (d, i) {
            var currentY = +d3.select(this.parentNode).attr("data-y");
            return d.type.id + "-" + currentY + "-" + i;
        })
            .attr("data-x", function (d) {
            return _this.xScale(d.starting_time);
        })
            .on("mouseover", function (d, i) {
            that.onMouseOver(this, d, i);
        })
            .on("mouseout", function (d, i) {
            that.onMouseOut(this, d, i);
        })
            .on("click", function (d, i) {
            that.onClick(this, d, i);
        });
        // Draw all blocks
        this.drawBlocks(blockG);
        // Determine overlapping
        this.determineOverlaps(blockG);
        // Title Box [Optional]
        // Insert a title into svg element to allow A tag-liked description box.
        // Override to make custom title box.
        var titleDesc = blockG.filter(function (d) {
            return !!(d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true);
        }).append("svg:title");
        this.titleOnHover(titleDesc, this);
        // Blocks Labeling
        this.drawLabels(blockG);
    };
    TimelineChart.prototype.clearAll = function () {
        this.chartSvg.selectAll("*").remove();
    };
    TimelineChart.prototype.clearNodes = function () {
        this.chartSvg.selectAll(".node-chart").remove();
    };
    TimelineChart.prototype.clearTimeline = function () {
        this.timelineSvg.selectAll("g").remove();
    };
    TimelineChart.prototype.clearGrid = function () {
        this.chartSvg.selectAll("g.grid").remove();
    };
    /**
     * Default data-binding on labels
     * @param d
     * @param i
     * @returns {any}
     */
    TimelineChart.prototype.labeling = function (d, i) {
        return d.place;
    };
    /**
     * Set domain for business hours to display in chart.
     * @param start
     * @param end
     */
    TimelineChart.prototype.setBusinessHours = function (start, end) {
        this.chartStart = start;
        this.chartEnd = end;
        // Update x axis scaling
        this.updateXAxis();
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
     * Get chart svg height.
     * If total # of rows don't make up the height of defined one, use the actual svg height,
     * otherwise use the defined one.
     * @returns {number}
     */
    TimelineChart.prototype.getChartSVGHeight = function () {
        var moduleHeight = +$("#" + this.moduleName).height();
        var svgHeight = +this.chartSvg.attr("height");
        return moduleHeight < svgHeight ? moduleHeight : svgHeight;
    };
    /**
     * Show tooltip of the current hovering object
     * Usage:
     *   instance.showTooltip(currentInstance).html(...) <- insert code
     * @returns {any}
     */
    TimelineChart.prototype.showTooltip = function (currentInstance) {
        var _this = this;
        this.tooltip.transition().duration(300).attr("style", function () {
            var currentRow = d3.select(currentInstance).select(function () {
                return this.parentNode;
            }).node();
            var currentHeight = _this.getChartSVGHeight();
            var currentY = +d3.select(currentRow).attr("data-y");
            var halfed = (currentY - $("." + TimelineChart.scrollableTimelineClass, "#" + _this.moduleName).scrollTop()) > (currentHeight / 2);
            // Calculate relative position of tooltip box
            var toolTipDom = _this.tooltip.node().getBoundingClientRect();
            var halfRowHeight = _this.rowHeight / 2;
            var halfBarHeight = (+d3.select(currentInstance).select("rect").attr("height")) / 2;
            var offset = halfed ? halfRowHeight - halfBarHeight - toolTipDom.height : halfRowHeight + halfBarHeight;
            return "opacity: 1; left: " + d3.select(currentInstance).attr("data-x") + "px; top: " + (+d3.select(currentRow).attr("data-y") + offset) + "px";
        });
        return this.tooltipInner;
    };
    /**
     * Hiding tooltip
     * @returns {any}
     */
    TimelineChart.prototype.hideTooltip = function () {
        this.tooltip.attr("style", function () {
            return "opacity: 0;";
        });
        return this.tooltipInner;
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
    return TimelineScheduler;
})();
