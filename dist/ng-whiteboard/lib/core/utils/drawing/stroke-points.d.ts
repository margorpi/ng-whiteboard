import type { StrokeOptions } from './stroke-types';
/**
 * Processes raw input points into optimized stroke points for rendering.
 * Applies streamlining, pressure simulation, and point filtering.
 */
export declare function getStrokePoints(rawInputPoints: number[][], options?: StrokeOptions): number[][];
