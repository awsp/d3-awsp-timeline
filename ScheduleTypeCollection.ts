class ScheduleTypeCollection<T> {
  protected list: Array<T> = [];

  public add(scheduleType: T): void {
    this.list.push(scheduleType);
  }

  public remove(index: number): void {
    if (this.list[index]) {
      delete this.list[index];
    }
  }

  public get(): Array<T> {
    return this.list;
  }
}