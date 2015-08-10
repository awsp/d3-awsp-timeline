///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineGroup.ts" />

interface TimelineChartInterface {
  init(moduleName: string, gParent: any, data: any, width: d3.Primitive): void;

  draw(): void;
  drawLabels(blockG: any): void;
  drawTimeline(timelineSvg?: any): void;
  drawBlocks(blockG: any): void;
  drawGrid(chartSvg?: any): void;

  setDate(date: string): void;
  setBusinessHours(start: Date, end: Date): void;

  labeling(d: any, i?: number): any;
  onMouseOver(svg: any, data: any, i: number): void;
  onMouseOut(svg: any, data: any, i: number): void;
  onClick(svg: any, data: any, i: number): void;
  titleOnHover(svg: any, instance: any): void;
  setData(data: any): void;
  setXAxisFormat(format: string): void;
  setRowHeight(height: number): void;

  updateXAxis(): any;

  clearAll(): void;
  clearNodes(): void;
  clearTimeline(): void;
  clearGrid(): void;

  showTooltip(currentInstance: any): any;
  hideTooltip(): any;
}


/**
 * Represent chart part of scheduler
 */
class TimelineChart implements TimelineChartInterface {
  // TimelineChart Dimension, contains width() and height()
  protected aDimension: Dimension;

  // Parent SVG
  protected gParent: any;

  // Module Stem Name, without . or #
  protected moduleName: string;    // Stem of target

  // Root DOM
  public chartModuleDom: any = null;

  // Chart SVG, pointer to the actual SVG element.
  public chartSvg: any = null;

  // Storing Row Height, injectable from method.
  protected rowHeight: number = 21;

  // Storing Current Height
  protected aHeight: number;

  // Storing data
  protected aData: any;

  // Timeline CSS Class Name, used to do some jQuery stuff.
  public static scrollableTimelineClass: string = "timeline-scrollable";

  // Timeline Div Height
  public static timelineHeight: number = 21;

  // Scaling - x direction
  protected xScale: any;
  protected timelineSvg: any;

  // Chart output range, default to 2400
  protected chartRange: number = 2400;

  // Business hours
  protected chartStart: Date = null;
  protected chartEnd: Date = null;

  // X Axis Format
  public axisFormat: string = "%H:%M";

  // Tooltip
  public tooltip: any;
  public tooltipInner: any;
  public tooltipClass = "tooltip";

  /**
   * Constructor
   * @param dimension
   */
  public constructor(dimension: Dimension) {
    if (!dimension) {
      throw new Error("Dimension is not set. ");
    }
    this.aDimension = dimension;
    var date: Date = new Date();
    var today: string = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    var start: Date = new Date(today + " 00:00:00");
    var end: Date = new Date(today + " 23:59:59");
    this.setBusinessHours(start, end);
  }

  public dimension(): Dimension {
    return this.aDimension;
  }

  public setRowHeight(height: number): void {
    this.rowHeight = height;
  }

  public height(): d3.Primitive {
    return Object.keys(this.aData).length * this.rowHeight;
  }

  public width(): d3.Primitive {
    return this.dimension().width();
  }

  public setData(data: any): void {
    this.aData = data;
  }

  public setXAxisFormat(format: string): void {
    this.axisFormat = format;
  }

  /**
   * Draw timeline
   * @param timelineSvg
   */
  public drawTimeline(timelineSvg?: any): void {
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
  }

  /**
   * Draw grid
   * @param chartSvg
   */
  public drawGrid(chartSvg?: any): void {
    if (!chartSvg) {
      chartSvg = this.chartSvg;
    }
    var ticks: number = 24 * 2;
    var xGridScale = d3.scale.linear().domain([0, this.chartRange]).range([0, this.chartRange]);
    var xGrid = d3.svg.axis().scale(xGridScale).orient("bottom").ticks(ticks).tickFormat("").tickSize(-this.chartRange, 0);
    chartSvg.append("g").attr("class", "grid").attr("transform", "translate(0," + this.chartRange + ")").call(xGrid);
  }

  /**
   * Set up chart, timeline
   * @param moduleName
   * @param gParent
   * @param data
   * @param marginLeft
   */
  public init(moduleName: string, gParent: any, data: any, marginLeft: number): void {
    this.gParent = gParent;
    this.moduleName = moduleName;
    this.aData = data;
    var theoreticalWidth: number = this.chartRange;
    var theoreticalHeight: number = this.aHeight = <number>this.height();

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
    var remainingWidth: number = <number>this.dimension().height() - TimelineChart.timelineHeight;
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
  }

  /**
   * This will re-calculate and update the current x axis scaling.
   * Shall be called, after changing business hours, or chart width.
   * @returns {d3.time.Scale<any, number>}
   */
  public updateXAxis(): any {
    var start: number = this.chartStart.getTime();
    var end: number = this.chartEnd.getTime();
    if (! (isNaN(start) || isNaN(end))) {
      this.chartRange = (end - start) / 36000;
    }

    this.xScale = d3.time.scale().domain([start, end]).range([0, this.chartRange]);
    return this.xScale;
  }

  public onMouseOver(svg: any, data: any, i: number): void {
  }

  public onMouseOut(svg: any, data: any, i: number): void {
  }

  public onClick(svg: any, data: any, i: number): void {
  }

  public titleOnHover(svg: any, instance: any): void {
  }

  /**
   * Determine and mark overlaps if type has a property `markOverlap` to true
   * @param blockG
   */
  public determineOverlaps(blockG: any): void {
    // Hold temporary overlapped blocks
    var overlapBlockHolder: any = {};

    blockG.filter(function (d) {
      return d.type.markOverlap;
    }).select("rect").attr("class", (d, i) => {
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
  }

  /**
   * Draw all blocks on given chart element.
   * @param blockG
   */
  public drawBlocks(blockG: any): void {
    var rowHeight = this.rowHeight;

    blockG.append("rect")
      .attr("fill", (d) => {
        return d.type.backgroundColor;
      })
      .attr("height", (d) => {
        return d.type.height ? +d.type.height : rowHeight;
      })
      .attr("width", (d) => {
        return this.xScale(new Date(d.ending_time)) - this.xScale(new Date(d.starting_time));
      })
      .attr("stroke-width", (d) => {
        return d.type.hasOwnProperty("strokeWidth") ? d.type.strokeWidth : 0;
      })
      .attr("stroke", (d) => {
        return d.type.hasOwnProperty("stroke") ? d.type.stroke : 0;
      })
      .attr("rx", (d) => {
        return d.type.hasOwnProperty("round") ? d.type.round : 0;
      })
      .attr("style", (d) => {
        var style: string = "";
        style += "stroke-opacity: " + (d.type.opacity / 2) + ";";
        style += "fill-opacity: " + d.type.opacity + ";";
        if (d.type.hasLabel) {
          style += "filter: url(#f1);";
        }
        return style;
      })
      .attr("y", (d) => {
        if (d.type.height < rowHeight) {
          return (rowHeight - d.type.height) / 2;
        }
      })
    ;
  }

  /**
   * Append SVG gradient definitions
   * @param baseG
   * @returns {any}
   */
  public static appendDefinitions(baseG: any): any {
    // Gradient Definitions
    var defFilter: any = baseG.append("defs").append("filter")
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
      })
    ;
    defFilter.append("feGaussianBlur")
      .attr({
        result: "blurOut",
        "in": "matrixOut",
        stdDeviation: 10
      })
    ;
    defFilter.append("feBlend")
      .attr({
        "in": "SourceGraphic",
        in2: "blurOut",
        mode: "normal"
      })
    ;

    return defFilter;
  }


  public drawLabels(blockG: any): void {
    var rowHeight = this.rowHeight;

    blockG.filter((d) => {
      return !!(d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true);
    }).append("text")
      .text(this.labeling)
      .attr("dx", (d) => {
        return d.type.hasOwnProperty("round") ? d.type.round + 3 : 3;
      })
      .attr("dy", () => {
        return rowHeight / 2;
      })
      .attr("style", (d) => {
        return "fill: " + d.type.foregroundColor + "; font-size: " + (d.type.hasOwnProperty("fontSize") ? d.type.fontSize : 12) + "px";
      })
      .attr("dominant-baseline", "central")
    ;
  }

  /**
   * Draw actual data onto the chart!
   */
  public draw(): void {
    // Timeline SVG timeline
    this.drawTimeline();

    // Update SVG properties
    this.chartSvg.attr("width", this.chartRange);
    this.chartSvg.attr("height", <number>this.height());

    // Timeline Grid
    this.drawGrid();

    // Save class reference
    var that = this;

    // Base G
    var baseG = this.chartSvg.append("g").attr("transform", "translate(0, 0)").attr("class", "node-chart");
    var g = baseG.selectAll("g").data(d3.values(this.aData));

    // Row Height
    var rowHeight: number = this.rowHeight;

    // Gradient Definitions
    TimelineChart.appendDefinitions(baseG);

    var gEnter = g.enter().append("g").attr("class", "chart-row").attr("transform", (d, i) => {
      return "translate(0, " + rowHeight * i + ")";
    }).attr("data-y", (d, i) => {
      return rowHeight * i;
    });

    var blockG = gEnter.selectAll("g").data((d: any, i: number) => {
        return d;
      }).enter()
        .append("g")
        .attr("transform", (d) => {
          return "translate(" + this.xScale(d.starting_time) + ", 0)";
        })
        .attr("class", "block")
        .attr("id", function (d, i) {
          var currentY: number = +d3.select(this.parentNode).attr("data-y");
          return d.type.id + "-" + currentY + "-" + i;
        })
        .attr("data-x", (d) => {
          return this.xScale(d.starting_time);
        })
        .on("mouseover", function (d: any, i: number) {
          that.onMouseOver(this, d, i);
        })
        .on("mouseout", function (d: any, i: number) {
          that.onMouseOut(this, d, i);
        })
        .on("click", function (d: any, i: number) {
          that.onClick(this, d, i);
        })
      ;

    // Draw all blocks
    this.drawBlocks(blockG);

    // Determine overlapping
    this.determineOverlaps(blockG);

    // Title Box [Optional]
    // Insert a title into svg element to allow A tag-liked description box.
    // Override to make custom title box.
    var titleDesc = blockG.filter((d) => {
      return !!(d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true);
    }).append("svg:title");
    this.titleOnHover(titleDesc, this);

    // Blocks Labeling
    this.drawLabels(blockG);
  }

  public clearAll(): void {
    this.chartSvg.selectAll("*").remove();
  }

  public clearNodes(): void {
    this.chartSvg.selectAll(".node-chart").remove();
  }

  public clearTimeline(): void {
    this.timelineSvg.selectAll("g").remove();
  }

  public clearGrid(): void {
    this.chartSvg.selectAll("g.grid").remove();
  }

  /**
   * Default data-binding on labels
   * @param d
   * @param i
   * @returns {any}
   */
  public labeling(d: any, i?: number): any {
    return d.place;
  }

  /**
   * Set domain for business hours to display in chart.
   * @param start
   * @param end
   */
  public setBusinessHours(start: Date, end: Date): void {
    this.chartStart = start;
    this.chartEnd = end;

    // Update x axis scaling
    this.updateXAxis();
  }

  /**
   * Short form / Alias for setting daily business hours
   * @param date
   */
  public setDate(date: string): void {
    var startTime: string = "00:00:00", endTime: string = "23:59:59";
    this.setBusinessHours(new Date(date + " " + startTime), new Date(date + " " + endTime));
  }

  /**
   * Get chart svg height.
   * If total # of rows don't make up the height of defined one, use the actual svg height,
   * otherwise use the defined one.
   * @returns {number}
   */
  public getChartSVGHeight(): number {
    var moduleHeight: number = +$("#" + this.moduleName).height();
    var svgHeight: number = +this.chartSvg.attr("height");
    return moduleHeight < svgHeight ? moduleHeight : svgHeight;
  }

  /**
   * Show tooltip of the current hovering object
   * Usage:
   *   instance.showTooltip(currentInstance).html(...) <- insert code
   * @returns {any}
   */
  public showTooltip(currentInstance: any): any {
    this.tooltip.transition().duration(300).attr("style", () => {
      var currentRow: any = d3.select(currentInstance).select(function () {
        return this.parentNode;
      }).node();

      var currentHeight: number = this.getChartSVGHeight();
      var currentY = +d3.select(currentRow).attr("data-y");
      var halfed: boolean = (currentY - $("." + TimelineChart.scrollableTimelineClass, "#" + this.moduleName).scrollTop()) > (currentHeight / 2);

      // Calculate relative position of tooltip box
      var toolTipDom = this.tooltip.node().getBoundingClientRect();
      var halfRowHeight: number = this.rowHeight / 2;
      var halfBarHeight: number = (+d3.select(currentInstance).select("rect").attr("height")) / 2;
      var offset: number = halfed ? halfRowHeight - halfBarHeight - toolTipDom.height : halfRowHeight + halfBarHeight;

      return "opacity: 1; left: " + d3.select(currentInstance).attr("data-x") + "px; top: " + (+d3.select(currentRow).attr("data-y") + offset) + "px";
    });
    return this.tooltipInner;
  }

  /**
   * Hiding tooltip
   * @returns {any}
   */
  public hideTooltip(): any {
    this.tooltip.attr("style", function () {
      return "opacity: 0;";
    });
    return this.tooltipInner;
  }
}