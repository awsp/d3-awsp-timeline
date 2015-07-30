var ScheduleType = (function () {
    function ScheduleType(id, options) {
        this.markOverlap = false;
        this.height = 24;
        this.hasLabel = false;
        this.opacity = 0.9;
        this.backgroundColor = "#ccffcc";
        this.foregroundColor = "#447744";
        this.zIndex = 0;
        this.round = 0;
        this.stroke = "";
        this.strokeWidth = 0;
        this.fontSize = 11;
        this.overlapClass = "overlapping";
        this.allowedBatch = [
            "backgroundColor",
            "foregroundColor",
            "stroke",
            "strokeWidth",
            "fontSize",
            "round",
            "zIndex",
            "opacity",
            "height",
            "markOverlap",
            "hasLabel",
            "name",
            "overlapClass"
        ];
        this.setId(id);
        if (options) {
            this.setOptions(options);
        }
    }
    ScheduleType.prototype.setOptions = function (options) {
        if (options) {
            for (var key in options) {
                var value = options[key];
                if (this.hasOwnProperty(key) && this.allowedBatch.indexOf(key) >= 0) {
                    this[key] = value;
                }
            }
        }
        return this;
    };
    ScheduleType.prototype.setId = function (id) {
        this.id = id;
        return this;
    };
    ScheduleType.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    ScheduleType.prototype.enableOverlapping = function () {
        this.markOverlap = true;
        return this;
    };
    ScheduleType.prototype.disableOverlapping = function () {
        this.markOverlap = false;
        return this;
    };
    ScheduleType.prototype.enableLabeling = function () {
        this.hasLabel = true;
        return this;
    };
    ScheduleType.prototype.disableLabeling = function () {
        this.hasLabel = false;
        return this;
    };
    return ScheduleType;
})();
