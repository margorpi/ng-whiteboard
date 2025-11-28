import { Pipe } from '@angular/core';
import { getStrokePoints } from '../utils/drawing/stroke-points';
import { getSvgPathFromStroke } from '../utils/drawing/path';
import * as i0 from "@angular/core";
export class PointsToPathPipe {
    /**
     * Converts an array of points to an SVG path string.
     */
    transform(points, options) {
        if (!points || points.length === 0) {
            return '';
        }
        const stroke = getStrokePoints(points, options);
        return getSvgPathFromStroke(stroke);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PointsToPathPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: PointsToPathPipe, isStandalone: true, name: "pointsToPath" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PointsToPathPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pointsToPath',
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRzLXRvLXBhdGgucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLXdoaXRlYm9hcmQvc3JjL2xpYi9jb3JlL3BpcGVzL3BvaW50cy10by1wYXRoLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFcEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDOztBQU03RCxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCOztPQUVHO0lBQ0gsU0FBUyxDQUFDLE1BQThCLEVBQUUsT0FBdUI7UUFDL0QsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ25DLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFaEQsT0FBTyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxDQUFDO3dHQVpVLGdCQUFnQjtzR0FBaEIsZ0JBQWdCOzs0RkFBaEIsZ0JBQWdCO2tCQUo1QixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxjQUFjO29CQUNwQixVQUFVLEVBQUUsSUFBSTtpQkFDakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN0cm9rZU9wdGlvbnMgfSBmcm9tICcuLi91dGlscy9kcmF3aW5nJztcclxuaW1wb3J0IHsgZ2V0U3Ryb2tlUG9pbnRzIH0gZnJvbSAnLi4vdXRpbHMvZHJhd2luZy9zdHJva2UtcG9pbnRzJztcclxuaW1wb3J0IHsgZ2V0U3ZnUGF0aEZyb21TdHJva2UgfSBmcm9tICcuLi91dGlscy9kcmF3aW5nL3BhdGgnO1xyXG5cclxuQFBpcGUoe1xyXG4gIG5hbWU6ICdwb2ludHNUb1BhdGgnLFxyXG4gIHN0YW5kYWxvbmU6IHRydWUsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQb2ludHNUb1BhdGhQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgLyoqXHJcbiAgICogQ29udmVydHMgYW4gYXJyYXkgb2YgcG9pbnRzIHRvIGFuIFNWRyBwYXRoIHN0cmluZy5cclxuICAgKi9cclxuICB0cmFuc2Zvcm0ocG9pbnRzOiBudW1iZXJbXVtdIHwgdW5kZWZpbmVkLCBvcHRpb25zPzogU3Ryb2tlT3B0aW9ucyk6IHN0cmluZyB7XHJcbiAgICBpZiAoIXBvaW50cyB8fCBwb2ludHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdHJva2UgPSBnZXRTdHJva2VQb2ludHMocG9pbnRzLCBvcHRpb25zKTtcclxuXHJcbiAgICByZXR1cm4gZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKTtcclxuICB9XHJcbn1cclxuIl19