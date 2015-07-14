///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="Dimension.ts" />

interface TimelineChartInterface {
  init(moduleName: string, gParent: any, data: any, width: d3.Primitive): void;
  setRowHeight(height: number): void;
}


/**
 * Represent chart part of scheduler
 */
class TimelineChart implements  TimelineChartInterface {
  protected aDimension: Dimension; // Group's dimension
  protected gParent: any;          // The root element
  protected moduleName: string;    // Stem of target
  public domInstance: any = null;  // DOM root element
  public svgInstance: any = null;  // SVG root element

  protected rowHeight: number = 21;
  protected aHeight: number;
  public svgHeight: number; // SVG height, should depend on data source, or dimension provided
  public svgWidth: number; // SVG width

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
    var theoreticalWidth: number = 2000;
    var theoreticalHeight: d3.Primitive = this.aHeight = data.length * this.rowHeight;

    var domInstance = this.gParent.append("div");
    domInstance.attr("id", this.moduleName + "-chart").attr("class", "chart-module");
    domInstance.attr("style", "width: " + this.dimension().width() + "; height: " + this.height() + "; margin-left: " + marginLeft + "px;");

    var domInnerInstance = domInstance.append("div");
    domInnerInstance.attr("class", "chart-inner").attr("style", "width: " + theoreticalWidth + "px;");

    // TODO: temp value for width: 2000
    var svgInstance = domInnerInstance.append("svg");
    svgInstance = svgInstance.attr("width", theoreticalWidth).attr("height", this.height());

    this.domInstance = domInstance;
    this.svgInstance = svgInstance;
  }
}