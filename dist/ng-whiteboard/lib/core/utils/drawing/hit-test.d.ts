import { Bounds, Point } from '../../types';
/** Tests if a line segment intersects with a bounding box. */
export declare function hitTestBoundingBox(bounds: Bounds, pointA: Point, pointB: Point, threshold: number): boolean;
/** Tests if a line segment intersects with an ellipse. */
export declare function hitTestEllipse(cx: number, cy: number, rx: number, ry: number, pointA: Point, pointB: Point, threshold: number): boolean;
/** Tests if a line segment intersects with another line segment. */
export declare function hitTestLine(x1: number, y1: number, x2: number, y2: number, pointA: Point, pointB: Point, threshold: number): boolean;
/** Tests if a line segment intersects with a pen stroke. */
export declare function hitTestPen(points: [number, number][], pointA: Point, pointB: Point, threshold: number): boolean;
