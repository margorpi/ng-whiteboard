import { BaseElement, Bounds, Direction, ElementType, ElementUtil, Point } from '../types';
export interface RectangleElement extends BaseElement {
    type: ElementType.Rectangle;
    width: number;
    height: number;
    rx: number;
}
export declare class RectangleElementUtil implements ElementUtil<RectangleElement> {
    create(props: Partial<RectangleElement>): RectangleElement;
    resize(element: RectangleElement, direction: Direction, dx: number, dy: number): RectangleElement;
    getBounds(element: RectangleElement): Bounds;
    hitTest(element: RectangleElement, pointA: Point, pointB: Point, threshold: number): boolean;
}
