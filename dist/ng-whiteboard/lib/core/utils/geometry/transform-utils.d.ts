import { Point, Bounds, WhiteboardElement } from '../../types';
/**
 * Calculates the combined bounding box for multiple elements in screen space.
 */
export declare function getCombinedScreenBounds(elements: WhiteboardElement[]): Bounds | null;
/**
 * Rotates a point around a center point by a given angle.
 */
export declare function rotatePointAroundCenter(point: Point, center: Point, angleDegrees: number): Point;
