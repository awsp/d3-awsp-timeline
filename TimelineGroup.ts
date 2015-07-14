///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="Dimension.ts" />
///<reference path="TimelineChart.ts" />

interface TimelineGroupInterface {
  init(moduleName: string, gParent: any, data: any): void;
  drawData(data?: any): void;
  dimension(): Dimension;
  height(): d3.Primitive;
  setRowHeight(height: number): void;
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

  public init(moduleName: string, gParent: any, data: any): void {
    this.gParent = gParent;
    this.moduleName = moduleName;
    this.aData = data;
    var theoreticalHeight: d3.Primitive = this.aHeight = data.length * this.rowHeight;

    // Create a HTML element with attributes like width and height
    var domInstance = this.gParent.append("div");
    domInstance.attr("id", this.moduleName + "-grouping").attr("class", "list-module");
    domInstance.attr("style", "width: " + this.dimension().width() + "px; height: " + this.dimension().height() + "px; margin-top: " + TimelineChart.timelineHeight + "px;");

    // Create SVG element inside this DOM.
    // TODO: height is using pre-defined number.
    var svgInstance = domInstance.append("svg");
    svgInstance.attr("width", this.dimension().width()).attr("height", theoreticalHeight);

    // Assignment
    this.domInstance = domInstance;
    this.svgInstance = svgInstance;
  }

  public drawData(data: any) {
    if (!data) {
      data = this.aData;
    }

    var svg = this.svgInstance;
    var baseG = svg.append("g");
    var rowHeight = this.rowHeight;

    baseG.selectAll("rect").data(data).enter()
      .append("text")
      .text(function (d) {
        return d.therapist;
      })
      .attr("y", function (d, i) {
        return rowHeight * i;
      })
      .attr("x", TimelineGroup.leftPadding)
    ;
  }
}