///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineGroup.ts" />

interface TimelineChartInterface {
  init(moduleName: string, gParent: any, data: any, width: d3.Primitive): void;
  setRowHeight(height: number): void;
  drawData(): void;
  labeling(d: any, i?: number): any;
  setDate(date: string): void;
  setBusinessHours(start: Date, end: Date): void;
  onMouseOver(svg: any, data: any, i: number): void;
  onMouseOut(svg: any, data: any, i: number): void;
  titleOnHover(svg: any): void;
  clearAll(): void;
  clearNodes(): void;
  setData(data: any): void;
  updateXAxis(): any;
  drawTimeline(): void;
  clearTimeline(): void;
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
  public axisFormat: string = "%I:%M";

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
    var defaultHeight: d3.Primitive = +this.dimension().height();
    return this.aHeight > defaultHeight ? this.aHeight : defaultHeight;
  }

  public width(): d3.Primitive {
    return this.dimension().width();
  }

  public setData(data: any): void {
    this.aData = data;
  }

  public drawTimeline(): void {
    var xScale = this.xScale = this.updateXAxis();
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("top")
      .ticks(d3.time.minutes, 30)
      .tickSize(6)
      .tickFormat(d3.time.format(this.axisFormat));
    this.timelineSvg.append("g").attr("class", "axis").attr("transform", "translate(0, " + (TimelineChart.timelineHeight - 1) + ")").call(xAxis);
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
    var theoreticalHeight: number = this.aHeight = Object.keys(data).length * this.rowHeight;

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
    var timelineSvg = this.timelineSvg = chartTimelineDom.append("svg");
    timelineSvg.attr("width", theoreticalWidth).attr("height", TimelineChart.timelineHeight);

    // Timeline Scrollable Div
    var chartScrollableDom = chartInnerDom.append("div");
    var remainingWidth: number = <number>this.dimension().height() - TimelineChart.timelineHeight;
    chartScrollableDom.attr("class", TimelineChart.scrollableTimelineClass);
    chartScrollableDom.attr("style", "height: " + remainingWidth + "px");

    // Timeline Chart SVG
    var chartSvg = chartScrollableDom.append("svg");
    chartSvg.attr("width", theoreticalWidth).attr("height", theoreticalHeight);

    // Timeline Chart Grid
    var ticks: number = 24 * 2;
    var xGridScale = d3.scale.linear().domain([0, theoreticalWidth]).range([0, theoreticalWidth]);
    var xGrid = d3.svg.axis().scale(xGridScale).orient("bottom").ticks(ticks).tickFormat("").tickSize(-theoreticalWidth, 0);
    chartSvg.append("g").attr("class", "grid").attr("transform", "translate(0," + theoreticalWidth + ")").call(xGrid);

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
    this.xScale = d3.time.scale().domain([start, end]).range([0, this.chartRange]);
    return this.xScale;
  }

  public onMouseOver(svg: any, data: any, i: number): void {}
  public onMouseOut(svg: any, data: any, i: number): void {}
  public titleOnHover(svg: any): void {}

  /**
   * Draw actual data onto the chart!
   */
  public drawData(): void {
    // Timeline SVG timeline
    this.drawTimeline();

    var that = this;
    var baseG = this.chartSvg.append("g").attr("transform", "translate(0, 0)").attr("class", "node-chart");
    var g = baseG.selectAll("g").data(d3.values(this.aData));
    var rowHeight: number = this.rowHeight;

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


    var gEnter = g.enter().append("g").attr("class", "chart-row").attr("transform", (d, i) => {
      return "translate(0, " + rowHeight * i + ")";
    });

    var blockG = gEnter.selectAll("g").data((d: any, i: number) => {
      return d;
    }).enter()
      .append("g")
      .attr("transform", (d) => {
        return "translate(" + this.xScale(d.starting_time) +  ", 0)";
      })
      .attr("class", "block")
      .on("mouseover", function (d: any, i: number) {
        that.onMouseOver(this, d, i);
      })
      .on("mouseout", function (d: any, i: number) {
        that.onMouseOut(this, d, i);
      })
    ;

    blockG.append("rect")
      .attr("fill", (d) => {
        return d.type.backgroundColor;
      })
      .attr("height", (d) => {
        return d.type.height;
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

    var titleDesc = blockG.filter((d) => {
      return !!(d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true);
    }).append("svg:title");

    this.titleOnHover(titleDesc);

    blockG.filter((d) => {
      return !!(d.type.hasOwnProperty("hasLabel") && d.type.hasLabel === true);
    }).append("text")
      .text(that.labeling)
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

  public clearAll(): void {
    this.chartSvg.selectAll("*").remove();
  }

  public clearNodes(): void {
    this.chartSvg.selectAll(".node-chart").remove();
  }

  public clearTimeline(): void {
    this.timelineSvg.selectAll("g").remove();
  }

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
}