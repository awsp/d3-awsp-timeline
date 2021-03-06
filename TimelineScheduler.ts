///<reference path="DefinitelyTyped/d3/d3.d.ts" />
///<reference path="DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="DefinitelyTyped/moment/moment.d.ts" />
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
  protected targetName: string;
  protected targetStem: string;
  public aTargetInner: any;

  public static scheduleModuleClass: string = "scheduler-module";
  public static scheduleInnerClass: string = "scheduler-inner";
  public static listModuleClass: string = "list-module";
  public static chartTimelineClass: string = "chart-timeline";
  public static currentDateModuleClass: string = "chart-date";

  public constructor(target: string, dimension: Dimension, data: any, chart: TimelineChartInterface, grouping: TimelineGroupInterface) {
    if (!target || !dimension || !chart || !grouping) {
      throw new Error("Unable to initialize class. ");
    }

    this.targetName = target;

    // Get target stem
    this.targetStem = TimelineScheduler.getStem(target);

    // Chart & Groups
    this.chart = chart;
    this.grouping = grouping;

    // Timeline scheduler dimension settings
    this.aDimension = dimension;

    // Begin to initialize root frame
    var innerRoot = this.aTargetInner = this.initGParent(target);

    // Data
    this.initData(data, innerRoot);
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

  /**
   * Convert data based on a groupBy key.
   * @param data
   * @param groupBy
   * @param order
   * @returns {Dictionary<T[]>|Dictionary<TValue[]>|_.Dictionary<T[]>}
   */
  public static processData(data: any, groupBy: string, order: string = "asc"): any {
    var groupedData: any = _.groupBy(data, groupBy), sortedPersons: any, persons: any;

    for (var i in groupedData) {
      persons = groupedData[i];
      // Sort in ascending order.
      // zIndex at 2 is on top of 1, on top of 0, etc.
      sortedPersons = _.sortBy(persons, function (d: any) {
        if (order === "asc") {
          return d.type.zIndex;
        }
        return -d.type.zIndex;
      });

      groupedData[i] = sortedPersons;
    }

    return groupedData;
  }

  /**
   * Initialize G parent.
   * @param target
   */
  public initGParent(target: string): void {
    this.aTarget = d3.select(target);
    this.aTarget.attr("class", TimelineScheduler.scheduleModuleClass)
      .attr("style", "width: " + this.dimension().width() + (+this.dimension().width() >= 0 ? "px" : "") + "; " +
      "height: " + this.dimension().height() + (+this.dimension().height() >= 0 ? "px" : "")  + ";");
    var aTargetInner: any = this.aTarget.append("div");
    aTargetInner.attr("class", TimelineScheduler.scheduleInnerClass);

    return aTargetInner;
  }

  public initData(data: any, aTargetInner?: any): void {
    this.aData = data;
    if (!aTargetInner) {
      aTargetInner = this.aTargetInner;
    }

    // Draw them out!
    this.grouping.init(this.targetStem, aTargetInner, this.aData);
    this.chart.init(this.targetStem, aTargetInner, this.aData, this.grouping.dimension().width());

    // Scrolling
    $("." + TimelineChart.scrollableTimelineClass, this.targetName).on("scroll", function () {
      $("." + TimelineScheduler.listModuleClass, this.targetName).scrollTop($(this).scrollTop());
      $("." + TimelineScheduler.chartTimelineClass, this.targetName).scrollLeft($(this).scrollLeft());
    });
  }

  /**
   * Shortcut to set data for both grouping and chart.
   * @param data
   */
  public setData(data: any): void {
    this.chart.setData(data);
    this.grouping.setData(data);
  }

  /**
   * Clear method
   */
  public clear(): void {
    this.chart.clearNodes();
    this.chart.clearTimeline();
    this.chart.clearGrid();
    this.chart.clearDateModule();
    this.grouping.clearNodes();
  }

  /**
   * Main render method
   */
  public render(): void {
    this.grouping.drawData();
    this.chart.draw();
  }

  /**
   * Render method
   * Same as render, but does a little bit, clear chart first then render
   */
  public reRender(): void {
    this.clear();
    this.render();
  }

  /**
   * Soft render method
   * Differ to render / reRender method which wipe the whole thing out,
   * instead update the changed portion only.
   *
   * - Allow less resource to redraw changes
   * - Allow animation aid
   *
   * TODO: not implemented.
   */
  public softRender(): void {
    // Find out changes
    // Pick by its identifier(id)
    // Move it to the correct position
    // Update its g data-x, data-y
    // Update its identifier(id)
  }
}