///<reference path="DefinitelyTyped/d3/d3.d.ts" />
var TwoDimensionalShape = (function () {
    function TwoDimensionalShape(width, height) {
        this.aHeight = height;
        this.aWidth = width;
    }
    /**
     * Getter / Setter of `width`
     * @param w
     * @returns {d3.Primitive}
     */
    TwoDimensionalShape.prototype.width = function (w) {
        // TODO: this part is not called.
        if (w) {
            if (+w > 0) {
                this.aWidth = w;
            }
            else if (w.toString().match(/\%/).length >= 0) {
            }
            else {
                throw new Error("Width must be a number and greater than 0. ");
            }
        }
        return this.aWidth;
    };
    /**
     * Getter / Setter of `height`
     * @param h
     * @returns {d3.Primitive}
     */
    TwoDimensionalShape.prototype.height = function (h) {
        if (h) {
            if (+h > 0) {
                this.aHeight = h;
            }
            else {
                throw new Error("Height must be a number and greater than 0. ");
            }
        }
        return this.aHeight;
    };
    return TwoDimensionalShape;
})();
