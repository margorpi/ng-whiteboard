import { BaseElement, Bounds, Direction, ElementType, ElementUtil, Point } from '../types';
export interface LineElement extends BaseElement {
    type: ElementType.Line;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export declare class LineElementUtil implements ElementUtil<LineElement> {
    create(props: Partial<LineElement>): LineElement;
    resize(element: LineElement, direction: Direction, dx: number, dy: number): LineElement;
    getBounds(element: LineElement): Bounds;
    hitTest(element: LineElement, pointA: Point, pointB: Point, threshold: number): boolean;
}
