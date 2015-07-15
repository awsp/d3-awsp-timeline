///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineGroup.ts" />

interface TimelineChartInterface {
  init(moduleName: string, gParent: any, data: any, width: d3.Primitive): void;
  setRowHeight(height: number): void;
  drawData(): void;
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
  public static scrollableTimelineClass: string = "timeline-asdf";

  // Timeline Div Height
  public static timelineHeight: number = 21;


  public constructor(dimension: Dimension) {
    if (!dimension) {
      throw new Error("Dimension is not set. ");
    }
    this.aDimension = dimension;
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

  public init(moduleName: string, gParent: any, data: any, marginLeft: number): void {
    this.gParent = gParent;
    this.moduleName = moduleName;
    this.aData = data; 
    var theoreticalWidth: number = 2400; // TODO: temp value for width: 2400
    var theoreticalHeight: number = this.aHeight = Object.keys(data).length * this.rowHeight;

    // `chart-module` DOM
    var chartModuleDom = this.gParent.append("div");
    chartModuleDom.attr("id", this.moduleName + "-chart").attr("class", "chart-module");
    chartModuleDom.attr("style", "width: " + this.dimension().width() + "; height: " + this.dimension().height() + "; margin-left: " + marginLeft + "px;");

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
    var start = new Date("2015-07-14 00:00:00").getTime();
    var end = new Date("2015-07-14 23:59:59").getTime();
    var xScale = d3.time.scale().domain([start, end]).range([0, theoreticalWidth]);
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("top")
      .ticks(d3.time.minutes, 30)
      .tickSize(6)
      .tickFormat(d3.time.format("%I:%M"));
    timelineSvg.append("g").attr("class", "axis").attr("transform", "translate(0, " + (TimelineChart.timelineHeight - 1) + ")").call(xAxis);

    // Timeline Scrollable Div
    var chartScrollableDom = chartInnerDom.append("div");
    var remainingWidth: number = <number>this.dimension().height() - TimelineChart.timelineHeight;
    chartScrollableDom.attr("class", TimelineChart.scrollableTimelineClass);
    chartScrollableDom.attr("style", "width: " + this.dimension().width() + "; height: " + remainingWidth + "px");

    // Timeline Chart SVG
    var chartSvg = chartScrollableDom.append("svg");
    chartSvg.attr("width", theoreticalWidth).attr("height", theoreticalHeight);

    // Timeline Chart Grid
    var ticks = 48;
    var xGridScale = d3.scale.linear().domain([0, theoreticalWidth]).range([0, theoreticalWidth]);
    var xGrid = d3.svg.axis().scale(xGridScale).orient("bottom").ticks(ticks).tickFormat("").tickSize(-theoreticalWidth, 0);
    chartSvg.append("g").attr("class", "grid").attr("transform", "translate(0," + theoreticalWidth + ")").call(xGrid);

    this.chartModuleDom = chartModuleDom;
    this.chartSvg = chartSvg;
  }

  public drawData(): void {
    var chartG = this.chartSvg.append("g");
    chartG.selectAll("rect")
      .data(d3.values(this.aData)).enter().append("rect")
      .attr("width", 200)
      .attr("height", 31)
      .attr("y", (d, i) => {
        return i * 30;
      })
    ;
  }
}