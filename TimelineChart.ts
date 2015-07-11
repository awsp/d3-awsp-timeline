///<reference path="Dimension.ts" />

interface TimelineChartInterface {
  init(moduleName: string, gParent: any): void;
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

  public height(): number {
    // Check data source and calculate height
    // If greater than provided height, use calculated height instead.
    return this.dimension().height();
  }

  public width(): number {
    return this.dimension().width();
  }

  public init(moduleName: string, gParent: any, marginLeft: number): void {
    this.gParent = gParent;
    this.moduleName = moduleName;
    var theoreticalWidth: number = 2000;

    var domInstance = this.gParent.append("div");
    domInstance.attr("id", this.moduleName + "-grouping").attr("class", "chart-module");
    domInstance.attr("style", "width: " + this.dimension().width() + "; height: " + this.dimension().height() + "; margin-left: " + marginLeft + "px;");

    var domInnerInstance = domInstance.append("div");
    domInnerInstance.attr("class", "chart-inner").attr("style", "width: " + theoreticalWidth + "px;");

    // TODO: temp value for width: 2000
    var svgInstance = domInnerInstance.append("svg");
    svgInstance = svgInstance.attr("width", theoreticalWidth).attr("height", this.dimension().height());

    // Background
    var gradientDef = svgInstance.append("defs").append("linearGradient")
        .attr("id", "bg").attr("x1", "0%").attr("x2", "0%")
        .attr("y1", "0%").attr("y2", "100%")
        .attr("gradientTransform", "rotate(10)").attr("spreadMethod", "pad");

    svgInstance.append("rect").attr("width", theoreticalWidth).attr("height", this.height()).attr("style", "fill: url(#bg); ")

    gradientDef.append("stop").attr("offset", "0%").attr("stop-color", "#f5f3f5").attr("stop-opacity", 1);
    gradientDef.append("stop").attr("offset", "100%").attr("stop-color", "#cfcfcf").attr("stop-opacity", 1);

    this.domInstance = domInstance;
    this.svgInstance = svgInstance;
  }
}