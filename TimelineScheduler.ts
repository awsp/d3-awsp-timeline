///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="TimelineChart.ts" />
///<reference path="TimelineGroup.ts" />
///<reference path="Dimension.ts" />

/**
 * Timeline Scheduler
 *
 * @author Anthony S. Wu <anthony@ssetp.com>
 */
class TimelineScheduler {
  protected aDimension: Dimension;
  public chart: TimelineChartInterface;
  public grouping: TimelineGroupInterface;
  protected aTarget: any;
  protected gParent: any;
  protected aData: any;
  protected targetStem: string;

  public scheduleModuleClass: string = "scheduler-module";
  public scheduleInnerClass: string = "scheduler-inner";

  public constructor(target: string, dimension: Dimension, data: any, chart: TimelineChartInterface, grouping: TimelineGroupInterface) {
    if (!target || !dimension || !chart || !grouping) {
      throw new Error("Unable to initialize class. ");
    }

    // Get target stem
    this.targetStem = this.getStem(target);

    // Chart & Groups
    this.chart = chart;
    this.grouping = grouping;

    // Data
    this.aData = data;

    // Timeline scheuler dimension settings
    this.aDimension = dimension;

    // Begin to initialize root frame
    this.initGParent(target);
  }

  /**
   * Get stem of the target name, dispatch its front property such as . or #
   * @param targetName
   * @returns {string}
   */
  public getStem(targetName: string): string {
    return targetName.replace("#", "").replace(".", "");
  }

  /**
   * Get dimension
   * @returns {Dimension}
   */
  public dimension(): Dimension {
    return this.aDimension;
  }

  /**
   * Return selected target.
   * @returns {any}
   */
  public target(): any {
    return this.aTarget;
  }

  public initGParent(target: string): void {
    this.aTarget = d3.select(target);
    this.aTarget.attr("class", this.scheduleModuleClass).attr("style", "width: " + this.dimension().width() + "px; height: " + this.dimension().height() + "px;");
    var aTargetInner: any = this.aTarget.append("div");
    aTargetInner.attr("class", this.scheduleInnerClass);

    // Draw them out!
    this.grouping.init(this.targetStem, aTargetInner);
    this.chart.init(this.targetStem, aTargetInner, this.grouping.dimension().width());


    return ;






    this.gParent.append("rect").attr("width", this.dimension().width()).attr("height", this.dimension().height())
      .attr("style", "fill: url(#bg); stroke: #ccc; stroke-width: 1")

    this.grouping.init(this.gParent, this.aData);
  }

  public render(): void {

  }

}