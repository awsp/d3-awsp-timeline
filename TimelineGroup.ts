///<reference path="Dimension.ts" />

interface TimelineGroupInterface {
  init(gParent: any, data: any): void;
}

/**
 * Represent scheduler group part
 */
class TimelineGroup implements  TimelineGroupInterface {
  protected aOrigin: any;
  protected aDimension: Dimension;
  protected aData: any;

  public constructor(dimension: Dimension) {
    if (!dimension) {
      throw new Error("Dimension is not set. ");
    }
    this.aDimension = dimension;
  }

  public dimension(): Dimension {
    return this.aDimension;
  }

  public origin(o: any): any {
    if (o) {
      this.aOrigin = o;
    }
    return this.aOrigin;
  }

  public cleanup(): void {
    this.aOrigin.selectAll("rect").remove();
  }

  public draw(): void {
    if (!this.aData) {
      throw new Error("No data is provided. ");
    }

    this.cleanup();

    var width: number = <number>this.aDimension.width();

    this.aOrigin.selectAll("g").data(this.aData).enter().append("text")
      .attr("transform", function (d, i) {
        return "translate(0, " + (i + 1) * 25 + ")";
      })
      .attr("width", width)
      .attr("height", 30)
      .text(function (d) {
        return d.therapist;
      })
    ;
  }

  public init(gParent: any, data: any): void {
    this.aData = data;
    this.aOrigin = gParent.append("g");

    this.draw();
  }
}