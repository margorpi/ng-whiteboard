import { Point, Direction } from '../../types';
/** Geometric computation utilities for angle calculations, line operations, collision detection, and vector math. */
/** Epsilon value for floating-point comparisons. */
export declare const EPSILON = 0.000001;
/** Calculates the angle in degrees between a center point and a target point. */
export declare function calculateAngle(center: Point, point: Point): number;
/** Normalizes an angle to the range [0, 360) degrees. */
export declare function normalizeAngle(angle: number): number;
/** Returns a constrained movement offset (horizontal or vertical only). */
export declare function getSnappedOffset(dx: number, dy: number): Point;
/** Calculates the shortest distance from a point to a line segment. */
export declare function pointToLineDistance(px: number, py: number, lineStart: Point, lineEnd: Point): number;
/** Tests whether two line segments intersect. */
export declare function lineSegmentsIntersect(p1: Point, p2: Point, q1: Point, q2: Point, threshold?: number): boolean;
/** Tests if an element's bounding box intersects with a selection box. */
export declare function isElementInSelectionBox(bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}, selectionBox: {
    x: number;
    y: number;
    width: number;
    height: number;
}): boolean;
/** Calculates the rotated direction based on rotation angle. */
export declare function getRotatedDirection(direction: Direction, rotation: number): Direction;
