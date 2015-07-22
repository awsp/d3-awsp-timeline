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
  clearNodes(): void;
  setData(data: any): void;
}

/**
 * Represent scheduler group part
 */
class TimelineGroup implements TimelineGroupInterface {
  // Group's dimension
  protected aDimension: Dimension;

  // The root element
  protected gParent: any;

  // Stem name of target
  protected moduleName: string;

  // Data sample
  protected aData: any;

  // DOM root element
  public domInstance: any = null;

  // SVG root element
  public svgInstance: any = null;

  // Row's height, default to 21
  protected rowHeight: number = 21;

  // Left padding of text
  public static leftPadding: number = 5;

  // Overall height
  protected aHeight: number = 0;

  // Text width, used to calcalate truncate position
  public textFactorBase: number = 9;

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

  /**
   * Initialize the base dom and svg elements.
   * @param moduleName
   * @param gParent
   * @param data
   */
  public init(moduleName: string, gParent: any, data: any): void {
    this.gParent = gParent;
    this.moduleName = moduleName;
    this.aData = data;
    var theoreticalHeight: d3.Primitive = this.aHeight = Object.keys(data).length * this.rowHeight;

    // Create a HTML element with attributes like width and height
    var domInstance = this.gParent.append("div");
    domInstance.attr("id", this.moduleName + "-grouping").attr("class", "list-module");
    domInstance.attr("style", "width: " + this.dimension().width() + (+this.dimension().width() >= 0 ? "px" : "") + "; " +
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

  /**
   * Draw the data out based on given data.
   * @param data
   */
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
        var factor: number = this.getTextFactor(d[0].worker);
        if (d[0].worker.length > factor) {
          return d[0].worker.substring(0, factor) + "...";
        }
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

  /**
   * Get factor of a text string
   * @param text
   * @returns {number}
   */
  public getTextFactor(text: string): number {
    var factor: number;
    factor = <number>this.dimension().width() / this.textFactorBase;
    if (TimelineGroup.containsNonLatinCodepoints(text)) {
      factor /= 2;
    }

    return factor;
  }

  public clearNodes(): void {
    this.svgInstance.selectAll("g").remove();
  }

  public setData(data: any): void {
    this.aData = data;
  }

  /**
   * Test if a string contains non-latin characters
   * Reference:
   *   http://stackoverflow.com/questions/147824/how-to-find-whether-a-particular-string-has-unicode-characters-esp-double-byte
   * @param text
   * @returns {boolean}
   */
  public static containsNonLatinCodepoints(text: string): boolean {
    return /[^\u0000-\u00ff]/.test(text);
  }
}