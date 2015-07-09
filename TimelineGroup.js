///<reference path="Dimension.ts" />
/**
 * Represent scheduler group part
 */
var TimelineGroup = (function () {
    function TimelineGroup(dimension) {
        if (!dimension) {
            throw new Error("Dimension is not set. ");
        }
        this.aDimension = dimension;
    }
    TimelineGroup.prototype.dimension = function () {
        return this.aDimension;
    };
    TimelineGroup.prototype.origin = function (o) {
        if (o) {
            this.aOrigin = o;
        }
        return this.aOrigin;
    };
    TimelineGroup.prototype.cleanup = function () {
        this.aOrigin.selectAll("rect").remove();
    };
    TimelineGroup.prototype.draw = function () {
        if (!this.aData) {
            throw new Error("No data is provided. ");
        }
        this.cleanup();
        var width = this.aDimension.width();
        this.aOrigin.selectAll("g").data(this.aData).enter().append("text").attr("transform", function (d, i) {
            return "translate(0, " + (i + 1) * 25 + ")";
        }).attr("width", width).attr("height", 30).text(function (d) {
            return d.therapist;
        });
    };
    TimelineGroup.prototype.init = function (gParent, data) {
        this.aData = data;
        this.aOrigin = gParent.append("g");
        this.draw();
    };
    return TimelineGroup;
})();
//# sourceMappingURL=TimelineGroup.js.map