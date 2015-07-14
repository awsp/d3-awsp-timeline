///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/jquery/jquery.d.ts" />
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
  protected aData: any;
  protected targetStem: string;

  public static scheduleModuleClass: string = "scheduler-module";
  public static scheduleInnerClass: string = "scheduler-inner";

  public constructor(target: string, dimension: Dimension, data: any, chart: TimelineChartInterface, grouping: TimelineGroupInterface) {
    if (!target || !dimension || !chart || !grouping) {
      throw new Error("Unable to initialize class. ");
    }

    // Get target stem
    this.targetStem = TimelineScheduler.getStem(target);

    // Chart & Groups
    this.chart = chart;
    this.grouping = grouping;

    // Data
    this.aData = data;

    // Timeline scheduler dimension settings
    this.aDimension = dimension;

    // Begin to initialize root frame
    this.initGParent(target);
  }

  /**
   * Get stem of the target name, dispatch its front property such as . or #
   * @param targetName
   * @returns {string}
   */
  public static getStem(targetName: string): string {
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
    this.aTarget.attr("class", TimelineScheduler.scheduleModuleClass).attr("style", "width: " + this.dimension().width() + "px; height: " + this.dimension().height() + "px;");
    var aTargetInner: any = this.aTarget.append("div");
    aTargetInner.attr("class", TimelineScheduler.scheduleInnerClass);

    // Draw them out!
    this.grouping.init(this.targetStem, aTargetInner, this.aData);
    this.chart.init(this.targetStem, aTargetInner, this.aData, this.grouping.dimension().width());

    $("#" + this.targetStem + "-grouping").on("scroll", function () {
      $("#" + this.targetStem + "-chart").scrollTop($(this).scrollTop());
    })
  }

  public render(): void {
    this.grouping.drawData();
  }

}