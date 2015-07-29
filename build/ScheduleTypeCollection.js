var ScheduleTypeCollection = (function () {
    function ScheduleTypeCollection() {
        this.list = [];
    }
    ScheduleTypeCollection.prototype.add = function (scheduleType) {
        this.list.push(scheduleType);
    };
    ScheduleTypeCollection.prototype.remove = function (index) {
        if (this.list[index]) {
            delete this.list[index];
        }
    };
    ScheduleTypeCollection.prototype.get = function () {
        return this.list;
    };
    return ScheduleTypeCollection;
})();
