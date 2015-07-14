///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineGroup.ts" />

interface TimelineChartInterface {
  init(moduleName: string, gParent: any, data: any, width: d3.Primitive): void;
  setRowHeight(height: number): void;
}


/**
 * Represent chart part of scheduler
 */
class TimelineChart implements  TimelineChartInterface {
  // TimelineChart Dimension, contains width() and height()
  protected aDimension: Dimension;

  // Parent SVG
  protected gParent: any;

  // Module Stem Name, without . or #
  protected moduleName: string;    // Stem of target

  // Root DOM
  public chartModuleDom: any = null;

  // Chart SVG, pointer to the actual SVG element.
  public svgInstance: any = null;

  // Storing Row Height, injectable from method.
  protected rowHeight: number = 21;

  // Storing Current Height
  protected aHeight: number;

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
    var theoreticalWidth: number = 2000; // TODO: temp value for width: 2000
    var theoreticalHeight: number = this.aHeight = data.length * this.rowHeight;

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

    // Timeline Scrollable Div
    var chartScrollableDom = chartInnerDom.append("div");
    var remainingWidth: number = <number>this.dimension().height() - TimelineChart.timelineHeight;
    chartScrollableDom.attr("class", TimelineChart.scrollableTimelineClass);
    chartScrollableDom.attr("style", "width: " + this.dimension().width() + "; height: " + remainingWidth + "px");

    // Timeline SVG
    var svgInstance = chartScrollableDom.append("svg");
    svgInstance = svgInstance.attr("width", theoreticalWidth).attr("height", theoreticalHeight);

    this.chartModuleDom = chartModuleDom;
    this.svgInstance = svgInstance;
  }
}