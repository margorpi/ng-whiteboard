import { Point, WhiteboardConfig } from '../../types';
/** Coordinate transformation utilities for screen ↔ canvas conversion with zoom, pan, and grid snapping. */
/** Converts screen coordinates to canvas coordinates accounting for zoom and pan. */
export declare function getCanvasCoordinates(config: WhiteboardConfig, point: Point): Point;
/** Snaps a point to the closest 45-degree angle relative to an origin point. */
export declare function snapToAngle(x1: number, y1: number, x2: number, y2: number): {
    x: number;
    y: number;
    a: number;
};
/** Snaps a single numeric value to the nearest grid point. */
export declare function snapToGrid(n: number, gridSize: number): number;
/** Snaps a 2D point to the nearest grid intersection. */
export declare function snapPointToGrid(point: Point, gridSize: number): Point;
