import { Bounds, Point } from '../../types';
/** Utilities for working with axis-aligned bounding boxes (AABB). */
/** Calculates the axis-aligned bounding box for a set of 2D points. */
export declare function calculateBoundingBox(points: number[][]): Bounds;
/** Checks if two axis-aligned bounding boxes intersect or overlap. */
export declare function doBoundingBoxesIntersect(box1: Bounds, box2: Bounds): boolean;
/** Converts a box representation (x, y, width, height) to a Bounds object. */
export declare function boxToBounds(box: {
    x: number;
    y: number;
    width: number;
    height: number;
}): Bounds;
/** Tests if a point is contained within a bounding box. */
export declare function isPointInBounds(bounds: Bounds, point: Point): boolean;
/** Calculates the center point of a bounding box. */
export declare function getBoundsCenter(bounds: Bounds): Point;
/** Tests if a line segment potentially intersects with a bounding box. */
export declare function isBoundsIntersect(bounds: Bounds, p1: Point, p2: Point, margin: number): boolean;
