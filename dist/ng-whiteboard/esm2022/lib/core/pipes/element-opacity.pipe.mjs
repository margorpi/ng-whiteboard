import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class ElementOpacityPipe {
    /**
     * Calculate the effective opacity combining element, style, and layer opacity.
     */
    transform(element, layers) {
        if (element.isDeleting) {
            return 0.1;
        }
        let opacity = (element.opacity || 100) / 100;
        if (element.style?.opacity !== undefined) {
            opacity *= element.style.opacity;
        }
        if (element.layerId) {
            const layer = layers.find((l) => l.id === element.layerId);
            if (layer && layer.opacity !== undefined) {
                opacity *= layer.opacity;
            }
        }
        return opacity;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementOpacityPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: ElementOpacityPipe, isStandalone: true, name: "elementOpacity" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ElementOpacityPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'elementOpacity',
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC1vcGFjaXR5LnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy13aGl0ZWJvYXJkL3NyYy9saWIvY29yZS9waXBlcy9lbGVtZW50LW9wYWNpdHkucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFPcEQsTUFBTSxPQUFPLGtCQUFrQjtJQUM3Qjs7T0FFRztJQUNILFNBQVMsQ0FBQyxPQUEwQixFQUFFLE1BQXlCO1FBQzdELElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUVELElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFN0MsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6QyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDbkMsQ0FBQztRQUVELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNELElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ3pDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQzNCLENBQUM7UUFDSCxDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzt3R0F2QlUsa0JBQWtCO3NHQUFsQixrQkFBa0I7OzRGQUFsQixrQkFBa0I7a0JBSjlCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsVUFBVSxFQUFFLElBQUk7aUJBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBXaGl0ZWJvYXJkRWxlbWVudCwgV2hpdGVib2FyZExheWVyIH0gZnJvbSAnLi4vdHlwZXMnO1xyXG5cclxuQFBpcGUoe1xyXG4gIG5hbWU6ICdlbGVtZW50T3BhY2l0eScsXHJcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEVsZW1lbnRPcGFjaXR5UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZSB0aGUgZWZmZWN0aXZlIG9wYWNpdHkgY29tYmluaW5nIGVsZW1lbnQsIHN0eWxlLCBhbmQgbGF5ZXIgb3BhY2l0eS5cclxuICAgKi9cclxuICB0cmFuc2Zvcm0oZWxlbWVudDogV2hpdGVib2FyZEVsZW1lbnQsIGxheWVyczogV2hpdGVib2FyZExheWVyW10pOiBudW1iZXIge1xyXG4gICAgaWYgKGVsZW1lbnQuaXNEZWxldGluZykge1xyXG4gICAgICByZXR1cm4gMC4xO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcGFjaXR5ID0gKGVsZW1lbnQub3BhY2l0eSB8fCAxMDApIC8gMTAwO1xyXG5cclxuICAgIGlmIChlbGVtZW50LnN0eWxlPy5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgb3BhY2l0eSAqPSBlbGVtZW50LnN0eWxlLm9wYWNpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVsZW1lbnQubGF5ZXJJZCkge1xyXG4gICAgICBjb25zdCBsYXllciA9IGxheWVycy5maW5kKChsKSA9PiBsLmlkID09PSBlbGVtZW50LmxheWVySWQpO1xyXG4gICAgICBpZiAobGF5ZXIgJiYgbGF5ZXIub3BhY2l0eSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgb3BhY2l0eSAqPSBsYXllci5vcGFjaXR5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wYWNpdHk7XHJcbiAgfVxyXG59XHJcbiJdfQ==