///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineChart.ts" />

interface TimelineGroupInterface {
  init(moduleName: string, gParent: any, data: any): void;
  drawData(data?: any): void;
  dimension(): Dimension;
  height(): d3.Primitive;
  setRowHeight(height: number): void;
  getRowHeight(): number;
}

/**
 * Represent scheduler group part
 */
class TimelineGroup implements TimelineGroupInterface {
  protected aDimension: Dimension; // Group's dimension
  protected gParent: any;          // The root element
  protected moduleName: string;    // Stem of target
  protected aData: any;            // Data
  public domInstance: any = null;  // DOM root element
  public svgInstance: any = null;  // SVG root element
  protected rowHeight: number = 21;
  public static leftPadding: number = 5;
  protected aHeight: number = 0;      // Overall height


  public constructor(dimension: Dimension) {
    if (!dimension) {
      throw new Error("Dimension is not set. ");
    }
    this.aDimension = dimension;
  }

  public dimension(): Dimension {
    return this.aDimension;
  }

  public height(): d3.Primitive {
    var defaultHeight: d3.Primitive = +this.dimension().height();
    return this.aHeight > defaultHeight ? this.aHeight : defaultHeight;
  }

  public setRowHeight(height: number): void {
    this.rowHeight = height;
  }

  public getRowHeight(): number {
    return this.rowHeight;
  }

  public init(moduleName: string, gParent: any, data: any): void {
    this.gParent = gParent;
    this.moduleName = moduleName;
    this.aData = data;
    var theoreticalHeight: d3.Primitive = this.aHeight = Object.keys(data).length * this.rowHeight;

    // Create a HTML element with attributes like width and height
    var domInstance = this.gParent.append("div");
    domInstance.attr("id", this.moduleName + "-grouping").attr("class", "list-module");
    domInstance.attr("style", "width: " + this.dimension().width() + "px; " +
      "height: " + (<number>this.dimension().height() - TimelineChart.timelineHeight) + "px; " +
      "margin-top: " + TimelineChart.timelineHeight + "px;");

    // Create SVG element inside this DOM.
    // TODO: height is using pre-defined number.
    var svgInstance = domInstance.append("svg");
    svgInstance.attr("width", this.dimension().width()).attr("height", theoreticalHeight);

    // Assignment
    this.domInstance = domInstance;
    this.svgInstance = svgInstance;
  }

  public drawData(data?: any) {
    // Allow data to override original value.
    if (!data) {
      data = this.aData;
    }

    var svg = this.svgInstance;
    var baseG = svg.append("g").attr("transform", "translate(0, 0)");
    var rowHeight = this.rowHeight;

    var g = baseG.selectAll("g").data(d3.values(data));
    var gEnter = g.enter().append("g").attr("transform", (d: any, i: number) => {
      return "translate(0, " + rowHeight * i + ")";
    });

    gEnter.append("rect")
      .attr("height", rowHeight).attr("width", this.dimension().width())
      .attr("class", (d: any, i: number) => {
        return i % 2 === 0 ? "even" : "odd";
      })
    ;
    gEnter.append("text")
      .text((d: any) => {
        return d[0].worker;
      })
      .attr("dominant-baseline", "central")
      .attr("x", (d: any, i: number) => {
        return 5;
      })
      .attr("dy", (d: any, i: number) => {
        return rowHeight / 2;
      })
      .attr("text-anchor", "start")
    ;
  }
}