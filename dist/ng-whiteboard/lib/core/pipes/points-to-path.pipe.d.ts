import { PipeTransform } from '@angular/core';
import { StrokeOptions } from '../utils/drawing';
import * as i0 from "@angular/core";
export declare class PointsToPathPipe implements PipeTransform {
    /**
     * Converts an array of points to an SVG path string.
     */
    transform(points: number[][] | undefined, options?: StrokeOptions): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<PointsToPathPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<PointsToPathPipe, "pointsToPath", true>;
}
